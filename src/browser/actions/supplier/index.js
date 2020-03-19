import ActionBase from "../actbase";
import axios from "axios";
import {
    message
} from "antd";
class SupplierAction extends ActionBase {
    async getSupplierList(pageNum, rowNum) {
        const {
            departmentId,
            userId
        } = this.pageInfo;
        // 获取供应商列表
        let ret = await axios.get(this.BaseURL + 'gysInfos', {
            params: {
                userId,
                departmentId,
                pageNum,
                rowNum
            }
        })
        console.log(ret)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async addSupplierinfo(body) {
        // 获取供应商列表
        let ret = await axios.post(this.BaseURL + 'gysInfos', {
            ...body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getCurSupIsBZ(data) {
        // 获取当前供应商是否标准
        let ret = await axios.post(this.BaseURL + 'confGysInfosBase', {
            ...data
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async addgysInfosTjBjk(body) {
        // 供应商从中间库入标准库
        let ret = await axios.post(this.BaseURL + 'gysInfosTjBjk' + `?username= ${this.pageInfo.username}`, {
            ...body
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async tjGysBaseInfos(id) {
        // PUT /1.0/tjGysBaseInfos 除703的单位提交中间库数据（单个提交
        let {
            userId,
            username,
        } = this.pageInfo
        let ret = await axios.put(this.BaseURL + 'tjGysBaseInfos' + `?id=${id}&username=${username}&userId=${userId}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async gysStorageInfosexcel(body) {
        // 从中间库导出 EXCEL
        let str = '';
        for (let key in body) {
            str += `${key}=${body[key] ? body[key] : ''}&`
        }
        let downloadURL = this.BaseURL + 'gysStorageInfosexcel/args?' + str
        console.log(downloadURL);
        window.open(downloadURL)
    }
    async gysTbInfosexcel(body) {
        // 从填报导出 EXCEL
        let str = '';
        for (let key in body) {
            str += `${key}=${body[key] ? body[key] : ''}&`
        }
        let downloadURL = this.BaseURL + 'gysTbInfosexcel/args?' + str
        console.log(downloadURL);
        window.open(downloadURL)
    }
    async submitSupplierInfo(redord) {
        // 提交供应商信息
        let ret = await axios.put(this.BaseURL + 'gysInfosTj', redord)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async tuihuiSupplierInfo(id) {
        // 退回供应商提交信息
        const {
            userId,
            username,
            departmentId
        } = this.pageInfo;
        let ret = await axios.put(this.BaseURL + 'gysTbInfoBack' + `?id=${id}&userId=${userId}&departmentId=${departmentId}&userName=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async tuihuiSupplierzjk(id) {
        // 退回供应商中间库信息
        const {
            userId,
            username,
            departmentId
        } = this.pageInfo;
        let ret = await axios.put(this.BaseURL + 'backGysBaseInfos' + `?id=${id}&userId=${userId}&departmentId=${departmentId}&userName=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async verifySupplierInfo(redord) {
        // 校验供应商信息
        let ret = await axios.post(this.BaseURL + 'gysInfosTjJy', redord)
        if (ret.status == 200 && ret.data.code == 200) {
            message.error(ret.data.message)
            return false;
        } else {
            return true;
        }
    }
    async suppleierzjkUpload(redord) {
        // 校验供应商信息
        let ret = await axios.post(this.BaseURL + 'upload', redord)
        if (ret.status == 200 && ret.data.code == 200) {
            message.error("上传失败")
            return false;
        } else {
            return true;
        }
    }
    /* async submitSupplierInfo(redord) {
        const departmentId = this.pageInfo.departmentId;
        // 提交供应商信息
        console.log(redord);
        let ret = await axios.put(this.BaseURL + 'gysInfosTj' + '?ids=' + redord)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    } */
    async deleteSupplierInfo(redord) {
        // 删除供应商信息
        let ret = await axios.delete(this.BaseURL + 'gys' + '?ids=' + redord)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else if (ret.status == 200 && ret.data.code == 204) {
            message.error(ret.data.message)
            // 全部失败
            return false;
        } else if (ret.status == 200 && ret.data.code == 205) {
            message.error(ret.data.message)
            // 部分失败和部分成功
            return ret.data.data;
        }
    }
    async deleteSupplierProductInfo(redord) {
        // 删除供应商产品信息
        let ret = await axios.delete(this.BaseURL + 'product' + '?ids=' + redord)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async editorSupplierProductInfo(supplierId, productId, redord) {
        // 编辑供应商产品信息
        let ret = await axios.put(`${this.BaseURL}product?id1=${supplierId}&id2=${productId}`, redord)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async remoteEditorInfo(redord) {
        // 编辑供应商信息
        let { username, userId } = this.pageInfo
        let ret = await axios.put(`${this.BaseURL}gysInfos`, {
            ...redord,
            updateuser: username,
            processdefid: userId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async searchSupplierInfo(name) {
        // 搜索供应商信息
        let ret = await axios.get(`${this.BaseURL}standardGyss`, {
            params: {
                name,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async searchCompanyInfo(name) {
        // 搜索院所信息
        const { departmentId } = this.pageInfo;
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
    async addSupplierProductinfo(body, id) {
        // 添加供应商产品
        let ret = await axios.post(this.BaseURL + 'product' + '?id=' + id, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async supplierfeedback(gysid, content, {
        is_name_error = 0,
        is_code_error = 0
    }) {
        // 供应商问题反馈
        let ret = await axios.post(`${this.BaseURL}gys/feedback?gysid=${gysid}&content=${content}&is_name_error=${is_name_error}&is_code_error=${is_code_error}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getfeedbacksList(pageNum, rowNum) {
        // 获取供应商列表
        let ret = await axios.get(this.BaseURL + 'gys/feedbacks', {
            params: {
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async getSupplierProductlist(id) {
        // 获取供应商产品列表
        let ret = await axios.get(this.BaseURL + 'product' + '?id=' + id)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async chooseSupplierList() {
        // 获取标准供应商列表
        let ret = await axios.get(this.BaseURL + 'standardGys')
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getSupplierPuductSelect() {
        // GET /1.0/productComboBox 选择供应商产品表下拉框
        let ret = await axios.get(this.BaseURL + 'productComboBox')
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getCompanyListTree() {
        // 获取单位树
        const departmentId = this.pageInfo.departmentId;
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
    async getCompanyTypeTree() {
        // 获取企业性质
        const departmentId = this.pageInfo.departmentId;
        let ret = await axios.get(this.BaseURL + 'qyxz', {
            params: {
                departmentId,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            // message.error(ret.data.message)
            message.error('获取企业性质失败')
            return [];
        }
    }
    async gysInfosTjzjk(putdata) {
        // 提交供应商中间库信息
        const { departmentId, username } = this.pageInfo;
        for (let i in putdata) {
            if (putdata[i] == undefined) {
                putdata[i] = ''
            }
        }
        let ret = await axios.put(`${this.BaseURL}gysInfosTjzjk`, {
            ...putdata,
            dept_id: departmentId,
            createuser: username,
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async gysInfosTjzjkxg(putdata) {
        // 编辑供应商中间库信息
        const {
            departmentId,
            username
        } = this.pageInfo;
        for (let i in putdata) {
            if (putdata[i] == undefined) {
                putdata[i] = ''
            }
        }
        putdata.dept_id = departmentId;
        putdata.createuser = username;
        let ret = await axios.put(`${this.BaseURL}gysInfosTjzjkxg`, {
            ...putdata,
            dept_id: departmentId,
            createuser: username,
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async addSupBZkuInfo(body) {
        // 新增标准库供应商
        const {
            userId,
            username,
            departmentId
        } = this.pageInfo;
        for (let i in body) {
            if (body[i] == undefined) {
                body[i] = ''
            }
        }
        let ret = await axios.post(`${this.BaseURL}gysInfosBase?userId=${userId}&userName=${username}`, {
            ...body,
            org_id: departmentId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async modifySupBZkuInfo(body, supplierId) {
        // 修改标准库供应商
        const {
            userId,
            username,
            departmentId
        } = this.pageInfo;
        for (let i in body) {
            if (body[i] == undefined) {
                body[i] = ''
            }
        }
        let ret = await axios.put(`${this.BaseURL}gysInfosBase?userId=${userId}&userName=${username}`, {
            ...body,
            org_id: departmentId,
            id: supplierId
        })
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getworldareatree() {
        // 获取世界树
        let ret = await axios.get(`${this.BaseURL}lookup/getworldareatree`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async deleteBZkuInfo(provider_Id) {
        // 获取世界树
        let {
            userId,
            username
        } = this.pageInfo;
        let ret = await axios.delete(`${this.BaseURL}gysInfosBase?userId=${userId}&userName=${username}&provider_id=${provider_Id}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async uploadSupplierBZkuInfo(provider_Id) {
        let {
            userId,
            username
        } = this.pageInfo;
        let ret = await axios.put(`${this.BaseURL}gysInfosBase?userId=${userId}&userName=${username}`)
        if (ret.status == 200 && ret.data.code == 200) {
            message.success(ret.data.message)
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    async getRukuSupplierList(pageNum, rowNum) {
        const departmentId = this.pageInfo.departmentId;
        // 获取待入库供应商列表
        let ret = await axios.get(this.BaseURL + 'gysStorageInfos', {
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
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async gysStorageInfosDept(pageNum, rowNum) {
        const departmentId = this.pageInfo.departmentId;
        // 获取供应商中间库信息(除703所的各单位)
        let ret = await axios.get(this.BaseURL + 'gysStorageInfosDept', {
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
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async searchRukuSupplierList(pageNum, rowNum, searchval) {
        const departmentId = this.pageInfo.departmentId;
        let {
            name = '',
            code = '',
            status = '',
            property_key = '',
            org_id = '',
            dept_id = ''
        } = searchval
        // 搜索待入库供应商列表
        console.log(searchval)
        let ret = await axios.get(this.BaseURL + 'gysStorageInfos/args', {
            params: {
                name,
                code,
                property_key,
                org_id,
                dept_id,
                pageNum,
                rowNum,
                status
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async getBzkuSupplierList(pageNum, rowNum) {
        const departmentId = this.pageInfo.departmentId;
        // 获取供应商标准列表
        let ret = await axios.get(this.BaseURL + 'gysPartBaseInfo', {
            params: {
                pageNum,
                rowNum
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async searchBzkuSupplierList(pageNum, rowNum, {
        name = '',
        code =  '',
        property =  '',
        district =  '',
    }) {
        // 搜索供应商标准列表
        let ret = await axios.get(this.BaseURL + 'gysPartBaseInfo', {
            params: {
                district:district,
                code: code,
                property: property,
                name: name,
                pageNum,
                rowNum,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
    async searchWithTypeSupplierList(pageNum, rowNum, {
        name = '',
        status = '',
        level = '',
        org_id = '',
        dept_id = ''
    }) {
        const {
            departmentId,
            userId
        } = this.pageInfo;
        // 搜索供应商列表
        let ret = await axios.get(this.BaseURL + 'gysStorageInfosTb/args', {
            params: {
                departmentId,
                userId,
                name,
                status,
                level,
                org_id,
                dept_id,
                pageNum,
                rowNum,
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
            return {
                list: [],
                recordsTotal: 0
            }
        }
    }
  
    async gysPartBaseInfoExcel(name) {
        // 标准库导出 EXCEL
        let str = `name=${name}&code=${name}&property=${name}`;
        let downloadURL = this.BaseURL + 'gysPartBaseInfoExcel?' + str
        console.log(downloadURL);
        window.open(downloadURL)
    }
    async gysBaseInfosexcel() {
        // 标准库临时导出 EXCEL
        let downloadURL = this.BaseURL + 'gysBaseInfosexcel'
        window.open(downloadURL)
    }
}
const supplierAction = new SupplierAction();
export default supplierAction;