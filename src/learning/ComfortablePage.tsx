import { findArticle } from './content'
import type { Navigate } from './Link'
import TutorialLayout, { TutorialSection, type TutorialSectionInfo } from './TutorialLayout'
import { HierarchyExperiment, PageComparison, ReadingExperiment, SpacingExperiment, TransferPractice } from './ComfortableExperiments'

const sections: readonly TutorialSectionInfo[] = [
  { id: 'lesson-observe', title: '你会从哪里开始？', navTitle: '你会从哪里开始？' },
  { id: 'lesson-purpose', title: '页面要帮谁做什么？', navTitle: '页面要帮谁做什么？' },
  { id: 'lesson-hierarchy', title: '怎样让重点先被看见？', navTitle: '怎样让重点先被看见？' },
  { id: 'lesson-space', title: '距离怎样表达关系？', navTitle: '距离怎样表达关系？' },
  { id: 'lesson-reading', title: '换个条件，还好读吗？', navTitle: '换个条件，还好读吗？' },
  { id: 'lesson-practice', title: '试着改善另一个入口', navTitle: '试着改善另一个入口' },
]

export default function ComfortablePage({ navigate }: { navigate: Navigate }) {
  return <TutorialLayout article={findArticle('frontend', 'comfortable-page')!} sections={sections} navigate={navigate}>
    <TutorialSection section={sections[0]}>
      <p>你第一次来到“前端与交互”，想找一篇适合入门的教程。眼前有一组分类，也有一篇文章。你会先看哪里，又会点击哪里？</p>
      <p>下面用初构的领域页做实验。切换前先找一找：<strong>哪里告诉你“从这里开始”？</strong></p>
      <PageComparison />
      <details className="ff-explanation"><summary>观察之后，看看两种布局的取舍</summary>
        <p>A 优先展示分类：宽屏时目录与教程并排，窄屏时目录在教程上方。第一次来的读者需要自己判断起点。B 先呈现一篇可开始的教程，再提供分类，优先帮助新读者行动。</p>
        <p>如果这是供熟悉内容的人频繁查阅的资料库，目录也可能更适合放在前面。布局是否合适，要回到读者的任务判断。</p>
      </details>
      <p>这个对比同时改变了顺序、宽度和强调程度，帮助我们发现问题。后面的实验会拆开这些因素，每次观察一个具体变化。</p>
      <p id="lesson-method"><strong>看得出重点，读得懂关系，找得到下一步。</strong>风格偏好可以不同，这三个问题都可以回到页面上检查。</p>
    </TutorialSection>
    <TutorialSection section={sections[1]}>
      <p>先把页面的任务写成一句话：<strong>帮助第一次来的读者，开始一篇适合自己的教程。</strong>有了这个目标，内容的位置才有依据。</p>
      <p>第一次来的读者，需要知道能学到什么、是否适合自己，然后找到入口。已经来过的读者，则可以通过知识树查找熟悉的主题。</p>
      <p>在初构当前只有一篇入门教程的阶段，先帮助新读者开始，再让目录承担查找任务。分类描述“有哪些内容”，学习顺序描述“先做什么”，两者需要分别表达。</p>
      <p>以后内容更多、查阅需求更强时，可以重新调整优先级。页面任务是设计依据，也需要随着实际使用而修正。</p>
    </TutorialSection>
    <TutorialSection section={sections[2]}>
      <p>内容顺序确定后，还需要让读者看出轻重。字号、字重、颜色和位置都能影响强调程度；把它们同时推到最强，会让信息重新互相争抢。</p>
      <p>如果标题和正文差不多大，哪一项更难被发现？先预测，再调整下面的标题字号。</p>
      <HierarchyExperiment />
      <p>本例只改变标题字号，字重、颜色、正文和间距保持不变。标题与正文产生差别后，读者多了一条判断信息轻重的线索；继续放大，则可能让标题换成更多行。</p>
      <p>字号没有适用于所有页面的最佳值。先确定谁是重点，再结合文字长度、容器宽度和其他强调方式判断。正文也需要保持足够清楚，不能靠把其他信息变得难读来突出标题。</p>
    </TutorialSection>
    <TutorialSection section={sections[3]}>
      <p>读者也会根据距离判断哪些内容相关。这里的标题与说明共同解释“学什么”，操作按钮回答“接下来做什么”。这两种关系可以用不同的间距表达。</p>
      <p>先只缩小标题与说明之间的距离，再只增大不同组的距离。哪一步让分组更清楚？</p>
      <SpacingExperiment />
      <p>当组内比组间更紧密时，相关内容更容易被看成一个整体。距离过大也会割裂联系，让按钮显得不属于上面的内容。</p>
      <p>内容之间的间距帮助分组；内容与容器边缘的留白提供阅读空间。增加四周的留白，并不能自动解决内容内部的分组问题。</p>
      <p>把每一种关系对应到少量、稳定的间距，后面的卡片和章节就可以沿用这套规则。数值可以变，表达的关系应该保持一致。</p>
    </TutorialSection>
    <TutorialSection section={sections[4]}>
      <p>一个安排在短标题和宽屏下成立，换成真实内容后可能就不成立。保持共同的左侧对齐线，能给每一段文字一个稳定的起点；还需要检查换行和上下行之间的距离。</p>
      <p>先只把容器变窄，再换成长标题，最后调整正文行高。观察哪一步开始影响阅读，以及按钮是否仍能被找到。</p>
      <ReadingExperiment />
      <p>容器变窄会增加换行；行高太紧容易让相邻行挤在一起，太松则会削弱段落的连贯感。请读完真实文字，结合字号与内容密度做判断。</p>
      <p>这里用容器宽度模拟一个条件。完成整页后，还要检查手机布局、明暗主题和键盘操作：重要入口有没有消失，文字是否清楚，当前焦点是否看得见。</p>
      <p>“这组字号和间距适合当前文字与宽度”是可以验证的判断。换了任务、内容或设备，就再检查一次。</p>
    </TutorialSection>
    <TutorialSection section={sections[5]}>
      <p>现在换到“部署与工程”。读者已经做出了一个本地网站，想把它发布上线。请改善下面的学习入口，让他知道能获得什么，以及下一步怎么做。</p>
      <p>先写下你希望读者看到的重点，再调整参数。完成后换成长标题和窄容器，解释哪些选择仍然有效，哪些需要改变。</p>
      <TransferPractice />
      <div className="ff-lesson-extras">
        <details className="ff-explanation"><summary>把观察对应到代码</summary>
          <p>实验状态在 <code>src/learning/ComfortableExperiments.tsx</code>；<code>CourseCard</code> 把数值交给 CSS 变量。样式在 <code>src/learning/tutorial.css</code>：</p>
          <ul><li><code>--demo-title-size</code> 对应标题字号。</li><li><code>--demo-inner-gap</code> 对应标题与说明的距离。</li><li><code>--demo-group-gap</code> 对应不同组之间的距离。</li><li><code>--demo-line-height</code> 对应正文行高。</li></ul>
          <p>先说出你预计会发生的变化，再修改一个数值，对照页面检查预测。</p>
        </details>
        <details className="ff-explanation"><summary>怎样把这个任务讲给 Agent</summary>
          <pre>{[
            '先说明这页的读者是谁，以及他现在要完成的一个主要任务。',
            '列出信息的优先级，解释主入口和辅助目录各自的作用。',
            '每次只调整一个因素，说明预计出现的变化，再让我比较结果。',
            '完成后检查长标题、窄屏、明暗主题和键盘操作。',
            '指出哪些结论依赖当前内容与宽度，并给出一个不适用的例子。',
          ].join('\n')}</pre>
        </details>
      </div>
    </TutorialSection>
  </TutorialLayout>
}
