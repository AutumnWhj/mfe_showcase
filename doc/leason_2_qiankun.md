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

回到根目录，添加 [qiankun](https://github.com/umijs/qiankun) 的依赖到 master

```bash
lerna add qiankun --scope=master
```