import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Moon, Sun } from 'lucide-react'
import { BRAND_NAME, BRAND_FULL_NAME, BRAND_TAGLINE } from '@/lib/branding'
import { applyAppearance } from '@/lib/appearance'
import { BrandMark } from '@/components/brand'
import { articleHref, domainHref, findArticle, findDomain, learningDomains, restoreExpandedBranches, type DomainId, type LearningDomain } from './content'
import { canonicalLearningPath, readLearningRoute } from './routing'
import { DomainArt } from './DomainArt'
import { LearningLink, type Navigate } from './Link'
import ComfortablePage from './ComfortablePage'
import CicdCaseStudy from './CicdCaseStudy'
import EngineeringRoadmap from './EngineeringRoadmap'
import KnowledgeTree from './KnowledgeTree'
import './learning.css'
import './tutorial.css'
import './engineering.css'

const treeStorageKey = 'firstform.knowledge-tree.v1'
const articleViews: Record<string, ComponentType<{ navigate: Navigate }>> = {
  'comfortable-page': ComfortablePage,
  'firstform-cicd': CicdCaseStudy,
}

function readTreePreferences() {
  try { return restoreExpandedBranches(localStorage.getItem(treeStorageKey)) }
  catch { return restoreExpandedBranches(null) }
}

function Home({ navigate }: { navigate: Navigate }) {
  return <>
    <header className="ff-home-intro"><h1 className="ff-title">从好奇开始，<br />把理解做成作品。</h1><p className="ff-description">选一个好奇的领域，<br />从一个小实验开始。</p></header>
    <div className="ff-domains">
      {learningDomains.map((domain, index) => <LearningLink key={domain.id} className={'ff-domain' + (index > 1 ? ' ff-domain-small' : '')} href={domainHref(domain.id)} navigate={navigate} aria-label={'探索' + domain.title + '知识树'}>
        <h2>{domain.title}</h2><p>{domain.summary}</p><DomainArt domain={domain.id} compact={index > 1} />
        <div className="ff-domain-foot"><span className="ff-domain-cta">探索知识树 <ArrowUpRight size={20} aria-hidden="true" /></span></div>
      </LearningLink>)}
    </div>
  </>
}

function DomainPage({ domain, expanded, onExpandedChange, navigate }: { domain: LearningDomain; expanded: string[]; onExpandedChange: (ids: string[]) => void; navigate: Navigate }) {
  const publishedNodes = domain.branches.flatMap(branch => branch.nodes).filter(node => node.articleId)
  const firstArticle = publishedNodes[0]?.articleId ? findArticle(domain.id, publishedNodes[0].articleId) : undefined
  return <>
    <nav className="ff-breadcrumb" aria-label="返回学习领域"><LearningLink href="/" navigate={navigate} restoreScroll><ArrowLeft size={18} aria-hidden="true" />学习领域</LearningLink></nav>
    <header className="ff-tree-intro"><h1 className="ff-title">{domain.title}</h1><p className="ff-description">{domain.description}</p></header>
    {firstArticle && <section className="ff-start-card" aria-labelledby="learning-start-title">
      <div className="ff-start-copy">
        <h2 id="learning-start-title">{firstArticle.title}</h2>
        <p className="ff-description">{firstArticle.description}</p>
        <div className="ff-start-actions">
          <LearningLink className="ff-primary" href={articleHref(domain.id, firstArticle.id)} navigate={navigate}>从这篇开始 <ArrowRight size={18} aria-hidden="true" /></LearningLink>
        </div>
      </div>
      <div className="ff-start-art"><DomainArt domain={domain.id} /></div>
    </section>}
    {domain.id === 'engineering' && <EngineeringRoadmap />}
    <KnowledgeTree domain={domain} expanded={expanded} onExpandedChange={onExpandedChange} navigate={navigate} />
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
  const changeExpandedBranches = (domainId: DomainId, ids: string[]) => setExpanded(previous => ({ ...previous, [domainId]: ids }))

  return <div className="firstform-lab">
    <LearningLink className="ff-skip-link" href={path + '#learning-main'} navigate={navigate} onClick={() => main.current?.focus()}>跳转至主要内容</LearningLink>
    <div className="ff-container">
      <header className="ff-header">
        <LearningLink className="ff-brand" href="/" navigate={navigate} restoreScroll aria-label="初构首页"><BrandMark className="ff-mark" /><span className="ff-brand-name">{BRAND_NAME}</span></LearningLink>
        <nav className="ff-nav" aria-label="主导航">
          <button type="button" className="ff-theme-button" aria-label={dark ? '切换亮色外观' : '切换深色外观'} aria-pressed={dark} onClick={() => setDark(value => !value)}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
          <details className="ff-about" ref={about} onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}><summary>关于初构</summary><p>在建设这个网站的过程中，理解设计、代码与工程，再把经验整理成可以探索、实践和复用的方法。</p></details>
        </nav>
      </header>
      <main ref={main} tabIndex={-1} id="learning-main" className="ff-main">
        <div className={'ff-view' + (hasNavigated ? ' ff-transition' : '')} key={path}>
          {route.kind === 'home' || route.kind === 'legacy' ? <Home navigate={navigate} /> : route.kind === 'domain'
            ? <DomainPage domain={findDomain(route.domainId)!} expanded={expanded[route.domainId]} onExpandedChange={ids => changeExpandedBranches(route.domainId, ids)} navigate={navigate} />
            : route.kind === 'article' && ArticleView ? <ArticleView navigate={navigate} />
              : <section className="ff-not-found"><h1 className="ff-title">未找到这个页面</h1><p className="ff-description">可以回到学习领域，沿着知识树继续探索。</p><LearningLink href="/" navigate={navigate} className="ff-primary">回到学习领域 <ArrowRight size={15} aria-hidden="true" /></LearningLink></section>}
        </div>
      </main>
      <footer className="ff-footer"><span>{BRAND_FULL_NAME}</span></footer>
    </div>
  </div>
}
