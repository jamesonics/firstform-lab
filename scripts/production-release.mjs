import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const manifestPath = '.wrangler/release/manifest.json'
const workerEntry = '.wrangler/release/index.js'

function releaseFiles(root) {
  const files = []
  function walk(relative) {
    const stat = lstatSync(join(root, relative))
    if (stat.isSymbolicLink()) throw new Error('Release cannot contain symlinks.')
    if (stat.isDirectory()) {
      for (const name of readdirSync(join(root, relative)).sort()) walk(`${relative}/${name}`)
    } else if (stat.isFile() && relative !== manifestPath) {
      files.push({ path: relative, sha256: createHash('sha256').update(readFileSync(join(root, relative))).digest('hex') })
    }
  }
  walk('dist')
  walk('.wrangler/release')
  if (!files.some(file => file.path === 'dist/index.html') || !files.some(file => file.path === workerEntry)) throw new Error('Release requires a homepage and a bundled Worker.')
  return files
}

export function createRelease(root, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Release requires a full commit SHA.')
  const manifest = { version: 1, commit, workerEntry, files: releaseFiles(root) }
  writeFileSync(join(root, manifestPath), JSON.stringify(manifest, null, 2) + '\n')
  return manifest
}

export function verifyRelease(root, commit) {
  const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8'))
  if (manifest.version !== 1 || manifest.commit !== commit || manifest.workerEntry !== workerEntry) throw new Error('Release commit or format does not match this workflow run.')
  if (JSON.stringify(manifest.files) !== JSON.stringify(releaseFiles(root))) throw new Error('Release contents differ from the verified artifact.')
  return manifest
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.cwd()
  const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  const command = process.argv[2]
  if (!['create', 'verify'].includes(command)) throw new Error('Use create or verify.')
  const manifest = command === 'create' ? createRelease(root, commit) : verifyRelease(root, commit)
  console.log(`Release ${command === 'create' ? 'prepared' : 'verified'} for ${manifest.commit}: ${manifest.files.length} files.`)
}
