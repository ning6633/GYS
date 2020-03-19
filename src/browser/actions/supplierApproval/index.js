import ActionBase from "../actbase";
import axios from "axios";
import {
    message
} from "antd"
/* 
核对修改供应商及产品信息
*/
class SupplierApproval extends ActionBase {
    infoProcessDefId = "obj_42844be9e7d14a6b94753028c5dfc813"
    blackProcessDefId = "obj_bbf15734cb8c40a5a54bbc0d9427447f"
    constructor() {
        super()
        this.newInfoUrl = this.BaseURL.replace("/1.0/", "") + `/clientrest?op=generatorByPageId&isVerify=false&usage=add&pageId=gysupdmsgnew`
        this.editInfoUrl = this.BaseURL.replace("/1.0/", "") + `/clientrest?op=generatorByPageId&isVerify=false&usage=edit&pageId=gysupdmsgnew`
        this.checkInfolUrl = this.BaseURL.replace("/1.0/", "") + `/clientrest?op=generatorByPageId&isVerify=false&usage=view&pageId=gysupdmsgnew`
    }
    
    async getSupplierInfoList(pageNum = 1, rowNum = 5) {
        const processDefId = this.infoProcessDefId;
        // 获取供应商列表
        let ret = await axios.get(this.BaseURL + 'supplier/getgysxxlist', {
            params: {
                processDefId,
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error('数据获取失败')
            return [];
        }
    }
    //准入申请满意度反馈
    async markForSS(applyId, score) {
        let ret = await axios.put(`${this.BaseURL}zrApply/score?applyId=${applyId}&score=${score}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getSuppliercredentialList(body) {
        // 获取供应商资质列表
        let ret = await axios.get(`${this.BaseURL}querySupplierQualifiInfo`,{params:{...body}}
        )
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error('数据获取失败')
            return {};
        }
    }
    async getSupplierDetail(gysId) {
        // 通过供应商ID获取供应商详细信息
        let ret = await axios.get(this.BaseURL + 'getSupplierInfoById', {
            params: {
                supplierId: gysId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error('数据获取失败')
            return {};
        }
    }
    async getSupplierCredentialDetail(supplierId) {
        // 获取供应商资质信息列表
        let ret = await axios.get(this.BaseURL + 'getSuppQualifiListById', {
            params: {
                supplierId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error('数据获取失败')
            return {};
        }
    }
    async getSupplierCerDetail(supplierId, qualificationName, flag) {
        // 获取供应商资质详情
        let ret = await axios.get(this.BaseURL + 'getSuppQualifiInfo', {
            params: {
                supplierId,
                qualificationName,
                flag
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error('数据获取失败')
            return {};
        }
    }

    async getSupplierProcessFlowAds(processInstId) {
        // 获取供获取待处理的修改流程页面
        const sid = this.pageInfo.sid;
        let ret = await axios.get(this.BaseURL + 'supplier/gettaskinstid', {
            params: {
                sid,
                processInstId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
            // return "http://localhost/TEST_DEMO/a.html"
        } else {
            message.error(ret.data.message)
        }
    }
    async getnewprocessurl(processDefId) {
        // 获取供获取待处理的修改流程页面
        const {
            sid,
            userId
        } = this.pageInfo;
        let ret = await axios.get(this.BaseURL + 'supplier/getnewprocessurl', {
            params: {
                processDefId,
                sid,
                uid: userId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getcredentials(gysId) {
        // 获取供应商资质信息列表
        let ret = await axios.get(this.BaseURL + 'supplier/getcredentials', {
            params: {
                gysId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getgysupdall(pageNum, rowNum) {
        // 获取供应商资质信息列表
        const userId = this.pageInfo.userId;
        let ret = await axios.get(this.BaseURL + 'gysupdmsg/getgysupdall', {
            params: {
                userId,
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getCharacter() {
        // 获取角色
        let ret = await axios.get(this.BaseURL + 'gysupdmsg/getApproveRole')
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteSupplierInfo(id, info) {
        // 删除未提交的记录
        let ret = await axios.delete(this.BaseURL + 'gysupdmsg/deleteGysMessageUpdById?businessId=' + id)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success("删除成功")
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async searchSupplierInfo(info, pageNum, rowNum) {

        const userId = this.pageInfo.userId;
        let ret = await axios.get(`${this.BaseURL}gysupdmsg/getgysupdall?queryName=${info}&userId=${userId}&pageNum=${pageNum}&rowNum=${rowNum}`)
        // }
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async isEdit() {
        // 是否可以进行编辑
        const userId = this.pageInfo.userId;
        let ret = await axios.get(this.BaseURL + 'gysupdmsg/getcurruserprocessstatus', {
            params: {
                userId
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async dic(type) {
        // 获取产品类别
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${type}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async directHandleTask(id) {
        // 提交按钮
        let {userId} = this.pageInfo
        let res = await axios.get(`${this.BaseURL}gysupdmsg/directHandleTask?processDefinitionKey=gysupdmsg&businessInstId=${id}&userId=${userId}`)
        console.log(res)
        if(res.status == 200){
            return res.data
        }
    }
}
const supplierApproval = new SupplierApproval();
export default supplierApproval;