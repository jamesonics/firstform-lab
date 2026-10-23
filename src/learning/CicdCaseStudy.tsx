import { ArrowDown, ArrowRight, Cloud, Database, FileCheck2, GitBranch, GitPullRequest, Globe, PackageCheck, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { findArticle } from './content'
import { engineeringSources } from './engineering'
import type { Navigate } from './Link'
import TutorialLayout, { TutorialSection, type TutorialSectionInfo } from './TutorialLayout'
import ReleaseExperiment from './ReleaseExperiment'

const sections: readonly TutorialSectionInfo[] = [
  { id: 'cicd-map', title: '先看清：代码最终运行在哪里？', navTitle: '网站、GitHub 与 Cloudflare 的分工' },
  { id: 'cicd-journey', title: '从一次修改，到用户看到新页面', navTitle: '一次修改的完整路径' },
  { id: 'cicd-checks', title: 'CI 到底检查了什么？', navTitle: '两组检查与隔离数据库' },
  { id: 'cicd-gates', title: '检查通过，为什么还不能直接上线？', navTitle: '两道门禁在哪里设置' },
  { id: 'cicd-artifact', title: '如何确认上传的是被检查的版本？', navTitle: '产物、版本与部署身份' },
  { id: 'cicd-evidence', title: '我们怎样验证这条流程真的有效？', navTitle: '一次真实发布的证据' },
  { id: 'cicd-experiment', title: '换一个条件，预测它会停在哪里', navTitle: '亲手试一试发布门禁' },
  { id: 'cicd-next', title: '换成一个新项目，怎样开始？', navTitle: '迁移到新项目与理解自检' },
]
const repository = 'https://github.com/jamesonics/firstform-lab'
const caseCommit = '4f58baf92782e85ab607bd2045cbf384a73590ba'
const workflowHref = repository + '/blob/' + caseCommit + '/.github/workflows/verify.yml'

const journey = [
  { title: '任务分支提交 PR', detail: '在分支修改、验证和提交，申请合入 main。继续推送修改，会更新同一个 PR。', icon: GitPullRequest },
  { title: 'PR 检查 → 合并门禁', detail: 'source 与 backend 都通过，分支与目标同步、讨论解决后，才能合并。失败就修复再检查。', icon: ShieldCheck, gate: true },
  { title: '合入 main → 再检查实际版本', detail: '合并触发 main 的 CI。成功后保存这次运行构建的网页与 Worker 产物。', icon: FileCheck2 },
  { title: '生产门禁 → 等待人批准', detail: '只有 main 的运行可以申请 production；人核对这次提交，点击 Approve and deploy。', icon: UserRoundCheck, gate: true },
  { title: '核对版本与产物 → Wrangler 上传', detail: '批准后确认 main 未更新、产物完整、生产配置符合要求，再把已构建内容上传到 Cloudflare。', icon: PackageCheck },
  { title: '检查线上 → 记录版本', detail: '自动检查首页与健康接口，再验收页面、交互和关键路径。上传后的失败需要另行处置。', icon: Globe },
]

export default function CicdCaseStudy({ navigate }: { navigate: Navigate }) {
  return <TutorialLayout article={findArticle('engineering', 'firstform-cicd')!} sections={sections} navigate={navigate}>
    <TutorialSection section={sections[0]}>
      <p>假设我们刚修改了初构的一段教程。文件保存在电脑里，访问网站的人还看不到。中间要解决三件事：<strong>确认改动可信、决定是否放行、把确定的版本交到线上。</strong></p>
      <figure className="ff-engineering-figure" aria-labelledby="runtime-map-title">
        <figcaption id="runtime-map-title">初构的运行与交付分工</figcaption>
        <div className="ff-runtime-origin"><GitBranch aria-hidden="true" /><div><strong>本机 → GitHub</strong><p>编辑与提交 → 自动检查、构建和发布任务</p></div></div>
        <div className="ff-flow-label"><ArrowDown size={20} aria-hidden="true" />批准后上传产物</div>
        <div className="ff-cloud-box"><h3><Cloud size={22} aria-hidden="true" />Cloudflare 承载网站</h3>
          <div className="ff-runtime-grid"><div><Globe aria-hidden="true" /><strong>静态文件</strong><p>React 构建的页面资源<br />在浏览器中运行</p></div><div><Cloud aria-hidden="true" /><strong>Worker</strong><p>处理后端接口<br />连接已有服务</p></div><div><Database aria-hidden="true" /><strong>D1</strong><p>持久化数据<br />通过绑定供 Worker 使用</p></div></div>
        </div>
        <div className="ff-flow-label"><ArrowDown size={20} aria-hidden="true" />浏览器通过域名和 HTTPS 访问</div>
        <div className="ff-runtime-visitor"><Globe size={20} aria-hidden="true" /><span>读者看到 jiaotonai.cc 上的新版本</span></div>
      </figure>
      <p>GitHub Actions 提供执行工作流的 Runner，可以把它理解为自动化任务使用的临时计算机。本项目选用 GitHub 托管的 Ubuntu 环境。网站持续运行在 Cloudflare，本机不用一直开着。</p>
      <details className="ff-explanation"><summary>先认识 CI、CD 和门禁</summary>
        <p><strong>CI（持续集成）</strong>把小批量改动经常合到共享代码中，通过构建和自动测试尽早发现问题。自动检查是其中的重要手段；很久不合并的分支，即使有测试，也没有充分实现持续集成。参见 <a href={engineeringSources.ci.href}>DORA 的持续集成说明</a>。</p>
        <p><strong>CD</strong>可能指持续交付（随时可以发布，发布可由人批准），也可能指持续部署（符合条件就自动发布到生产）。初构采用前一种，保留生产人工批准。参见 <a href={engineeringSources.cd.href}>DORA 的持续交付说明</a>。</p>
        <p><strong>门禁</strong>使用检查结果、分支、权限或审批状态，决定操作是否被允许。检查回答“测出了什么”，门禁回答“现在能不能继续”。</p>
      </details>
    </TutorialSection>

    <TutorialSection section={sections[1]}>
      <p><strong>PR 检查回答“适不适合合并”，main 检查回答“最终要发布的版本是否通过验证”。</strong>这两个时刻可能对应不同提交；不能拿旧分支上的绿色结果代替合并后版本的检查。</p>
      <figure className="ff-engineering-figure ff-journey" aria-labelledby="release-journey-title">
        <figcaption id="release-journey-title">初构的发布路径</figcaption>
        <ol>{journey.map((step, index) => <li key={step.title} data-gate={step.gate || undefined}>
          <div className="ff-journey-symbol"><step.icon size={22} aria-hidden="true" /></div>
          <div><h3><span className="ff-journey-number">{index + 1}.</span> {step.title}</h3><p>{step.detail}</p></div>
        </li>)}</ol>
        <p className="ff-figure-note">上传前任一必需条件不满足，就停止或等待。修复代码要重新检查；人工批准不能把失败的 CI 变成通过。</p>
      </figure>
      <div className="ff-table-wrap" role="region" aria-label="CI 触发时机" tabIndex={0}><table className="ff-cicd-table"><caption>什么操作会触发这份工作流？</caption><thead><tr><th scope="col">操作</th><th scope="col">当前行为</th></tr></thead><tbody>
        <tr><td>只推送任务分支，还没有 PR</td><td>不触发完整 CI</td></tr>
        <tr><td>创建或更新目标为 main 的 PR</td><td>运行两组检查，不发布</td></tr>
        <tr><td>PR 合并到 main</td><td>重新检查，成功后等待生产审批</td></tr>
        <tr><td>手动触发工作流</td><td>运行检查；只有 main 可以进入生产任务</td></tr>
      </tbody></table></div>
      <p>本项目的 <code>npm run worker:deploy</code> 只会请求 GitHub 对远程 main 运行这条流程，不会上传当前电脑里的未提交文件。通常合并 PR 就已自动触发，无需再运行一次。</p>
    </TutorialSection>

    <TutorialSection section={sections[2]}>
      <p>CI 不会自动理解“正确的网站应该是什么样”。我们把需要重复验证的规则写进工作流和测试里。目前有两组并行任务，任何一组失败都会影响后续放行。</p>
      <figure className="ff-engineering-figure" aria-labelledby="ci-checks-title">
        <figcaption id="ci-checks-title">同一次 CI，两个隔离任务</figcaption>
        <div className="ff-ci-columns"><section><h3>source · 网站与 Workers</h3><ol>
          <li>安装锁文件中的依赖</li>
          <li>源码扫描与 lint</li>
          <li>构建邮件模板、运行测试</li>
          <li>TypeScript 检查、网站构建、Worker 打包演练</li>
          <li>创建产物清单，在全新本地 D1 上执行全部迁移</li>
          <li>Gitleaks 扫描提交中的凭据泄露</li>
        </ol></section><section><h3>backend · Go 研究代码</h3><ol>
          <li>启动临时 PostgreSQL 18 容器</li>
          <li>准备依赖与 Go 环境</li>
          <li><code>go vet</code> 静态检查</li>
          <li><code>go test</code> 自动化测试</li>
        </ol><p>这一组保护仓库中的研究代码，线上网站的后端仍是 Worker。</p></section></div>
        <div className="ff-flow-label"><ArrowDown size={20} aria-hidden="true" />两组结果共同决定是否放行</div>
      </figure>
      <p><strong>这里的 D1 是 Runner 上的本地模拟数据库。</strong>命令带 <code>--local</code>，存放在临时目录；它验证“全部迁移能否从空库顺利执行”，不会连接或修改 Cloudflare 上的生产 D1。<a href={engineeringSources.d1.href}>D1 命令文档</a>明确区分本地与远程执行。</p>
      <p>PostgreSQL 也由这次任务临时启动，使用隔离测试库；镜像在需要时拉取，任务结束后销毁。CI 不使用生产数据库、真实交易或供应商。</p>
      <p>构建与测试的顺序取决于依赖关系。例如邮件测试要先生成模板，类型检查和打包也是检查的一部分，并没有“CI 全部通过后才开始构建”的通用规则。缓存主要节省下载时间，不代替依赖安装和验证。</p>
      <p>这组检查还不能证明所有视觉效果正确、旧数据升级安全或所有业务路径可用。源码扫描也不等于完整漏洞审计；应该从实际风险出发逐步补充验证。</p>
    </TutorialSection>

    <TutorialSection section={sections[3]}>
      <p>门禁分布在 GitHub 的三处配置。工作流负责执行，仓库规则与环境保护负责约束操作。</p>
      <div className="ff-gate-locations">
        <section><ShieldCheck aria-hidden="true" /><h3>合并门禁</h3><p><strong>Settings → Rules → Rulesets</strong><br />规则 <code>main-pr-and-ci</code> 要求通过 PR，必需检查为 source、backend；分支须同步，讨论须解决，并禁止强推、删除和绕过。</p></section>
        <section><FileCheck2 aria-hidden="true" /><h3>工作流依赖</h3><p><a href={workflowHref}>.github/workflows/verify.yml</a><br /><code>needs: [source, backend]</code> 要求两组成功，分支条件限制生产任务只接受 main 的非 PR 运行。</p></section>
        <section><UserRoundCheck aria-hidden="true" /><h3>生产批准</h3><p><strong>Settings → Environments → production</strong><br />只允许 main 分支，由人批准后才能运行生产任务、使用该环境的 Secrets；关闭管理员绕过。</p></section>
      </div>
      <p>初构目前只有一名协作者，因此 PR 没有强制要求第二个人批准，生产环境也允许运行发起人亲自批准。<strong>代码审查和生产批准是两种不同判断。</strong>团队扩大后可以要求独立审查，但增加一道点击并不会自动提高质量。</p>
      <p>main 发布与人工批准是这个项目的选择。其他项目可以使用受控的发布分支、版本标签或自动部署。GitHub 门禁只约束相应 GitHub 操作，拥有独立 Cloudflare 部署权限的人仍可直接调用云平台；完整权限治理还需要云平台配合。</p>
      <p>配置原理可对照 <a href={engineeringSources.rules.href}>GitHub 仓库规则集</a>和 <a href={engineeringSources.environments.href}>部署环境保护</a>。具体功能可用性还取决于仓库可见性与 GitHub 套餐。</p>
    </TutorialSection>

    <TutorialSection section={sections[4]}>
      <figure className="ff-engineering-figure" aria-labelledby="artifact-path-title"><figcaption id="artifact-path-title">让版本与文件一直对应</figcaption>
        <ol className="ff-artifact-path"><li><GitBranch aria-hidden="true" /><strong>同一个提交</strong><span>完整 Git SHA</span></li><li><PackageCheck aria-hidden="true" /><strong>同一次构建</strong><span>网页 + Worker + 摘要清单</span></li><li><Cloud aria-hidden="true" /><strong>同一份上传</strong><span>下载、核对、不重新打包</span></li></ol>
      </figure>
      <p>main 检查生成 <code>dist/</code> 与 Worker 包，清单记录完整提交号、文件列表和 SHA-256。生产任务下载<strong>同一次运行</strong>的产物并校验，再用 Wrangler 的 <code>--no-bundle</code> 上传。生产任务仍会安装部署工具的依赖，但不会重新编译网站。</p>
      <p>等待审批期间 main 可能变化，因此工作流在准备发布时、临近上传时各核对一次 main。发现新提交就拒绝旧运行。产物保存七天，过期后需重新运行检查。摘要校验用于检查完整性，不等于具备独立签名的供应链来源证明。</p>
      <div className="ff-identity-card"><h3>谁提供部署身份？</h3><p>以前：本机 Wrangler 使用已保存的 OAuth 登录。<br />现在：GitHub production 环境保存专用 API Token，批准后供生产任务调用 Cloudflare。</p><p><code>CLOUDFLARE_API_TOKEN</code> 提供部署权限，<code>CLOUDFLARE_ACCOUNT_ID</code> 与 <code>WRANGLER_PRODUCTION_CONFIG</code> 指向既有资源。生产凭据不会交给 PR 的检查任务；网站运行需要的业务 Secrets 继续留在 Cloudflare。</p></div>
      <p>所以，<strong>CD 是交付流程，Wrangler 是这个流程中的部署工具。</strong>其他平台可以换成不同 CLI 或 API，版本追踪、权限、验证和恢复的逻辑仍然需要保留。</p>
    </TutorialSection>

    <TutorialSection section={sections[5]}>
      <p>以下是 <strong>2026 年 10 月 23 日</strong>完成的实操记录，展示本页所讲的配置如何被验证。它是历史案例，不代表网站当前版本的实时状态。</p>
      <ol className="ff-evidence-list">
        <li><strong>故意失败，观察拦截。</strong>在任务分支写入类型错误，source 因 TypeScript 检查失败，PR 合并被阻止。<a href={repository + '/actions/runs/39923073326'}>查看失败运行 <ArrowRight size={16} aria-hidden="true" /></a></li>
        <li><strong>修复后重新验证。</strong>移除错误，两组检查通过，再按规则合并。<a href={repository + '/actions/runs/39923324160'}>查看修复后的运行 <ArrowRight size={16} aria-hidden="true" /></a></li>
        <li><strong>对齐实际待发布版本。</strong>确认既有品牌素材被保留，通过 PR 将发布基线合入 main；最终发布提交是 <code>4f58baf</code>。<a href={repository + '/pull/2'}>查看发布基线 PR <ArrowRight size={16} aria-hidden="true" /></a></li>
        <li><strong>等待人批准，再上传。</strong>main 的两组 CI 通过后，生产任务等待；人批准后，Cloudflare 鉴权、上传和首页、健康接口检查全部通过。<a href={repository + '/actions/runs/39929665964'}>查看完整发布运行 <ArrowRight size={16} aria-hidden="true" /></a></li>
        <li><strong>把线上版本留成记录。</strong>进一步核对 Worker 版本标记、前端产物与品牌图片，并为实际提交添加发布标签。<a href={repository + '/tree/firstform-cicd-v1-20261023'}>查看 firstform-cicd-v1-20261023 <ArrowRight size={16} aria-hidden="true" /></a></li>
      </ol>
      <p>当前自动上线检查确认首页响应成功、<code>/api/health</code> 返回正常。若上传后检查失败，工作流会报错，<strong>但不会自动回滚</strong>。恢复代码优先走 revert PR、重新检查与批准；紧急恢复也需要清楚的操作预案。</p>
      <p>生产 D1 迁移没有包含在自动部署中，需要另行确认兼容性、备份和执行顺序。这次发布没有执行生产迁移。代码回滚不会自动撤销数据库结构或数据变化。</p>
    </TutorialSection>

    <TutorialSection section={sections[6]}>
      <p>先选一种情况，预测网站是否已经发生变化，再看模拟结果。特别比较“上传前失败”和“上传后验收失败”：两者都可能让 Actions 标红，但线上状态不同。</p>
      <ReleaseExperiment />
      <p>再试着回答：如果 CI 通过后，等待批准的那几分钟里又合并了一个 PR，应该批准哪次运行？如果只是重新按一次发布按钮，是否就能修复失败的类型检查？</p>
    </TutorialSection>

    <TutorialSection section={sections[7]}>
      <p>先把一个最小闭环跑通，再根据风险增加能力。下面是从初构案例提炼的起步顺序，具体选择仍要回到新项目的运行平台、数据与团队。</p>
      <ol className="ff-new-project-steps">
        <li><strong>画清运行图。</strong>前端、后端、数据库分别在哪里运行？怎样配置、怎样验证基本可用、失败怎样恢复？</li>
        <li><strong>准备可重复的构建和检查。</strong>固定依赖与运行时，先保护关键路径，检查失败必须返回失败状态。</li>
        <li><strong>把检查接到合并规则。</strong>选择 PR 与主分支的触发时机，设置必需检查、审查责任和权限。</li>
        <li><strong>建立受控发布。</strong>让已验证产物对应确定提交，隔离凭据，按风险选择审批和预发布环境。涉及数据库就先设计兼容与恢复。</li>
        <li><strong>验收并演练失败。</strong>确认版本与用户路径，补上监控、告警、恢复手册，再根据实际问题改进。</li>
      </ol>
      <p>初构已验证的是“一次变更经过检查与批准，交付到既有站点”的闭环。预发布环境、旧数据升级测试、完整端到端验收、渐进发布、持续告警和恢复演练，仍是知识树中的后续课题。</p>
      <fieldset className="ff-self-check"><legend>能用自己的话解释这些问题吗？</legend>
        {[
          '我能分清 CI、合并门禁、生产门禁和部署工具各自负责什么。',
          '我能解释 PR 与 main 为什么分别检查，以及本地 D1 为什么不需要生产 Token。',
          '我能追踪线上版本对应的提交、检查和产物，而不只说“Actions 是绿色的”。',
          '我能区分上传前停止、上传后失败与数据库恢复，并说出下一步怎么做。',
        ].map(label => <label key={label}><input type="checkbox" />{label}</label>)}
      </fieldset>
      <p>这些勾选仅供当前页面自检，不会自动认定掌握。下一步可以从“程序与运行环境”补基础，再回到这篇案例复述整条路径。</p>
      <details className="ff-explanation"><summary>对照源码与资料继续研究</summary>
        <ul>
          <li><a href={workflowHref}>案例版本的完整工作流</a>：对照触发事件、两组检查、生产任务和健康检查。</li>
          <li><a href={repository + '/blob/' + caseCommit + '/scripts/production-release.mjs'}>发布产物清单与校验实现</a>：核对版本、文件列表与摘要。</li>
          <li><a href={repository + '/blob/' + caseCommit + '/docs/cicd.md'}>案例版本的运维说明</a>：核对设置位置与操作边界。</li>
          <li><a href={engineeringSources.tests.href}>{engineeringSources.tests.title}</a>：从关键行为出发逐步增加自动化测试。</li>
          <li><a href={engineeringSources.release.href}>{engineeringSources.release.title}</a>：继续理解构建、交付与版本管理。</li>
        </ul>
        <p>本文为初构的第一版实战整理。通用概念参考官方资料；具体行为以案例提交、工作流及当时核对的仓库设置为依据，后续实践会继续补充。</p>
      </details>
    </TutorialSection>
  </TutorialLayout>
}
