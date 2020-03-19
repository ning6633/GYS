import ActionBase from "../actbase";
import axios from "axios";
import { message } from 'antd'
/* 
供应商培训
*/
class SupplierTrain extends ActionBase {
    constructor() {
        super();
        this.processUrl = `${this.BaseURL.replace("/1.0/", "")}/gystrainapply/gystrainapply.html?processInstanceId=&processDefinitionKey=gystraining`
        this.approveUrl = `${this.BaseURL.replace("/1.0/", "")}/gystrainapply/gystrainapply.html?processDefinitionKey=gystraining`
        this.approvePlanUrl = `${this.BaseURL.replace("/1.0/", "")}/gysnewtrainplan/gysnewtrainplan.html?processDefinitionKey=gysplanappraisenew`
        this.PlanDefinitionKey = 'gysplanappraisenew'
    }

     /* ---------------------------------------------------------培训计划--------------------------------------------------- */
     async getTrainPlan(params) {
        // 获取培训计划
        const {userId } = this.pageInfo
        params['createuser'] = userId
        let ret = await axios.get(`${this.BaseURL}newTrainPlan?`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getTrainPlanByPrincipal(params) {
        const {userId } = this.pageInfo
        // 审批人员获取培训计划
        params['userId'] = userId
        let ret = await axios.get(`${this.BaseURL}newTrainPlan/page?`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async newTrainPlan(body) {
        // 新建培训计划
        let ret = await axios.post(`${this.BaseURL}newTrainPlan?`,body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteTrainPlanNew(ids) {
        // 删除培训计划
        let ret = await axios.delete(`${this.BaseURL}newTrainPlan?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    
    async editTrainPlan(body) {
        // 修改培训计划
        let ret = await axios.put(`${this.BaseURL}newTrainPlan`,body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
  async getPlanApplyDetail(trainid){
      //获取培训申请详情
      let ret = await axios.get(`${this.BaseURL}trainApplyNew/center?trainid=${trainid}`)
      if (ret.status == 200 && ret.data.code == 200) {
          return ret.data;
      } else {
          message.error(ret.data.message)
      }
     
  }
  async approveGysApplyStatus(ids,status){
    //修改申请状态
    let ret = await axios.put(`${this.BaseURL}trainApplyNew/status?ids=${ids}&status=${status}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}

async getTrainApplyNew4PJZX(params){
        //培训中心查询专项培训报名
        const {userId } = this.pageInfo
        params['userId'] = userId
        let ret = await axios.get(`${this.BaseURL}trainApplyNew4PJZX`,{params})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
       
}
async getTrainApplyNew4PJZR(params){
    //培训中心查询准入培训报名
    const {userId } = this.pageInfo
    params['userId'] = userId
    let ret = await axios.get(`${this.BaseURL}trainApplyNew4PJZR`,{params})
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getTrainApplyedGYS(trainid,status){
    //培训中心查询专项培训申请供应商
  
    let ret = await axios.get(`${this.BaseURL}trainApplyedGysVO/center?trainid=${trainid}&status=${status}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getTrainZRAppliedPerson(planId){
    //查询准入培训申请参训人员
    let ret = await axios.get(`${this.BaseURL}trainAccessApply/appliedPerson?planId=${planId}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getTrainZRApplied(planId){
    //查询已报名准入培训申请
    let ret = await axios.get(`${this.BaseURL}trainAccessApply/applied?planId=${planId}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getTrainZRapprovalApply(planId){
    //查询待审批准入培训申请
    let ret = await axios.get(`${this.BaseURL}trainAccessApply/approval?planId=${planId}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
  /* ---------------------------------------------------------E N D --------------------------------------------------- */
   /* ---------------------------------------------------------我的专项报名--------------------------------------------------- */

   async getTrainApplyGysWaited(trainid){
    //培训中心查看待审批供应商

    let ret = await axios.get(`${this.BaseURL}trainApplyNew/wait/detail?trainid=${trainid}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getTrainApplyGysApplyed(trainid){
    //查询已申请供应商的详细信息

    let ret = await axios.get(`${this.BaseURL}trainApplyNew/applyedNum/detail?trainid=${trainid}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getTrainUserApplyedNum(trainid){
    //查询已申请总人数

    let ret = await axios.get(`${this.BaseURL}trainApplyNew/userApplyedNum/detail?trainid=${trainid}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}

async getTrainApplyGysNoApplyedNum(trainid){
    //查询未申请供应商

    let ret = await axios.get(`${this.BaseURL}trainApplyNew/noApplyedNum/detail?trainid=${trainid}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async getNewTrainPlanGysBases(trainid){
    //根据培训计划获取添加的供应商

    let ret = await axios.get(`${this.BaseURL}newTrainPlanGysBases?newtrainplanid=${trainid}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async addGysToTrainplan(newtrainplanid,provider_ids){
    //培训计划新增供应商

    let ret = await axios.post(`${this.BaseURL}newTrainPlanGysBases?provider_ids=${provider_ids}&newtrainplanid=${newtrainplanid}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}
async removeGysFromTrainplan(ids){
    //培训计划移除供应商

    let ret = await axios.delete(`${this.BaseURL}newTrainPlanGysBases?ids=${ids}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
   
}


  /* ---------------------------------------------------------E N D --------------------------------------------------- */


 /* ---------------------------------------------------------培训策划--------------------------------------------------- */

 async getTrainPlotTypesByType(type) {
    // 根据培训分类获取培训类型树
    let ret = await axios.get(`${this.BaseURL}trainPlotTypes/${type}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}



 async getCourses(params) {
    // 获取培训策划课程
    let ret = await axios.get(`${this.BaseURL}getvalidcourselist`,{
        params
    })
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}


async getTypeByPlanId(newtrainplanID) {
    // 获取培训类型
    let ret = await axios.get(`${this.BaseURL}newTrainplotTrainplottype?newtrainplanID=${newtrainplanID}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async getTrainSchmeCourseByZXD(params) {
    // 获取培训策划课程
    let ret = await axios.get(`${this.BaseURL}getcourselistbytrainplotid`,{params})
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}


 async getTrainSchmeCourse(plotId) {
    // 获取培训策划课程
    let ret = await axios.get(`${this.BaseURL}trainplotTraincourse?plotId=${plotId}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async removeTrainSchmeCourse(ids) {
    // 删除培训策划课程
    let ret = await axios.delete(`${this.BaseURL}trainplotTraincourse?ids=${ids}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}

async addTrainSchmeCourse(body) {
    console.log(body)
    // 添加培训策划课程
    let ret = await axios.post(`${this.BaseURL}trainplotTraincourse`,body)
    console.log(ret)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}

 async deleteTrainPlot(ids) {
    // 删除培训策划
    let ret = await axios.delete(`${this.BaseURL}trainPlot?ids=${ids}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async NewTrainSchme(body) {
    // 新建培训策划
    let ret = await axios.post(`${this.BaseURL}trainPlot?`,body)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async EditTrainSchme(body) {
    // 修改培训策划类型
    let ret = await axios.put(`${this.BaseURL}trainPlot?`,body)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}

async getTrainSchmeInfo(params) {
    // 获取培训策划
    let ret = await axios.get(`${this.BaseURL}trainPlot?`,{
        params
    })
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}

 async getTrainSchmeList(params) {
    // 获取培训策划
    let ret = await axios.get(`${this.BaseURL}trainPlot?`,{
        params
    })
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async getTrainAttach(plotId) {
    // 获取策划下的附件
    let ret = await axios.get(`${this.BaseURL}trainPlotFile?plotId=${plotId}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async getTrainCourseList(params) {
    // 获取培训课程
    let ret = await axios.get(`${this.BaseURL}getcourselistbyname?`,{
        params
    })
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
 async getTrainSchmeTypeTree(params) {
    // 获取培训策划类型树
    let ret = await axios.get(`${this.BaseURL}trainPlotTypes?`,{
        params
    })
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
async NewTrainSchmeType(params) {
    const {userId } = this.pageInfo
    // 新建培训策划类型
    params['userId'] = userId
    let ret = await axios.post(`${this.BaseURL}trainPlotTypes?name=${params.name}&pid=${params.pid}&userId=${params.userId}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}

async editTrainSchmeType(params) {
   // 修改培训策划类型
    let ret = await axios.put(`${this.BaseURL}trainPlotTypes?name=${params.name}&id=${params.id}`)
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}

async removeTrainSchmeType(typeIds) {
    const {userId } = this.pageInfo
    // 删除培训策划类型
     let ret = await axios.delete(`${this.BaseURL}trainPlotTypes?userId=${userId}&typeIds=${typeIds}`)
     if (ret.status == 200 && ret.data.code == 200) {
         return ret.data;
     } else {
         message.error(ret.data.message)
     }
 }
  /* ---------------------------------------------------------E N D--------------------------------------------------- */

    /* ---------------------------------------------------------培训证书--------------------------------------------------- */
    async getTrainCertificate(body) {
        // 获取证书列表
        let ret = await axios.get(`${this.BaseURL}train/certificate?`,{
            params:body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async directHandlePlan(businessInstId,processDefinitionKey){
        let {userId} = this.pageInfo
        let params  ={
            businessInstId,
            processDefinitionKey,
            userId
        }
        let ret = await axios.get(`${this.BaseURL}gysnewtrainplan/directHandleTask?`,{
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async directHandleApply(businessInstId,processDefinitionKey){
        let {userId} = this.pageInfo
        let params  ={
            businessInstId,
            processDefinitionKey,
            userId
        }
        let ret = await axios.get(`${this.BaseURL}gystrainapply/directHandleTask?`,{
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async modifyTrainCertificate(body) {
        // 修改证书
        let {userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}train/certificate?id=${body.id}`,{ ...body,userId})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteTrainCertificate(id) {
        // 删除证书
        let ret = await axios.delete(`${this.BaseURL}train/certificate?ids=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async addTrainCertificate(body) {
        // 增加培训证书
        let {userId} = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}train/certificate`, {...body,userId})
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getDic(body) {
        // 培训证书字典
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${body}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getTrainTypeInfosArgs(pageNum = 1, rowNum = 20) {
        // 培训证书字典
        let ret = await axios.get(`${this.BaseURL}gysTrainTypeInfosArgs?pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    /* ---------------------------------------------------------培训类型--------------------------------------------------- */
    async getTrainingTypes(pageNum, rowNum, searchVal) {
        // 获取培训类型列表
        let trainName;
        if (searchVal) {
            trainName = searchVal.trainName;
        } else {
            trainName = ""
        }
        let ret = await axios.get(`${this.BaseURL}gysTrainTypeInfosArgs?pageNum=${pageNum}&rowNum=${rowNum}&trainName=${trainName}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getSpecialistTypes(lookUpId) {
        // 获取专家类型列表
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${lookUpId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getSupplierTypes(lookUpId) {
        // 获取供应商类型列表
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${lookUpId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainType(body) {
        // 新建培训类型
        let ret = await axios.post(`${this.BaseURL}trainType`, {
            ...body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainExpertType(body) {
        // 新建培训专家类型
        let ret = await axios.post(`${this.BaseURL}trainExpertType`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainGysType(body) {
        // 新建培训供应商类型
        let ret = await axios.post(`${this.BaseURL}trainGysType`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteTrainType(params) {
        // 删除培训类型
        let ret = await axios.delete(`${this.BaseURL}trainType?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async editTrainType(body) {
        // 修改培训类型
        let ret = await axios.put(`${this.BaseURL}trainType`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteExpertType(params) {
        // 删除专家类型
        let ret = await axios.delete(`${this.BaseURL}trainExpertType?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteSupplierType(params) {
        // 删除供应商类型
        let ret = await axios.delete(`${this.BaseURL}trainGysType?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    /* ---------------------------------------------------END--------------------------------------------------- */

    /* ---------------------------------------------------培训计划--------------------------------------------------- */
    async getTrainingPlans(pageNum, rowNum, searchVal) {
        // 获取培训计划列表
        let { trainPlanName } = searchVal;
        console.log(trainPlanName)
        let ret = await axios.get(`${this.BaseURL}gysTrainPlanInfosArgs?pageNum=${pageNum}&rowNum=${rowNum}&trainPlanName=${trainPlanName}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async gysTrainPlanInfosArgswss(pageNum, rowNum, searchVal) {
        // 实施获取培训计划列表
        let { trainPlanName } = searchVal;
      
        let ret = await axios.get(`${this.BaseURL}gysTrainPlanInfosArgswss?pageNum=${pageNum}&rowNum=${rowNum}&trainPlanName=${trainPlanName}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getPlansOfGys(userId, pageNum, rowNum, searchVal) {
        // 获取供应商培训计划列表
        let { trainPlanName } = searchVal;
        let ret = await axios.get(`${this.BaseURL}gysTrainPlanInfosArgs/gysUser?userId=${userId}&pageNum=${pageNum}&rowNum=${rowNum}&trainPlanName=${trainPlanName}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteTrainPlan(params) {
        // 删除培训计划
        let ret = await axios.delete(`${this.BaseURL}trainPlan?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainPlan(body) {
        // 新建培训计划
        let ret = await axios.post(`${this.BaseURL}trainPlan`, {
            ...body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainExpert(body) {
        // 新建培训计划——新增专家
        let ret = await axios.post(`${this.BaseURL}trainPlanExpert`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainGys(body) {
        // 新建培训计划——新增供应商
        let ret = await axios.post(`${this.BaseURL}trainPlanGysBase`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    // async editTrainPlan(body) {
    //     // 修改培训计划
    //     let ret = await axios.put(`${this.BaseURL}trainPlan`, body)
    //     if (ret.status == 200 && ret.data.code == 200) {
    //         message.success(ret.data.message)
    //         return ret.data.data;
    //     } else {
    //         message.error(ret.data.message)
    //         return []
    //     }
    // }
    async deleteExpert(params) {
        // 删除专家
        let ret = await axios.delete(`${this.BaseURL}trainPlanExpert?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deleteSupplier(params) {
        // 删除供应商
        let ret = await axios.delete(`${this.BaseURL}trainPlanGysBase?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainFile(body) {
        // 新建培训计划——新增附件
        let ret = await axios.post(`${this.BaseURL}trainPlanFile`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async deletePlanFile(params) {
        // 培训计划——删除附件
        let ret = await axios.delete(`${this.BaseURL}trainPlanFile?ids=${params}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    /* ---------------------------------------------------END--------------------------------------------------- */
    /* ---------------------------------------------------培训申请--------------------------------------------------- */
    async createTrainApply(body) {
        // 供应商新建培训申请
        let ret = await axios.post(`${this.BaseURL}trainApply`, {
            ...body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async createTrainApplyUser(id, body) {
        // 添加参加培训人员
        let ret = await axios.post(`${this.BaseURL}trainApply/user?id=${id}`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            // message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getTrainApplyOfApprover(userId, pageNum, rowNum, searchVal) {
        // 评价中心 查询培训申请
        let { trainPlanName } = searchVal;
        console.log(trainPlanName)
        let ret = await axios.get(`${this.BaseURL}trainApply4PJZX?userId=${userId}&pageNum=${pageNum}&rowNum=${rowNum}&trainPlanName=${trainPlanName}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getTrainApplyOfGys(userId, pageNum, rowNum, searchVal) {
        // 供应商 查询培训申请列表
        let { trainPlanName } = searchVal;
        console.log(trainPlanName)
        let ret = await axios.get(`${this.BaseURL}trainApply/page?userId=${userId}&pageNum=${pageNum}&rowNum=${rowNum}&trainPlanName=${trainPlanName}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async checkApplyDetail(id) {
        //供应商查看培训申请详情
        let ret = await axios.get(`${this.BaseURL}trainApply?id=${id}`)
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async evaluateTrain(id, value) {
        //培训打分
        let ret = await axios.put(`${this.BaseURL}train/satisfaction?satisfaction=${value}&id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    /* ---------------------------------------------------END--------------------------------------------------- */
    /* ---------------------------------------------------培训实施--------------------------------------------------- */



   
    async ImplementUserImportExcel(body) {
        // 查看要导入的excel参训人员
        let ret = await axios.put(`${this.BaseURL}trainImplementUserNew/excel2`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async newTrainimplement(body) {
        const { userId } = this.pageInfo
        body['createuser'] = userId
        // 新建培训实施记录

        let ret = await axios.post(`${this.BaseURL}gystrainimplement/creategystrainimplement`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }

    async getTrainimplement(pageNum, rowNum, queryName) {
        const { userId } = this.pageInfo
        // 获取培训实施记录
        let params = {
            pageNum,
            rowNum,
            queryName,
            userId
        }
        let ret = await axios.get(`${this.BaseURL}gystrainimplement/getgystrainimplementlistall`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getPxApplyByTrainPlan(pageNum, rowNum, trainplanid, queryName) {

        // 获取培训申请
        let params = {
            pageNum,
            rowNum,
            queryName,
            trainplanid
        }
        let ret = await axios.get(`${this.BaseURL}gystrainimplement/getTrainApplyByPlan`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async getPxPeopleByApply(applyId) {

        // 获取培训申请参训人员

        let ret = await axios.get(`${this.BaseURL}trainApplyUsers?id=${applyId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }

    async getTrainCertificateAll(pageNum,rowNum,options) {
        // 获取证书列表
         let params = {
            pageNum,
            rowNum,
            ...options
         }
        let ret = await axios.get(`${this.BaseURL}train/certificate`,{params})
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    async getTrainimplementDetail(id) {
        // 获取实施记录详情
         let params = {
            id
         }
        let ret = await axios.get(`${this.BaseURL}gystrainimplement/getgystrainimplementbyid`,{params})
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    /*-------------------------------------------------培训课程-------------------------------------------- */
    async getSubCoursetype() {
        // 根据departmentId 获取根目录
         let {departmentId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getSubCoursetype?orgId=${departmentId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getCoursetype(id) {
        // genjuID获取课程分类
        let ret = await axios.get(`${this.BaseURL}getCoursetype?CoursetypeId=${id}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async insertCoursetype(body) {
        //新增课程分类
        let {userId,departmentId} = this.pageInfo
        body.createuser = userId
        body.orgid = departmentId
        let ret = await axios.post(`${this.BaseURL}insertCoursetype`,{
            ...body
        })
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async insertcourse(body) {
        //新建课程
        let {userId} = this.pageInfo
        body.createuser = userId
        let ret = await axios.post(`${this.BaseURL}insertcourse?coursetypeId=${body.coursetypeId}`,{
            ...body
        })
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async insertspecialist(body) {
        // 根据课程ID，添加专家
        console.log(body)
        let ret = await axios.post(`${this.BaseURL}insertspecialist?courseid=${body.courseid}&zzpjSpecialist=${body.zzpjSpecialist}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    
    async insertcourseware(body) {
        // 根据课程ID，添加课件
        let ret = await axios.post(`${this.BaseURL}insertcourseware?courseid=${body.courseid}`,body.Coursewarelist)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getcourselist(body) {
        // 根据课程分类ID查询课程
        let ret = await axios.get(`${this.BaseURL}getcourselist?coursetypeid=${body.coursetypeid}&coursename=${body.coursename}&pageNum=${body.pageNum}&rowNum=${body.rowNum}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteCoursetype(id) {
        // 删除节点
        let ret = await axios.delete(`${this.BaseURL}deleteCoursetype?ids=${id}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deletecourselist(list) {
        // 删除课程
        let ret = await axios.delete(`${this.BaseURL}deletecourselist?courseIDlist=${list}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deletespecialist(body) {
        // 删除单条专家
        let ret = await axios.delete(`${this.BaseURL}deletespecialist?courseID=${body.courseid}&speciaID=${body.specialistid}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deletespecialistbycourseid(courseid) {
        // 删除全部专家
        let ret = await axios.delete(`${this.BaseURL}deletespecialistbycourseid?courseID=${courseid}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteware(_arr) {
        // 批量删除课件
        let ret = await axios.delete(`${this.BaseURL}deleteware?coursewareidlist=${_arr}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deletewarebycourseid(courseid) {
        // 删除全部课件
        let ret = await axios.delete(`${this.BaseURL}deletewarebycourseid?courseid=${courseid}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async updateCoursetype(body) {
        // 根据departmentId 获取根目录
        let {userId,departmentId} = this.pageInfo
        body.createuser = userId
        body.orgid = departmentId
        let ret = await axios.put(`${this.BaseURL}updateCoursetype`,{
            ...body
        })
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    // async specialists(body) {
    //     //获取专家列表
    //     let ret = await axios.get(`${this.BaseURL}specialists?pageNum=${body.pageNum}&rowNum=${body.rowNum}`)
    //     if (ret.status == 200 ) {
    //         return ret.data;
    //     } else {
    //         message.error(ret.data.message)
    //     }
    // }
    async getSpecialist(options){
        // 获取专家列表
        console.log("222")
        let ret = await axios.get(`${this.BaseURL}specialists/name/type`, {
            params: {
               ...options
            }
        })
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getspecialistByCourse(body) {
        // 根据课程查询专家
        let ret = await axios.get(`${this.BaseURL}getspecialist?courseid=${body.id}&pageNum=${body.pageNum}&rowNum=${body.rowNum}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getcourseware(body) {
        // 根据课程查询课件
        let ret = await axios.get(`${this.BaseURL}getcourseware?courseid=${body.id}&pageNum=${body.pageNum}&rowNum=${body.rowNum}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async updatecourse(body) {
        // 课程修改
        let ret = await axios.put(`${this.BaseURL}updatecourse`,{
            ...body
        })
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    /*---------------------------------------------------我的专项培训-----------------------------------------*/
    async trainApplyNew(body) {
        // 获取专项培训列表
        let {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}trainApplyNew/zx/page?queryName=${body.queryName}&userId=${userId}&pageNum=${body.pageNum}&rowNum=${body.rowNum}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async trainApplyNewDetail(id) {
        // 根据ID查询培训详情
        let ret = await axios.get(`${this.BaseURL}trainApplyNew?id=${id}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    /*-----------------------------------------------培训通知--------------------------------------*/
    async newTrainPlanGys(body) {
        // 获取培训计划列表 供应商角色
        let {userId} = this.pageInfo
        body.userId = userId
        let ret = await axios.get(`${this.BaseURL}newTrainPlanGys`,{
            params:{...body}
        })
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }
    async newTrainPlanFile(id) {
        // 根据NEW培训计划ID获取附件信息列表
        let ret = await axios.get(`${this.BaseURL}newTrainPlanFile?newtrainplanID=${id}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async newTrainPlanById(id) {
        // 根据NEW培训计划ID获取策划信息
        let ret = await axios.get(`${this.BaseURL}newTrainPlanById?id=${id}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async comfgysInfo() {
        // 获取gysID
        let {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}comfgysInfo?userId=${userId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    
    async trainApplyNewTrainId(body) {
        // 根据培训通知id 添加培训人员
        let {userId} = this.pageInfo
        body['createuserid'] = userId
        let ret = await axios.post(`${this.BaseURL}trainApplyNew`,body)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async trainApplyNewversion(id,body) {
        // 根据培训通知id 添加培训人员
        let ret = await axios.post(`${this.BaseURL}trainApplyNew/user?id=${id}`,
            body
        )
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

    //培训计划新增准入申请
    async addTrainApplyToPlan(newtrainplanid,accessApplyIds) {
      
        let ret = await axios.post(`${this.BaseURL}trainAccessApply/trainPlan?newtrainplanid=${newtrainplanid}&accessApplyIds=${accessApplyIds}`,)
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

    async getTrainAccessApply(newtrainplanid,status) {
        // 根据NEW培训计划ID,查询准入培训申请
        let ret = await axios.get(`${this.BaseURL}trainAccessApply/trainPlan?newtrainplanid=${newtrainplanid}&status=${status}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }


    async getTrainApplyUsers(params) {
        // 根据NEW准入培训申请ID,查询参训人员
        let ret = await axios.get(`${this.BaseURL}trainAccessApply/personnel`,{params})
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async addUserToZRTrainApply(applyId,body) {
        let {userId} = this.pageInfo
        // 给准入申请添加参训人员
        let ret = await axios.post(`${this.BaseURL}trainAccessApply/personnel?applyId=${applyId}&userId=${userId}`,body)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

    async gysZRApplysignUp(applyId) {
        // 供应商准入申请报名
        let {userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}trainAccessApply/signUp?applyId=${applyId}&userId=${userId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async PJZXReturnApply(newtrainplanid,applyIds) {
        // 供应商准入退回
        let ret = await axios.put(`${this.BaseURL}trainAccessApply/return?newtrainplanid=${newtrainplanid}&applyIds=${applyIds}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async PJZXAgreeApply(newtrainplanid,applyIds) {
        // 供应商准入申请统一
        let ret = await axios.put(`${this.BaseURL}trainAccessApply/agree?newtrainplanid=${newtrainplanid}&applyIds=${applyIds}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async getTrainAddedUsers(gysId,planId) {
        // 根据NEW培训计划ID,供应商ID查询已添加参训人员
        let ret = await axios.get(`${this.BaseURL}trainApplyNewUsers/gys/plan?gysid=${gysId}&trainid=${planId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async trainApplyNewUsers(gysId) {
        // 根据NEW培训计划ID获取急哈u信息
        let {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}trainApplyNewUsers/gys?gysid=${gysId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async deleteTrainApplyNewUsers(ids) {
        // 删除已添加的参训人员
        let ret = await axios.delete(`${this.BaseURL}trainApplyNewUsers?ids=${ids}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
   /*-----------------------------------------------------NEW 实施记录--------------------------------------------*/

   async getTrainPlanToSS(params) {
    // 获取培训计划
    let ret = await axios.get(`${this.BaseURL}newTrainPlan?`,{params})
    if (ret.status == 200 && ret.data.code == 200) {
        return ret.data;
    } else {
        message.error(ret.data.message)
    }
}
    async getTrainSSRecord(params) {
        // 培训中心获取实施记录
        let {userId} = this.pageInfo
        params['createuser'] = userId
        let ret = await axios.get(`${this.BaseURL}trainImplementNew/page`,{params})
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

    async getTrainApplyNewUsers(trainid){
        //根据计划id查询通过和尚未审批的报名人员
        let ret = await axios.get(`${this.BaseURL}trainApplyNew/center/user?trainid=${trainid}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

   

    async newTrainSSRecord(body) {
        let {userId} = this.pageInfo
        body['createuser'] = userId
        //新建实施记录
        let ret = await axios.post(`${this.BaseURL}trainImplementNew`,
            body
        )
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async editTrainSSRecord(ofgti,body) {
        let {userId} = this.pageInfo
        body['createuser'] = userId
        //修改实施记录
        let ret = await axios.put(`${this.BaseURL}trainImplementNew?ofgti=${ofgti}`,
            body
        )
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

    async editTrainInSS(trainid,body) {
        //新建实施记录，修改计划主表
        let ret = await axios.put(`${this.BaseURL}newTrainPlan/implement?trainid=${trainid}`,
            body
        )
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

   async getTrainDetailToSS(trainid) {
        //新建实施记录获取计划信息
        let ret = await axios.get(`${this.BaseURL}newTrainPlan/implement?trainid=${trainid}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    
    async addCertificateToSSRecord(gyscid,ofgti) {
        //为实施记录添加证书
        let ret = await axios.post(`${this.BaseURL}trainImplementNew/certificate?gyscid=${gyscid}&ofgti=${ofgti}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async removeCertificateFromSSRecord(gyscid,ofgti) {
        //为实施记录移除证书
        let ret = await axios.delete(`${this.BaseURL}trainImplementNew/certificate?gyscid=${gyscid}&ofgti=${ofgti}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

    async addUserToSSRecord(ofgti,body) {
        //为实施记录添加参训人员
        let ret = await axios.post(`${this.BaseURL}trainImplementUserNew?ofgti=${ofgti}`,
            body
        )
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async getTrainSSRecordDetail(ofgti) {
        // 查询实施记录详情
        let ret = await axios.get(`${this.BaseURL}trainImplementNewDetail?ofgti=${ofgti}`)
        console.log(ret)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }
    async removeTrainSSRecord(ids) {
        // 删除实施记录
        let ret = await axios.delete(`${this.BaseURL}trainImplementNews?ids=${ids}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }

   async removeTrainSSUser(ids) {
        // 移除参训人员
        let ret = await axios.delete(`${this.BaseURL}trainImplementUserNews?ids=${ids}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return null
        }
    }



    noticeDownLoad(id) {
        // 下载附件
        window.open(this.FileBaseURL+id)
    }
    /*-----------------------------------------------------我的准入培训--------------------------------------------*/
    async trainAccessApplyNoPage(queryName) {
        // 根据USERID获取准入培训申请列表 供应商角色
        let {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}trainAccessApplyNoPage?queryName=${queryName}&userId=${userId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async trainAccessApplyHasPage(body) {
        // 根据USERID获取准入培训申请列表 评价中心角色角色
        let {userId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}trainAccessApply?queryName=${body.queryName}&pageNum=${body.pageNum}&rowNum=${body.rowNum}&userId=${userId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getTrainApplys(body) {
        // 评价中心角色获取准入培训申请列表 评价中心角色角色
        let params = {
            ...body
        }
        let ret = await axios.get(`${this.BaseURL}trainAccessApplyList`,{params})
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }


    

    async trainAccessApply(body) {
        // 根据USERID新建申请
        let {userId} = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}trainAccessApply?userId=${userId}`,body)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteTrainAccessApply(body) {
        // 根据USERID删除申请
        let {userId} = this.pageInfo
        let ret = await axios.delete(`${this.BaseURL}trainAccessApply?applyIds=${body}&userId=${userId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async uploadTrainAccessApply(_arr) {
        // 根据USERID删除申请
        let {userId} = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}trainAccessApply/submit?applyIds=${_arr}&userId=${userId}`)
        if (ret.status == 200 ) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }


     /* ---------------------------------------------------END--------------------------------------------------- */
}
const supplierTrain = new SupplierTrain();
export default supplierTrain;