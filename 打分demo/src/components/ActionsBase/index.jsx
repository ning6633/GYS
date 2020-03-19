import axios from "axios";
import { Component } from "react";

const BaseUrl = "/api";

class ActionBase {

    constructor() {
        this.initAxios();
    }

    initAxios() {
        // 请求前拦截
        axios.interceptors.request.use(
            config => {
                return config;
            },
            err => {
                console.log("请求超时");
                return Promise.reject(err);
            }
        );

        // 返回后拦截
        axios.interceptors.response.use(
            data => {
                return data;
            },
            err => {
                if (err.response.status === 504 || err.response.status === 404) {
                    console.log("服务器被吃了⊙﹏⊙∥");
                } else if (err.response.status === 401) {
                    console.log("登录信息失效⊙﹏⊙∥");
                } else if (err.response.status === 500) {
                    console.log("服务器开小差了⊙﹏⊙∥");
                }
                return Promise.reject(err);
            }
        );
    }

}
export default ActionBase


