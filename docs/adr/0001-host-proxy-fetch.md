# 数据经插件 host 半代理拉取 codexradar API

api.codexradar.com 的全部读端点虽然免认证，但 CORS 是**站点白名单制**：只有 `deng.codexradar.com` 自身的 Origin 能拿到 ACAO 回显，从 DSH 页面（`http://127.0.0.1:3080`）发起的浏览器直连拿不到任何 ACAO 头、必然被拦。因此所有远端数据一律由插件 host 半在 Node 侧拉取（顺带完成本地快照持久化），再经 Package 私有 JSON 方法交给 client 渲染。后续维护者请不要以「简化」为由把 fetch 挪回 client 半——那不是冗余设计，是绕不开的约束。
