#!/usr/bin/env node
/**
 * Build one local plugin (plugins/<name>) into dist/.
 *
 * Replaces tsup: host installs here are root-owned and a fresh `npm install` can't
 * refresh them, so the build uses the esbuild + sass already in the root node_modules.
 * Behaviour matches the old tsup.config.ts:
 *   - entry points src/index.ts and src/components/index.ts
 *   - *.scss compiled with sass and imported as a CSS string
 *   - *.inline.ts bundled + minified for the browser and imported as a JS string
 *   - preact is external; everything else is bundled
 *   - emits .d.ts via tsc
 */
import { build } from "esbuild"
import { compile } from "sass"
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, rmSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const pluginName = process.argv[2]
if (!pluginName) {
  console.error("usage: node plugins/build-plugin.mjs <plugin-name>")
  process.exit(1)
}

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const pluginDir = join(root, "plugins", pluginName)
if (!existsSync(join(pluginDir, "package.json"))) {
  console.error(`[build-plugin] no plugin at plugins/${pluginName}`)
  process.exit(1)
}

const outdir = join(pluginDir, "dist")
rmSync(outdir, { recursive: true, force: true })

/** @type {import("esbuild").Plugin} */
const INLINE_NS = "quartz-inline-asset"

const inlineAssets = {
  name: "quartz-inline-assets",
  setup(parentBuild) {
    // Force these imports into a virtual namespace: esbuild's default onLoad for
    // .ts resolves them as modules instead of letting a loader return a string.
    parentBuild.onResolve({ filter: /\.(scss|inline\.ts)$/ }, (args) => ({
      path: join(args.resolveDir, args.path),
      namespace: INLINE_NS,
    }))

    parentBuild.onLoad({ filter: /\.scss$/, namespace: INLINE_NS }, (args) => {
      const result = compile(args.path)
      return { contents: result.css, loader: "text" }
    })

    parentBuild.onLoad({ filter: /\.inline\.ts$/, namespace: INLINE_NS }, async (args) => {
      let text = readFileSync(args.path, "utf8")
      text = text.replace(/^export default /gm, "").replace(/^export /gm, "")

      const result = await build({
        stdin: {
          contents: text,
          loader: "ts",
          resolveDir: dirname(args.path),
          sourcefile: relative(pluginDir, args.path),
        },
        write: false,
        bundle: true,
        minify: true,
        platform: "browser",
        format: "esm",
        target: "es2020",
        sourcemap: false,
        external: [
          "preact",
          "preact/hooks",
          "preact/jsx-runtime",
          "preact/compat",
          "http://*",
          "https://*",
        ],
      })

      const js = result.outputFiles?.[0]?.text
      if (!js) throw new Error(`no JS output for ${args.path}`)
      return { contents: js, loader: "text" }
    })
  },
}

await build({
  absWorkingDir: pluginDir,
  entryPoints: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
  },
  outdir: "dist",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  splitting: false,
  sourcemap: true,
  packages: "bundle",
  external: ["preact", "preact/hooks", "preact/jsx-runtime", "preact/compat"],
  jsx: "automatic",
  jsxImportSource: "preact",
  plugins: [inlineAssets],
})

const tsc = spawnSync(
  "npx",
  [
    "tsc",
    "--emitDeclarationOnly",
    "--declaration",
    "--noEmit",
    "false",
    "-p",
    "tsconfig.build.json",
  ],
  { cwd: pluginDir, stdio: "inherit" },
)
if (tsc.status !== 0) {
  console.error(`[build-plugin] tsc failed for ${pluginName}`)
  process.exit(tsc.status ?? 1)
}

console.log(`[build-plugin] built plugins/${pluginName}`)
