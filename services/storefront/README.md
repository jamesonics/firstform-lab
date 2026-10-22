# Go 后端研究材料

Go + Gin + PostgreSQL，API 与业务 Worker 使用同一个二进制，用于研究后端架构、接口、权限和数据库。练习时使用全新隔离数据库，不导入生产快照。公共学习站使用仓库根目录的 Workers/D1 实现。

历史离线导入测试使用截至 `0043_partner_product_visibility.sql` 的固定 D1 结构，对应 `internal/importer/legacy-schema.json`。后续 Workers 迁移不自动加入这份历史测试数据；导出器继续拒绝未知表，避免静默丢失数据。当前学习站的 Workers/D1 部署仍执行全部 44 个迁移。

## Docker 本地启动

需要 Docker Compose，命令在本目录执行。首先生成三个独立随机秘密（Python 3）：

```sh
python3 scripts/init-secrets.py
cp .env.example .env
docker compose config --quiet
docker compose build api
docker compose up -d --wait postgres
docker compose --profile maintenance run --rm maintenance migrate
docker compose --profile maintenance run --rm maintenance grant-runtime
docker compose up -d --wait api worker
```

也可以在 PowerShell 使用 `./scripts/init-secrets.ps1` 初始化。秘密文件位于被忽略的 `.secrets/`，已有文件不会覆盖。API 仅监听宿主机 `127.0.0.1:8093`，PostgreSQL 不映射宿主机端口；运行数据库角色与迁移所有者分离。

`compose.auth.yaml` 可选启用管理员/邮件：配置 `ADMIN_USERNAME`、`ADMIN_EMAIL`、`MAIL_FROM`，自行生成 `.secrets/admin-totp` 并保存 `.secrets/resend-key`，再叠加该 Compose 文件。不要使用测试中的固定认证向量。

接口参数结构见 `.env.integrations.example`，Compose 配置示例见 `compose.integrations.yaml`。所有交易开关保持关闭，适配器的保留域名是占位值；学习中使用本地 Mock，不填入生产秘密或调用真实商户、供应商。`compose.domains.yaml` 仅供阅读部署配置结构。

## 原生开发

程序读取环境变量，不自动加载 dotenv。通过 `DATABASE_URL_FILE` 或 `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD_FILE` 指向独立数据库；外部连接默认要求 TLS。先用所有者身份执行 `migrate` 和 `grant-runtime`，再用受限角色执行 `api` 和 `worker`：

```sh
go run ./cmd/storefront migrate
go run ./cmd/storefront grant-runtime
go run ./cmd/storefront api
# 另一个终端使用相同运行配置：
go run ./cmd/storefront worker
```

`grant-runtime` 还需 `APP_DB_PASSWORD_FILE`。运行身份需 `AUTH_SECRET_FILE`，默认公开来源为 `http://127.0.0.1:8093`。配置管理员与邮件后才能使用完整后台登录。根目录执行 `npx vite --config services/storefront/vite.config.ts` 启动前端。

## 测试

先在仓库根目录执行 `npm ci`；前后端路由契约测试需要 TypeScript 解析器。

```sh
go test ./...
go vet ./...
# 专用本机 PostgreSQL，库名必须以 _test 结尾：
STOREFRONT_TEST_DATABASE_URL='postgres://test_user:YOUR_LOCAL_PASSWORD@127.0.0.1:5432/storefront_test?sslmode=disable' go test -count=1 ./...
```

每个集成测试建立随机 schema 和受限角色，并在结束后清理，需要测试数据库所有者拥有创建角色权限。不可指向业务数据库；没有连接配置时，集成测试明确跳过。
