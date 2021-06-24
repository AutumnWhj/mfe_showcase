# 使用qiankun 构建Master

[基于vue3+koa2+qiankun2的微前端后台管理系统项目实战](https://github.com/wl-ui/wl-mfe)，这个项目确实不错，把一些微前需要学习和了解的事情都基本覆盖了，本项目也是借鉴它的部分实现方式来做的。

## 开始构建

现在现在我们为之前创建的 [master](../packages/master)，使用vue cli 构建master

```bash
cd packages # 从根目录进入到 packages目录
vue create master # 使用 vue cli 来构建（把之前的master overwrite 掉）

# vue cli 的选项
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, TS, Router, Vuex, CSS Pre-processors, Linter, Unit
? Use class-style component syntax? Yes
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with node-sass)
? Pick a linter / formatter config: Prettier
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Jest
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? Yes
? Save preset as: Master
? Pick the package manager to use when installing dependencies: Yarn

```

然后试运行一下

```bash
cd master
yarn serve
```

没有异常的话就可以在浏览器上访问 [http://localhost:8080](http://localhost:8080)

用同样的方法创建login项目

现在先来一个最简单的 [qiankun](https://github.com/umijs/qiankun) 的配置改造

按照官方的[快速上手](https://qiankun.umijs.org/zh/guide/getting-started)，我们现在了解一些基本的操作

回到根目录，添加 [qiankun](https://github.com/umijs/qiankun) 的依赖到 master

```bash
lerna add qiankun --scope=master
```

然后在 [main.ts](../packages/master/src/main.ts) 改写成

``` js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { registerMicroApps, start } from "qiankun";

registerMicroApps(
  [
    {
      name: "subAppLogin",
      entry: "//localhost:8081",
      container: "#subapp-viewport",
      activeRule: "/login",
    },
  ],
  {
    beforeLoad: async (app) => console.log("before load", app.name),
    beforeMount: [async (app) => console.log("before mount", app.name)],
  }
);
// 启动 qiankun
start();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#main-container");

```

`registerMicroApps` 的[参数解析](https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles)

然后再改造一下 [App.vue](../packages/master/src/App.vue)

```html
<template>
  <div id="root" class="main-container">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <router-view />
    <div id="subapp-viewport" class="app-view-box"></div>
  </div>
</template>
```

还有 [index.html](../packages/master/public/index.html)

把原来的 `id="app"` 换成 `id="main-container"`，防止子项目默认使用`app`来加载时带来的问题

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong
        >We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work
        properly without JavaScript enabled. Please enable it to
        continue.</strong
      >
    </noscript>
    <div id="main-container"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```

现在我们启动master项目 

```bash
cd master
yarn serve
```

master 还是可以正常启动的，只是当我们去点击 login 的菜单时，控制台上会输出

> Uncaught TypeError: application 'subAppLogin' died in status LOADING_SOURCE_CODE: application 'subAppLogin' died in status LOADING_SOURCE_CODE: Failed to fetch

是因为我们还没有启动login项目

下面我们先对login项目的 启动端口设置成`8081`，然后启动一下 login看看效果

2333 小朋友太天真了，以为就这样就可以了吗？当然需要对子项目做一点点小改造，qiankun 才可以检测到它。

首先是 [vue.config.js](../packages/login/vue.config.js) 文件

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { name, port } = require("./package");

function resolve(dir) {
  return path.join(__dirname, dir);
}
const dev = process.env.NODE_ENV === "development";
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: dev ? `//localhost:${port}` : "/",
  outputDir: "dist",
  assetsDir: "static",
  filenameHashing: true,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
```

`configureWebpack.output` 部分是最核心的内容

先把 [router/index](../packages/login/src/router/index.ts) 改造一下，把 `VueRouter` 的注册删除，把`routes` 导出

```js
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

export const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];
```

然后在`login/src` 下 创建一个 [public-path.ts](../packages/login/src/public-path.ts)

```js
if ((<any>window).__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = (<any>window).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

最后是 [main.ts](../packages/login/src/main.ts)

```js
import "./public-path";

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import { routes } from "./router";
import store from "./store";

Vue.config.productionTip = false;

let instance: Vue | null = null;
let router: VueRouter | null = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /login
    base: (<any>window).__POWERED_BY_QIANKUN__ ? "/login" : "/",
    mode: "history",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}

// 独立运行时，直接挂载应用
if (!(<any>window).__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("LoginMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  console.log("LoginMicroApp mount", props);
  render();
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("LoginMicroApp unmount");
  if (instance) {
    instance.$destroy();
  }

  instance = null;
  router = null;
}
```

然后把子项目跑起来

```bash
cd login
yarn serve
```

大功告成，微前端就是这么简单！

但是如果要扣细节的话，里面还有很多问题的，例如之前搭建的 lerna 好似也没有啥用途

下一节 lerna + qiankun 实现多项目业务共用

## 更多建议必看的内容

- [基于 qiankun 的微前端最佳实践（万字长文） - 从 0 到 1 篇](https://juejin.cn/post/6844904158085021704)
- [qiankun 微前端方案实践及总结](https://juejin.cn/post/6844904185910018062)
- [qiankun 微前端实践总结（二）](https://juejin.cn/post/6856569463950639117)