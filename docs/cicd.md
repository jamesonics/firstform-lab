# CI/CD 运维

更新：2026-10-23。本文件记录实际配置和操作；学习教程在完成实操与讨论后另行整理。

## 三处配置

1. 仓库 Settings → Rulesets 中的 `main-pr-and-ci` 保护 `main`：必须通过 PR，`source` 和 `backend` 必须由 GitHub Actions 成功执行，分支须与目标分支同步，讨论须解决，禁止强推和删除，无绕过名单。
2. `.github/workflows/verify.yml` 对目标为 `main` 的 PR，以及 `main` 的推送运行检查。PR 更新会重新检查；没有 PR 的普通任务分支推送不运行完整工作流。保留手动触发。检查任务不给生产凭据，不操作远程 D1。
3. Settings → Environments → `production` 只接受名为 `main` 的分支，由仓库所有者批准；关闭管理员绕过。当前只有一名协作者，允许运行发起人批准自己的生产发布，PR 不要求第二位用户审批。人负责实际点击生产批准，代理不代替批准。

合并保护约束代码进入 `main`，环境保护约束 Actions 生产任务。拥有 Cloudflare 独立部署权限的人仍有能力直接调用其 API；GitHub 规则不能撤销云平台权限。本次保留既有本机登录，不吊销或改动已有凭据。

## 检查与发布

- `source`：源码安全扫描、lint、测试、邮件和前端构建、TypeScript 检查、Worker 打包演练、全新本地 D1 迁移、Gitleaks。不会修改生产数据库。
- `backend`：独立 PostgreSQL 容器、Go 静态检查及测试。只测试 Go 后端研究代码。
- PR 只运行检查，不发布。`main` 检查保存 `release-<完整提交号>` 产物，有效期七天；内容只有 `dist/`、`.wrangler/release/`，不包含生产配置或凭据。
- `production` 依赖两组检查成功，并等待环境审批。批准后再检查提交仍为当前 `main`，下载同次工作流的产物，验证提交号、完整文件列表与 SHA-256，读取私有配置并预检，使用 `--no-bundle` 上传已验证的 Worker 与静态文件。
- 发布串行执行。旧工作流对应的提交若已被新的 `main` 替代，将停止；请批准最新成功的运行。失效产物需要重新触发检查。
- 发布后自动检查首页和 `/api/health`，再人工验收页面、路由、交互、身份验证。自动健康检查失败会标红，但不会自动回滚。

## 生产环境 Secrets

以下值只存储在 GitHub `production` 环境中，不放入代码、工作流字面量或聊天：

| 名称 | 用途 |
| --- | --- |
| `WRANGLER_PRODUCTION_CONFIG` | 现有本机 `wrangler.production.jsonc` 的完整内容，沿用原资源 |
| `CLOUDFLARE_ACCOUNT_ID` | 既有 Cloudflare 账户标识 |
| `CLOUDFLARE_API_TOKEN` | 专用于 CI 的 Cloudflare 部署 Token，限制到现有目标账户与实际所需权限 |

Wrangler 本机 OAuth 登录会话不复制为长期 CI Token。已有管理员、邮件等业务 Secrets 继续留在 Cloudflare；工作流只检查名称，不获取值。运行时遮蔽账户及 D1 等资源标识。交易与交易测试开关必须保持关闭，预检会拒绝启用结算功能。

## 请求和批准发布

1. 在任务分支开发，创建目标为 `main` 的 PR，等待两组检查成功，核对改动后合并。
2. 打开合并提交的 Actions 运行，等待 `source`、`backend` 成功。打开 Review deployments，核对完整提交号和待发布内容，再由人批准 `production`。
3. 检查部署任务和线上验收。还未合入 `main` 的旧任务分支，不会自动包含在这次发布中。

`npm run worker:deploy` 等价于 `gh workflow run verify.yml --ref main`：重新验证和请求发布远程 `main`，无论当前本地分支是什么，都不上传本地文件。生产迁移仍按部署文档单独备份和执行，工作流不会自动执行远程迁移。

恢复代码时，优先为待撤销的改动创建 revert PR，重新通过检查和生产批准。代码恢复不自动恢复 D1 结构或数据；数据库变更必须单独核对兼容性与恢复方案。
