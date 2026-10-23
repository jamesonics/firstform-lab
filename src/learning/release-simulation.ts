// Teaching model only. It never reads credentials or invokes a deployment API.
// Authentication/configuration and the cloud upload itself are assumed valid;
// the model isolates the gates discussed in this lesson.
export const releaseSteps = ['PR 检查', 'main 检查', '人工批准', '提交核对', '产物核对', '上线验收'] as const
export type ReleaseConditions = {
  prPassed: boolean
  mainPassed: boolean
  approved: boolean
  latest: boolean
  artifactIntact: boolean
  healthy: boolean
}
export type ReleaseResult = {
  step: number
  state: 'blocked' | 'waiting' | 'deployed-warning' | 'verified'
  deployed: boolean
  title: string
  explanation: string
  next: string
}

export function evaluateRelease(input: ReleaseConditions): ReleaseResult {
  if (!input.prPassed) return { step: 0, state: 'blocked', deployed: false, title: '合并门禁拦截', explanation: '必需的 PR 检查失败，这次修改还不能合入 main。', next: '修复后推送到原任务分支，PR 会重新检查。' }
  if (!input.mainPassed) return { step: 1, state: 'blocked', deployed: false, title: '生产任务不会启动', explanation: '合并后的实际版本检查失败，production 的依赖条件不成立。', next: '排查失败原因，通过修复 PR 或 revert PR 让 main 恢复可交付状态。' }
  if (!input.approved) return { step: 2, state: 'waiting', deployed: false, title: '停在人工批准', explanation: 'main 检查通过，但生产环境仍未放行。检查通过不会自动获得部署权限。', next: '由人核对提交与变更后，在 GitHub Review deployments 中批准。' }
  if (!input.latest) return { step: 3, state: 'blocked', deployed: false, title: '旧版本被拒绝', explanation: '等待期间 main 已有新提交。本次运行不再对应当前 main，工作流停止上传。', next: '等待最新 main 运行通过检查，再批准那次运行。' }
  if (!input.artifactIntact) return { step: 4, state: 'blocked', deployed: false, title: '产物校验失败', explanation: '下载的产物与清单中的提交、文件列表或摘要不一致，无法确认它就是被检查的输出。', next: '检查产物与清单的来源；保留校验，修复后重新运行检查。' }
  if (!input.healthy) return { step: 5, state: 'deployed-warning', deployed: true, title: '已上传，但验收失败', explanation: '这时变更可能已经对用户生效。Actions 标红不会自动把网站恢复到旧版本。', next: '查看日志与线上影响，按预案修复或恢复代码；单独核对数据库兼容性。' }
  return { step: 5, state: 'verified', deployed: true, title: '基础上线检查通过', explanation: '模拟中已经上传，首页与健康接口检查通过。它们只验证基本可达性，不能证明所有页面和功能都正确。', next: '继续检查真实页面、路由、交互和必要的业务路径，并记录发布版本。' }
}

const ready: ReleaseConditions = { prPassed: true, mainPassed: true, approved: true, latest: true, artifactIntact: true, healthy: true }
export const releaseScenarios = [
  { id: 'pr-fails', label: 'PR 检查失败', conditions: { ...ready, prPassed: false } },
  { id: 'main-fails', label: 'main 检查失败', conditions: { ...ready, mainPassed: false } },
  { id: 'waiting', label: '还没人工批准', conditions: { ...ready, approved: false } },
  { id: 'outdated', label: '批准前 main 更新了', conditions: { ...ready, latest: false } },
  { id: 'artifact', label: '产物被改动', conditions: { ...ready, artifactIntact: false } },
  { id: 'unhealthy', label: '上传后健康检查失败', conditions: { ...ready, healthy: false } },
  { id: 'ready', label: '所有条件通过', conditions: ready },
] as const
