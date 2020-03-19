import ActionBase from "../actbase";
import axios from "axios";
import { message } from 'antd'
/* 
一年一评、奖惩记录
*/
class SupPa extends ActionBase {

    async newPa(body) {
        const { username,departmentId} = this.pageInfo
        //新增一年一评
         body['score_USERID'] = username
         body['gys_DEPT_ID'] = departmentId
         console.log(body)
        let ret = await axios.post(`${this.BaseURL}addGysYear`, body)
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error("新建失败")
        }

    }
    //系统自动一年一评
    async evaluateBySys(){
        let ret = await axios.get(`${this.BaseURL}evaluate`)
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //一年一评中心获取列表
    async getEvaluateByCenter(pageNum, rowNum,gysName=''){
        const { roleNameKey} = this.pageInfo
        let params={
            pageNum,
            rowNum,
            roleid:roleNameKey,
            gysName
        }
      let ret = await axios.get(`${this.BaseURL}getEvaluateByCenter`, {params})
      console.log(ret)
      if (ret.status == 200 && ret.data.code == 200) {
          return ret.data;
      } else {
          message.error(ret.data.message)
      }
        
    }

      //一年一评供应商获取列表
      async getEvaluateByGYS(pageNum, rowNum,gysName){
          const { departmentId} = this.pageInfo
        let params={
            pageNum,
            rowNum,
            deptid:departmentId,
            gysName
        }
      let ret = await axios.get(`${this.BaseURL}getGysYear`, {params})
      console.log(ret)
      if (ret.status == 200 && ret.data.code == 200) {
          return ret.data;
      } else {
          message.error(ret.data.message)
      }
        
    }
    //一年一评集团获取列表
    async getEvaluateByCom(pageNum, rowNum,gysName){
        let params={
            pageNum,
            rowNum,
            gysName
        }
      let ret = await axios.get(`${this.BaseURL}getEvaluateByCom`, {params})
      if (ret.status == 200 && ret.data.code == 200) {
          return ret.data;
      } else {
          message.error(ret.data.message)
      }
        
    }
        //编辑一年一评
        async editEvaluate(body) {
      
            let ret = await axios.post(`${this.BaseURL}updateEvaluate`,body)
            if (ret.status == 200 && ret.data.code == 200) {
                return ret.data;
            } else {
                message.error(ret.data.message)
            }
    
        }
       //获取一年一评详情
       async getDisciplinarysDetail(id) {
      
        let ret = await axios.get(`${this.BaseURL}detailEvaluateById?id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    async delEvaluateByCenter(ids){
        let ret = await axios.delete(`${this.BaseURL}delEvaluateByCenter?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async newDisciplinary(body) {
        const { username,departmentId} = this.pageInfo
        //新增奖惩记录
         body['create_USERID'] = username
         body['dept_ID'] = departmentId
        let ret = await axios.post(`${this.BaseURL}addRewards`, body)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
   //获取供应商奖惩记录
    async getDisciplinarys(pageNum, rowNum,options) {
        const { departmentId} = this.pageInfo
        let params={
            pageNum,
            rowNum,
            deptid:departmentId,
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}getRewards`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }

    //奖惩记录 获取展示台奖惩记录
    async getRewardsTop(pageNum, rowNum) {
        let params={
            pageNum,
            rowNum,
        }
        let ret = await axios.get(`${this.BaseURL}getRewardsTop`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    //删除奖惩
    async deleteDisciplinary(ids) {
        let ret = await axios.delete(`${this.BaseURL}delRewardsById?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    
    //获取审核人员角色
    async getApprovalRoles(){
        let ret = await axios.get(`${this.BaseURL}getRoleList`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }

    }
    //确定一年一评
    async confirmEvaluate(ids){
        const { userId } = this.pageInfo
        let params = {
            userid:userId,
            ids
        }
        let ret = await axios.get(`${this.BaseURL}confirmEvaluate`,{params})
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }

    }
    //否定一年一评
    async cancleEvaluate(ids){
        const { userId } = this.pageInfo
        let params = {
            userid:userId,
            ids
        }
        let ret = await axios.get(`${this.BaseURL}cancleEvaluate`,{params})
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }

    }
    //获取供应商清退记录
    async getCleanups(currPageNum, rowNumOfPage,options) {
        const { roleNameKey} = this.pageInfo
        let params={
            currPageNum,
            rowNumOfPage,
            currRoleId:roleNameKey,
            ...options
        }
        console.log(params)
        let ret = await axios.get(`${this.BaseURL}clearOfThreeYear/getClearList`, {params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    //新增供应商清退记录
    async newCleanups(body) {
        const { userId,departmentId} = this.pageInfo
       
         body['create_userid'] = userId
         body['gys_dept_id'] = departmentId
         
        let ret = await axios.post(`${this.BaseURL}clearOfThreeYear/addClearRecord`, body)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除清退
    async revocationClearRecord(id){
        let res = await axios.delete(`${this.BaseURL}clearOfThreeYear/revocationClearRecord?id=${id}`)
        console.log(res.data)
        if(res.status == 200 && res.data.code == 200){
            return res.data
        }else{
            message.error('删除失败')
        }
    }
    //编辑清退
    async editCleanups(body) {
        const { userId,departmentId} = this.pageInfo
       
         body['update_userid'] = userId
         
        let ret = await axios.put(`${this.BaseURL}clearOfThreeYear/editClearRecord`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getStatusDict() {
        // 获取状态字典
        let ret = await axios.get(this.BaseURL + 'clearOfThreeYear/getStatusDict')
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error('数据获取失败')
            return [];
        }
    }
    //撤销清退操作
    async removeCleanups(id) {
        const { userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}clearOfThreeYear/revocationClearRecord?id=${id}&userId=${userId}`)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
       //系统生成满足清退供应商记录
       async sysAddClearRecord() {
         
        let ret = await axios.post(`${this.BaseURL}clearOfThreeYear/sysAddClearRecord`)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //审核操作
    async confirmAndClear(id) {
        const { username,userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}clearOfThreeYear/confirmAndClear?id=${id}&userId=${userId}&userName=${username}`)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
   
}
const supPa = new SupPa();
export default supPa;