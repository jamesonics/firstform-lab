import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronRight, Moon, Sun } from 'lucide-react'
import { BRAND_NAME, BRAND_ENGLISH_NAME, BRAND_FULL_NAME, BRAND_TAGLINE } from '@/lib/branding'
import { applyAppearance } from '@/lib/appearance'
import { BrandMark } from '@/components/brand'
import { articleHref, domainHref, findArticle, findDomain, learningDomains, restoreExpandedBranches, type DomainId, type LearningDomain } from './content'
import { canonicalLearningPath, readLearningRoute } from './routing'
import { DomainArt } from './DomainArt'
import { LearningLink, type Navigate } from './Link'
import ComfortablePage from './ComfortablePage'
import './learning.css'
import './tutorial.css'

const treeStorageKey = 'firstform.knowledge-tree.v1'
const articleViews: Record<string, ComponentType<{ navigate: Navigate }>> = {
  'comfortable-page': ComfortablePage,
}

function readTreePreferences() {
  try { return restoreExpandedBranches(localStorage.getItem(treeStorageKey)) }
  catch { return restoreExpandedBranches(null) }
}

function Home({ navigate }: { navigate: Navigate }) {
  return <>
    <header className="ff-home-intro"><div><p className="ff-kicker">PERSONAL LEARNING LAB</p><h1 className="ff-title">从好奇开始，<br />把理解做成作品。</h1></div><p className="ff-description">设计、代码与工程。<br />沿着知识树，动手探索每一个问题。</p></header>
    <div className="ff-domains">
      {learningDomains.map((domain, index) => <LearningLink key={domain.id} className={'ff-domain' + (index > 1 ? ' ff-domain-small' : '')} href={domainHref(domain.id)} navigate={navigate} aria-label={'探索' + domain.title + '知识树'}>
        <h2>{domain.title}</h2><p>{domain.summary}</p><DomainArt domain={domain.id} compact={index > 1} />
        <div className="ff-domain-foot"><span>{domain.topics}</span><span className="ff-domain-cta">探索知识树 <ArrowUpRight size={16} aria-hidden="true" /></span></div>
      </LearningLink>)}
    </div>
  </>
}

function KnowledgeTree({ domain, expanded, toggleBranch, navigate }: { domain: LearningDomain; expanded: string[]; toggleBranch: (id: string) => void; navigate: Navigate }) {
  const publishedNodes = domain.branches.flatMap(branch => branch.nodes).filter(node => node.articleId)
  const firstArticle = publishedNodes[0]?.articleId ? findArticle(domain.id, publishedNodes[0].articleId) : undefined
  return <>
    <nav className="ff-breadcrumb" aria-label="当前位置"><LearningLink href="/" navigate={navigate} restoreScroll>学习领域</LearningLink><span aria-hidden="true">/</span><span aria-current="page">{domain.title}</span></nav>
    <header className="ff-tree-intro"><p className="ff-kicker">学习领域 · {publishedNodes.length ? `${publishedNodes.length} 篇可读` : '内容规划中'}</p><h1 className="ff-title">{domain.title}</h1><p className="ff-description">{domain.description}</p></header>
    {firstArticle && <section className="ff-start-card" aria-labelledby="learning-start-title">
      <div className="ff-start-copy">
        <p className="ff-kicker">第一次来，从这里开始</p>
        <h2 id="learning-start-title">{firstArticle.title}</h2>
        <p className="ff-description">{firstArticle.description}</p>
        <p className="ff-start-prerequisite">{firstArticle.prerequisite}</p>
        <div className="ff-start-actions">
          <LearningLink className="ff-primary" href={articleHref(domain.id, firstArticle.id)} navigate={navigate}>开始学习 <ArrowRight size={16} aria-hidden="true" /></LearningLink>
          <LearningLink className="ff-text-button" href={domainHref(domain.id) + '#knowledge-tree'} navigate={navigate}>浏览完整知识树 <ArrowDown size={14} aria-hidden="true" /></LearningLink>
        </div>
      </div>
      <div className="ff-start-outcomes"><p className="ff-kicker">通过讲解和实验，学会</p><ol>{firstArticle.outcomes.map((outcome, index) => <li key={outcome}><span aria-hidden="true">0{index + 1}</span>{outcome}</li>)}</ol></div>
    </section>}
    <section className="ff-knowledge" id="knowledge-tree" tabIndex={-1} aria-labelledby="knowledge-tree-title">
      <header className="ff-knowledge-heading"><div><h2 id="knowledge-tree-title">完整知识树</h2><p>{firstArticle ? '想找某个主题？在这里按分类浏览。' : '这里是这一领域的学习规划，教程会随实践逐步补充。'}</p></div><span>{domain.branches.length} 个主题分类</span></header>
      <div className="ff-tree-list">
        {domain.branches.map(branch => {
          const open = expanded.includes(branch.id)
          const id = 'learning-branch-' + domain.id + '-' + branch.id
          const ready = branch.nodes.filter(node => node.articleId).length
          return <section className="ff-branch" data-open={open} key={branch.id}>
            <h3><button type="button" className="ff-branch-toggle" aria-expanded={open} aria-controls={id} onClick={() => toggleBranch(branch.id)}><span><strong>{branch.title}</strong><small>{branch.description}</small></span><span className="ff-branch-status"><span>{ready ? `${ready} 篇可读` : `${branch.nodes.length} 篇规划`}</span><ChevronRight className="ff-chevron" size={17} aria-hidden="true" /></span></button></h3>
            <div className="ff-branch-body" id={id} inert={!open} aria-hidden={!open}><div className="ff-branch-inner"><div className="ff-leaves">
              {branch.nodes.map(node => node.articleId
                ? <LearningLink className="ff-leaf" data-ready="true" href={articleHref(domain.id, node.articleId)} navigate={navigate} key={node.id}><span>{node.title}</span><small>阅读 <ArrowRight size={12} aria-hidden="true" /></small></LearningLink>
                : <div className="ff-leaf" data-ready="false" key={node.id}><span>{node.title}</span><small>规划中</small></div>)}
            </div></div></div>
          </section>
        })}
      </div><p className="ff-planning">标为“规划中”的主题尚未发布。每完成一次学习与验证，这棵树就生长一点。</p>
    </section>
  </>
}

export default function LearningApp() {
  const [path, setPath] = useState(() => canonicalLearningPath(location.pathname))
  const pathRef = useRef(path)
  const locationRef = useRef(path + location.search + location.hash)
  const [navigationId, setNavigationId] = useState(0)
  const scrollPositions = useRef(new Map<string, number>())
  const entryScrollPositions = useRef(new Map<string, number>())
  const pendingScroll = useRef({ top: 0, focus: false, anchor: location.hash.slice(1) })
  const main = useRef<HTMLElement>(null)
  const about = useRef<HTMLDetailsElement>(null)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [expanded, setExpanded] = useState(readTreePreferences)
  const [hasNavigated, setHasNavigated] = useState(false)
  const route = readLearningRoute(path)
  const ArticleView = route.kind === 'article' ? articleViews[route.articleId] : undefined

  useEffect(() => {
    document.documentElement.lang = 'zh-CN'
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const canonical = canonicalLearningPath(location.pathname)
    if (canonical !== location.pathname) history.replaceState(history.state, '', canonical === '/' ? '/' : canonical + location.search + location.hash)
    const onHistory = () => {
      const next = canonicalLearningPath(location.pathname)
      const nextLocation = next + location.search + location.hash
      scrollPositions.current.set(pathRef.current, window.scrollY)
      entryScrollPositions.current.set(locationRef.current, window.scrollY)
      if (next !== location.pathname) history.replaceState(history.state, '', nextLocation)
      const saved = entryScrollPositions.current.get(nextLocation)
      pendingScroll.current = { top: saved ?? 0, focus: next !== pathRef.current, anchor: saved === undefined ? location.hash.slice(1) : '' }
      pathRef.current = next; locationRef.current = nextLocation
      setPath(next); setNavigationId(value => value + 1); setHasNavigated(true)
    }
    const closeAbout = (event: PointerEvent) => { if (about.current && !about.current.contains(event.target as Node)) about.current.open = false }
    addEventListener('popstate', onHistory)
    document.addEventListener('pointerdown', closeAbout)
    return () => { history.scrollRestoration = previous; removeEventListener('popstate', onHistory); document.removeEventListener('pointerdown', closeAbout) }
  }, [])

  useEffect(() => { try { localStorage.setItem(treeStorageKey, JSON.stringify(expanded)) } catch { /* Keep navigation usable without storage. */ } }, [expanded])
  useEffect(() => {
    applyAppearance(dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#191d24' : '#f6f7f9')
  }, [dark])

  useLayoutEffect(() => {
    const pending = pendingScroll.current
    const target = pending.anchor ? document.getElementById(pending.anchor) : null
    if (target) {
      target.scrollIntoView({ behavior: 'instant' })
      target.focus({ preventScroll: true })
    }
    else window.scrollTo({ top: pending.top, behavior: 'instant' })
    if (pending.focus && !target) main.current?.focus({ preventScroll: true })
    if (about.current) about.current.open = false
  }, [path, navigationId])

  useEffect(() => {
    const current = readLearningRoute(path)
    const domain = current.kind === 'domain' || current.kind === 'article' ? findDomain(current.domainId) : undefined
    const article = current.kind === 'article' ? findArticle(current.domainId, current.articleId) : undefined
    const title = article?.title ?? domain?.title ?? (current.kind === 'not-found' ? '未找到页面' : '')
    document.title = title ? title + ' · ' + BRAND_FULL_NAME : BRAND_FULL_NAME
    document.querySelector('meta[name="description"]')?.setAttribute('content', article?.description ?? domain?.description ?? BRAND_TAGLINE + '探索前端、后端、数据、部署与 Agent 协作的知识树。')
  }, [path])

  const navigate: Navigate = (href, restoreScroll = false) => {
    const url = new URL(href, location.href)
    const next = canonicalLearningPath(url.pathname)
    const nextLocation = next + url.search + url.hash
    scrollPositions.current.set(pathRef.current, window.scrollY)
    entryScrollPositions.current.set(locationRef.current, window.scrollY)
    pendingScroll.current = { top: restoreScroll ? scrollPositions.current.get(next) ?? 0 : 0, focus: next !== pathRef.current, anchor: url.hash.slice(1) }
    if (nextLocation !== locationRef.current) history.pushState(history.state, '', nextLocation)
    pathRef.current = next; locationRef.current = nextLocation
    setPath(next); setNavigationId(value => value + 1); setHasNavigated(true)
  }
  const toggleBranch = (domainId: DomainId, branchId: string) => setExpanded(previous => ({ ...previous, [domainId]: previous[domainId].includes(branchId) ? previous[domainId].filter(id => id !== branchId) : [...previous[domainId], branchId] }))

  return <div className="firstform-lab">
    <LearningLink className="ff-skip-link" href={path + '#learning-main'} navigate={navigate} onClick={() => main.current?.focus()}>跳转至主要内容</LearningLink>
    <div className="ff-container">
      <header className="ff-header">
        <LearningLink className="ff-brand" href="/" navigate={navigate} restoreScroll aria-label="初构首页"><BrandMark className="ff-mark" /><span className="ff-brand-name">{BRAND_NAME}<small>{BRAND_ENGLISH_NAME}</small></span></LearningLink>
        <nav className="ff-nav" aria-label="主导航"><LearningLink className="ff-text-button" href="/" navigate={navigate} restoreScroll aria-current={route.kind === 'home' ? 'page' : undefined}>学习领域</LearningLink>
          <button type="button" className="ff-theme-button" aria-label={dark ? '切换亮色外观' : '切换深色外观'} aria-pressed={dark} onClick={() => setDark(value => !value)}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
          <details className="ff-about" ref={about} onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}><summary>关于初构</summary><p>在建设这个网站的过程中，理解设计、代码与工程，再把经验整理成可以探索、实践和复用的方法。</p></details>
        </nav>
      </header>
      <main ref={main} tabIndex={-1} id="learning-main" className="ff-main">
        <div className={'ff-view' + (hasNavigated ? ' ff-transition' : '')} key={path}>
          {route.kind === 'home' || route.kind === 'legacy' ? <Home navigate={navigate} /> : route.kind === 'domain'
            ? <KnowledgeTree domain={findDomain(route.domainId)!} expanded={expanded[route.domainId]} toggleBranch={id => toggleBranch(route.domainId, id)} navigate={navigate} />
            : route.kind === 'article' && ArticleView ? <ArticleView navigate={navigate} />
              : <section className="ff-not-found"><p className="ff-kicker">404</p><h1 className="ff-title">未找到这个页面</h1><p className="ff-description">可以回到学习领域，沿着知识树继续探索。</p><LearningLink href="/" navigate={navigate} className="ff-primary">回到学习领域 <ArrowRight size={15} aria-hidden="true" /></LearningLink></section>}
        </div>
      </main>
      <footer className="ff-footer"><span>{BRAND_FULL_NAME}</span><span>{BRAND_TAGLINE}</span></footer>
    </div>
  </div>
}
