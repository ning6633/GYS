import ActionBase from "../actbase";
import axios from "axios";
import { message } from 'antd'
/* 
合同管理
*/
class SupContract extends ActionBase {
    async newContract(body) {
        //新增合同
        let {userId ,username} = this.pageInfo
        body['createUserId'] = userId
        body['createUserName'] = username
        let ret = await axios.post(`${this.BaseURL}contractInfos`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async createHtFile(body) {
        //新增合同附件
        let ret = await axios.post(`${this.BaseURL}addContractfjInfos`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async contractfjyqInfos(body) {
        //新增合同要求
        let ret = await axios.post(`${this.BaseURL}contractfjyqInfos?htid=${body.htid}`, body.htxxyqlist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async insertContractQualityinfo(body) {
        //新增质量要求
        let ret = await axios.post(`${this.BaseURL}insertContractQualityinfo?htid=${body.htid}`, body.contractQualitylist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async insertContractDefectinfo(body) {
        //新增不合格记录
        let ret = await axios.post(`${this.BaseURL}insertContractDefectinfo?htid=${body.htid}`, body.contractDefectlist)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getContractInfosYQ( htID ,pageNum, rowNum,) {
        // 根据ID 获取合同要求
        let ret = await axios.get(`${this.BaseURL}getContractInfosYQ?htID=${htID}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            // message.error(ret.data.message)
            return []
        }
    }
    async getContractList(pageNum, rowNum,gysCode, htnumber ) {
        // 查询合同列表
        // let gysCode = await this.getGysCodeByUserId()
        console.log(gysCode, htnumber)
        let {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getContractInfosByCode`,{
            params:{
                gysCode,pageNum,rowNum,htnumber
            }
            })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async contractyqInfos(id) {
        // 删除合同附件
        let ret = await axios.delete(`${this.BaseURL}contractyqInfos?htfjId=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteHtyq(htyqid) {
        // 删除合同要求
        let ret = await axios.delete(`${this.BaseURL}deleteHtyq?htyqid=${htyqid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteContract(id) {
        // 甲方删除合同
        let {userId} = this.pageInfo
        let ret = await axios.delete(`${this.BaseURL}deleteHtxx?htId=${id}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async closeContract(id) {
        // 甲方关闭合同
        let {userId,username} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}closeContractInfos?htID=${id}&username=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async delayContract(id) {
        // 甲方延期合同
        let {userId,username} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}putoffContractInfos?htID=${id}&username=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getFJbyId(id,pageNum,rowNum) {
        // 根据合同ID获取合同附件
        let {userId,username} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getContractInfosFJ?htID=${id}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getQualitybyId(id,pageNum,rowNum) {
        //GET /1.0/getContractZLWTInfos根据合同ID获取合同质量要求记录
        let ret = await axios.get(`${this.BaseURL}getContractZLWTInfos?htID=${id}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getDefectbyId(id,pageNum,rowNum) {
        //GET /1.0/getContractDefectInfos根据合同ID查询不合格品的记录
        let ret = await axios.get(`${this.BaseURL}getContractDefectInfos?htID=${id}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createQualityProblem(body) {
        //新增质量问题记录
        let ret = await axios.post(`${this.BaseURL}insertContractQualityinfo`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async createdefectProblem(body) {
        //新增不合格品记录
        let ret = await axios.post(`${this.BaseURL}insertContractDefectinfo`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteQuality(ids) {
        let ret = await axios.delete(`${this.BaseURL}deleteContractQualityinfo?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteDefects(ids) {
        let ret = await axios.delete(`${this.BaseURL}deleteContractDefectinfo?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    // 通过供应商用户userid获取供应商详细信息——社会信用代码
    //  getGysCodeByUserId() {
    //     let {userId} = this.pageInfo;
    //     let gyscode;
    //     if(userId == "513399bb35de000"){
    //         gyscode = "91110000100009176ACDG"
    //     }else if(userId == "53356360cdde000"){
    //         gyscode = "966666666666666666"
    //     }
    //     return gyscode
    // }
    // 根据供应商ID获取供应商code
    async getstandardgysbyid(gysid){
        let res = await axios.get(`${this.BaseURL}getstandardgysbyid?gysid=${gysid}`)
        if(res.status == 200){
            return res.data
        }else{
            message.error("用户识别失败")
            return {}
        }
    }
    // 获取供应商info
    async getUserInfoByUserId(){
        let {userId} = this.pageInfo
        let res = await axios.get(`${this.BaseURL}comfgysInfo?userId=${userId}`)
        if(res.status == 200){
            return res.data
        }else{
            message.error("用户识别失败")
            return {}
        }
    }
    //修改合同基本信息
    async updateHtinfo(body){
        console.log(body)
        let ret = await axios.put(`${this.BaseURL}updateContractInfos`,body)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //甲方提交合同
    async submitContract(id){
        let {userId,username} = this.pageInfo;
        let ret = await axios.put(`${this.BaseURL}JFsubmitContractInfos?htID=${id}&username=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //乙方提交合同
    async submitContractYF(id){
        console.log(id)
        let {userId,username} = this.pageInfo;
        let ret = await axios.put(`${this.BaseURL}YFsubmitContractInfos?htID=${id}&username=${username}`)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //根据合同ID查询履约评价
    
    async getContractPerformanceBycontractId(id){
        let {userId,username} = this.pageInfo;
        let ret = await axios.get(`${this.BaseURL}contract/getContractPerformanceBycontractId?contractId=${id}`)
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //添加履约评价
    async performance(body){
        console.log(body)
        let ret = await axios.post(`${this.BaseURL}contract/performance`,body)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
}
const supContract = new SupContract();
export default supContract;