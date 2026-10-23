import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createRelease, verifyRelease } from '../scripts/production-release.mjs'

const commit = '1'.repeat(40)
function fixture(t: { after: (fn: () => void) => void }) {
  const root = mkdtempSync(join(tmpdir(), 'firstform-release-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(join(root, 'dist'), { recursive: true })
  mkdirSync(join(root, '.wrangler/release'), { recursive: true })
  writeFileSync(join(root, 'dist/index.html'), '<main>Firstform</main>')
  writeFileSync(join(root, '.wrangler/release/index.js'), 'export default {}')
  return root
}

test('a release is tied to its workflow commit and rejects a different revision', t => {
  const root = fixture(t)
  createRelease(root, commit)
  assert.equal(verifyRelease(root, commit).commit, commit)
  assert.throws(() => verifyRelease(root, '2'.repeat(40)), /commit/)
})

test('release verification rejects modified, missing and unexpected files', t => {
  const root = fixture(t)
  createRelease(root, commit)
  writeFileSync(join(root, 'dist/index.html'), '<main>Changed after verification</main>')
  assert.throws(() => verifyRelease(root, commit), /contents/)
  writeFileSync(join(root, 'dist/index.html'), '<main>Firstform</main>')
  writeFileSync(join(root, 'dist/unexpected.js'), 'unexpected')
  assert.throws(() => verifyRelease(root, commit), /contents/)
  rmSync(join(root, 'dist/unexpected.js'))
  rmSync(join(root, '.wrangler/release/index.js'))
  assert.throws(() => verifyRelease(root, commit), /bundled Worker/)
})

test('release preparation rejects links outside the built artifact', t => {
  const root = fixture(t)
  symlinkSync(join(root, 'dist/index.html'), join(root, 'dist/link.html'))
  assert.throws(() => createRelease(root, commit), /symlinks/)
})
