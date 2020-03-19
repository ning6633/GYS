### ASP内置APP模板项目结构介绍

react+react-dom+react-router+mobx+antd

1. 建立软连接
2. 运行整个工程： npm run serve
3. 访问：http://localhost:9000
   
    https://segmentfault.com/a/1190000012921279

    https://www.cnblogs.com/TaoLand/p/9643232.html

    https://github.com/mzohaibqc/antd-theme-generator#readme

    https://www.cnblogs.com/stephenykk/p/5057022.html

    https://github.com/ReactTraining/history

    https://reacttraining.com/react-router/web/api/history
    
### 项目工程简介

1. 自定义主题颜色风格
2. 组件使用介绍 
3. 国际化

### 文件结构树

- browser 
    - actions                    // mobx actions 层
        - todoList
            - index.js          // 不同 模块需要处理数据的服务层
        - index.js              // action 服务统一出口
    - components
        - Intro
            - index.jsx         // 组件jsx文件
            - index.less        // 组件样式文件
        - RouteWithSubRoutes    // 路由及子路由处理组件
            - index.jsx     
    - images            // 项目依赖的静态图片文件
    - plugins            // 本项目中用到的独立插件
    - stores            // MOBX 状态数据 层
        - todoStore
            - index.js  // 模块状态数据处理文件
        - index.js      // 状态数据统一出口
    - theme
        - var.less        // 全局 主题变量文件
    - views
        - Home
            - index.jsx         // 页面视图层根组件文件
            - index.less        // 页面视图层样式文件
        - Main.jsx      // 全局路由配置文件
    - index.jsx         // 全局 react 入口文件 
    - index.less        // 全局样式文件
    - index.tmpl.html   // html 根模板
    - jsconfig.json     // js 配置文件