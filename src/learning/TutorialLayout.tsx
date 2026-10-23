import type { ReactNode } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { articleHref, domainHref, findArticle, findDomain, type LearningArticle } from './content'
import { LearningLink, type Navigate } from './Link'

export type TutorialSectionInfo = { id: string; title: string; navTitle: string }

export function TutorialSection({ section, children }: { section: TutorialSectionInfo; children: ReactNode }) {
  return <section className="ff-lesson-section" id={section.id} tabIndex={-1} aria-labelledby={section.id + '-title'}>
    <h2 id={section.id + '-title'}>{section.title}</h2>
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

  return <>
    <nav className="ff-breadcrumb ff-lesson-back" aria-label={'返回' + domain.title}>
      <LearningLink href={domainHref(domain.id)} navigate={navigate} restoreScroll><ArrowLeft size={18} aria-hidden="true" />{domain.title}</LearningLink>
    </nav>
    <div className="ff-lesson-layout">
      <header className="ff-lesson-intro">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <p className="ff-prerequisite">{article.prerequisite}</p>
      </header>
      <details className="ff-article-contents">
        <summary>本文目录<ChevronDown size={18} aria-hidden="true" /></summary>
        <nav aria-label="本文目录"><ul>{sections.map(section => <li key={section.id}>
          <LearningLink href={articleHref(domain.id, article.id) + '#' + section.id} navigate={navigate} onClick={event => {
            const disclosure = event.currentTarget.closest('details')
            if (disclosure) disclosure.open = false
          }}>{section.navTitle}</LearningLink>
        </li>)}</ul></nav>
      </details>
      <article className="ff-reading">
        {children}
        <footer className="ff-lesson-end">
          <p>{article.takeaway}</p>
          <LearningLink className="ff-return-link" href={domainHref(domain.id)} navigate={navigate} restoreScroll><ArrowLeft size={18} aria-hidden="true" />返回{domain.title}知识树</LearningLink>
          {nextArticle && <p><LearningLink className="ff-return-link" href={articleHref(domain.id, nextArticle.id)} navigate={navigate}>下一篇：{nextArticle.title}</LearningLink></p>}
        </footer>
      </article>
    </div>
  </>
}
