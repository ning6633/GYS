import ActionBase from "../actbase";
import axios from "axios";
import { message } from 'antd'
/* 
专家管理
*/
class SpecialExposure extends ActionBase {


    /*********************************曝光台***********************************/
    async getExposure (body) {
        // 获取曝光台信息
        console.log(body)
        let { roleNameKey } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getExposure`, {
            params: {
                roleId: roleNameKey,
                ...body
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            return {}
        }
    }
    async getGysmessage (body) {
        // 获取GYS信息
        let { roleNameKey } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}searchGyss`, {
            params: {
                ...body,
                roleId: roleNameKey
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deletemessage (id) {
        // 删除GYS信息
        let { username } = this.pageInfo
        let ret = await axios.delete(`${this.BaseURL}deleteExposure?username=${username}&id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async updateAvailable (id) {
        // 修改状态信息
        let { username } = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}updateAvailable?username=${username}&id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    async uploademessage (body) {
        // 修改GYS信息
        let { username } = this.pageInfo
        let { content,
            id,
            type } = body
        let ret = await axios.put(`${this.BaseURL}updateExposure?content=${content}&id=${id}&type=${type}&username=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async addGysmessage (body) {
        // 添加GYS信息
        let ret = await axios.post(`${this.BaseURL}addExposure`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    /*********************************投诉***********************************/
    async getAskDict () {
        // 获取搜索类型
        // const departmentId = this.pageInfo.departmentId;
        let ret = await axios.get(this.BaseURL + 'askOrComplain/getAskDict')
        if (ret.status == 200) {
            return ret.data;
        }
    }
    async getCompanyListTree () {
        // 获取上报单位树
        // const departmentId = this.pageInfo.departmentId;
        const departmentId = '188fd53c-c12b-4dcc-aa3b-48d842be2102';//中国航天科技集团有限公司
        let ret = await axios.get(this.BaseURL + 'orgdepartment', {
            params: {
                departmentId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            // message.error(ret.data.message)
            message.error('院信息获取失败')
            return [];
        }
    }
    async searchCompanyInfo (name) {
        // 搜索院所信息
        // const {departmentId} = this.pageInfo;
        const departmentId = '188fd53c-c12b-4dcc-aa3b-48d842be2102';//中国航天科技集团有限公司
        let ret = await axios.get(`${this.BaseURL}org`, {
            params: {
                departmentId,
                name,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            // message.error(ret.data.message)
            message.error('院信息搜索失败')
            return [];
        }
    }
    async getAskList (body) {
        // 获取投诉信息
        console.log(body)
        let { departmentId, roleNameKey } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}askOrComplain/getAskList`, {
            params: {
                ...body,
                currDeptId: departmentId,
                currRoleId: roleNameKey,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    // async isGysRole(body) {
    //     // 添加GYS信息
    //     let {departmentId} = this.pageInfo
    //     let ret = await axios.get(`${this.BaseURL}askOrComplain/isGysRole?currRoleId=${departmentId}`)
    //     if (ret.status == 200 && ret.data.code == 200) {
    //         return ret.data;
    //     } else {
    //         message.error(ret.data.message)
    //     }
    // }
    async getgysmessagelist (pageNum, rowNum, options) {
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
    async submitAsk (body) {
        //添加
        let { userId, departmentId } = this.pageInfo

        let ret = await axios.post(`${this.BaseURL}askOrComplain/addAsk`,
            {
                ...body,
                userid: userId,
                gys_dept_id: departmentId

            }
        )
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }

    }
    async delAsk (id) {
        //删除
        let ret = await axios.delete(`${this.BaseURL}askOrComplain/delAsk?id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async update (body) {
        //修改
        let { userId, departmentId } = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}askOrComplain/updateAsk`, {
            ...body,
            gys_dept_id: departmentId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async updata (id) {
        //提交
        let ret = await axios.put(`${this.BaseURL}askOrComplain/submitAsk?id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async overAsk (id) {
        //结束
        let ret = await axios.put(`${this.BaseURL}askOrComplain/overAsk?id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getAskReplyList (id) {
        //回复信息查询
        let ret = await axios.get(`${this.BaseURL}askOrComplain/getAskReplyList?id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async centerReplyAsk (body) {
        //中心回复操作
        let { userId } = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}askOrComplain/centerReplyAsk`, {
            ...body,
            user_id: userId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async gysReplyAsk (body) {
        //中心回复操作
        let { userId } = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}askOrComplain/gysReplyAsk`, {
            ...body,
            user_id: userId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async dealAsk (body) {
        //办理
        let { userId } = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}askOrComplain/dealAsk`, {
            ...body,
            user_id: userId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async lookUpId (type) {
        //字典
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${type}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getOneAskInfoById (id) {
        //获取一条信息
        let ret = await axios.get(`${this.BaseURL}askOrComplain/getOneAskInfoById?id=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    /*****************************交流大会*********************************/
    async getComminicationTopTen (body) {
        //获取交流前10
        let { departmentId } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getComminicationTopTen`, {
            params: body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getComminication (body) {
        //获取交流大会列表
        let { departmentId } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getComminication`,
            {
                params: {
                    ...body,
                    deptid: departmentId,
                }
            }
        )
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async addCommunicate (body) {
        //添加交流活动
        let { departmentId, username } = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}addCommunicate`, {
            ...body,
            dept_ID: departmentId,
            userid: username
        }
        )
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async updateCommunication (body) {
        //修改交流活动
        let { departmentId, userId } = this.pageInfo
        let ret = await axios.post(`${this.BaseURL}updateCommunication`, {
            ...body,
            dept_ID: departmentId,
            userid: userId
        }
        )
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    async cancleCommunication (id) {
        //撤回
        let { userId } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}cancleCommunication?id=${id}&userid=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async publishCommunication (id) {
        //提交
        let { userId } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}publishCommunication?id=${id}&userid=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async delComminicationById (id) {
        //删除
        let ret = await axios.delete(`${this.BaseURL}delComminicationById?ids=${id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

}
const specialExposure = new SpecialExposure();
export default specialExposure;