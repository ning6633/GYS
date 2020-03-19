import ActionBase from "../actbase";
import axios from "axios";
import {
    message
} from "antd"
/* 
核对修改供应商及产品信息
*/
class SupplierDirectory extends ActionBase {
    constructor() {
        super();
        this.uploadUrl = `${this.BaseURL}initcategorytype?userId=${this.pageInfo.userId}&orgid=${this.pageInfo.departmentId}`
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
    async getStandardSupplierList(params) {
        params['gysname'] = params.keyword

        // 获取供应商列表
        let ret = await axios.get(`${this.BaseURL}getstandardgys`, {
            params
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getDic(lookUpId) {
        // 获取字典值
        let ret = await axios.get(`${this.BaseURL}dic?lookUpId=${lookUpId}`)
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
    //获取根名录类别
    async getRootCategory() {
        const { departmentId } = this.pageInfo
        // const departmentId = '1' //this.pageInfo.departmentId;
        let ret = await axios.get(`${this.BaseURL}category/root?orgId=${departmentId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取名录类别详情
    async getCategoryDetail(categoryID) {
        let ret = await axios.get(`${this.BaseURL}category/getCategoryDetail?categoryID=${categoryID}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //获取名录分类树
    async getCategoryTree(categoryId) {
        // const departmentId = '1' //this.pageInfo.departmentId;
        const { departmentId } = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}category?orgId=${departmentId}&categoryId=${categoryId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //新建名录分类
    async newCategory(body) {
        const { departmentId, username } = this.pageInfo;
        body['orgid'] = departmentId
        body['createuser'] = username || "test"
        body['updateuser'] = username || "test"
        let ret = await axios.post(`${this.BaseURL}category`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //编辑名录分类
    async editCategory(body) {
        const { username } = this.pageInfo;
        body['updateuser'] = username || "test"
        let ret = await axios.put(`${this.BaseURL}category?id=${body.id}`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //删除分类
    async removeCategory(ids) {
        let ret = await axios.delete(`${this.BaseURL}category?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取分类下的名录
    async getDirectByCategory(params) {
        const { userId } = this.pageInfo;
        params['userId'] = userId
        let ret = await axios.get(`${this.BaseURL}directories`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //新增分类下的名录
    async addDirectToCategory(categoryId, body) {
        const { username, userId, departmentId } = this.pageInfo;
        body['createuser'] = userId
        body['orgid'] = departmentId
        let ret = await axios.post(`${this.BaseURL}directories?categoryId=${categoryId}`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //删除分类下的名录
    async deleteDirectOfClass(ids) {
        let ret = await axios.delete(`${this.BaseURL}directories?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //修改名录
    async editDirect(body) {
        const { username, departmentId } = this.pageInfo;
        body['createuser'] = username
        body['updateuser'] = username
        body['orgid'] = departmentId
        let ret = await axios.put(`${this.BaseURL}directories`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //发布名录
    async publishDirect(ids) {
        let ret = await axios.put(`${this.BaseURL}directories/status?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //获取名录下的供应商
    async getSuppliersByDirect(options) {
        const { departmentId } = this.pageInfo;
        let params = {
            ...options,
            orgId: departmentId
        }
        let ret = await axios.get(`${this.BaseURL}directories/gysinfos`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return [];
        }
    }

    //获取上级已授权名录
    async getAuthorizedDirectByParent(options) {
        const { departmentId } = this.pageInfo;
        let params = {
            ...options,
            orgId: departmentId
        }
        let ret = await axios.get(`${this.BaseURL}directories/parents`, { params })

        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return [];
        }
    }
    //获取上级授权名录下的供应商列表
    async getSuppliersByParentAuthoried(options) {
        const { departmentId } = this.pageInfo;
        let params = {
            ...options,
            orgId: departmentId
        }
        let ret = await axios.get(`${this.BaseURL}directories/gysinfos/parents`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return [];
        }
    }
    //获取标准供应商列表
    async getStandardSuppliers(options) {
        let params = {
            ...options
        }
        let ret = await axios.get(`${this.BaseURL}directories/gysinfos/standard`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return [];
        }
    }
    //添加供应商到名录
    async addSupByDirect(body) {
        const { username, userId } = this.pageInfo;
        body['userid'] = userId
        body['username'] = username
        let ret = await axios.post(`${this.BaseURL}directories/gysinfos`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //移除名录与供应商的关系
    async removeSupsInDirect(relids) {
        const { username, userId } = this.pageInfo;
        let ret = await axios.delete(`${this.BaseURL}directories/gysinfos?ids=${relids}&userName=${username}&userId=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //获取部门下供应商信息
    async getgysInfosByOrgId(options) {
        const { departmentId } = this.pageInfo;
        let params = {
            ...options,
            orgId: departmentId
        }
        let ret = await axios.get(`${this.BaseURL}directories/gysinfos/local`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取本地名录列表
    async getLocalDirectList(params) {
        const { departmentId } = this.pageInfo;
        params['orgId'] = departmentId
        let ret = await axios.get(`${this.BaseURL}directories/local`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //获取单位直属下级
    async getNextOrgDepartment(params) {
        const { departmentId } = this.pageInfo;
        params['departmentId'] = departmentId
        let ret = await axios.get(`${this.BaseURL}nextorgdepartment`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //获取集团下属的所有企业
    async getaAllSubOrgdepartment(params) {
        const { departmentId } = this.pageInfo;
        let ret = await axios.get(`${this.BaseURL}getaAllSubOrgdepartment`, {
            params: { departmentId: departmentId }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //查看已授权组织名单
    async getAuthorizedrole(params) {
        params['orgId'] = this.pageInfo.departmentId
        let ret = await axios.get(`${this.BaseURL}directories/authorizedroles`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //授权名录
    async authortyDirect(directids, body) {
        const { userId } = this.pageInfo;
        let ret = await axios.put(`${this.BaseURL}directories/children?directoryIds=${directids}&userId=${userId}`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //删除名录授权信息
    async removeAuthortyDirect(relids) {
        let ret = await axios.delete(`${this.BaseURL}directories/authorizedroles?ids=${relids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    // 升版
    async upgradeDirectory(categoryId, arr) {
        let ret = await axios.post(`${this.BaseURL}upgradeDirectory?categoryId=${categoryId}`, arr)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //查看名录修改记录
    async getDirectHistory(params) {
        let ret = await axios.get(`${this.BaseURL}directories/histories`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    /***********************************************************名录二**************************************************************/
    //集团按分类查询名录分类树(查询条件：集团、院、场所)
    async getSubCategories(params) {
        let ret = await axios.get(`${this.BaseURL}getSubCategories`, { params })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return []
        }
    }

    //按产品分类获取供应商
    // async getproviderbyproducttype(params) {
    //     let ret = await axios.get(`${this.BaseURL}getproviderbyproducttype?Producttype=${params.producttype}&pageNum=${params.pageNum}&rowNum=${params.rowNum}`)
    //     if (ret.status == 200 && ret.data.code == 200) {
    //         return ret.data;
    //     } else {
    //         message.error(ret.data.message)
    //         return {}
    //     }
    // }

    // 根据名录ID获取供应商
    async getgysinfos(params) {
        let ret = await axios.get(`${this.BaseURL}getgysinfos?categoryId=${params.categoryId}&pageNum=${params.pageNum}&rowNum=${params.rowNum}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return {}
        }
    }

    // 获取标准库供应商
    async getBZkugGysinfos(params) {
        let ret = await axios.get(`${this.BaseURL}directories/gysinfos/standard?gysName=${params.gysName}&pageNum=${params.pageNum}&rowNum=${params.rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return {}
        }
    }

    // 初始化名录(向名录中添加供应商)
    async initcategory(params) {
        let { departmentId, userId } = this.pageInfo
        let { categoryId, gysIds } = params
        let ret = await axios.put(`${this.BaseURL}initcategory?categoryId=${categoryId}&gysIds=${gysIds}&orgid=${departmentId}&userId=${userId}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return {}
        }
    }

    // 从上级授权名录添加供应商
    async getAuthorizedDirectories(params) {
        let { departmentId } = this.pageInfo
        let {keyword,pageNum,rowNum} = params
        let ret = await axios.get(`${this.BaseURL}getAuthorizedDirectories?orgId=${departmentId}&keyword=${keyword}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
            return {}
        }
    }

    //获取集团下属的所有企业
    async getaAllSubOrgdepartmentnew() {
        const { departmentId } = this.pageInfo;
        let ret = await axios.get(`${this.BaseURL}getaAllSubOrgdepartmentnew`, {
            params: { departmentId: departmentId }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 院授权的企业
    async getSubOrgdepartmentnew(body) {
        let {pageNum,rowNum} = body
        let {departmentId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getSubOrgdepartmentnew?departmentId=${departmentId}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            // message.error(ret.data.message)
        }
    }
    //pageNum=${pageNum}&rowNum=${rowNum}

    //限用供应商
    async restrictgys(params) {
        let { gysids, orgids, scope } = params
        const { userId } = this.pageInfo;
        let ret = await axios.put(`${this.BaseURL}restrictgys?gysids=${gysids}&orgids=${orgids}&scope=${scope}&userid=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }


    //移除名录中的供应商
    async removeGysFromDirectory(params) {
        let { gysids, orgids, scope } = params
        const { userId } = this.pageInfo;
        let ret = await axios.delete(`${this.BaseURL}removeGysFromDirectory?ids=${params}&userid=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 授权名录
    async authorizeToChildren(params) {
        let { directoryid, orgs } = params
        const { userId } = this.pageInfo;
        let ret = await axios.put(`${this.BaseURL}authorizeToChildren?directoryid=${directoryid}&userId=${userId}`, orgs)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 取消名录授权
    async deleteDirectoryAuthorizedInfo(ids) {
        let ret = await axios.delete(`${this.BaseURL}deleteDirectoryAuthorizedInfo?ids=${ids}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 获取名录的授权信息(更新)
    // async getDirectoryAuthorizedallInfo(params) {
    //     let {directoryId,pageNum,rowNum} = params
    //     const { departmentId } = this.pageInfo;
    //     let ret = await axios.get(`${this.BaseURL}getDirectoryAuthorizedallInfo?directoryId=${directoryId}&orgId=${departmentId}&pageNum=${pageNum}&rowNum=${rowNum}`)
    //     if (ret.status == 200) {
    //         return ret.data;
    //     } else {
    //         message.error(ret.data.message)
    //     }
    // }

    // 院查看本地新增的名录供应商(集团查看下属企业子女增的供应商)
    async localDirectories(params) {
        let {directoryId,pageNum,rowNum} = params
        const { departmentId } = this.pageInfo;
        let ret = await axios.get(`${this.BaseURL}localDirectories?orgid=${departmentId}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 展示给定名录下供应商列表信息(更新)
    async getGysInfosByCategoryId(params) {
        let {categoryId,orgid,typecode,keyword,pageNum,rowNum} = params
        if(orgid.length == ''){
            orgid = this.pageInfo.departmentId
        }
        let ret = await axios.get(`${this.BaseURL}getGysInfosByCategoryId?categoryId=${categoryId}&orgid=${orgid}&typecode=${typecode}&keyword=${keyword}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 获取供应商修改记录
    async getgysupdmessage(params) {
        let {directoryId,orgId,pageNum,rowNum,startdate,enddate,eventype} = params
        let ret = await axios.get(`${this.BaseURL}getgysupdmessage?directoryId=${directoryId}&orgId=${orgId}&startdate=${startdate}&enddate=${enddate}&eventype=${eventype}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 获取供应商修改消息查看详情(消息的查看情况)
    async getgysupdmessagedetail(params) {
        let {departmentId} = this.pageInfo
        let {directoryId,pageNum,rowNum,gysId,orgId} = params
        let ret = await axios.get(`${this.BaseURL}getgysupdmessagedetail?directoryId=${directoryId}&gysId=${gysId}&orgId=${orgId}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 供应商变更消息通知
    async getgysupdmessageto(params) {
        let {departmentId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getgysupdmessageto?gysId=4d4232b4-dc08-4b1c-84b3-9907a40329ed&orgId=188fd53c-c12b-4dcc-aa3b-48d842be2102&pageNum=1&rowNum=2`)
        // let ret = await axios.get(`${this.BaseURL}getgysupdmessageto?gysId=${params}&orgId=${departmentId}&pageNum=1&rowNum=1`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }


    // 获取供应商用户信息(gysid)
    async comfgysInfo() {
        let {departmentId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}comfgysInfo?userId=${this.pageInfo.userId}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }


    // 获取给定名录的授权信息(更新)
    async getDirectoryAuthorizedallInfo(body) {
        let {departmentId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getDirectoryAuthorizedallInfo?directoryId=${body.directoryId}&orgId=${departmentId}&pageNum=${body.pageNum}&rowNum=${body.rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 获取给定名录的名录修改记录列表信息(0302)
    async categoryupdhistories(params) {
        let {directoryId,orgID,pageNum,rowNum} = params
        let ret = await axios.get(`${this.BaseURL}categoryupdhistories?directoryId=${directoryId}&orgID=${orgID}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 消息设置为已读
    async suretoread(messageid) {
        let ret = await axios.put(`${this.BaseURL}suretoread?messageid=${messageid}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 消息设置为已执行
    async suretozx(messageid) {
        let ret = await axios.put(`${this.BaseURL}suretozx?messageid=${messageid}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 获取供应商基础信息修改记录
    async getgysbaseupdmessagehistroy(parmas) {
        let {directoryId,orgId,gysname,startdate,enddate,pageNum,rowNum} = parmas
        let ret = await axios.get(`${this.BaseURL}getgysbaseupdmessagehistroy?directoryId=${directoryId}&orgId=${orgId}&gysname=${gysname}&startdate=${startdate}&enddate=${enddate}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    // (集团)根据日期查询历史版本接口
    async searchgyshistoriesbyjt(parmas) {
        let {directoryId,endDate,pageNum,rowNum,gysname} = parmas
        let ret = await axios.get(`${this.BaseURL}searchgyshistoriesbyjt?directoryId=${directoryId}&endDate=${endDate}&gysname=${gysname}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // (院所)根据日期查询历史版本接口
    async searchgyshistories(parmas) {
        let {directoryId,orgID,endDate,pageNum,rowNum,gysname} = parmas
        let ret = await axios.get(`${this.BaseURL}searchgyshistoriesbyjt?directoryId=${directoryId}&orgID=${orgID}&endDate=${endDate}&gysname=${gysname}&pageNum=${pageNum}&rowNum=${rowNum}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    // 获取名录授权信息(下拉框)
    async getDirectoryAuthorizedInfo(directoryId) {
        let {departmentId} = this.pageInfo
        let ret = await axios.get(`${this.BaseURL}getDirectoryAuthorizedInfo?directoryId=${directoryId}&orgId=${departmentId}`)
        if (ret.status == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }



}
const supplierDirectory = new SupplierDirectory();
export default supplierDirectory;


// [
//     {
//       "createdate": "string",
//       "createuser": "string",
//       "description": "string",
//       "id": "53e2c5cd-9136-4d60-acd3-d60294f10230",
//       "name": "string",
//       "orgid": "string",
//       "status": "20",
//       "updatedate": "string",
//       "updateuser": "string",
//       "version": "string"
//     },
//   {
//   "id": "53e2c5cd-9136-4d60-acd3-d60294f10230",
//   "name": "测试系统名录1216",
//   "description": "测试系统名录1216ddd",
//   "status": "20",
//   "orgid": "188fd53c-c12b-4dcc-aa3b-48d842be2035",
//   "createdate": "2019-12-16 13:12:24.0",
//   "createuser": "tuijin",
//   "updatedate": "2019-12-17 17:21:59.0",
//   "updateuser": "tuijin",
//   "version": null
//   }
//   ]