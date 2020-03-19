import ActionBase from "../actbase";
import axios from "axios";
import {
    message
} from 'antd'
//供应商年度审核action
class SupYearAudit extends ActionBase {
   constructor(props){
       super(props)
       this.roleNameInfo = {
             gys:'wbgys2053'
       }
   }
    async getSupplierList(departmentId = '5bc3a2dc-3bd2-4376-bcc3-5612e28e55fe') {
        // 获取供应商列表
        let ret = await axios.get(this.BaseURL + 'gysInfos', {
            params: {
                departmentId: departmentId
            }
        })
    }
    async getAnnualExamination(pageNum, rowNum, options) {
        let params = {
            pageNum,
            rowNum,
            ...options
        }
        // 获取复审计划列表
        let ret = await axios.get(this.BaseURL + 'GysAnnualaudit/getAnnuaPlan', {
            params
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
    //通过供应商获取计划列表
    async getAnnualExaminationByGYS(pageNum, rowNum, options) {
        let params = {
            pageNum,
            rowNum,
            ...options
        }
        console.log(params)
        let ret = await axios.get(this.BaseURL + 'GysAnnualaudit/getannualauditPlanbygysID', {
            params
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
      //通过供应商,计划获取实施记录详情
      async getauditRecordByPlanidAndGysid(planID, gysID) {
        let params = {
            planID,
            gysID,
            
        }
        let ret = await axios.get(this.BaseURL + 'GysAnnualaudit/getannualauditRecordbyplanidandgysid', {
            params
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
      //根据ID查询证书详情
      async getcertificatesbyID(certificatesid) {
      
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getcertificatesbyID?certificatesid=${certificatesid}`)
        if (ret.status == 200) {
            return ret.data
        }
    }
    
      //供应商为审核记录打分
   async markSs(params){
       const {satisfaction ,gysid,annualauditrecordid} = params
    let ret = await axios.put(this.BaseURL + `GysAnnualaudit/annualauditrecordsatisfaction?satisfaction=${satisfaction}&gysid=${gysid}&annualauditrecordid=${annualauditrecordid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
}
    //判断该用户是否是供应商用户
   async comfgysInfo(){
        const { userId} =this.pageInfo
        let ret = await axios.get(this.BaseURL + `comfgysInfo?userId=${userId}`)
            if (ret.status == 200 && ret.data.code == 200) {
                return ret.data;
            } else {
                message.error(ret.data.message)
            }
   }
    //新增复审计划
    async newAnnualExamination(body) {
        let ret = await axios.post(this.BaseURL + 'GysAnnualaudit/insertAnnualauditPlan',
            body
        )
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //为复审计划添加供应商
    async addGYStoauditPlan(annuaplanid, annualauditplanrellist) {
        let ret = await axios.post(this.BaseURL + `GysAnnualaudit/insertAnnualauditPlanGys?annuaplanid=${annuaplanid}`, annualauditplanrellist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //为复审计划添加专家
    async addSpecialToSs(annualauditrecordID, annualauditSpecirellist) {
        let ret = await axios.post(this.BaseURL + `GysAnnualaudit/insertannualauditspecirel?annualauditrecordID=${annualauditrecordID}`, annualauditSpecirellist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //为复审计划添加要求
    async addBZYQToSs(annualauditrecordID, annualauditRequirementslist) {
        let ret = await axios.post(this.BaseURL + `GysAnnualaudit/insertRequirements?annualauditID=${annualauditrecordID}`, annualauditRequirementslist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //为复审实施记录添加供应商
    async addGYSToSs(annualauditID, anualauditRellist) {
        let ret = await axios.post(this.BaseURL + `GysAnnualaudit/insertGysRel?annualauditID=${annualauditID}`, anualauditRellist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除实施记录

    async deleteAnnualaudit(annualauditrecordID) {
        let ret = await axios.delete(this.BaseURL + `GysAnnualaudit/deleteAnnualaudit?annualauditrecordID=${annualauditrecordID}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除复审计划
    async deleteAnnualExamination(annualauditplanID) {
        let ret = await axios.delete(this.BaseURL + `GysAnnualaudit/deleteAnnualauditPlan?annualauditplanID=${annualauditplanID}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除实施记录
    async deleteAnnualaudit(annualauditrecordID) {
        let ret = await axios.delete(this.BaseURL + `GysAnnualaudit/deleteAnnualaudit?annualauditrecordID=${annualauditrecordID}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
     //查询复审实施记录下的供应商
     async getGYSBySs(pageNum,rowNum,annualRecordid) {
         let params = {
            pageNum,
            rowNum,
            annualRecordid
         }
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getAllAnnualauditRecordGys`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
      //查询复审实施记录下的专家
      async loadSpeciallist(pageNum,rowNum,zjName,AnnualauditID) {
        let params = {
           pageNum,
           rowNum,
           zjName,
           AnnualauditID
        }
       let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getannualauditspecialist`,{params})
       if (ret.status == 200 && ret.data.code == 200) {
           return ret.data;
       } else {
           message.error(ret.data.message)
       }
   }
    //查询复审实施记录详情
    async getSsDetail(AnnualauditID) {
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getAnnualauditbyAnnualauditID?AnnualauditID=${AnnualauditID}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //查询复审计划详情
    async getAnnualExaminationDetail(annuaplanid) {
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getAnnualauditPlanbyID?annuaplanid=${annuaplanid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取复审计划下面的供应商
    async getGYSByReviewPlan(pageNum, rowNum, annuaplanid) {
        let params = {
            pageNum,
            rowNum,
            annuaplanid
        }
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getAnnualauditPlanGys`, {
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }





    //-------------------------年度复审证书----------------------
    async deletecertificates(id) {
        // 删除复审证书
        let {
            departmentId
        } = this.pageInfo
        let ret = await axios.delete(`${this.BaseURL}GysAnnualaudit/deletecertificates?certificateID=${id}`)
        if (ret.status == 200) {
            return ret.data
        }
    }
    async updatecertificate(body) {
        // 修改复审证书
        let ret = await axios.put(`${this.BaseURL}GysAnnualaudit/updatecertificate`, {
            ...body
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
    async insertcertificate(body) {
        // 添加复审证书
        let {
            departmentId
        } = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}GysAnnualaudit/insertcertificate`, {

            ...body,
            // belonggysid: departmentId,
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
    async getcertificatestype() {
        // 获取年度审核证书类型
        let ret = await axios.get(`${this.BaseURL}GysAnnualaudit/getcertificatestype`)
        if (ret.status == 200) {
            return ret.data
        }
    }
    async getcertificates(body) {
        // 获取年度审核证书列表
        let ret = await axios.get(`${this.BaseURL}GysAnnualaudit/getcertificatesbyname`, {
            params: body
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
    //获取复审证书
    async getReviewCertificates(pageNum, rowNum, certificatesname) {
        let params = {
            pageNum,
            rowNum,
            certificatesname
        }
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getcertificatesbyname`, {
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取复审专家
    async getAuditSpecial(options) {
        let params = {
            ...options
        }
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getannualauditspecialist`, {
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //获取年度复审实施记录
    async getAnnualaudit(pageNum, rowNum, fsName) {
        let params = {
            pageNum,
            rowNum,
            fsName
        }
        let ret = await axios.get(this.BaseURL + `GysAnnualaudit/getAnnualaudit`, {
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //新增年度复审实施记录
    async newAnnualaudit(annualauditplanid, body) {
        const {
            userId
        } = this.pageInfo
        console.log(annualauditplanid,userId, body)
        let ret = await axios.post(this.BaseURL + `GysAnnualaudit/insertAnnualaudit?annualauditplanid=${annualauditplanid}&userId=${userId}`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

}
const supYearAudit = new SupYearAudit();
export default supYearAudit;