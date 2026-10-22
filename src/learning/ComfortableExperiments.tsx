import { useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { findDomain } from './content'
import { ChoiceGroup, Experiment, RangeControl } from './Experiment'

function CourseCard({ titleSize = 24, innerGap = 8, groupGap = 24, lineHeight = 1.8, narrow = false, longTitle = false, practice = false }: {
  titleSize?: number; innerGap?: number; groupGap?: number; lineHeight?: number; narrow?: boolean; longTitle?: boolean; practice?: boolean
}) {
  const style = {
    '--demo-title-size': titleSize + 'px',
    '--demo-inner-gap': innerGap + 'px',
    '--demo-group-gap': groupGap + 'px',
    '--demo-line-height': lineHeight,
  } as CSSProperties
  return <div className="ff-course-demo" data-narrow={narrow} style={style} role="group" aria-label="排版示例">
    <span className="ff-demo-category">{practice ? '部署与工程' : '前端与交互'} · 从这里开始</span>
    <div className="ff-demo-copy">
      <h3>{practice
        ? (longTitle ? '把第一个网站发布上线，并验证它在另一台设备上也能访问' : '把第一个网站发布上线')
        : (longTitle ? '一个有很多内容的学习页面，怎样让第一次来的读者找到起点' : '一个页面为什么看起来舒服')}</h3>
      <p>{practice ? '已经有了一个本地网站？从准备发布到检查访问，亲手走完一次上线过程。' : '一起改造初构的学习入口，理解重点、分组与阅读顺序。学完后，试着改善自己的页面，并解释每个选择。'}</p>
    </div>
    <span className="ff-demo-action">开始学习 <ArrowRight size={13} aria-hidden="true" /></span>
  </div>
}

export function PageComparison() {
  const [version, setVersion] = useState<'a' | 'b'>('a')
  const directory = <div className="ff-case-directory">
    <span className="ff-case-label">完整知识树</span>
    {findDomain('frontend')!.branches.map(branch => <div key={branch.id}>{branch.title}</div>)}
  </div>
  const course = <div className="ff-case-course">
    <span className="ff-case-label">从一个问题开始</span>
    <strong>一个页面为什么看起来舒服</strong>
    <p>观察重点与留白，亲手改善一个学习入口。</p>
    <span className="ff-demo-action">开始学习 <ArrowRight size={13} aria-hidden="true" /></span>
  </div>
  return <Experiment title="观察实验 · 同样的内容，两种组织" onReset={() => setVersion('a')} caption="这是领域页的结构示意。示例中的“开始学习”仅用于观察，不会跳转。">
    <div className="ff-lab-controls"><ChoiceGroup label="切换布局" value={version} onChange={setVersion} options={[{ value: 'a', label: '版本 A' }, { value: 'b', label: '版本 B' }]} /></div>
    <div className="ff-lab-stage">
      <div className="ff-case" data-version={version}>
        <div className="ff-case-header"><strong>前端与交互</strong><span>从页面结构到交互细节</span></div>
        <div className="ff-case-body">{version === 'a' ? <>{directory}{course}</> : <>{course}{directory}</>}</div>
      </div>
    </div>
  </Experiment>
}

export function HierarchyExperiment() {
  const [size, setSize] = useState(16)
  return <Experiment title="实验一 · 只改变标题字号" onReset={() => setSize(16)} caption="范围 16–32px 用于对比。本例的正文固定为 14px；字号比例需要结合真实内容判断。">
    <div className="ff-lab-stage"><CourseCard titleSize={size} /></div>
    <div className="ff-lab-controls"><RangeControl label="标题字号" value={size} min={16} max={32} onChange={setSize} /></div>
  </Experiment>
}

export function SpacingExperiment() {
  const [inner, setInner] = useState(12)
  const [outer, setOuter] = useState(12)
  return <Experiment title="实验二 · 让距离表达分组" onReset={() => { setInner(12); setOuter(12) }} caption="组内间距连接标题和说明；组间间距隔开分类、内容与操作。卡片四周的留白固定为 24px。">
    <div className="ff-lab-stage"><CourseCard innerGap={inner} groupGap={outer} /></div>
    <div className="ff-lab-controls ff-two-controls">
      <RangeControl label="标题与说明的距离" value={inner} min={4} max={24} onChange={setInner} />
      <RangeControl label="不同组之间的距离" value={outer} min={8} max={40} onChange={setOuter} />
    </div>
  </Experiment>
}

export function ReadingExperiment() {
  const [width, setWidth] = useState<'regular' | 'narrow'>('regular')
  const [long, setLong] = useState(false)
  const [leading, setLeading] = useState(1.8)
  return <Experiment title="实验三 · 换一种阅读条件" onReset={() => { setWidth('regular'); setLong(false); setLeading(1.8) }} caption="常规容器最多 440px，窄容器最多 280px；都受当前屏幕宽度限制。这里只模拟内容宽度，整页仍需在真实手机上检查。">
    <div className="ff-lab-controls">
      <ChoiceGroup label="内容容器" value={width} onChange={setWidth} options={[{ value: 'regular', label: '常规宽度' }, { value: 'narrow', label: '窄一些' }]} />
      <label className="ff-check-control"><input type="checkbox" checked={long} onChange={event => setLong(event.target.checked)} />换成长标题</label>
    </div>
    <div className="ff-lab-stage"><CourseCard narrow={width === 'narrow'} longTitle={long} lineHeight={leading} /></div>
    <div className="ff-lab-controls"><RangeControl label="正文行高" value={leading} min={1.3} max={2.2} step={0.1} unit=" 倍" onChange={setLeading} /></div>
  </Experiment>
}

const selfChecks = [
  '我能指出第一眼应该看到的信息，并解释原因。',
  '我能说清哪些内容是一组，距离怎样表达了这种关系。',
  '我检查了窄容器和长标题，操作入口仍然清楚。',
] as const

export function TransferPractice() {
  const [size, setSize] = useState(16)
  const [gap, setGap] = useState(12)
  const [stress, setStress] = useState(false)
  const [reason, setReason] = useState('')
  const [checked, setChecked] = useState<boolean[]>([false, false, false])
  return <>
    <label className="ff-practice-reason">先写下你的判断
      <textarea value={reason} onChange={event => setReason(event.target.value)} rows={3} placeholder="我希望访客先看见……因为他现在需要……" />
      <small>这是本次练习的临时笔记，离开或刷新页面后会清空。</small>
    </label>
    <Experiment title="独立练习 · 改善一个新的学习入口" onReset={() => { setSize(16); setGap(12); setStress(false) }} caption="使用同样的方法处理另一组内容。没有唯一正确的数值，关键是解释取舍并验证。还原参数会保留上面的笔记。">
      <div className="ff-lab-stage"><CourseCard practice titleSize={size} groupGap={gap} narrow={stress} longTitle={stress} /></div>
      <div className="ff-lab-controls ff-two-controls">
        <RangeControl label="练习：标题字号" value={size} min={16} max={32} onChange={setSize} />
        <RangeControl label="练习：组间距离" value={gap} min={8} max={40} onChange={setGap} />
        <label className="ff-check-control"><input type="checkbox" checked={stress} onChange={event => setStress(event.target.checked)} />检查窄容器与长标题</label>
      </div>
    </Experiment>
    <fieldset className="ff-self-check">
      <legend>做完后，检查自己的解释</legend>
      {selfChecks.map((text, index) => <label key={text}><input type="checkbox" checked={checked[index]} onChange={event => setChecked(previous => previous.map((value, item) => item === index ? event.target.checked : value))} /><span>{text}</span></label>)}
      <p role="status">{checked.every(Boolean) ? '三项自检已完成。把页面给另一个人看，请他指出重点和下一步，再对照你的判断。' : '勾选用于自我检查。试着用自己的话解释，每个选择帮助读者完成了什么。'}</p>
    </fieldset>
    <details className="ff-explanation"><summary>完成后，看看一种思考方式</summary>
      <p>读者已经有一个本地网站，现在想把它发布出去。标题先说明具体成果，说明文字交代适用对象和过程，“开始学习”给出下一步。可以让标题和说明靠近，把操作放在稍远的位置。</p>
      <p>标题放大到窄容器里出现很多行时，可以适当减小字号或缩短标题。请把你的修改理由写成“为了帮助读者……，我调整了……”，再找一个反例检查它。</p>
    </details>
  </>
}
