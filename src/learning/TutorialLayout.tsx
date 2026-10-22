import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { articleHref, domainHref, findArticle, findDomain, type LearningArticle } from './content'
import { LearningLink, type Navigate } from './Link'

export type TutorialSectionInfo = { id: string; title: string; navTitle: string }

export function TutorialSection({ section, index, children }: { section: TutorialSectionInfo; index: number; children: ReactNode }) {
  return <section className="ff-lesson-section" id={section.id} tabIndex={-1} aria-labelledby={section.id + '-title'}>
    <header className="ff-section-heading">
      <span className="ff-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <h2 id={section.id + '-title'}>{section.title}</h2>
    </header>
    {children}
  </section>
}

export default function TutorialLayout({ article, sections, navigate, children }: {
  article: LearningArticle
  sections: readonly TutorialSectionInfo[]
  navigate: Navigate
  children: ReactNode
}) {
  const domain = findDomain(article.domainId)!
  const branch = domain.branches.find(item => item.id === article.branchId)!
  const nextNode = branch.nodes[branch.nodes.findIndex(node => node.articleId === article.id) + 1]
  const nextArticle = nextNode?.articleId ? findArticle(domain.id, nextNode.articleId) : undefined
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = sections[0].id
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= 150) current = section.id
      }
      setActive(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', schedule)
      removeEventListener('resize', schedule)
    }
  }, [sections])

  const contents = <ol>{sections.map((section, index) => <li key={section.id}>
    <LearningLink href={articleHref(domain.id, article.id) + '#' + section.id} navigate={navigate} aria-current={active === section.id ? 'location' : undefined} onClick={event => {
      const disclosure = event.currentTarget.closest('details')
      if (disclosure) disclosure.open = false
      setActive(section.id)
    }}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.navTitle}</LearningLink>
  </li>)}</ol>

  return <>
    <nav className="ff-breadcrumb" aria-label="当前位置">
      <LearningLink href="/" navigate={navigate} restoreScroll>学习领域</LearningLink><span aria-hidden="true">/</span>
      <LearningLink href={domainHref(domain.id)} navigate={navigate} restoreScroll>{domain.title}</LearningLink><span aria-hidden="true">/</span>
      <span aria-current="page">{branch.title}</span>
    </nav>
    <header className="ff-lesson-intro">
      <p className="ff-kicker">入门教程 · 讲解、实验与练习</p>
      <h1>{article.title}</h1>
      <p className="ff-description">{article.description}</p>
      <div className="ff-lesson-goals">
        <span>这一篇，学会</span>
        <ul>{article.outcomes.map(outcome => <li key={outcome}><Check size={14} aria-hidden="true" />{outcome}</li>)}</ul>
      </div>
      <p className="ff-prerequisite"><span>开始之前</span>{article.prerequisite}</p>
    </header>
    <details className="ff-mobile-toc">
      <summary><span>本文目录 <small>· {sections.find(section => section.id === active)?.navTitle}</small></span><ChevronDown size={16} aria-hidden="true" /></summary>
      <nav aria-label="本文目录">{contents}</nav>
    </details>
    <div className="ff-lesson-layout">
      <article className="ff-reading">
        {children}
        <footer className="ff-lesson-end">
          <p className="ff-kicker">本篇结束</p>
          <p>带走一个方法：{article.takeaway}</p>
          <LearningLink className="ff-return-link" href={domainHref(domain.id)} navigate={navigate} restoreScroll><ArrowLeft size={16} aria-hidden="true" />返回{domain.title}知识树</LearningLink>
          {nextNode && <div className="ff-next-lesson"><span>接下来</span>{nextArticle
            ? <LearningLink href={articleHref(domain.id, nextArticle.id)} navigate={navigate}>{nextArticle.title}<ArrowRight size={14} aria-hidden="true" /></LearningLink>
            : <p>{nextNode.title}<small>规划中</small></p>}
          </div>}
        </footer>
      </article>
      <aside className="ff-lesson-toc">
        <nav aria-label="本文目录"><p className="ff-kicker">这一篇的学习顺序</p>{contents}</nav>
        <p className="ff-toc-note">沿着正文往下读。<br />实验就在讲解旁边。</p>
      </aside>
    </div>
  </>
}
