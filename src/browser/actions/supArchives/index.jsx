import ActionBase from "../actbase";
import axios from "axios";
import { message } from 'antd'
/* 
档案列表
*/
class SupArchives extends ActionBase {

    //获取档案列表
    async getSupArchivesInfo(pageNum, rowNum, name = '') {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getstandardslist?gysName=${name}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //根据ID获取供应商信息
    async getSupArchivesInfoOne(providerid) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessagefilebygysid?gysId=${providerid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    
    //法人证书
    async getSupCorporate(data) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessagelegalpersonsgysid`,{
            params:{
                providerId:data.providerid,
                pageNum:data.getSupCorporatePageNum,
                rowNum:data.rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //资质信息
    async getQualificationData(data) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessageQualificationgysid`,{
            params:{
                providerId:data.providerid,
                pageNum:data.getQualificationDataPageNum,
                rowNum:data.rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //培训信息
    async getQEApplygysid(data) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessageQEApplygysid`,{
            params:{
                providerId:data.providerid,
                pageNum:data.getQEApplygysidPageNum,
                rowNum:data.rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //认定信息
    async getImplementList(data) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessageImplementListgysid`,{
            params:{
                providerId:data.providerid,
                pageNum:data.getImplementListPageNum,
                rowNum:data.rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //绩效评价
    async getEvaluate(data, pageNum = 1, rowNum =20) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessageEvaluategysid`,{
            params:{
                providerId:data.providerid,
                pageNum:data.getEvaluatePageNum,
                rowNum:data.rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //惩奖记录
    async getPunishmentsList(data, pageNum = 1, rowNum =20) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessageGysEvaluateRecordListgysid?providerId=${data.providerid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    // 年度审核
    async getEvaluateRecordList(data) {
        let ret = await axios.get(`${this.BaseURL}gysmessage/getgysmessageannualauditgysid`,{
            params:{
                providerId:data.providerid,
                pageNum:data.getEvaluateRecordListPageNum,
                rowNum:data.rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

}
const supArchives = new SupArchives();
export default supArchives;