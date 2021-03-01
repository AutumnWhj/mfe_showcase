# 使用Lerna 构建项目

初认识 [Lerna](https://github.com/lerna/lerna) 的话，建议看这个比较全[lerna管理前端packages的最佳实践](http://www.sosout.com/2018/07/21/lerna-repo.html)

## 初始化一个lerna工程

```bash
yarn global add lerna
# 进入到当前项目的根目录
lerna init
```

然后就会看到以下的文件夹结构被构建出来

```doc
- packages(目录)
- lerna.json(配置文件)
- package.json(工程描述文件)
```

稍微修改以下配置文件 `lerna.json`

```json
{
  "packages": [
    "packages/*"
  ],
  "useWorkspaces": true,// 使用 工作目录
  "npmClient": "yarn",  // 使用 yarn
  "version": "0.0.0"
}
```

然后是 `package.json`，把一些常用的命令也加入进来

```json
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"  // 上面定义了 useWorkspaces，这里就是告诉 lerna 那个是 workspaces
  ],
  "devDependencies": {
    "lerna": "^3.22.1"
  },
  "scripts": {
    "init": "lerna bootstrap", // 把所有 packages 内的项目的依赖安装
    "list": "lerna list",
    "changed": "lerna changed",
    "diff": "lerna diff", 
    "build": "lerna run build", // lerna run 是对 packages 内的项目都运行 run 后面的命令，然后具体看 packages内的 package.json 的对应的命令是什么
    "clean": "lerna clean"
  }
}

```

然后创建我们后面要用的 `master` 应用

```bash
lerna create master
```

一连回车后，就可以看到 `packages` 内有了 `master` 文件夹了
