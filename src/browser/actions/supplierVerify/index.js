import ActionBase from "../actbase";
import axios from "axios";
import { message} from 'antd'
/* 
核对修改供应商及产品信息
*/
class SupplierVerify extends ActionBase {
    async getSupplierProductinfoList(pageNum, rowNum) {
        const {departmentId} = this.pageInfo;
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
    async modifySupplierProductinfo(gysid, productid, gysProducts) {
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