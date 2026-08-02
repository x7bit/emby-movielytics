const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { createRequire } = require("node:module");

const require = createRequire(process.cwd() + "/package.json");
const vueTscBin = require.resolve("vue-tsc/bin/vue-tsc.js");
const patchPath = path.resolve(__dirname, "patch-vue-tsc-resolve.cjs");

const result = spawnSync(process.execPath, ["-r", patchPath, vueTscBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
