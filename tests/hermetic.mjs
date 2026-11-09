// SPDX-License-Identifier: Apache-2.0 OR MIT
/*
 * Launch options that keep the browser gates hermetic.
 *
 * Every suite measures the build served from 127.0.0.1. Third-party
 * embeds on a page (the site theme's ten Spotify players issue about 350
 * requests, Sentry telemetry included) made `networkidle` wait on
 * someone else's servers: the playlists page settled in 9 to 14 s alone
 * and passed the 30 s navigation timeout under the gate's load.
 *
 * The host resolver answers "not found" for every host except the local
 * server and cloudcdn.pro, the site theme's own image CDN, whose images
 * the page renders and the contrast suites measure text against. A
 * blocked iframe keeps the size its attributes give it, so layout checks
 * still see it. Pages are never skipped: only their third-party requests
 * fail, at once.
 */
export const HERMETIC = {
  args: [
    '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost, EXCLUDE cloudcdn.pro',
  ],
};
