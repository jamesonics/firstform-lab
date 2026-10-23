import test from 'node:test'
import assert from 'node:assert/strict'
import { engineeringBranches, engineeringSources, engineeringStages } from '../src/learning/engineering.ts'
import { readLearningRoute } from '../src/learning/routing.ts'
import { evaluateRelease, releaseScenarios, type ReleaseConditions } from '../src/learning/release-simulation.ts'

test('engineering stages cover the tree once and prerequisite links point backwards to existing branches', () => {
  assert.deepEqual(engineeringStages.flatMap(stage => [...stage.branches]), engineeringBranches.map(branch => branch.id))
  const earlierBranches = new Set<string>()
  for (const branch of engineeringBranches) {
    assert.ok(branch.prerequisites.every(id => earlierBranches.has(id)), 'Learning dependencies must be resolvable without a cycle')
    assert.ok(branch.sources.every(id => engineeringSources[id]?.href), 'A reading entry must resolve to its source')
    earlierBranches.add(branch.id)
    for (const node of branch.nodes) {
      if (!node.articleId) assert.deepEqual(readLearningRoute('/learn/engineering/' + node.id), { kind: 'not-found' })
    }
  }
})

const ready: ReleaseConditions = { prPassed: true, mainPassed: true, approved: true, latest: true, artifactIntact: true, healthy: true }

test('each condition before upload prevents publishing, and approval is a wait rather than a failed check', () => {
  const gates = ['prPassed', 'mainPassed', 'approved', 'latest', 'artifactIntact'] as const
  for (const [index, gate] of gates.entries()) {
    const result = evaluateRelease({ ...ready, [gate]: false })
    assert.equal(result.step, index)
    assert.equal(result.deployed, false)
    assert.equal(result.state, gate === 'approved' ? 'waiting' : 'blocked')
  }
  assert.equal(evaluateRelease({ ...ready, prPassed: false, approved: false, artifactIntact: false }).step, 0)
  assert.equal(evaluateRelease({ ...ready, approved: false, latest: false }).state, 'waiting')
})

test('a health failure after upload must not be represented as a prevented deployment or automatic rollback', () => {
  const unhealthy = evaluateRelease({ ...ready, healthy: false })
  assert.equal(unhealthy.state, 'deployed-warning')
  assert.equal(unhealthy.deployed, true)
  assert.equal(evaluateRelease(ready).state, 'verified')
  assert.equal(evaluateRelease(ready).deployed, true)
  assert.equal(new Set(releaseScenarios.map(item => item.id)).size, releaseScenarios.length)
})
