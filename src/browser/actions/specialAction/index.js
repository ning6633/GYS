import ActionBase from "../actbase";
import axios from "axios";
import { message} from 'antd'
/* 
专家管理
*/
class SpecialAction extends ActionBase {
   
    //新建专家
    async newSpecialist(body) {
       
        // 核对修改供应商及产品信息
        let ret = await axios.post(`${this.BaseURL}specialist`, body)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }

    //查询专家列表
    async getSpecialist(options){
        let ret = await axios.get(`${this.BaseURL}specialists/name/type`, {
            params: {
               ...options
            }
        })
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //移除专家列表
    async deleteSpecialist(ids){
        let ret = await axios.delete(`${this.BaseURL}specialist?ids=${ids}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //查询专家字典
    async getSpecialDIc(){
        let ret = await axios.get(`${this.BaseURL}specialist/dic`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data;
        } else {
            message.error(ret.data.message)
        }
    }
    //根据领域查询专家列表
    async getSpecialistByFiled(username,fields){
        let ret = await axios.get(`${this.BaseURL}field/specialist?username=${username}&fields=${fields}`)
        if (ret.status == 200 && ret.data.code == 200) {
            return ret.data.data;
        } else {
            message.error(ret.data.message)
        }
    }
}
const specialAction = new SpecialAction();
export default specialAction;