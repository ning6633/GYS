import axios from "axios";
import {
    message
} from "antd";
// action 基础 类， 以后用于拓展使用
// 启动内置APP使用 this.openURL  启动 web 网页 使用 this.saView.shell.openExternal
class ActionBase {
    authModule; //用户相关服务
    asp; // 审计署ASP对象
    EventManager; // 底层服务事件，用户数据实时同步作用
    saView; // 底层服务事件，用户数据实时同步作用
    BaseURL; // 底层服务事件，用户数据实时同步作用
    pageInfo = {}
    constructor() {
        this.init();
        this.initAxios();
    }
    init() {
        //http://10.0.39.47:9000/suprecommend?uid=513399bb35de000&username=zhangsan&departmentId=orgRootDomain&departmentName=中国航天&clientIp=10.0.39.47&roleName=&roleNameKey=&sid=29ECA943063D73B2355734EC0B682ECE
        this.pageInfo = {
            sid: this.getQueryString("sid") || '29ECA943063D73B2355734EC0B682ECE',
            departmentId: this.getQueryString("departmentId") || '188fd53c-c12b-4dcc-aa3b-48d842be2035',
            // 中国航天科技集团有限公司 ：188fd53c-c12b-4dcc-aa3b-48d842be2102   推进研究院：188fd53c-c12b-4dcc-aa3b-48d842be2035
            username: this.getQueryString("username") || 'zhangsan',
            userId: this.getQueryString("uid") || 'f1f7d4c6-6c89-4985-ab62-21773cbbc499', // 中国运载火箭：'5537d84911de000',艾博唯: '513399bb35de000',集团用户：lisi,5326fa1c15de000,'53356360cdde000'//供应商用户：5387fd3e05de000，huayu:53888cb655de000,tuijin:53356360cdde000,评价人员：95ef0c0b-a50a-4986-b86e-d03b3cb66c74,培训人员ID：f1f7d4c6-6c89-4985-ab62-21773cbbc499,
            roleName: this.getQueryString("roleName") || '',
            roleNameKey: this.getQueryString("roleNameKey") || 'pxypjzxglry2053',//wbgys2053,ld2053,pxypjzxglry2053
            clientIp: this.getQueryString("clientIp") || '10.0.37.22',
            ssocode: this.getQueryString("ssocode") || '',
            path: this.getQueryString("path") || '', // 获取当前登录角色的所属级别
        }
        // 初始化 action

        // this.BaseURL = 'http://10.3.68.98:8082/gys/1.0/';集团现场
        //  this.BaseURL = 'http://10.10.30.210:8082/gys/1.0/';//内网测试
        //   this.BaseURL = 'http://10.0.37.214:8179/gys/1.0/';
        this.BaseURL = 'http://10.0.37.22:8082/gys/1.0/';
        this.FileBaseURL = 'http://10.0.37.22:8082/aspfile/file/1.0/files/';

        if (!!window.asp) {
            // 说明当前运行在 客户端环境
            // 注意各个Service中禁止直接使用 ASP 对象 
            this.asp = asp;
            this.authModule = asp.getServiceByClassName("AuthService");
            this.saView = asp.getServiceByClassName("DesktopService");
            this.EventManager = EventManager;
            this.openURL = openURL;
        } else {
            // 说明当前运行在浏览器环境
            // 在浏览器环境可以模拟基本ASP对象
            // 同时重置各个服务，达到 客户端及浏览器同时运行的目的
            this.asp = {
                user: {
                    tokenstr: ""
                }
            }
            /* this.authModule = {
                getUserInfo:()=>{}
            } */
        }
    }
    initAxios() {
        //设置全局axios默认值
        axios.defaults.timeout = 10000; //10000的超时验证
        axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
        axios.defaults.headers['Accept'] = 'application/json;charset=UTF-8';
        axios.defaults.headers['CLIENTIP'] = this.pageInfo.clientIp;
        axios.defaults.headers['USERID'] = this.pageInfo.userId;
        //request拦截器
        axios.interceptors.request.use(
            config => {
                //每次发送请求之前检测都mobx存有token,那么都要放在请求头发送给服务器
                // if (true) {
                //     config.headers['XASPSESSION'] = this.asp.user.tokenstr;
                // }
                return config;
            },
            err => {
                return Promise.reject(err);
            }
        );
        //respone拦截器
        axios.interceptors.response.use(
            response => {
                return response
            },
            error => { //默认除了2XX之外的都是错误的，就会走这里
                if (error.data) {
                    message.error(error.data.message)
                    switch (error.data.status) {
                        case 401:
                            // 用户token过期或用户未登录
                            console.log(401);
                        case 404:
                            // 用户token过期或用户未登录
                            console.log("请求的内容不存在");
                            console.log(404);
                        case 408:
                            // 请求超时
                            console.log(408);
                        case 500:
                            // 用户token过期或用户未登录
                            console.log("服务器内部错误");
                    }
                } else {
                    console.log(error);
                }
                return Promise.reject(error.response);
            }
        );
    }
    // 获取浏览器 query 参数
    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
    // 处理url数组参数
    getQueryCovertArr(name, arr) {
        // a=1&a=2
        let str = '';
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            str = index == 0 ? name + '=' + element : '&' + name + '=' + element
        }
        return str;
    }
    // 获取当前登录用户的基本信息
    async getUserInfo() {
        let ret = await axios.get(`${this.BaseURL}userInfo`, {
            params: {
                userId: this.pageInfo.userId,
                departmentId: this.pageInfo.departmentId
            }
        })
        if (ret.status == 200) {
            return ret.data.data[0]
        }
    }
    // 通过供应商ID获取供应商详细信息
    async getUserInfoByUserId() {
        let ret = await axios.get(`${this.BaseURL}gysInfo`, {
            params: {
                userId: this.pageInfo.userId
            }
        })
        if (ret.status == 200) {
            return ret.data.data
        }
    }
}

export default ActionBase;