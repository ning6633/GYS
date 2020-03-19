import ActionBase from "../actbase";
import axios from "axios";
import { message} from 'antd'
/* 
核对修改供应商及产品信息
*/
class SupplierEvalution extends ActionBase {
    constructor(){
        super()
        //this.ZJSQUrl = `http://172.29.72.2:8179/gys/gysappraise/gysappraise.html?processInstanceId=&processDefinitionKey=gysappraise&businessid=984700239917142019`
        this.ZJSQUrl = `${this.BaseURL.replace("/1.0/","")}/gysappraise/gysappraise.html?processInstanceId=&processDefinitionKey=gysappraisenew&businessid=984700239917142019`
        //this.ApprovalUrl = 'http://10.0.39.49:8179/gys/clientrest?op=generatorByPageId&isVerify=false&usage=view&pageId=gysrecommend'
        this.DefinitionKey = 'gysappraisenew'
      
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
        let ret = await axios.get(`${this.BaseURL}gysappraise/directHandleTask?`,{
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
    async gysInfoAll(pageNum, rowNum,gysName) {
        // 获取供应商列表(推荐)
        let ret = await axios.get(`${this.BaseURL}gysInfoAll`, {
            params: {
                gysName,
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
    async getDic(lookUpId) {
        // 获取供应商证书类型
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${lookUpId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
    //给实施记录添加标准供应商
     async addBZYQToSs(zzpjdoquaevalid,zzpjStandards){
        let ret = await axios.post(`${this.BaseURL}zzpj/standard?zzpjdoquaevalid=${zzpjdoquaevalid}`,zzpjStandards)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
     }
     //根据推荐码获取供应商信息
     async tjRecommendInfo(referralCode){
        let ret = await axios.get(`${this.BaseURL}gys/apply/tjRecommendInfo?referralCode=${referralCode}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
     }
    //通过供应商获取培训证书
    async getTrainCertificatesByGys(pageNum,rowNum,options) {
       let params = {
        pageNum,
        rowNum,
        ...options
       }
        let ret = await axios.get(`${this.BaseURL}gysTrainShuInfosArgs`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
      //获取组织信息
      async getUserInfo() {
          const {departmentId,userId} = this.pageInfo
        let params = {
            departmentId,
            userId,
        }
         let ret = await axios.get(`${this.BaseURL}userInfo`,{params})
         if (ret.status == 200 && ret.data.code == 200) {
             return ret.data;
             
         } else {
             message.error(ret.data.message)
         }
     }
    //新增供应商资质申请
    async newZzpjApply(body){
        const {userId} = this.pageInfo
        body['createuser'] = userId
        let ret = await axios.post(`${this.BaseURL}gys/apply`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    
    }
    
    //给实施记录添加供应商
    async addGYSToSs(zzpjdoquaevalid,zzpjDoQuaEval_ZzpjApplys){
       
        let ret = await axios.post(`${this.BaseURL}zzpjDoQuaEval_Gys?zzpjdoquaevalid=${zzpjdoquaevalid}`,zzpjDoQuaEval_ZzpjApplys)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //给实施记录添加专家
   async addSpecialToSs(zzpjdoquaevalid,zzpjSpecialistIds){
    let ret = await axios.post(`${this.BaseURL}zzpjSpecialist?zzpjdoquaevalid=${zzpjdoquaevalid}&zzpjSpecialistIds=${zzpjSpecialistIds}`)
    console.log(ret)
   if (ret.status == 200 && ret.data.code == 200) {
       return ret.data;
   } else {
       message.error(ret.data.message)
   }
   }

    //供应商获取供应商信息
    async getGYSInfo(){
        const {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}zrApply/gysInfo?userId=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //供应商获取供应商信息(推荐)
    async getGYSInfoById(){
        const {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}comfgysInfo?userId=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //下拉框取值
    async getSelectOptions(){
        let ret = await axios.get(`${this.BaseURL}productComboBox`)
        if (ret.status == 200 && ret.data.code == 200) {
           return ret.data
        } else {
            message.error(ret.data.message)
        }
    }
    //获取资质申请
    async getZzpjApply(pageNum=1, rowNum=15,statuses,options){
        const {userId} = this.pageInfo
        let params = {
            pageNum,
            rowNum,
            userId,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}gys/apply?statuses=${statuses}`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取资质评价申请（供应商）
    async getZzpjApplyDetail(applyId){
        let params = {
            applyId
        }
        let ret = await axios.get(`${this.BaseURL}gys/apply/detail`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

      //获取资质评价实施申请详情（供应商）
      async getZzpjssApply(applyid){
        let params = {
            applyid
        }
        let ret = await axios.get(`${this.BaseURL}evaluateApply`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除资质申请
    async deleteApply(ids){
        
        let ret = await axios.delete(`${this.BaseURL}gys/apply?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //更改申请状态
    async editApplyStatus(ids){
        const {userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}gys/apply/apply?ids=${ids}&userId=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //为资质实施记录打分
    async markSsju(id,evaluateSatisfaction){
        const {userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}gys/apply/evaluation?id=${id}&evaluateSatisfaction=${evaluateSatisfaction}&userId=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //获取待审批的资质申请（评价中心）
    async getZzpjApplyByManager(){
        let params = {
            pageNum,
            rowNum,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}gys/apply`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除资质申请
    async deleteZzApply(ids){
        let ret = await axios.delete(`${this.BaseURL}gys/apply?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
   
    //新建资质评价实施
    async newZzpjDoQuaEval(body){
        const { userId} = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}zzpjDoQuaEval?userId=${userId}`,body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取评价申请(评价中心)
    async getPJSSList(pageNum=1,rowNum=15, options){
        const { userId} = this.pageInfo
        let params = {
            pageNum,
            rowNum,
            userId,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}gys/apply/center`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取资质评价实施列表
    async getZzpjDoQuaEval(pageNum,rowNum,options){
        const { userId} = this.pageInfo
           let params = {
            pageNum,
            rowNum,
            userId,
            ...options
           }
           let ret = await axios.get(`${this.BaseURL}zzpjDoQuaEvals`, {params})
       
           if (ret.status == 200 && ret.data.code == 200) {
               return ret.data;
           } else {
               message.error(ret.data.message)
           }
    }

    //获取资质评价实施详情
    async getZJSSDeatail(zzpjdoquaevalid){
        console.log(zzpjdoquaevalid)
        let params = {
            zzpjdoquaevalid
        }
        let ret = await axios.get(`${this.BaseURL}zzpjDoQuaEval`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
   //获取注册供应商
    async getgysmessagelist(pageNum,rowNum,options){
        let params = {
            pageNum,
            rowNum,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessagelist`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
      //删除资质评价实施
      async deleteZJSS(zzpjdoquaevalids){
        let ret = await axios.delete(`${this.BaseURL}zzpjDoQuaEvals?zzpjdoquaevalids=${zzpjdoquaevalids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //新建资质评价证书
    async newZzpjCertificate(body){
        const { userId} = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}zzpjCertificate?userId=${userId}`,body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //查询资质证书列表

    async getZzpjCertificate(pageNum,rowNum){
     
        let params = {
            pageNum,
            rowNum,
        }
        let ret = await axios.get(`${this.BaseURL}zzpjCertificates?`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //查询资质证书列表(所有)
    async getZzpjCertificateAll(pageNum,rowNum,options){
        let params = {
            pageNum,
            rowNum,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}zzpjCertificates?`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //查询资质证书详情
    async getZzpjCertificateDetail(certificateid){
        let ret = await axios.get(`${this.BaseURL}zzpjCertificate?certificateid=${certificateid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除资质证书
    async deleteZzpjCertificate(ids){
        let ret = await axios.delete(`${this.BaseURL}zzpjCertificates?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //资质评价申请
    async ZzpjSatisfaction(id,satisfaction){
        let ret = await axios.put(`${this.BaseURL}satisfaction?satisfaction=${satisfaction}&id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
}
const supplierEvalution = new SupplierEvalution();
export default supplierEvalution;