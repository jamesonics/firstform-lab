export type DomainId = 'frontend' | 'backend' | 'data' | 'engineering' | 'agents'

export type LearningNode = {
  id: string
  title: string
  description: string
  articleId?: string
}

export type LearningBranch = {
  id: string
  title: string
  description: string
  nodes: readonly LearningNode[]
}

export type LearningDomain = {
  id: DomainId
  title: string
  summary: string
  description: string
  topics: string
  branches: readonly LearningBranch[]
}

export const learningDomains: readonly LearningDomain[] = [
  {
    id: 'frontend', title: '前端与交互', summary: '从清晰的布局，到细腻的交互。',
    description: '从页面结构到交互细节，理解一个好界面怎样成立。', topics: '布局 · 组件 · 动效',
    branches: [
      { id: 'page-design', title: '页面与信息设计', description: '理解信息、空间与阅读顺序', nodes: [
        { id: 'comfortable-page', title: '一个页面为什么看起来舒服', description: '从重点、分组与阅读顺序，改善一个学习入口。', articleId: 'comfortable-page' },
        { id: 'type-and-rhythm', title: '字体层级与阅读节奏', description: '观察字号、行长与行距怎样影响连续阅读。' },
      ] },
      { id: 'components', title: '组件与视觉层次', description: '把结构、材质和细节放在一起', nodes: [
        { id: 'card-depth', title: '一张卡片如何产生层次感', description: '拆开边界、阴影与背景，理解卡片的前后关系。' },
        { id: 'component-system', title: '从一个组件到统一的界面', description: '把一个组件的选择整理成可重复使用的规则。' },
      ] },
      { id: 'motion', title: '交互与动效', description: '让变化有方向、有节奏', nodes: [
        { id: 'natural-motion', title: '动效为什么显得自然', description: '比较时长、速度变化与方向，理解动效的节奏。' },
        { id: 'input-methods', title: '鼠标、触摸和键盘如何配合', description: '用不同输入方式走完同一个操作，检查反馈与焦点。' },
      ] },
      { id: 'visual-assets', title: '图形与素材', description: '选择适合表达的视觉形式', nodes: [
        { id: 'where-images-come-from', title: '网页里的“图片”从哪里来', description: '辨认位图、矢量和代码绘图各自的表达方式。' },
        { id: 'asset-performance', title: '图形的加载、清晰度与性能', description: '一起考虑文件体积、显示尺寸与加载过程。' },
      ] },
      { id: 'design-collaboration', title: '设计表达与协作', description: '把观察转化为可执行的说明', nodes: [
        { id: 'design-brief', title: '把参考界面翻译成 Agent 能执行的说明', description: '把视觉观察写成目标、约束和可检查的要求。' },
      ] },
    ],
  },
  {
    id: 'backend', title: '后端与接口', summary: '理解一次请求背后的工作。',
    description: '从熟悉的路由开始，理解请求、身份与业务状态。', topics: '路由 · 鉴权 · 状态',
    branches: [
      { id: 'requests', title: '请求与路由', description: '一次操作怎样到达对应的函数', nodes: [
        { id: 'request-journey', title: '一条请求的完整旅程', description: '跟着一次点击，追踪请求、处理和响应。' },
        { id: 'fastapi-to-workers', title: '从 FastAPI 路由理解 Workers', description: '对照熟悉的路由写法，理解另一种运行方式。' },
      ] },
      { id: 'authentication', title: '身份与权限', description: '确定谁可以执行什么操作', nodes: [
        { id: 'sessions-and-access', title: '登录、会话和访问权限', description: '梳理身份怎样被确认，以及权限在哪里检查。' },
      ] },
      { id: 'reliability', title: '状态与可靠性', description: '让系统面对重复和失败', nodes: [
        { id: 'retry-and-idempotency', title: '重试、幂等和状态变化', description: '观察重复请求与中途失败时，系统怎样保持一致。' },
      ] },
    ],
  },
  {
    id: 'data', title: '数据与存储', summary: '让信息有结构，也有归处。',
    description: '按从上到下的顺序，从数据存放、表与查询，学到事务、性能和恢复，最后认识更多存储方案。各主题正在规划中。', topics: '建模 · 查询 · 可靠性',
    branches: [
      { id: 'foundations', title: '数据在哪里', description: '从一次保存认识内存、文件、浏览器与数据库', nodes: [
        { id: 'data-journey', title: '一条数据从输入到保存', description: '追踪数据经过的位置，区分程序中的状态与持久保存。' },
        { id: 'files-and-values', title: '文件、JSON 与数据类型', description: '用文本、数字和空值理解数据表示、编码与序列化。' },
        { id: 'browser-and-server-storage', title: '浏览器与服务器各存什么', description: '比较存储的位置、寿命与访问范围，理解刷新和换设备的差别。' },
        { id: 'why-databases', title: '为什么需要数据库', description: '从查找、修改、共享和规则维护，理解数据库承担的工作。' },
      ] },
      { id: 'structure', title: '表与关系', description: '把需求整理成记录、字段、关系和规则', nodes: [
        { id: 'keys-and-constraints', title: '主键、字段与约束', description: '从一条记录出发，为数据定义结构与规则。' },
        { id: 'numbers-time-and-null', title: '数字、时间与空值怎样表示', description: '区分数值精度、时间含义和缺失信息，明确字段的存储约定。' },
        { id: 'relationships', title: '两张表如何建立关系', description: '用关系图与记录配对理解一对多、多对多和外键。' },
        { id: 'normalization', title: '什么时候应该拆表', description: '从重复与修改异常理解依赖、范式和保留冗余的条件。' },
        { id: 'model-from-requirements', title: '从需求画出数据模型', description: '把要保存的信息、需要的查询和必须成立的规则放在一张图里。' },
      ] },
      { id: 'queries', title: '查询与更新', description: '用 SQL 准确读写，并核对结果的含义', nodes: [
        { id: 'first-sql', title: '第一次用 SQL 读写数据', description: '在独立练习库中创建表、增加记录、查询、修改和删除。' },
        { id: 'filter-sort-and-page', title: '筛选、排序与分页', description: '把查找条件与结果顺序写清楚，处理空值和相同排序值。' },
        { id: 'join-cardinality', title: '关联查询为什么会多行或少行', description: '用匹配关系理解内连接、左连接、重复行和没有匹配的记录。' },
        { id: 'aggregate-and-null', title: '分组统计与空值', description: '核对计数、汇总和筛选发生在哪一层，避免统计口径错误。' },
        { id: 'compose-queries', title: '把复杂查询拆成几步', description: '用子查询与公共表表达式组织查询，再认识视图和窗口函数。' },
      ] },
      { id: 'application-data', title: '程序如何读写数据', description: '连接页面、接口和数据库，明确各层的责任', nodes: [
        { id: 'query-to-interface', title: '从查询语句到界面上的内容', description: '追踪一次数据读取怎样成为页面上的信息。' },
        { id: 'parameters-and-validation', title: '参数化查询与输入校验', description: '区分查询结构、输入值和业务规则，观察参数绑定怎样工作。' },
        { id: 'data-access-boundaries', title: '数据访问权限在哪里检查', description: '验证身份、记录归属与返回字段，检查不同用户能读写什么。' },
        { id: 'database-access-tools', title: 'ORM、连接与数据库边界', description: '认识数据库驱动、对象映射和连接方式，查看工具最终执行的操作。' },
      ] },
      { id: 'correctness', title: '事务与并发', description: '在中途失败、同时修改和重试时保护数据', nodes: [
        { id: 'transaction-failure', title: '操作做到一半失败怎么办', description: '用失败实验理解事务边界、提交、回滚与必须保持的规则。' },
        { id: 'concurrent-updates', title: '两个人同时修改一条记录', description: '按时间线复现覆盖更新，比较原子更新与版本检查。' },
        { id: 'isolation-and-locks', title: '锁、隔离级别与多版本', description: '观察并发读写的可见性、等待和冲突，核对具体数据库的实现。' },
        { id: 'deduplication-and-retries', title: '重复提交与失败重试', description: '面对结果未知的请求，用唯一约束和业务标识验证重复处理。' },
      ] },
      { id: 'storage-internals', title: '数据结构与存储原理', description: '补齐查找、树、数据页和恢复日志的基础', nodes: [
        { id: 'search-structures', title: '查找数据有哪些办法', description: '比较顺序查找、二分查找与哈希，认识数组、链表和复杂度。' },
        { id: 'trees-and-pages', title: '树如何减少查找次数', description: '从有序数据和分叉查找，认识平衡树、B 树与 B+ 树。' },
        { id: 'record-layout', title: '一条记录怎样放进数据页', description: '连接逻辑记录与文件布局，认识数据页、缓存和读写开销。' },
        { id: 'logs-and-crash-recovery', title: '数据库怎样在中断后恢复', description: '结合日志与检查点理解恢复过程，区分进程中断和断电保证。' },
      ] },
      { id: 'performance', title: '索引与查询性能', description: '用执行计划和测量解释快慢与优化代价', nodes: [
        { id: 'index-tradeoffs', title: '索引为什么有收益也有代价', description: '比较读取、写入与空间开销，验证索引是否适合当前查询。' },
        { id: 'composite-indexes', title: '联合索引的顺序怎样选择', description: '结合筛选、范围和排序，比较不同列顺序的执行计划。' },
        { id: 'query-plans', title: '数据库怎样选择查询计划', description: '认识扫描、连接、排序与统计信息，读懂一次查询的执行方式。' },
        { id: 'slow-query-investigation', title: '怎样定位一次慢查询', description: '沿请求检查查询次数、处理数据量与耗时，一次验证一个改动。' },
      ] },
      { id: 'evolution', title: '迁移与恢复', description: '让结构变化可追踪，让恢复经过实际核验', nodes: [
        { id: 'database-migrations', title: '数据库迁移解决什么问题', description: '记录结构变化，让不同环境得到一致的数据表。' },
        { id: 'changing-existing-data', title: '有旧数据时怎样改表', description: '安排结构变更、数据回填与程序兼容，明确失败后的处理方式。' },
        { id: 'restore-a-backup', title: '备份之后怎样验证恢复', description: '用恢复演练，检查备份是否真的可用。' },
        { id: 'recovery-objectives', title: '误删、回滚与恢复目标', description: '区分代码回滚与数据恢复，测量可接受的数据损失和恢复时间。' },
      ] },
      { id: 'operations', title: '数据安全与运行维护', description: '练习权限、监测、数据生命周期与故障处理', nodes: [
        { id: 'least-privilege-and-privacy', title: '最小权限与敏感数据', description: '梳理访问能力及数据副本，检查日志、导出和备份中的信息。' },
        { id: 'database-observability', title: '怎样发现数据库出问题', description: '把延迟、错误、资源用量和容量变化关联到具体故障。' },
        { id: 'retention-and-deletion', title: '数据增长、归档与删除', description: '制定保留规则，核对主数据、关联记录、缓存与备份的生命周期。' },
        { id: 'data-incident-review', title: '一次数据故障怎样排查和复盘', description: '在隔离环境中串起发现、定位、恢复、核验和防止复发。' },
      ] },
      { id: 'storage-landscape', title: '存储选型与分布式入门', description: '进阶概览：认识不同需求与系统之间的取舍', nodes: [
        { id: 'cache-freshness', title: '缓存为什么会读到旧数据', description: '区分事实来源与副本，观察过期、失效和并发更新的影响。' },
        { id: 'files-and-object-storage', title: '图片、附件与对象存储', description: '区分文件内容与元数据，考虑上传、引用和删除的一致性。' },
        { id: 'documents-search-and-vectors', title: '文档、搜索与向量检索', description: '比较精确匹配、灵活结构、全文搜索与相似度检索的需求。' },
        { id: 'replication-and-sharding', title: '复制、分片与一致性', description: '用副本延迟与网络故障认识读写一致性、可用性和扩容边界。' },
        { id: 'transactional-and-analytical-data', title: '业务查询与数据分析', description: '区分日常读写和大量统计，认识数据管道、行列存储与质量检查。' },
        { id: 'choose-storage', title: '怎样为一个需求选择存储', description: '根据数据模型、查询、正确性、规模和维护成本提出可验证的选择。' },
      ] },
    ],
  },
  {
    id: 'engineering', title: '部署与工程', summary: '把本地的想法，带到线上。',
    description: '从本地运行到线上交付，理解每个环节为什么存在。', topics: '测试 · CI · 发布',
    branches: [
      { id: 'verification', title: '代码与验证', description: '给每次改动留下可核对的证据', nodes: [
        { id: 'git-and-tests', title: 'Git、测试和提交的关系', description: '把修改、验证与版本记录串成一次完整交付。' },
      ] },
      { id: 'delivery', title: '持续集成与交付', description: '让检查与发布形成可靠流程', nodes: [
        { id: 'appropriate-ci', title: '怎样为项目选择合适的 CI/CD', description: '从项目需要出发，选择值得自动执行的检查。' },
      ] },
      { id: 'cloudflare', title: 'Cloudflare 与运维', description: '理解请求如何到达网站', nodes: [
        { id: 'dns-https-workers', title: 'DNS、HTTPS 与 Workers', description: '沿着访问路径，理解域名、加密连接与服务入口。' },
        { id: 'release-and-rollback', title: '一次发布和回滚的全过程', description: '把发布、验证和恢复上一个版本连起来练习。' },
      ] },
    ],
  },
  {
    id: 'agents', title: '与 Agent 协作', summary: '把需求讲清，把结果看懂。',
    description: '把目标讲清楚，把实现读明白，把结果验证好。', topics: '表达 · 约束 · 验收',
    branches: [
      { id: 'briefs', title: '需求与表达', description: '给协作一个明确的起点', nodes: [
        { id: 'idea-to-task', title: '从一个想法到可执行的任务', description: '把模糊愿望拆成目标、范围和完成条件。' },
      ] },
      { id: 'references', title: '参考与约束', description: '让设计意图可以被理解', nodes: [
        { id: 'describe-a-style', title: '怎样向 Agent 描述一种风格', description: '从参考中提取具体特征，说明希望保留的关系。' },
      ] },
      { id: 'review', title: '阅读与验收', description: '建立对结果的判断能力', nodes: [
        { id: 'read-a-diff', title: '怎样阅读一次代码改动', description: '沿着改动理解行为变化，找到需要追问的地方。' },
        { id: 'acceptance', title: '从“能运行”到完成验收', description: '根据真实使用过程，检查实现是否达到了目标。' },
      ] },
    ],
  },
]

export type LearningArticle = {
  id: string
  domainId: DomainId
  branchId: string
  title: string
  description: string
  prerequisite: string
  outcomes: readonly string[]
  takeaway: string
}

export const learningArticles: readonly LearningArticle[] = [{
  id: 'comfortable-page', domainId: 'frontend', branchId: 'page-design',
  title: '一个页面为什么看起来舒服',
  description: '一起改造初构的学习入口，理解重点、分组与阅读顺序。',
  prerequisite: '会浏览网页即可，代码阅读是可选的延伸。',
  outcomes: ['看见重点', '理解内容的分组', '找到清楚的下一步'],
  takeaway: '先明确任务，再安排重点与分组，最后换一种条件验证。',
}]

export function findDomain(id: string) { return learningDomains.find(domain => domain.id === id) }
export function findArticle(domainId: string, articleId: string) {
  return learningArticles.find(article => article.domainId === domainId && article.id === articleId)
}
export function domainHref(id: DomainId) { return '/learn/' + id }
export function articleHref(domainId: DomainId, articleId: string) { return domainHref(domainId) + '/' + articleId }

export type ExpandedBranches = Record<DomainId, string[]>

// Store only navigation preferences; blocked storage and older trees remain usable.
export function restoreExpandedBranches(serialized: string | null): ExpandedBranches {
  let saved: Record<string, unknown> = {}
  try {
    const parsed: unknown = serialized ? JSON.parse(serialized) : null
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed as Record<string, unknown>
  } catch { /* Start from each domain's first branch. */ }
  return Object.fromEntries(learningDomains.map(domain => {
    const selected = saved[domain.id]
    return [domain.id, Array.isArray(selected)
      ? domain.branches.filter(branch => selected.includes(branch.id)).map(branch => branch.id)
      : [domain.branches[0].id]]
  })) as ExpandedBranches
}
