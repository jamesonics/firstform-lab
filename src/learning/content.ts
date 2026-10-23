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
    description: '从一张表开始，理解数据的结构、关系和变化。', topics: '表 · 查询 · 迁移',
    branches: [
      { id: 'structure', title: '表与关系', description: '给信息建立清楚的结构', nodes: [
        { id: 'keys-and-constraints', title: '主键、字段与约束', description: '从一条记录出发，为数据定义结构与规则。' },
        { id: 'relationships', title: '两张表如何建立关系', description: '用具体查询理解记录之间的关联。' },
      ] },
      { id: 'queries', title: '查询与更新', description: '准确地读写需要的数据', nodes: [
        { id: 'query-to-interface', title: '从查询语句到界面上的内容', description: '追踪一次数据读取怎样成为页面上的信息。' },
      ] },
      { id: 'evolution', title: '迁移与恢复', description: '让结构变化可以追踪', nodes: [
        { id: 'database-migrations', title: '数据库迁移解决什么问题', description: '记录结构变化，让不同环境得到一致的数据表。' },
        { id: 'restore-a-backup', title: '备份之后怎样验证恢复', description: '用恢复演练，检查备份是否真的可用。' },
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
