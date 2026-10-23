import type { LearningBranch } from './content.ts'

// Source-backed curriculum, not a record of the reader's progress. Article links
// are added only after an implemented lesson exists in the article registry.
export const engineeringSources = {
  web: { title: 'MDN · Web 服务器', href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server' },
  http: { title: 'MDN · HTTP 缓存', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching' },
  workers: { title: 'Cloudflare · Workers 如何运行', href: 'https://developers.cloudflare.com/workers/reference/how-workers-works/' },
  ci: { title: 'DORA · 持续集成', href: 'https://dora.dev/capabilities/continuous-integration/' },
  cd: { title: 'DORA · 持续交付', href: 'https://dora.dev/capabilities/continuous-delivery/' },
  tests: { title: 'DORA · 测试自动化', href: 'https://dora.dev/capabilities/test-automation/' },
  rules: { title: 'GitHub · 仓库规则集', href: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets' },
  environments: { title: 'GitHub · 部署环境与保护规则', href: 'https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments' },
  supply: { title: 'SLSA · 软件供应链与构建来源', href: 'https://slsa.dev/spec/v1.2/' },
  database: { title: 'DORA · 数据库变更管理', href: 'https://dora.dev/capabilities/database-change-management/' },
  d1: { title: 'Cloudflare · D1 迁移命令', href: 'https://developers.cloudflare.com/d1/wrangler-commands/' },
  telemetry: { title: 'OpenTelemetry · 可观测性入门', href: 'https://opentelemetry.io/docs/concepts/observability-primer/' },
  slo: { title: 'Google SRE · 服务目标', href: 'https://sre.google/sre-book/service-level-objectives/' },
  release: { title: 'Google SRE · 发布工程', href: 'https://sre.google/sre-book/release-engineering/' },
  overload: { title: 'Google SRE · 应对过载', href: 'https://sre.google/sre-book/handling-overload/' },
  docker: { title: 'Docker · 容器、镜像与运行', href: 'https://docs.docker.com/get-started/docker-overview/' },
  terraform: { title: 'HashiCorp · 基础设施即代码', href: 'https://developer.hashicorp.com/terraform/intro' },
  kubernetes: { title: 'Kubernetes · 能力与边界', href: 'https://kubernetes.io/docs/concepts/overview/' },
} as const

export type EngineeringSourceId = keyof typeof engineeringSources
type EngineeringBranch = LearningBranch & {
  prerequisites: readonly string[]
  extraPrerequisite?: string
  practice: string
  readyWhen: string
  sources: readonly EngineeringSourceId[]
}

export const engineeringBranches: readonly EngineeringBranch[] = [
  {
    id: 'runtime', title: '程序与运行环境', description: '先理解程序在哪里、靠什么运行',
    prerequisites: [], extraPrerequisite: '能在本地启动一个简单网页或接口。',
    practice: '在本地启动、停止一个服务，修改端口和环境变量，观察退出码与日志。',
    readyWhen: '能画出浏览器、静态文件、服务进程和数据库的位置，并解释关掉终端后会发生什么。',
    sources: ['web', 'workers'],
    nodes: [
      { id: 'static-and-runtime', title: '静态文件、服务进程与运行时', description: '区分浏览器执行的代码、服务器执行的代码与需要持久化的数据。' },
      { id: 'shell-and-processes', title: '命令行、进程、端口与权限', description: '用路径、标准输出、退出码、信号和文件权限理解脚本怎样执行。' },
      { id: 'environment-config', title: '环境变量与开发、测试、生产环境', description: '区分构建时与运行时配置，让环境之间不共用生产数据和凭据。' },
      { id: 'hosting-models', title: '服务器、容器与 Serverless 的分工', description: '比较各自承担的运行、隔离与维护责任，定位 Workers 的角色。' },
    ],
  },
  {
    id: 'networking', title: '域名与访问链路', description: '再追踪一次访问怎样到达服务',
    prerequisites: ['runtime'],
    practice: '用浏览器 Network 面板和 curl 查看一次请求，分别定位域名、连接、HTTP 和应用错误。',
    readyWhen: '能解释“本地正常，域名打不开”该按什么顺序排查，以及缓存为何会显示旧内容。',
    sources: ['web', 'http', 'workers'],
    nodes: [
      { id: 'dns-https-workers', title: 'DNS、HTTPS 与服务入口', description: '把域名解析、TLS 证书、连接和路由串成一次访问。' },
      { id: 'http-and-proxy', title: 'HTTP、反向代理与负载均衡', description: '辨认客户端、入口代理和应用各自返回的状态与错误。' },
      { id: 'cdn-and-cache', title: 'CDN、缓存与更新可见性', description: '通过缓存头和内容哈希理解发布后为何还可能看到旧页面。' },
      { id: 'network-troubleshooting', title: '沿访问链路定位故障', description: '把 DNS、证书、超时、路由和应用异常分开验证。' },
    ],
  },
  {
    id: 'builds', title: '依赖、构建与产物', description: '让同一份源码有可追踪的输出',
    prerequisites: ['runtime'],
    practice: '从干净目录按锁文件安装依赖并构建，记录提交号、运行时版本和产物摘要。',
    readyWhen: '能区分源码、依赖缓存和发布产物，并说明重新构建为什么可能产生不同结果。',
    sources: ['ci', 'release', 'supply'],
    nodes: [
      { id: 'locked-dependencies', title: '运行时版本、依赖与锁文件', description: '固定输入，理解 npm ci 与缓存命中的不同作用。' },
      { id: 'build-and-bundle', title: '类型检查、编译与打包', description: '看清 TypeScript、前端构建和 Worker 打包各自产生什么。' },
      { id: 'artifacts-and-versions', title: '版本号、构建产物与文件摘要', description: '把提交、构建记录和输出文件关联起来，避免发布错版本。' },
      { id: 'build-once', title: '构建一次，再逐步交付', description: '区分安装依赖、恢复缓存、下载已验证产物与再次构建。' },
    ],
  },
  {
    id: 'verification', title: '版本协作与 CI', description: '让改动尽早得到可信的反馈',
    prerequisites: ['builds'],
    practice: '提交一个故意写错类型的 PR，观察检查失败、合并被拦截，再修复并重新检查。',
    readyWhen: '能解释 PR 检查、main 检查和合并规则分别解决什么问题，并为一个真实风险选择测试。',
    sources: ['ci', 'tests', 'rules'],
    nodes: [
      { id: 'git-and-tests', title: 'Git、短分支、PR 与代码审查', description: '把修改、验证、反馈与合并组织成小批量交付。' },
      { id: 'test-layers', title: '静态检查、单测、集成与端到端测试', description: '从故障风险出发选择检查，理解 Mock、测试数据和覆盖盲区。' },
      { id: 'workflow-and-runners', title: '工作流、Runner、任务与缓存', description: '理解触发事件、任务依赖、隔离服务、并行、取消与失败日志。' },
      { id: 'checks-and-merge-gates', title: '检查结果与分支保护', description: '用必需状态检查约束合并，区分检查执行与规则强制。' },
    ],
  },
  {
    id: 'security', title: '配置、身份与供应链', description: '明确谁能发布、凭什么获得权限',
    prerequisites: ['runtime', 'verification'],
    practice: '画出本机、PR 检查、生产发布与运行中的服务分别可以读取哪些配置和密钥。',
    readyWhen: '能指出生产凭据的信任边界，并解释最小权限、轮换、撤销和审计记录的用途。',
    sources: ['environments', 'supply'],
    nodes: [
      { id: 'secrets-and-identity', title: 'Secret、API Token 与最小权限', description: '区分本机登录、部署身份和业务密钥，并考虑轮换与失效处理。' },
      { id: 'trusted-workflows', title: 'PR 信任边界与发布权限', description: '理解外部代码为何不能直接获得生产凭据，以及谁能修改发布规则。' },
      { id: 'short-lived-identity', title: '长期令牌与 OIDC 短期身份', description: '比较凭据生命周期，按目标平台能力选择自动化身份方案。' },
      { id: 'software-supply-chain', title: '依赖风险、SBOM 与构建来源', description: '把依赖审计、锁定 Action、来源证明和产物校验放进供应链视角。' },
    ],
  },
  {
    id: 'delivery', title: '发布、审批与回滚', description: '把通过验证的版本交到用户手中',
    prerequisites: ['verification', 'security', 'networking'],
    practice: '先阅读初构案例；再用一次小修改走完 PR、main 检查、人工批准、上线验收与版本追踪。',
    readyWhen: '能从任一线上版本追溯到提交和检查，并说清失败时在哪里停、怎样恢复。',
    sources: ['cd', 'environments', 'release'],
    nodes: [
      { id: 'firstform-cicd', title: '初构的一次修改，怎样走到线上', description: '从一次真实发布认识 CI、两道门禁与上线验证。', articleId: 'firstform-cicd' },
      { id: 'appropriate-ci', title: '怎样为项目选择合适的 CI/CD', description: '区分持续交付与持续部署，为实际风险选择触发、检查和批准方式。' },
      { id: 'preview-and-staging', title: '预览、预发布与生产环境', description: '决定在哪里做集成验收，隔离数据、配置和访问权限。' },
      { id: 'release-strategies', title: '滚动、蓝绿、金丝雀与功能开关', description: '比较部署与功能开放的时机，用可观测结果控制变更影响范围。' },
      { id: 'release-and-rollback', title: '一次发布和回滚的全过程', description: '结合版本、健康检查与数据兼容性，演练恢复而不只演练上线。' },
    ],
  },
  {
    id: 'data-changes', title: '数据库变更与恢复', description: '让代码变化与已有数据相容',
    prerequisites: ['delivery'], extraPrerequisite: '数据与存储领域中的表、约束和迁移基础。',
    practice: '在隔离数据库里装入旧结构与测试数据，再升级、验证兼容性并恢复一次备份。',
    readyWhen: '能解释全新数据库迁移通过为什么不代表旧数据升级安全，以及代码回滚为何不能还原数据。',
    sources: ['database', 'd1'],
    nodes: [
      { id: 'fresh-and-existing-data', title: '空库迁移与已有数据升级', description: '区分建库验证、增量升级、回填和真实数据约束。' },
      { id: 'expand-contract', title: '先兼容、再切换、后清理', description: '用扩展与收缩策略协调新旧代码、字段和数据回填。' },
      { id: 'backup-recovery-objectives', title: '备份、恢复演练与 RPO / RTO', description: '用允许的数据损失和恢复时间反推备份及恢复方案。' },
      { id: 'migration-release-order', title: '迁移与代码发布的先后关系', description: '明确执行权限、窗口、失败处理和无法逆转的数据操作。' },
    ],
  },
  {
    id: 'operations', title: '观测与故障处理', description: '知道用户是否正常，也知道如何恢复',
    prerequisites: ['delivery', 'data-changes'],
    practice: '在测试环境制造一次请求失败，沿日志定位原因，记录发现、处置和恢复的过程。',
    readyWhen: '能从用户体验定义一个服务目标，设计可行动的告警，并写出带验证步骤的故障手册。',
    sources: ['telemetry', 'slo', 'release'],
    nodes: [
      { id: 'logs-metrics-traces', title: '日志、指标与调用链', description: '把一次请求、整体趋势和跨服务耗时联系起来，同时控制敏感信息与采集成本。' },
      { id: 'health-and-alerts', title: '健康检查、探针与告警', description: '区分进程存活、可接流量和用户关键路径正常，减少无效告警。' },
      { id: 'sli-slo-budget', title: 'SLI、SLO 与错误预算', description: '为可用性、延迟和正确性定义目标，并指导可靠性投入。' },
      { id: 'incident-and-learning', title: '故障响应、运行手册与复盘', description: '先恢复服务，再解释原因，用演练和改进缩短下一次恢复。' },
    ],
  },
  {
    id: 'infrastructure', title: '基础设施与环境复现', description: '按需深入主机、容器与资源管理',
    prerequisites: ['runtime', 'networking', 'builds', 'security'],
    practice: '在本地用容器运行一个无生产数据的服务，检查网络与持久化，再阅读一次基础设施变更计划。',
    readyWhen: '能比较托管平台与自管主机的维护责任，并在选择容器或编排前说明具体需求。',
    sources: ['docker', 'terraform', 'kubernetes'],
    nodes: [
      { id: 'linux-hosts', title: 'Linux、SSH 与服务托管', description: '补齐文件权限、进程守护、系统日志、网络与主机更新。' },
      { id: 'containers-and-compose', title: 'Docker 镜像、网络、卷与 Compose', description: '理解可移植运行环境和持久化边界，避免把数据只留在容器里。' },
      { id: 'infrastructure-as-code', title: 'IaC、状态、变更计划与漂移', description: '通过版本化配置复现资源，理解 plan、apply 与状态文件中的敏感信息。' },
      { id: 'orchestration-and-gitops', title: 'Kubernetes、声明式管理与 GitOps', description: '在多服务确有需要时学习调度、滚动更新和期望状态对齐。' },
    ],
  },
  {
    id: 'scale', title: '容量、成本与工程演进', description: '用实际瓶颈决定下一步投入',
    prerequisites: ['operations', 'infrastructure'],
    practice: '对隔离环境做有限负载实验，观察延迟、错误率、资源和成本，再提出一个可验证的改进。',
    readyWhen: '能区分性能、容量、可靠性与交付效率问题，说明扩展带来的收益和运维代价。',
    sources: ['overload', 'slo', 'cd'],
    nodes: [
      { id: 'capacity-and-cost', title: '负载测试、容量规划与成本', description: '测量吞吐和尾延迟，理解配额、扩缩容与预算。' },
      { id: 'resilience-and-overload', title: '缓存、队列、限流与故障隔离', description: '在过载和依赖失效时控制影响，处理超时、重试与幂等。' },
      { id: 'regions-and-redundancy', title: '多服务、多区域与容灾取舍', description: '根据故障范围、数据一致性和恢复目标决定冗余方式。' },
      { id: 'delivery-improvement', title: '交付指标、平台工程与持续改进', description: '观察变更等待、失败和恢复，用自动化和共享能力减少重复劳动。' },
    ],
  },
]

export const engineeringStages = [
  { title: '看懂运行', description: '运行环境 → 访问链路 → 构建产物', branches: ['runtime', 'networking', 'builds'] },
  { title: '建立交付', description: '版本与 CI → 身份与权限 → 发布', branches: ['verification', 'security', 'delivery'] },
  { title: '守住线上', description: '数据升级与恢复 → 观测与故障处理', branches: ['data-changes', 'operations'] },
  { title: '按需扩展', description: '基础设施复现 → 容量与工程演进', branches: ['infrastructure', 'scale'] },
] as const
