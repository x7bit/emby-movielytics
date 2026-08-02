const Module = require("module");
const path = require("path");

const absoluteTscPath = path.resolve(__dirname, "../node_modules/typescript/lib/tsc.js");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
  if (request === "typescript/lib/tsc" || request === "typescript/lib/tsc.js") {
    return absoluteTscPath;
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
