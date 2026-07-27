# Luna Body Tracker Landing Page

Luna Body Tracker 的产品介绍页，使用 Next.js、vinext 和 Cloudflare Workers 构建。

线上地址：[luna-body-tracker.ari-luna.workers.dev](https://luna-body-tracker.ari-luna.workers.dev)

## 环境要求

- Node.js `>=22.13.0`
- npm

## 本地启动

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 检查修改

构建并运行页面回归测试：

```bash
npm test
```

只检查生产构建：

```bash
npm run build
```

## 部署到 Cloudflare

首次部署需要登录 Cloudflare：

```bash
npx wrangler login
```

修改页面后，执行下面的命令重新构建并部署：

```bash
npm run build && npx wrangler deploy --config dist/server/wrangler.json
```

部署会更新现有的 `luna-body-tracker` Worker，线上地址保持不变。

如果已经执行过 `npm test`，可以直接部署测试产生的最新构建：

```bash
npx wrangler deploy --config dist/server/wrangler.json
```

不要跳过构建或测试后直接部署，否则可能上传 `dist` 目录中的旧版本。

## 主要目录

- `app/page.tsx`：页面内容与结构
- `app/globals.css`：全局样式和配色
- `public/`：图标和社交分享图片
- `tests/`：页面回归测试
- `vite.config.ts`：vinext 与 Cloudflare Workers 配置

> 分一点注意力给自己的身体，轻记录，迈向长期主义。
