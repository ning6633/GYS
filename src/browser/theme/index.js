/*
 * @Author: jiwei 
 * @Date: 2019-01-22 13:53:43 
 * @Last Modified by: jiwei
 * @Last Modified time: 2019-01-22 13:55:07
 */
import {
    message
} from "antd";

/**
 * 支持主题切换
 * 
 * 1.主要实现思路，修改根元素 id 为 root 的 classname 
 * 2.增加主题，增加相应的主题文件 theme.{主题名}.less
 * 3.在index.less文件中导入文件
 * 4.写相应主题不同样式
 * 
 * JS中使用
 * 1.导入 当前文件
 * 2.当前文件接口：
 * 3.默认主题： theme.defaultTheme
 * 4.获取本地主题配置文件： theme.config
 * 5.设置本地主题配置文件: theme.config = {}
 * 6.加载本地主题: theme.loadLocalTheme()
 * 7.改变本地主题: theme.changeTheme()
 * 
 */
class Theme {
    // 主题配置
    themeConfig = [{
        name: "亮白色",
        value: "root-light",
        description: "亮白色主题"
    }, {
        name: "暗黑色",
        value: "root-dark",
        description: "暗黑色主题"
    }]
    // 默认主题
    defaultTheme = "root-light"
    // 当前使用的主题
    currentTheme = "root-dark"
    // 获取根元素
    rootElement = document.getElementById("root")
    // 获取本地主题配置文件
    get config() {
        return this.themeConfig;
    }
    // 设置本地主题配置文件
    set config(conf) {
        this.themeConfig.push(conf);
    }
    // 加载本地主题
    loadLocalTheme() {
        // 读取本地 localStorage
        let loaclTheme = localStorage.getItem("theme");
        if (loaclTheme) {
            this.rootElement.className = loaclTheme;
        } else {
            this.rootElement.className = this.defaultTheme;
        }
    }
    // 改变本地主题
    changeTheme(value) {
        this.rootElement.className = value;
        message.success("主题切换成功！")
        localStorage.setItem("theme", value);
    }
}

const theme = new Theme();

export default theme;