// Build-time image pipeline. Runs before `next dev` and `next build` (see the
// `predev` / `prebuild` scripts); run `npm run images` by hand after adding or
// replacing an image.
//
// Why this exists: on Vercel, next/image's default loader optimizes each image
// on demand. Every (image × width × format) variant that isn't already in the
// edge cache costs a 400–1800 ms transform on first request, and the responses
// carry `Cache-Control: max-age=0`, so browsers never keep them. A cold visitor
// waits on a dozen of those. Here every variant is rendered once at build time
// into `public/_opt/<version>/…` as WebP and served as a plain static file with
// a one-year immutable cache (see `headers()` in next.config.ts). The custom
// loader in lib/image-loader.ts maps next/image requests onto those files.
//
// Outputs:
//   public/_opt/<version>/<dir>/<name>-<width>.webp   (gitignored)
//   lib/image-manifest.ts   — version + largest width per source image (gitignored
//                             on purpose: a build that skipped this script fails
//                             at compile time instead of shipping 404 images)
//   content/blur.ts         — tiny blur placeholders for the home-grid images
//
// <version> is a hash of every source image, so any change to any image moves
// every URL and the old immutable cache entries are simply never requested.
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, join, posix } from 'node:path'
import { cpus } from 'node:os'
import sharp from 'sharp'

// Bump when changing widths/quality so existing variants are regenerated.
const PIPELINE_VERSION = 1
// Must match IMAGE_WIDTHS in lib/static-image.ts.
const WIDTHS = [256, 384, 480, 640, 828, 1080, 1440, 1920]
const MAX_WIDTH = WIDTHS[WIDTHS.length - 1]
const QUALITY = 80

const root = new URL('..', import.meta.url).pathname
const publicDir = join(root, 'public')
const outRoot = join(publicDir, '_opt')
const SCAN_DIRS = ['app', 'components', 'content', 'hooks', 'lib']
const GENERATED = new Set(['content/blur.ts', 'lib/image-manifest.ts'])

// --- 1. Find every raster image the code references --------------------------

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else if (/\.(tsx?|mjs|css)$/.test(entry.name)) yield p
  }
}

const refs = new Set()
for (const dir of SCAN_DIRS) {
  if (!existsSync(join(root, dir))) continue
  for await (const file of walk(join(root, dir))) {
    if (GENERATED.has(posix.relative(root, file))) continue
    const text = await readFile(file, 'utf8')
    for (const m of text.matchAll(/['"`(](\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp))/g)) refs.add(m[1])
  }
}
const sources = [...refs].filter((src) => existsSync(join(publicDir, src))).sort()

// --- 2. Version hash over every source file ----------------------------------

const hash = createHash('sha1').update(`v${PIPELINE_VERSION}:${WIDTHS.join(',')}:${QUALITY}`)
const sourceInfo = new Map()
for (const src of sources) {
  const buf = await readFile(join(publicDir, src))
  hash.update(src).update(buf)
  const meta = await sharp(buf).rotate().metadata()
  const max = Math.min(meta.width, MAX_WIDTH)
  sourceInfo.set(src, { buf, max })
}
const version = hash.digest('hex').slice(0, 8)
const outDir = join(outRoot, version)

// Guard against `x.png` and `x.jpg` in one folder mapping to the same .webp.
const seen = new Map()
for (const src of sources) {
  const key = src.slice(0, -extname(src).length)
  if (seen.has(key)) throw new Error(`Image basename collision: ${seen.get(key)} vs ${src}`)
  seen.set(key, src)
}

// --- 3. Render variants (skipping any that already exist) --------------------

const jobs = []
for (const [src, { buf, max }] of sourceInfo) {
  const widths = [...WIDTHS.filter((w) => w < max), max]
  const base = src.slice(0, -extname(src).length)
  for (const w of widths) {
    const out = join(outDir, `${base}-${w}.webp`)
    if (existsSync(out)) continue
    jobs.push(async () => {
      await mkdir(dirname(out), { recursive: true })
      await sharp(buf)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out)
    })
  }
}

let nextJob = 0
async function worker() {
  while (nextJob < jobs.length) await jobs[nextJob++]()
}
await Promise.all(Array.from({ length: Math.min(jobs.length, cpus().length) }, worker))

// Drop variant sets from previous versions so public/ doesn't accumulate.
if (existsSync(outRoot)) {
  for (const entry of await readdir(outRoot)) {
    if (entry !== version) await rm(join(outRoot, entry), { recursive: true, force: true })
  }
}

// --- 4. Manifest consumed by the loader --------------------------------------

const widthLines = sources.map((src) => `  ${JSON.stringify(src)}: ${sourceInfo.get(src).max},`).join('\n')
await writeFile(
  join(root, 'lib/image-manifest.ts'),
  `// AUTO-GENERATED by scripts/optimize-images.mjs — do not edit by hand.
// Largest rendered width per source image, keyed by its public/ path, plus the
// version folder under public/_opt where the WebP variants live.

export const imageVersion = ${JSON.stringify(version)}

export const imageWidths: Record<string, number> = {
${widthLines}
}
`,
)

// --- 5. Blur placeholders for the home grid ----------------------------------
// Only the registry is scanned, deliberately: the map is imported by the home
// grid, so keeping it to card images keeps the home bundle small.

const registry = await readFile(join(root, 'content/works.ts'), 'utf8')
const cardPaths = [...new Set(registry.match(/'\/[^']+\.(?:jpe?g|png|webp)'/g) ?? [])]
  .map((s) => s.slice(1, -1))
  .sort()

const entries = []
for (const src of cardPaths) {
  const { data, info } = await sharp(join(publicDir, src))
    .rotate()
    .resize(12, 12, { fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer({ resolveWithObject: true })
  entries.push([src, `data:image/${info.format};base64,${data.toString('base64')}`])
}

const body = entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')
await writeFile(
  join(root, 'content/blur.ts'),
  `// AUTO-GENERATED by scripts/optimize-images.mjs — do not edit by hand.
// Tiny base64 previews shown while the real image loads (next/image \`blurDataURL\`).

export const blurMap: Record<string, string> = {
${body}
}

/** Placeholder props for next/image; empty when no preview exists for \`src\`. */
export function blurProps(src: string): { placeholder: 'blur'; blurDataURL: string } | Record<string, never> {
  const blurDataURL = blurMap[src]
  return blurDataURL ? { placeholder: 'blur', blurDataURL } : {}
}
`,
)

const total = [...sourceInfo.values()].reduce((n, { max }) => n + WIDTHS.filter((w) => w < max).length + 1, 0)
const bytes = await dirSize(outDir)
console.log(
  `images: ${sources.length} sources → ${total} WebP variants in public/_opt/${version} ` +
    `(${jobs.length} rendered, ${(bytes / 1024 / 1024).toFixed(1)} MB), ${entries.length} blur placeholders`,
)

async function dirSize(dir) {
  let n = 0
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    n += entry.isDirectory() ? await dirSize(p) : (await stat(p)).size
  }
  return n
}
