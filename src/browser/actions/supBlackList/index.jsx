import ActionBase from "../actbase";
import axios from "axios";
import { message } from 'antd'
/* 
专家管理
*/
class SupBlackList extends ActionBase {

    //获取注册供应商
    constructor(){
        super()
        this.newInfoUrl= this.BaseURL.replace("/1.0/","")+'/gysblacklist/gysblacklist.html?processInstanceId=&businessid=984700239917142019&processDefinitionKey=gysblacklist'
        this.approvalInfoUrl= this.BaseURL.replace("/1.0/","")+'/gysblacklist/gysblacklist.html?'
    }
    async getgysmessagelist(pageNum, rowNum, options) {
        let params = {
            pageNum,
            rowNum,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessagelist`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    async getDic(lookUpId) {
        //获取黑名单类别字典
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${lookUpId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    async getSupplierBlackList(pageNum, rowNum,name = '') {
        const processDefId = this.blackProcessDefId;
        // 获取供应商黑名单列表
        let {userId}=this.pageInfo
        let ret = await axios.get(`${this.BaseURL}gysblacklist/getgysblacklistall?queryName=${name}&userId=${userId}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error('数据获取失败')
            return {};
        }
    }
    async insertGysBlackList(body) {
        //新增供应商
        let {userId , departmentId} = this.pageInfo
        body.status = '';
        body.statusV = '';
        let ret = await axios.post(`${this.BaseURL}gysblacklist/insertGysBlackList`, {
            ...body,
            create_user:userId,
            org_id:departmentId
        })
        // console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    async deleteGysBlackList(id) {
        //更具ID删除供应商
        let ret = await axios.delete(`${this.BaseURL}gysblacklist/deleteBlackListById?businessId=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    async getApproveRole() {
        //执行判断
        let ret = await axios.get(`${this.BaseURL}gysblacklist/getApproveRole`)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.message)
        }

    }
    async updateGysBlackList(body) {
        //修改供应商
        let {userId , departmentId} = this.pageInfo
        body.status = '';
        body.statusV = '';
        let ret = await axios.put(`${this.BaseURL}gysblacklist/updateGysBlackList`,{
            ...body,
            create_user:userId,
            org_id:departmentId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
}
const supBlackList = new SupBlackList();
export default supBlackList;