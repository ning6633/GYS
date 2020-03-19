import ActionBase from "../actbase";
import axios from "axios";
import { message} from 'antd'
/* 
准入认定
*/
class SupplierVerify extends ActionBase {
    constructor(){
        super()
      this.jumpProcessUrl =this.BaseURL.replace("/1.0/","") +  `/gyscognizance/gyscognizance.html?processInstanceId=&processDefinitionKey=gyscognizancenew&businessid=984700239917142019`
        this.ApprovalUrl = `${this.BaseURL.replace("/1.0/","")}/gyscognizance/gyscognizance.html?processDefinitionKey=gyscognizancenew&businessid=984700239917142019`
        this.DefinitionKey = 'gyscognizancenew'
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
            let ret = await axios.get(`${this.BaseURL}gyscognizance/directHandleTask?`,{
                params
            })
            if (ret.status == 200 && ret.data.code == 200) {
                return ret.data;
            } else {
                message.error(ret.data.message)
            }
        }
    async getsupplierAcceptedList(pageNum, rowNum,queryName='') {
        const  userId = this.pageInfo.userId;
        // 获取供应商准入申请
        let ret = await axios.get(`${this.BaseURL}zrApply?userId=${userId}`, {
            params: {
                // userId,
                pageNum,
                rowNum,
                queryName
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //评价中心获取准入认定申请
    async getsupplierAcceptedListByManager(pageNum, rowNum,queryName='') {
        const  userId = this.pageInfo.userId;
        // 获取供应商准入申请
        let ret = await axios.get(`${this.BaseURL}zrApply4PJZX?userId=${userId}`, {
            params: {
                // userId,
                pageNum,
                rowNum,
                queryName
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }

    async getsupplierAcceptedCerList(pageNum, rowNum) {
        const userId = this.pageInfo.userId;
        // 获取供应商准入证书
        let ret = await axios.get(`${this.BaseURL}zrCertificate`, {
            params: {
                userId,
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
    
      //查询准入证书列表

      async getZrCertificate(pageNum,rowNum){
        const { userId} = this.pageInfo
        let params = {
            pageNum,
            rowNum,
            userId
        }
        let ret = await axios.get(`${this.BaseURL}zrCertificate?`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getDic(lookUpId) {
        // 获取供应商准入证书类型
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${lookUpId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
    async supplierNewcer(body) {
        const userId = this.pageInfo.userId;
        // const departmentId = this.pageInfo.departmentId;
        // 新建准入证书
        let ret = await axios.post(this.BaseURL + 'zrCertificate?userId=' + userId, {
            ...body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteCer(ids) {
        const userId = this.pageInfo.userId;
        // const departmentId = this.pageInfo.departmentId;
        // 删除准入证书
        let ret = await axios.delete(this.BaseURL + 'zrCertificate?certIds='+ids+'&userId=' + userId)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success("删除成功")
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteSupplierZr(ids) {
        const userId = this.pageInfo.userId;
        // const departmentId = this.pageInfo.departmentId;
        // 删除准入证书
        let ret = await axios.delete(this.BaseURL + 'zrApply?applyIds='+ids+'&userId=' + userId)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success("删除成功")
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteZRRD(ids) {
        const userId = this.pageInfo.userId;
        // const departmentId = this.pageInfo.departmentId;
        // 删除准入申请
        console.log(ids)
        let ret = await axios.delete(this.BaseURL + 'zrApply?applyIds='+ids+'&userId=' + userId)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success("删除成功")
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deletePJSS(ids) {
        const userId = this.pageInfo.userId;
        // const departmentId = this.pageInfo.departmentId;
        // 删除实施记录
        console.log(ids)
        let ret = await axios.delete(this.BaseURL + 'zrImplement?implementIds='+ids+'&userId=' + userId)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success("删除成功")
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getPjrdDoQuaEval(pageNum, rowNum) {
        const userId = this.pageInfo.userId;

        // 评价中心获取认定实施记录
        let ret = await axios.get(`${this.BaseURL}zrImplement/pjzx?userId=${userId}`, {
            params: {
                // userId,
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
    async getZRSSDetail(applyId) {
        const userId = this.pageInfo.userId;

        // 供应商查看评价认定实施记录详情
        let ret = await axios.get(`${this.BaseURL}zrImplementDetail`, {
            params: {
                applyId,
                userId
                
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
    async getPJSSDetail(implementId) {
        const userId = this.pageInfo.userId;
        // 评价中心查看评价认定实施记录详情主表
        let ret = await axios.get(`${this.BaseURL}zrImplementDetail4PJZX/main`, {
            params: {
                implementId,
                userId,
                
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getPJSSBzyq(implementId,pageNum, rowNum) {
        const userId = this.pageInfo.userId;
        // 评价中心查看评价认定实施记录标准要求
        let ret = await axios.get(`${this.BaseURL}zrImplementDetail4PJZX/need`, {
            params: {
                implementId,
                userId,
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getPJSSPjzj(implementId,pageNum, rowNum) {
        const userId = this.pageInfo.userId;
        // 评价中心查看评价认定实施记录标准要求
        let ret = await axios.get(`${this.BaseURL}zrImplementDetail4PJZX/zjs`, {
            params: {
                implementId,
                userId,
                pageNum,
                rowNum
            }
        })
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getPJSSAsup(implementId,pageNum, rowNum) {
        const userId = this.pageInfo.userId;
        // 评价中心查看评价认定实施记录中通过的供应商
        let ret = await axios.get(`${this.BaseURL}zrImplementDetail4PJZX/pass`, {
            params: {
                implementId,
                userId,
                pageNum,
                rowNum
            }
        })
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getPJSSUNsup(implementId,pageNum, rowNum) {
        const userId = this.pageInfo.userId;
        // 评价中心查看评价认定实施记录中未通过的供应商
        let ret = await axios.get(`${this.BaseURL}zrImplementDetail4PJZX/noPass`, {
            params: {
                implementId,
                userId,
                pageNum,
                rowNum
            }
        })
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取新建评价认定时选择供应商
    async getPjrdzrApply4Pass(pageNum, rowNum) {
        const userId = this.pageInfo.userId;

        // 评价中心获取认定实施记录
        let ret = await axios.get(`${this.BaseURL}zrApply4Pass`, {
            params: {
                userId,
                pageNum,
                rowNum
            }
        })
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
            
        } else {
            message.error(ret.data.message)
        }
    }
    //新建准入申请
    async newZrrdApply(body){
        const { userId} = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}zrApply?userId=${userId}`,body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
     //获取准入申请详情
     async getZrApplyDetail(applyId){
        let ret = await axios.get(`${this.BaseURL}zrApplyDetail?applyId=${applyId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

   
    //获取资质证书
    async getZzCerts(pageNum,rowNum,gysId){
        let ret = await axios.get(`${this.BaseURL}zrApply/zzCerts?gysId=${gysId}`,{
            params:{
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取资质证书
     
    //新建评价认定实施
    async newPjrdDoQuaEval(body){
        const { userId} = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}zrImplement?userId=${userId}`,body)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async modifySupplierProductinfo(gysid, productid, gysProducts) {
        const departmentId = this.pageInfo.departmentId;
        // 核对修改供应商及产品信息
        let ret = await axios.put(`${this.BaseURL}gysProducts?gysid=${gysid}&productid=${productid}`, gysProducts)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }

}
const supplierVerify = new SupplierVerify();
export default supplierVerify;