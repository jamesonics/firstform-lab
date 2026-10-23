# 初构 · Firstform Lab

**从好奇开始，把理解做成作品。**

初构是一个个人学习实验室，也是一件持续生长的作品。从自己好奇、尚未理解的问题出发，补齐知识和上下文，动手验证，再把理解整理成别人也能参与的教程与交互实验。

网站的设计、代码与工程实践本身就是学习的一部分。我们希望在教会自己的同时，也为下一个学习者留下清楚的解释和可操作的例子。

[实现与内容维护](docs/firstform-lab.md) · [Workers 部署](docs/cloudflare-workers.md) · [验证工作流](.github/workflows/verify.yml) · [MIT License](LICENSE)

## 怎样学习与创作

每个主题围绕一个具体问题展开：最初不懂什么、需要哪些前置知识、怎样通过实验理解、哪些条件会改变结论。

读者可以调整参数、比较结果、验证自己的预测。作者也需要解释设计理由、检查失败的例子，并根据反馈修正内容。能运行的作品与能讲清楚的理解，一起构成学习成果。

## 浏览方式

首页选择学习领域，进入该领域的知识树，展开章节，再进入具体教程。

| 领域 | 页面 |
| --- | --- |
| 前端与交互 | `/learn/frontend` |
| 后端与接口 | `/learn/backend` |
| 数据与存储 | `/learn/data` |
| 部署与工程 | `/learn/engineering` |
| 与 Agent 协作 | `/learn/agents` |

首篇教程为[一个页面为什么看起来舒服](https://jiaotonai.cc/learn/frontend/comfortable-page)，围绕初构领域页展开六步讲解，包含布局对比、字号与间距实验、阅读条件检查和迁移练习。其他内容按实际学习逐步补充，当前未发布的节点标为“规划中”。发布通过受保护的 main 分支与 GitHub Actions 生产审批，流程见 [CI/CD 运维](docs/cicd.md)。

## 当前实现

- React 19、TypeScript 和 Vite 实现公共学习页面，沿用现有 Tailwind 与组件基础。
- 清爽的领域卡片、可展开知识树、阅读页、亮暗色外观与手机布局。
- 独立 URL、深链接刷新、前进后退及知识树展开状态恢复。
- 学习内容当前随源码发布，不需要新增数据库表。
- Cloudflare Workers 提供部署与已有 API，D1 保留现有数据与健康检查。
- 工程实践代码涵盖后台、邮件验证与接口协议，所有真实交易及交易测试开关保持关闭。

Logo 与领域插图是第一版视觉资产，后续会继续共同打磨。

## 本地运行

使用已验证的 Node.js 22.20+，或项目 CI 使用的 Node.js 24，并准备 npm、Git 与 Python 3。

```sh
npm ci
test -e .dev.vars || cp .dev.vars.example .dev.vars
npm run worker:migrate:local
npm run preview:worker
```

访问 `http://127.0.0.1:8787`。仅调试学习页面时也可以运行 `npm run dev`，默认访问 `http://127.0.0.1:5173`。

已有 `.dev.vars` 必须保留。生产配置放在被忽略的 `wrangler.production.jsonc`，沿用已经创建的 Worker 与 D1。按[部署文档](docs/cloudflare-workers.md)完成远程预检和发布，密钥、配置与数据库不入 Git。

## 代码入口

```text
src/learning/          学习首页、知识树、教程、视觉与导航
src/lib/branding.ts    前端展示品牌
src/admin/            管理工作台与身份验证实践
src/partner/          角色与权限实践工作台
worker/               Workers API 与协议学习代码
migrations/            D1 迁移
emails/               系统邮件模板
tests/                业务与学习站回归测试
docs/                 学习站说明与部署文档
services/storefront/  Go + PostgreSQL 后端研究材料
```

公共学习站入口在 `src/Root.tsx`。`src/App.tsx` 中的业务界面用于源码研究；商品、订单和推广路径会进入学习首页。`/admin`、`/partner`、`/join` 是工程实践工作台，不出现在公共学习导航中。

## 开发验证

```sh
npm test
npm run lint
npm run security:scan
npm run worker:dry-run
```

验证工作流还包含新数据库迁移检查、凭据扫描及原 Go 后端测试。自动化交易测试使用隔离数据库和 Mock，不使用真实支付、供货商或生产凭据。公共学习页面的人工验收覆盖路由、返回状态、交互实验、窄屏、亮暗色和键盘操作。

新增文章的目录关系、正文与发布步骤见[维护说明](docs/firstform-lab.md)。

## 许可与素材

代码许可见 [LICENSE](LICENSE)。第三方素材的说明与许可分别见[品牌素材说明](public/brands/README.md)与[第三方样式说明](src/styles/vendor/README.md)。
