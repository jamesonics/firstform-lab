import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import { articleHref, type LearningDomain } from './content'
import { LearningLink, type Navigate } from './Link'
import './knowledge-tree.css'

type TreeGeometry = {
  width: number
  height: number
  trunk: string
  branches: { id: string; path: string; open: boolean }[]
  leaves: { id: string; path: string; ready: boolean }[]
  joints: { id: string; x: number; y: number; open: boolean }[]
}

const emptyGeometry: TreeGeometry = { width: 0, height: 0, trunk: '', branches: [], leaves: [], joints: [] }

/** Connect the actual card positions, so wrapping and expansion never detach a branch. */
function useTreeGeometry(domain: LearningDomain, expanded: readonly string[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<TreeGeometry>(emptyGeometry)
  useLayoutEffect(() => {
    const host = ref.current
    if (!host) return
    let frame = 0
    const measure = () => {
      frame = 0
      const bounds = host.getBoundingClientRect()
      if (!bounds.width) return
      const localBounds = (element: Element) => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left - bounds.left, right: rect.right - bounds.left, top: rect.top - bounds.top, bottom: rect.bottom - bounds.top, middle: rect.top - bounds.top + rect.height / 2 }
      }
      const root = localBounds(host.querySelector('[data-tree-root]')!)
      const narrow = matchMedia('(max-width: 760px)').matches
      const spine = narrow ? 14 : bounds.width / 2
      const next: TreeGeometry = { width: bounds.width, height: bounds.height, trunk: '', branches: [], leaves: [], joints: [] }
      let lastY = root.middle
      for (const row of host.querySelectorAll<HTMLElement>('[data-tree-row]')) {
        const branch = localBounds(row.querySelector('[data-tree-branch]')!)
        const open = row.dataset.open === 'true'
        const y = branch.middle
        lastY = y
        next.branches.push({ id: row.dataset.treeRow!, open, path: 'M ' + (narrow ? branch.left : branch.right) + ' ' + y + ' H ' + spine })
        next.joints.push({ id: row.dataset.treeRow!, x: spine, y, open })
        if (!open) continue
        for (const leaf of row.querySelectorAll<HTMLElement>('[data-tree-leaf]')) {
          const target = localBounds(leaf)
          const forkX = branch.left + 12
          const path = narrow
            ? 'M ' + forkX + ' ' + branch.bottom + ' V ' + (target.middle - 12) + ' Q ' + forkX + ' ' + target.middle + ' ' + target.left + ' ' + target.middle
            : 'M ' + spine + ' ' + y + ' C ' + (spine + 28) + ' ' + y + ', ' + (target.left - 28) + ' ' + target.middle + ', ' + target.left + ' ' + target.middle
          next.leaves.push({ id: leaf.dataset.treeLeaf!, path, ready: leaf.dataset.ready === 'true' })
        }
      }
      next.trunk = narrow
        ? 'M ' + root.left + ' ' + root.middle + ' H ' + spine + ' V ' + lastY
        : 'M ' + spine + ' ' + root.bottom + ' V ' + lastY
      setGeometry(next)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    observer.observe(host)
    for (const element of host.querySelectorAll('[data-tree-root], [data-tree-branch], [data-tree-leaf]')) observer.observe(element)
    addEventListener('resize', schedule)
    measure()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener('resize', schedule) }
  }, [domain, expanded])
  return { ref, geometry }
}

export default function KnowledgeTree({ domain, expanded, onExpandedChange, navigate }: {
  domain: LearningDomain
  expanded: readonly string[]
  onExpandedChange: (ids: string[]) => void
  navigate: Navigate
}) {
  const { ref, geometry } = useTreeGeometry(domain, expanded)
  const allOpen = domain.branches.every(branch => expanded.includes(branch.id))
  const nodeCount = domain.branches.reduce((count, branch) => count + branch.nodes.length, 0)
  const mapId = 'knowledge-map-' + domain.id
  return <section className="ff-knowledge" id="knowledge-tree" tabIndex={-1} aria-labelledby="knowledge-tree-title">
    <header className="ff-knowledge-heading">
      <div><h2 id="knowledge-tree-title">完整知识树</h2><p>沿着主干浏览主题，点开树枝，看看每个问题长在哪里。</p></div>
      <button className="ff-tree-expand-all" type="button" aria-expanded={allOpen} aria-controls={mapId} onClick={() => onExpandedChange(allOpen ? [] : domain.branches.map(branch => branch.id))}>
        {allOpen ? <Minus size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}{allOpen ? '收起全部' : '展开全部'}
      </button>
    </header>
    <div className="ff-tree-map" id={mapId} ref={ref}>
      {geometry.width > 0 && <svg className="ff-tree-lines" viewBox={'0 0 ' + geometry.width + ' ' + geometry.height} aria-hidden="true" focusable="false">
        <path className="ff-tree-trunk" d={geometry.trunk} />
        {geometry.branches.map(branch => <path key={branch.id} className="ff-tree-edge" data-open={branch.open} d={branch.path} />)}
        {geometry.leaves.map(leaf => <path key={leaf.id} className="ff-tree-twig" data-ready={leaf.ready} d={leaf.path} />)}
        {geometry.joints.map(joint => <g key={joint.id} data-open={joint.open}><circle className="ff-tree-joint-halo" cx={joint.x} cy={joint.y} r="11" /><circle className="ff-tree-joint" cx={joint.x} cy={joint.y} r="5" /></g>)}
      </svg>}
      <div className="ff-tree-root" data-tree-root>
        <span>学习领域</span><strong>{domain.title}</strong><small>{domain.branches.length} 个主题 · {nodeCount} 个知识点</small>
      </div>
      <ul className="ff-tree-branches" aria-label={domain.title + '的主题与知识点'}>
        {domain.branches.map(branch => {
          const open = expanded.includes(branch.id)
          const ready = branch.nodes.filter(node => node.articleId).length
          const id = 'learning-branch-' + domain.id + '-' + branch.id
          return <li className="ff-tree-row" key={branch.id} data-tree-row={branch.id} data-open={open}>
            <h3 className="ff-tree-branch-heading">
              <button type="button" className="ff-tree-branch-card" data-tree-branch aria-expanded={open} aria-controls={id} aria-label={(open ? '收起' : '展开') + branch.title} onClick={() => onExpandedChange(open ? expanded.filter(item => item !== branch.id) : [...expanded, branch.id])}>
                <span className="ff-tree-node-type">主题</span>
                <strong>{branch.title}</strong>
                <span className="ff-tree-branch-description">{branch.description}</span>
                <span className="ff-tree-branch-foot"><span>{branch.nodes.length} 个知识点{ready ? ' · ' + ready + ' 篇可读' : ' · 规划中'}</span><span className="ff-tree-node-toggle" aria-hidden="true">{open ? <Minus size={16} /> : <Plus size={16} />}</span></span>
              </button>
            </h3>
            <ul className="ff-tree-leaves" id={id} hidden={!open} aria-label={branch.title + '的知识点'}>
              {branch.nodes.map(node => <li key={node.id}>
                {node.articleId
                  ? <LearningLink className="ff-tree-leaf-card" data-tree-leaf={node.id} data-ready="true" href={articleHref(domain.id, node.articleId)} navigate={navigate}>
                    <span className="ff-tree-leaf-status">教程 · 可阅读<ArrowUpRight size={15} aria-hidden="true" /></span>
                    <h4>{node.title}</h4><p>{node.description}</p>
                  </LearningLink>
                  : <div className="ff-tree-leaf-card" data-tree-leaf={node.id} data-ready="false">
                    <span className="ff-tree-leaf-status">知识点 · 规划中</span><h4>{node.title}</h4><p>{node.description}</p>
                  </div>}
              </li>)}
            </ul>
            {!open && <p className="ff-tree-folded" aria-hidden="true">点开主题，查看 {branch.nodes.length} 个知识点</p>}
          </li>
        })}
      </ul>
    </div>
    <p className="ff-tree-legend"><span><i data-ready="true" aria-hidden="true" />已发布 · 可以阅读</span><span><i data-ready="false" aria-hidden="true" />规划中 · 尚未发布</span></p>
    <p className="ff-planning">连线表示领域、主题和知识点的所属关系。内容会随学习与实践逐步补充。</p>
  </section>
}
