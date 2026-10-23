import { ChevronDown } from 'lucide-react'
import { engineeringBranches, engineeringSources, engineeringStages } from './engineering'

export default function EngineeringRoadmap() {
  return <section className="ff-engineering-roadmap" aria-labelledby="engineering-path-title">
    <h2 id="engineering-path-title">沿着一次交付，逐步展开</h2>
    <p>先读上面的实战案例建立全貌，再按下面的顺序补齐原理。安全与验证贯穿每一步；最后一阶段按实际需要深入。</p>
    <ol className="ff-study-path">{engineeringStages.map((stage, index) => <li key={stage.title}>
      <span className="ff-study-number" aria-hidden="true">{index + 1}</span>
      <div><h3>{stage.title}</h3><p>{stage.description}</p></div>
    </li>)}</ol>
    <details className="ff-study-guide">
      <summary>每个主干先学什么、怎样练习<ChevronDown size={18} aria-hidden="true" /></summary>
      <p>这是学习路线初稿，知识树中的“规划中”表示教程尚未发布。能独立解释、完成实验、说明边界后，再把理解整理成文章。</p>
      <div className="ff-study-branches">{engineeringBranches.map((branch, index) => <details key={branch.id}>
        <summary>{index + 1}. {branch.title}</summary>
        <dl>
          <dt>先了解</dt><dd>{branch.prerequisites.length ? branch.prerequisites.map(id => engineeringBranches.find(item => item.id === id)!.title).join('、') + '。' : ''}{branch.extraPrerequisite}</dd>
          <dt>做一个实验</dt><dd>{branch.practice}</dd>
          <dt>怎样算理解</dt><dd>{branch.readyWhen}</dd>
          <dt>官方资料</dt><dd><ul>{branch.sources.map(id => <li key={id}><a href={engineeringSources[id].href}>{engineeringSources[id].title}</a></li>)}</ul></dd>
        </dl>
      </details>)}</div>
      <p>这条顺序是初构结合实践整理的学习建议，并非某家平台规定的唯一课程。程序的业务设计与 SQL 基础，分别回到“后端与接口”和“数据与存储”继续学习。</p>
    </details>
  </section>
}
