# 初构 · Firstform Lab：Cloudflare Workers + D1

更新：2026-10-22。所有命令从本仓库根目录执行。

## 站点与架构

初构的公共入口包括学习首页、领域知识树和教程实验。React 静态资源由 Cloudflare Workers 提供，Workers API 与 D1 支撑工程实践；邮件验证使用 Resend。内容结构与维护方法见 [firstform-lab.md](firstform-lab.md)。

当前站点为 `https://jiaotonai.cc`。已有 Worker、D1、自定义域名、管理员身份与 Secrets 继续使用，资源名称和标识以本地 `wrangler.production.jsonc` 为准。代码仓库独立不需要重建这些资源。

所有真实交易、充值与供货开关保持关闭，相关接口仅供源码研究和隔离的 Mock 测试。部署本学习站不需要配置支付或供应商凭据。

## 本地开发

准备 Node.js 22.20+ 或 CI 使用的 Node.js 24，以及 npm、Git 与 Python 3。

```sh
npm ci
test -e .dev.vars || cp .dev.vars.example .dev.vars
npm run worker:migrate:local
npm run preview:worker
```

默认访问 `http://127.0.0.1:8787`。只修改学习页面时可以运行 `npm run dev`，默认访问 `http://127.0.0.1:5173`。

`.dev.vars` 已存在时保留其中配置。它只用于本地运行，不会自动上传到生产。示例文件中的 `ORDER_TESTING_ENABLED=true` 仅允许非金融模拟订单；真实交易开关仍为 `false`。生产的订单测试与交易测试开关均为 `false`。

本地后台使用独立的管理员与邮件配置。密钥保存在被忽略的文件中，不打印到公开日志，不提交到 Git，不与生产环境共用。

## 生产配置

已有部署优先使用现有的 `wrangler.production.jsonc`。该文件与 `.dev.vars`、`.secrets/`、数据库和备份均已被 Git 忽略；新工作目录只在本机安全保存所需配置。

`wrangler.production.example.jsonc` 是可公开的结构示例，数据库 ID 与域名为占位值，不能直接发布。需要建立自己的配置时使用：

```sh
test -e wrangler.production.jsonc || cp wrangler.production.example.jsonc wrangler.production.jsonc
```

按照已存在的云资源填写 Worker 名称、D1 名称与 ID、自定义域名，以及 `STOREFRONT_ORIGIN`、`PAYMENT_NOTIFY_ORIGIN`。保留绑定名 `INTEREST_DB`、静态资源、限流绑定和 Cron 设置。`workers.dev` 与预览 URL 保持关闭。

当前部署使用 Workers 免费计划，实际生产配置省略 `limits.cpu_ms`；示例中的该字段不能直接套用到免费计划。

生产侧已有的 Secrets 为 `ADMIN_USERNAME`、`ADMIN_EMAIL`、`ADMIN_TOTP_SECRET`、`PARTNER_AUTH_SECRET`、`RESEND_API_KEY` 和 `RESEND_FROM`。迁移代码仓库无需重建或重新打印它们。凭据只通过 Cloudflare Secrets 管理，公开文档只记录名称。

## 验证与发布

```sh
npm test
npm run lint
npm run security:scan
npm run worker:dry-run
npm run worker:check -- --remote
```

`worker:dry-run` 使用示例配置完成构建和打包，不上传到 Cloudflare。远程预检检查配置和所需 Secret 名称，不读取 Secret 值；通过预检不能代替页面验收。

确认代码已提交并推送后，再发布：

```sh
npm run worker:deploy
```

学习内容当前随源码构建，没有新增数据库表；单纯更新文章或界面无需执行生产迁移。确实新增迁移时，先备份、在隔离的本地数据库验证，再执行：

```sh
npm run worker:migrate:production
```

已有数据库按迁移记录补齐，不重复初始化，不导入其他环境的私密数据。

## 发布验收

- 首页、五个领域知识树和已发布教程能够打开；规划中内容没有假的阅读链接。
- 深链接刷新、前进后退、知识树展开状态、文章实验、手机排版与键盘操作正常。
- `/api/health` 正常，后台初始化状态和身份验证可用。
- 真实交易及生产测试开关保持关闭，未启用真实支付或供货商。
- 记录实际发布的 Worker version ID、代码提交和迁移版本。重要发布使用带说明的 Git 标签。

## 运维与备份

```sh
npx wrangler tail --config wrangler.production.jsonc
mkdir -p backups
npx wrangler d1 export INTEREST_DB --remote --config wrangler.production.jsonc --output "backups/firstform-$(date +%F-%H%M%S).sql"
```

日志避免记录邮箱、身份凭据和接口秘密。备份留在被忽略的 `backups/` 中，数据库迁移前先导出并核对恢复方案。代码回滚不会自动回滚数据库结构。

Cloudflare 和 Resend 中已有资源只在当前授权范围内使用，不因仓库或展示名称变化而删除、重命名或重新创建。
