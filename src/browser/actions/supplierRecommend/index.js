import ActionBase from "../actbase";
import axios from "axios";
import { message} from 'antd'
/* 
核对修改供应商及产品信息
*/
class SupplierRecommend extends ActionBase {
    constructor(){
        super()
        this.newRecommendUrl=this.BaseURL.replace("/1.0/","") +  `/clientrest?op=generatorByPageId&isVerify=false&usage=add&pageId=gysrecommendnew&role=init`
        this.jumpProcessUrl =this.BaseURL.replace("/1.0/","") +  `/gysrecommend/gysrecommend.html?processInstanceId=&processDefinitionKey=gysrecommend&businessid=984700239917142019`
        this.ApprovalUrl = this.BaseURL.replace("/1.0/","") + '/clientrest?op=generatorByPageId&isVerify=false&pageId=gysrecommendnew'
    }

     //直接指定办理人
     async directHandleTask(businessInstId,processDefinitionKey){
        let {userId} = this.pageInfo
        let params  ={
            businessInstId,
            processDefinitionKey,
            userId
        }
        console.log(params)
        let ret = await axios.get(`${this.BaseURL}gysrecommend/directHandleTask?`,{
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getSupplierProductinfoList(pageNum, rowNum) {
        const departmentId = this.pageInfo.departmentId;
        // 获取供应商列表
        let ret = await axios.get(`${this.BaseURL}gysProducts`, {
            params: {
                departmentId,
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
    async modifySupplierProductinfo(gysid, productid, gysProducts) {
        const departmentId = this.pageInfo.departmentId;
       
        let ret = await axios.put(`${this.BaseURL}gysProducts?gysid=${gysid}&productid=${productid}`, gysProducts)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    
    //新增供应商资质申请
    async newZzpjApply(body){
        const { username} = this.pageInfo
        body['createuser'] = username
        let ret = await axios.post(`${this.BaseURL}gys/apply`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取推荐申请
    async getRecommendApply(pageNum=1, rowNum=15,options){
        const { userId} = this.pageInfo
        let params = {
            pageNum,
            rowNum,
            userId,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}tjRecommendAll`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除推荐申请
        async deleteApply(recommendId){
            const { userId} = this.pageInfo
            let params = {
                recommendId,
                userId,
            }
            let ret = await axios.delete(`${this.BaseURL}tjRecommend`, {params})
            if (ret.status == 200 && ret.data.code == 200) {
                return ret.data;
            } else {
                message.error(ret.data.message)
            }
        }
       //获取推荐申请(评价中心)
       async getRecommendApplyByPJZX(pageNum=1, rowNum=15,options){
        // const { userId} = this.pageInfo
        const userId = '39312145'
        let params = {
            pageNum,
            rowNum,
            userId,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}tjRecommend4PJZX`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
}
const supplierRecommend = new SupplierRecommend();
export default supplierRecommend;