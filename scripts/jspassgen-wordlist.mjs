#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// Packs and verifies the Diceware wordlist that jspassgen ships inside
// themes/jspassgen/_layouts/main.js.
//
//   node scripts/jspassgen-wordlist.mjs          verify (used by `make check`)
//   node scripts/jspassgen-wordlist.mjs --write  re-pack from the source list
//
// The source of truth is themes/jspassgen/wordlist/eff_large_wordlist.txt,
// one word per line. main.js carries it as WORDS_PACKED, an arithmetic-coded
// string its own decoder expands on first use, so the page still makes no
// network request for the list. The model and decoder are not duplicated
// here: this script evaluates the `wordlist-codec` block of main.js itself
// and drives the same walkWordlist() in both directions, so the bytes it
// verifies are decoded by exactly the code the browser runs.
//
// Verification fails unless the decoded list is byte-identical to the source
// list (same words, same order, so dice index N is still word N).
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAIN_JS = join(ROOT, "themes/jspassgen/_layouts/main.js");
const SOURCE = join(ROOT, "themes/jspassgen/wordlist/eff_large_wordlist.txt");
const START = "/* wordlist-codec:start";
const END = "/* wordlist-codec:end */";
const PACKED_LINE = /^( *var WORDS_PACKED = ")[A-Za-z0-9+/=]*(";)$/m;

function fail(message) {
  console.error(`jspassgen-wordlist: FAIL - ${message}`);
  process.exit(1);
}

function loadCodec(source) {
  const start = source.indexOf(START);
  const end = source.indexOf(END);
  if (start < 0 || end < start) fail(`main.js has no ${START} ... ${END} block`);
  const block = source.slice(start, end);
  const exported = "walkWordlist, renormShift, WORD_ALPHABET, WORDLIST_SIZE, WORDS_PACKED, " +
    "CODER_TOP, CODER_HALF, CODER_QUARTER, createSymbolReader";
  // The block is plain ES5 with no access to the page; atob is its only
  // global, and Node provides the same one browsers do.
  return new Function("atob", `${block}\nreturn { ${exported} };`)(atob);
}

function readSource() {
  const text = readFileSync(SOURCE, "utf8");
  if (!text.endsWith("\n") || text.includes("\r")) fail(`${SOURCE} must be LF-terminated lines`);
  return { text, words: text.slice(0, -1).split("\n") };
}

function validateSource(words, codec) {
  const allowed = new RegExp(`^[${codec.WORD_ALPHABET.replace("-", "\\-")}]+$`);
  words.forEach((word, i) => {
    if (!allowed.test(word)) fail(`line ${i + 1} (${JSON.stringify(word)}) has a character outside the codec alphabet`);
    // The model gives zero probability to anything sorting would rule out,
    // so an unsorted or duplicated list cannot be packed at all.
    if (i > 0 && !(words[i - 1] < word)) fail(`line ${i + 1} is not strictly after line ${i} in byte order`);
  });
  if (words.length !== codec.WORDLIST_SIZE) {
    fail(`source has ${words.length} words; main.js WORDLIST_SIZE is ${codec.WORDLIST_SIZE}`);
  }
}

// Front coding: shared-prefix length, then the remaining letters, then 0.
function frontCode(words, alphabet) {
  const symbols = [];
  let previous = "";
  for (const word of words) {
    let shared = 0;
    while (shared < word.length && word[shared] === previous[shared]) shared++;
    symbols.push(shared);
    for (const ch of word.slice(shared)) symbols.push(alphabet.indexOf(ch) + 1);
    symbols.push(0);
    previous = word;
  }
  return symbols;
}

function createSymbolWriter(codec, symbols) {
  const bits = [];
  let low = 0;
  let high = codec.CODER_TOP - 1;
  let pending = 0;
  let k = 0;
  const emit = (bit) => {
    bits.push(bit);
    for (; pending > 0; pending--) bits.push(1 - bit);
  };
  const next = (freq) => {
    const symbol = symbols[k++];
    if (!freq[symbol]) fail(`symbol ${k - 1} has zero probability under the model`);
    const total = freq.reduce((a, b) => a + b, 0);
    const cumulative = freq.slice(0, symbol).reduce((a, b) => a + b, 0);
    const range = high - low + 1;
    high = low + Math.floor((range * (cumulative + freq[symbol])) / total) - 1;
    low = low + Math.floor((range * cumulative) / total);
    for (let shift = codec.renormShift(low, high); shift >= 0; shift = codec.renormShift(low, high)) {
      if (shift === codec.CODER_QUARTER) pending++;
      else emit(shift === 0 ? 0 : 1);
      low = (low - shift) * 2;
      high = (high - shift) * 2 + 1;
    }
    return symbol;
  };
  const finish = () => {
    if (k !== symbols.length) fail(`encoder consumed ${k} of ${symbols.length} symbols`);
    pending++;
    emit(low < codec.CODER_QUARTER ? 0 : 1);
    const bytes = Buffer.alloc(Math.ceil(bits.length / 8));
    bits.forEach((bit, i) => { bytes[i >> 3] |= bit << (7 - (i & 7)); });
    // The decoder reads zeros past the end, so trailing zero bytes are free.
    let length = bytes.length;
    while (length > 0 && bytes[length - 1] === 0) length--;
    return bytes.subarray(0, length).toString("base64");
  };
  return { next, finish };
}

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

function write(source) {
  const codec = loadCodec(source);
  const { words } = readSource();
  validateSource(words, codec);
  const writer = createSymbolWriter(codec, frontCode(words, codec.WORD_ALPHABET));
  const echoed = codec.walkWordlist(words.length, writer.next);
  if (echoed.join("\n") !== words.join("\n")) fail("encoder walk did not reproduce the source list");
  const packed = writer.finish();
  if (!PACKED_LINE.test(source)) fail("main.js has no `var WORDS_PACKED = \"...\";` line");
  writeFileSync(MAIN_JS, source.replace(PACKED_LINE, `$1${packed}$2`));
  console.log(`jspassgen-wordlist: packed ${words.length} words into ${packed.length} base64 characters`);
}

function verify(source) {
  const codec = loadCodec(source);
  const { text, words } = readSource();
  validateSource(words, codec);
  const decoded = codec.walkWordlist(codec.WORDLIST_SIZE, codec.createSymbolReader(codec.WORDS_PACKED));
  const roundTrip = `${decoded.join("\n")}\n`;
  if (roundTrip !== text) {
    const at = decoded.findIndex((word, i) => word !== words[i]);
    fail(`decoded list differs from ${SOURCE} at word ${at + 1} (${decoded[at]} != ${words[at]})`);
  }
  console.log(
    `jspassgen-wordlist: ${decoded.length} words round-trip byte-identically ` +
      `(sha256 ${sha256(roundTrip)}; ${codec.WORDS_PACKED.length} packed characters, ` +
      `${text.length} plain bytes)`,
  );
}

const source = readFileSync(MAIN_JS, "utf8");
if (process.argv.includes("--write")) write(source);
verify(readFileSync(MAIN_JS, "utf8"));
