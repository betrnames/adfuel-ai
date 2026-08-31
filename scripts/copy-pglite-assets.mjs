#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@electric-sql/pglite/dist");
const dest = join(root, ".vercel/output/functions/__server.func/_libs");
if (existsSync(src) && existsSync(join(root, ".vercel/output/functions/__server.func"))) {
  mkdirSync(dest, { recursive: true });
  for (const name of ["pglite.wasm", "pglite.data", "initdb.wasm"]) {
    const from = join(src, name);
    if (existsSync(from)) copyFileSync(from, join(dest, name));
  }
}

// Rolldown/Nitro circular facade: ssr.mjs re-exports undeclared `ssr_exports`
// and ssr2.mjs imports `__exportAll` from ssr.mjs while ssr.mjs waits on ssr2.
// https://github.com/TanStack/router/issues/8031
const ssrDir = join(root, ".vercel/output/functions/__server.func/_ssr");
const ssrPath = join(ssrDir, "ssr.mjs");
const ssr2Path = join(ssrDir, "ssr2.mjs");

if (existsSync(ssrPath)) {
  const text = readFileSync(ssrPath, "utf8");
  if (text.includes("ssr_exports as s") && !text.includes("var ssr_exports")) {
    writeFileSync(ssrPath, text.replace("//#endregion\nexport", "//#endregion\nvar ssr_exports = { default: server_default };\nexport"));
  }
}

if (existsSync(ssr2Path)) {
  let text = readFileSync(ssr2Path, "utf8");
  const circular = /import \{ c as (__exportAll\$?\d*) \} from "\.\/ssr\.mjs";\n/;
  const match = text.match(circular);
  if (match) {
    const name = match[1];
    const helper = `var ${name} = (all, no_symbols) => {
	let target = {};
	for (var name in all) Object.defineProperty(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) Object.defineProperty(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
`;
    text = text.replace(circular, () => helper);
    writeFileSync(ssr2Path, text);
  }
}
