(function () {
  'use strict';
  var root = document.documentElement;
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var mode = document.getElementById('mode-toggle');
  var state = document.getElementById('mode-state');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('data-open', String(open));
  }

  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });
  }

  if (mode && state) {
    var order = ['system', 'light', 'dark'];
    var labels = { system: 'System', light: mode.dataset.labelLight || 'Light', dark: mode.dataset.labelDark || 'Dark' };
    function current() {
      var value = root.getAttribute('data-theme');
      return value === 'light' || value === 'dark' ? value : 'system';
    }
    function apply(value) {
      if (value === 'system') {
        root.removeAttribute('data-theme');
        try { localStorage.removeItem('theme'); } catch (error) { /* no-op */ }
      } else {
        root.setAttribute('data-theme', value);
        try { localStorage.setItem('theme', value); } catch (error) { /* no-op */ }
      }
      state.textContent = labels[value];
    }
    state.textContent = labels[current()];
    mode.addEventListener('click', function () {
      apply(order[(order.indexOf(current()) + 1) % order.length]);
    });
  }

  /* Dock search button into header slot without inline style mutations */
  var searchSlot = document.querySelector('[data-ssg-search]');
  var searchButton = document.getElementById('ssg-search-btn');
  if (searchSlot && searchButton) {
    searchSlot.replaceWith(searchButton);
  } else if (searchSlot && typeof MutationObserver === 'function') {
    var searchObserver = new MutationObserver(function () {
      var btn = document.getElementById('ssg-search-btn');
      if (btn) {
        searchSlot.replaceWith(btn);
        searchObserver.disconnect();
      }
    });
    searchObserver.observe(document.body, { childList: true, subtree: true });
  }

  /* FAQ Accordion toggle */
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (item) {
        item.classList.toggle('is-open', !expanded);
      }
    });
  });

  /* Interactive Cryptographic Engine */
  var EFF_WORDS = [
    "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
    "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "action",
    "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult",
    "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree",
    "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien",
    "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always",
    "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle",
    "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety",
    "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area",
    "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive",
    "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist",
    "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit",
    "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware",
    "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag",
    "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel",
    "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef",
    "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best",
    "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird",
    "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind",
    "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil",
    "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom",
    "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze",
    "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom",
    "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk",
    "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter",
    "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm",
    "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon",
    "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart",
    "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cattle",
    "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal",
    "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat",
    "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney",
    "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen",
    "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever",
    "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth",
    "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code",
    "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort", "comic",
    "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince",
    "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton",
    "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft"
  ];

  var CHARSET_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var CHARSET_LOWER = "abcdefghijklmnopqrstuvwxyz";
  var CHARSET_NUMBERS = "0123456789";
  var CHARSET_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  var AMBIGUOUS = /[0O1lI|]/g;

  var currentMode = "random";

  function getSecureRandomInt(max) {
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  function generateRandomPassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous) {
    var pool = "";
    if (useUpper) pool += CHARSET_UPPER;
    if (useLower) pool += CHARSET_LOWER;
    if (useNumbers) pool += CHARSET_NUMBERS;
    if (useSymbols) pool += CHARSET_SYMBOLS;

    if (excludeAmbiguous) {
      pool = pool.replace(AMBIGUOUS, "");
    }

    if (pool.length === 0) pool = CHARSET_LOWER;

    var password = "";
    var poolLen = pool.length;
    for (var i = 0; i < length; i++) {
      password += pool.charAt(getSecureRandomInt(poolLen));
    }
    return { password: password, poolSize: poolLen };
  }

  function generateDiceware(wordCount) {
    var words = [];
    var totalWords = EFF_WORDS.length;
    for (var i = 0; i < wordCount; i++) {
      words.push(EFF_WORDS[getSecureRandomInt(totalWords)]);
    }
    return { password: words.join("-"), poolSize: totalWords };
  }

  function generateQuantumKDF(length) {
    var raw = new Uint8Array(length);
    window.crypto.getRandomValues(raw);
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+,-./:;<=>?@[]^_{|}~";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += chars.charAt(raw[i] % chars.length);
    }
    return { password: result, poolSize: chars.length };
  }

  function generateHoneywords(masterPassword, count) {
    var honeywords = [masterPassword];
    var len = masterPassword.length;
    for (var i = 0; i < count - 1; i++) {
      var fake = generateRandomPassword(len, true, true, true, true, false).password;
      honeywords.push(fake);
    }
    for (var j = honeywords.length - 1; j > 0; j--) {
      var k = getSecureRandomInt(j + 1);
      var temp = honeywords[j];
      honeywords[j] = honeywords[k];
      honeywords[k] = temp;
    }
    return honeywords;
  }

  function calculateShannonEntropy(password, poolSize) {
    if (!password) return 0;
    return Math.round(password.length * (Math.log2(poolSize || 94)));
  }

  function calculateCrackTime(entropy) {
    if (entropy < 40) return "Instant";
    if (entropy < 60) return "Few hours";
    if (entropy < 80) return "Centuries";
    if (entropy < 100) return "Cosmic Age";
    if (entropy < 120) return "Planetary Scale";
    return "Quantum-Proof";
  }

  function updateSearchSpaceVisualizer(mode, length, poolSize, entropy) {
    var eqEl = document.getElementById("searchSpaceEquation");
    var expEl = document.getElementById("searchSpaceExplainer");
    var s1 = document.getElementById("seg1");
    var s2 = document.getElementById("seg2");
    var s3 = document.getElementById("seg3");
    var s4 = document.getElementById("seg4");
    var s5 = document.getElementById("seg5");

    var effectiveLength = length;
    var effectivePool = poolSize;

    if (mode === "diceware") {
      var wordCount = Math.max(3, Math.min(12, Math.round(length / 4)));
      effectiveLength = wordCount;
      effectivePool = EFF_WORDS.length;
    } else if (mode === "quantum") {
      effectiveLength = Math.max(32, length);
    }

    var log10Total = effectiveLength * Math.log10(effectivePool);
    var exponent = Math.floor(log10Total);
    var mantissa = Math.pow(10, log10Total - exponent).toFixed(1);

    if (eqEl) {
      eqEl.innerHTML = effectivePool + "<sup>" + effectiveLength + "</sup> ≈ " + mantissa + " × 10<sup>" + exponent + "</sup> combinations";
    }

    if (s1) s1.classList.toggle("is-active", entropy >= 35);
    if (s2) s2.classList.toggle("is-active", entropy >= 65);
    if (s3) s3.classList.toggle("is-active", entropy >= 90);
    if (s4) s4.classList.toggle("is-active", entropy >= 120);
    if (s5) s5.classList.toggle("is-active", entropy >= 140);

    if (expEl) {
      if (entropy < 50) {
        expEl.innerHTML = "At " + effectiveLength + (mode === "diceware" ? " words" : " characters") + " (" + entropy + " bits), modern GPU cracking rigs (e.g. RTX 4090 clusters) can exhaust the ~" + mantissa + " × 10<sup>" + exponent + "</sup> search space in seconds to minutes.";
      } else if (entropy < 75) {
        expEl.innerHTML = "At " + effectiveLength + (mode === "diceware" ? " words" : " characters") + " (" + entropy + " bits), exhausting the ~" + mantissa + " × 10<sup>" + exponent + "</sup> combinations requires centuries of compute time at 100 billion guesses per second.";
      } else if (entropy < 105) {
        expEl.innerHTML = "At " + effectiveLength + (mode === "diceware" ? " words" : " characters") + " (" + entropy + " bits), the search space reaches ~" + mantissa + " × 10<sup>" + exponent + "</sup>. Cracking requires millions of years, far outlasting recorded human civilization.";
      } else if (entropy < 135) {
        expEl.innerHTML = "At " + effectiveLength + (mode === "diceware" ? " words" : " characters") + " (" + entropy + " bits), the search space expands to ~" + mantissa + " × 10<sup>" + exponent + "</sup> combinations. Cracking energy exceeds the thermal output of planet Earth.";
      } else {
        expEl.innerHTML = "At " + effectiveLength + (mode === "diceware" ? " words" : " characters") + " (" + entropy + " bits), the search space exceeds ~" + mantissa + " × 10<sup>" + exponent + "</sup> permutations. Under Grover's quantum search (quadratic speedup), effective search complexity remains at least 2<sup>" + Math.floor(entropy / 2) + "</sup> operations, maintaining cryptographic infeasibility.";
      }
    }
  }

  function refreshPassword() {
    var passwordOutput = document.getElementById("passwordOutput");
    if (!passwordOutput) return;

    var lengthSlider = document.getElementById("lengthSlider");
    var length = lengthSlider ? parseInt(lengthSlider.value, 10) : 24;
    var chkUpper = document.getElementById("chkUpper");
    var chkLower = document.getElementById("chkLower");
    var chkNumbers = document.getElementById("chkNumbers");
    var chkSymbols = document.getElementById("chkSymbols");
    var chkAmbiguous = document.getElementById("chkAmbiguous");

    var useUpper = chkUpper ? chkUpper.checked : true;
    var useLower = chkLower ? chkLower.checked : true;
    var useNumbers = chkNumbers ? chkNumbers.checked : true;
    var useSymbols = chkSymbols ? chkSymbols.checked : true;
    var excludeAmbiguous = chkAmbiguous ? chkAmbiguous.checked : false;

    var result = { password: "", poolSize: 94 };
    var honeywordsBox = document.getElementById("honeywordsBox");
    if (honeywordsBox) honeywordsBox.classList.add("is-hidden");

    if (currentMode === "random") {
      result = generateRandomPassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous);
    } else if (currentMode === "diceware") {
      var wordCount = Math.max(3, Math.min(12, Math.round(length / 4)));
      result = generateDiceware(wordCount);
    } else if (currentMode === "quantum") {
      result = generateQuantumKDF(Math.max(32, length));
    } else if (currentMode === "honeywords") {
      result = generateRandomPassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous);
      if (honeywordsBox) {
        honeywordsBox.classList.remove("is-hidden");
        var decoys = generateHoneywords(result.password, 5);
        var list = document.getElementById("honeywordsList");
        if (list) {
          list.innerHTML = "";
          decoys.forEach(function (hw, idx) {
            var item = document.createElement("div");
            item.className = "honeyword-item";
            item.textContent = (idx + 1) + ". " + hw;
            list.appendChild(item);
          });
        }
      }
    }

    passwordOutput.textContent = result.password;

    var entropy = calculateShannonEntropy(result.password, result.poolSize);
    var valEntropy = document.getElementById("valEntropy");
    if (valEntropy) valEntropy.innerHTML = entropy + ' <small>bits</small>';

    var valPool = document.getElementById("valPool");
    if (valPool) valPool.textContent = result.poolSize + " chars";

    var valCrackTime = document.getElementById("valCrackTime");
    if (valCrackTime) valCrackTime.textContent = calculateCrackTime(entropy);

    updateSearchSpaceVisualizer(currentMode, length, result.poolSize, entropy);

    var strengthFill = document.getElementById("strengthFill");
    var strengthLabel = document.getElementById("strengthLabel");
    if (strengthFill && strengthLabel) {
      strengthFill.className = "strength-bar-fill";
      strengthLabel.className = "strength-label";

      if (entropy < 50) {
        strengthFill.classList.add("strength-weak");
        strengthLabel.classList.add("text-weak");
        strengthLabel.textContent = "Weak (" + entropy + " bits)";
      } else if (entropy < 80) {
        strengthFill.classList.add("strength-medium");
        strengthLabel.classList.add("text-medium");
        strengthLabel.textContent = "Moderate (" + entropy + " bits)";
      } else if (entropy < 110) {
        strengthFill.classList.add("strength-strong");
        strengthLabel.classList.add("text-strong");
        strengthLabel.textContent = "Strong (" + entropy + " bits)";
      } else {
        strengthFill.classList.add("strength-quantum");
        strengthLabel.classList.add("text-quantum");
        strengthLabel.textContent = "Quantum-Resistant (" + entropy + " bits)";
      }
    }
  }

  function copyToClipboard() {
    var passwordOutput = document.getElementById("passwordOutput");
    var btnCopy = document.getElementById("btnCopy");
    if (!passwordOutput) return;

    var pwd = passwordOutput.textContent;
    if (!pwd || pwd === "Generating...") return;

    navigator.clipboard.writeText(pwd).then(function () {
      if (btnCopy) {
        var origText = btnCopy.innerHTML;
        btnCopy.innerHTML = '<span>Copied!</span>';
        setTimeout(function () {
          btnCopy.innerHTML = origText;
        }, 2000);
      }
    }).catch(function () {
      /* Fallback if clipboard API is blocked */
    });
  }

  /* DOM Init */
  document.addEventListener("DOMContentLoaded", function () {
    var tabs = document.querySelectorAll(".generator-tabs .tab-btn");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        currentMode = tab.getAttribute("data-mode");
        refreshPassword();
      });
    });

    var lengthSlider = document.getElementById("lengthSlider");
    var lengthVal = document.getElementById("lengthVal");
    if (lengthSlider) {
      lengthSlider.addEventListener("input", function (e) {
        if (lengthVal) lengthVal.textContent = e.target.value;
        refreshPassword();
      });
    }

    var checkboxes = document.querySelectorAll('.controls-grid input[type="checkbox"]');
    checkboxes.forEach(function (chk) {
      chk.addEventListener("change", refreshPassword);
    });

    var btnRefresh = document.getElementById("btnRefresh");
    if (btnRefresh) {
      btnRefresh.addEventListener("click", refreshPassword);
    }

    var btnCopy = document.getElementById("btnCopy");
    if (btnCopy) {
      btnCopy.addEventListener("click", copyToClipboard);
    }

    var competitorSelect = document.getElementById("competitorSelect");
    var benchmarkTable = document.getElementById("benchmarkTable");
    if (competitorSelect && benchmarkTable) {
      competitorSelect.addEventListener("change", function (e) {
        benchmarkTable.classList.remove(
          "show-bitwarden",
          "show-onepassword",
          "show-lastpass",
          "show-keepassxc"
        );
        benchmarkTable.classList.add("show-" + e.target.value);
      });
    }

    refreshPassword();
  });
})();
