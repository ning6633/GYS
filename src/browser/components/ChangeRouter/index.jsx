import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { number, bool, string, array, object } from 'prop-types';
import { Select } from "antd";
const { Option } = Select
class ChangeRouter extends Component {
    config = {
        //------------------填报-------------------
        "fe/supplier": "填报",
        "fe/supruku": "入库",
        "fe/suprkgl": "入库管理",
        "fe/supfk": "反馈",
        "fe/supbzku": "标准库",
        "fe/supplierverify": "核对",

        //-----------------信息管理-------------------
        "fe/supplierdirectory": "名录",
        "fe/supplierdirectorystructure": "名录构建",
        "fe/supDiectauthorization": "名录授权",
        "fe/supplierDirectorysee": "名录查看",
        "fe/supplierDirectorychange": "名录变更",
        "fe/supplierapproval": "基本信息",
        "fe/suppliercertificate": "资质",
        "fe/supplierprofile": "档案",
        "fe/supblacklist": "黑名单",

        //----------------培训管理--------------------
        "fe/trainingschme":"培训策划",
        "fe/trainingschemetypes":"培训策划类型管理",
        "fe/trainingtype": "培训类型",
        "fe/trainingplan": "培训计划",
        "fe/trainingapplyspecial": "专项培训报名",
        "fe/trainingapplyzr": "准入培训报名",
        "fe/trainingcurriculum": "培训课程",
        "fe/trainapplication": "培训申请",
        "fe/traininglicence": "培训证书",
        "fe/suppxssrecord": "培训实施记录",
        "fe/trainingnotice": "培训通知",
        "fe/trainingspecial": "我的专项培训",
        "fe/trainingadmittance": "我的准入培训",
        "fe/administration": "准入培训申请管理",

  //------------------准入认定-------------------
  "fe/supaccess": "准入推荐",

        //旧版
      //  "fe/suppxsslist": "培训实施记录",
      
        //----------------资质评价管理----------------
        // "fe/supevaluation": "评价",
        "fe/suprecommend": "资质评价推荐",
        "fe/supzzapply": "资质评价申请",
        "fe/supevalicence": "资质评价证书",
        "fe/supzzsslist": "资质评价实施",
        "fe/supzzpjzjlist": "专家管理",


      

        //------------------评价认定------------------
        // "fe/supzrrd": "准入认定申请",
        // "fe/suppjrdss": "准入认定实施",
        // "fe/suppjrdzs": "准入认定证书",

        //------------------年度审核 ------------------
        "fe/supreviewcertificate": "复审证书",
        "fe/supannualexamination": "复审计划编制",
        "fe/supfshenss": "复审实施",
       // "fe/supannualaudit": "年度审核",
        
        //------------------绩效评价------------------
        "fe/suppa": "供应商绩效管理（一年一评）",
        "fe/supdisciplinary": "奖惩记录",
        "fe/supcontractmanage": "合同管理（一单一评）",
        "fe/supcleanups": "供应商清退管理",

        //------------------供应商关系管理----------------
        "fe/supexposureplatformquery": "曝光平台查询",
        "fe/supexposureplatformmanagement": "曝光平台管理",
        "fe/supexcomplaintenquiry": "投诉与咨询",
        "fe/supexcomplaintenquirylist": "投诉与咨询列表",
        "fe/supcommunication": "我的交流大会",


        "fe/Supshowcommunication": "供应商交流大会",
        "fe/suprelationship": "供应商展示",



        "fe/login": "退出",
    }
    state = {
        router: [],
        defaultValue: this.config[localStorage.getItem("saverouter")]
    }
    handleChange(value) {
        const { history } = this.props;
        localStorage.setItem("saverouter", value)
        this.setState({
            defaultValue: this.config[value]
        })
        history.push('/' + value)
    }
    componentDidMount() {
        let router = []
        for (let key in this.config) {
            router.push({
                link: key,
                name: this.config[key]
            })
        }
        this.setState({
            router
        })
    }
    render() {
        return (
            <Select defaultValue={this.state.defaultValue} onChange={this.handleChange.bind(this)} style={{ width: 160, marginLeft: 20 }}>
                {
                    this.state.router.map((item, idx) => {
                        return (
                            <Option key={idx} value={item.link}>{item.name}</Option>
                        )
                    })
                }
            </Select>
        )
    }
}

ChangeRouter.propTypes = {
    title: string
}

export default withRouter(ChangeRouter);