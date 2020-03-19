// 当前文件主要配置路由 - 修改此文件可以实现路由配置
/* 
    主视图主要包括路由配置
    路由共性 组件加载
*/
import React, { Component } from 'react';
import {
    BrowserRouter as Router,  //HashRouter 为通过hash值来切换路由
    NavLink,
    Redirect,
    Switch,
} from 'react-router-dom';
import RouteWithSubRoutes from "../components/RouteWithSubRoutes";
// 加载视图组件
import SupplierManager from "./SupManager";
import supplierVerify from "./SupVerify";
import SupplierDirectory from "./SupDirectory"
import SupplierdirectoryStructure from "./SupDirectorytwo/components/SupplierDirectory"
import SupDiectauthorization from "./SupDirectorytwo/components/SupDiectauthorization"
import SupplierDirectorySee from "./SupDirectorytwo/components/SupplierDirectorySee"
import SupplierDirectoryChange from "./SupDirectorytwo/components/SupplierDirectoryChange"
import SupplierApproval from "./SupApproval";
import SupplierCertificate from "./SupCertificate";
import SupplierProfile from "./SupProfile";
import SupBlackList from "./SupBlackList";
import LoginForm from './Login'
import SupEvaluation from './SupEvaluation'
import SupRecommend from './SupRecommend'
import SupZzssList from './SupEvaluation/components/SupZzssList'
import SupEvaluationManager from './SupEvaluation/components/SupEvaluationManager'
import SupEvaLicence from './SupEvaluation/components/SupZzpjzsList'
import SupZzpjzjList from './SupEvaluation/components/SupZzpjzjList'
import SupZrrd from './Supzrrd'
import SupPjss from './SupPjss'
import SupFshenss from './SupFshenss'
import SupPjrdzs from './SupPjrdzs'
import SupReviewCertificate from './SupReviewCertificate'
import SupPa from './SupPa'
import SupContractManage from './SupContractManage'
import SupAnnualAudit from './SupAnnualAudit'
import SupAnnualExamination from './SupAnnualExamination'
import ReviewImplementation from './ReviewImplementation'
import Supruku from './Supruku'
import Suprkgl from './Suprkgl'
import Supfk from './Supfk'
import SupBzku from './SupBzku'
//***training***
import TrainingType from './SupTraining/components/TrainingType'
import TrainingPlan from './SupTraining/components/TrainingPlan'
import TrainingApplySpecial from './SupTraining/components/TrainingApplySpecial'
import TrainingApplyZR from './SupTraining/components/TrainingApplyZR'
import TrainApplication from './SupTraining/components/TrainApplication'
import TrainingLicence from './SupTraining/components/TrainingLicence'
import TrainingScheme from './SupTraining/components/TrainingScheme'
import TrainingSchemeTypes from './SupTraining/components/TrainingSchemeTypes'
import TrainingSSRecord from './SupTraining/components/TrainingSSRecord'
//***END***
//***access***
import SupAccessRecommend from './SupAccess/components/SupAccessRecommend'


//***END***

//***lzy***
import SupPxssList from './SupTraining/components/SupPxssList'
import SupDisciplinary from './SupDisciplinary'
import SupCleanups from './SupCleanups'
//***曝光平台***
import SupExposurePlatformQuery from './SupExposureStage/components/SupExposurePlatformQuery';
import SupExposurePlatformManagement from './SupExposureStage/components/SupExposurePlatformManagement';
import SupplierEnquiry from './SupComplaint/components/SupEnquiry'
import SupplierEnquiryList from './SupComplaint/components/SupEnquiryList'
import SupCommunication from './SupCommunication/components/Supcommunication'

import SupRelationship from './SupRelationship'
import SupShowCommunication from './SupCommunication/components/SupShowCommunication'
import SupplierCurriculum from './SupTraining/components/TrainingCurriculum/index'

import TrainingNotice from './SupTraining/components/TrainingNotice/index'
import TrainingSpecial from './SupTraining/components/TrainingSpecial'
import TrainingAdmittance from './SupTraining/components/TrainingAdmittance'
import Administration from './SupTraining/components/Administration'

/** 准入 */
//***END***

// ===================  //
// 路由配置 - 可以配置跟路由 + 子路由 （含父子关系路由嵌套）
const BASENAME = '/fe';
const routes = [
    {
        path: `${BASENAME}/supplier`,
        component: SupplierManager,
        exact: true
    },
    {
        path: `${BASENAME}/supplierverify`,
        component: supplierVerify,
        exact: true
    },
    {
        path: `${BASENAME}/supplierdirectory`,
        component: SupplierDirectory,
        exact: true
    },
    {
        path: `${BASENAME}/supDiectauthorization`,
        component: SupDiectauthorization,
        exact: true
    },
    {
        path: `${BASENAME}/supplierDirectorysee`,
        component: SupplierDirectorySee,
        exact: true
    },
    {
        path: `${BASENAME}/supplierDirectorychange`,
        component: SupplierDirectoryChange,
        exact: true
    },
    {
        path: `${BASENAME}/supplierdirectorystructure`,
        component: SupplierdirectoryStructure,
        exact: true
    },
    {
        path: `${BASENAME}/supplierapproval`,
        component: SupplierApproval,
        exact: true
    },
    {
        path: `${BASENAME}/suppliercertificate`,
        component: SupplierCertificate,
        exact: true
    },
    {
        path: `${BASENAME}/supplierprofile`,
        component: SupplierProfile,
        exact: true
    },
    {
        path: `${BASENAME}/supblacklist`,
        component: SupBlackList,
        exact: true
    },
    //lzy
    {
        path: `${BASENAME}/supevaluation`,
        component: SupEvaluation,
        exact: true
    },
    {
        path: `${BASENAME}/supzzssList`,
        component: SupZzssList,
        exact: true

    },
   
    {
        path: `${BASENAME}/supaccess`,
        component: SupAccessRecommend,
        exact: true
    },
    {
        path: `${BASENAME}/suprecommend`,
        component: SupRecommend,
        exact: true
    },
    {
        path: `${BASENAME}/supzzapply`,
        component: SupEvaluationManager,
        exact: true
    },
    {
        path: `${BASENAME}/supevalicence`,
        component: SupEvaLicence,
        exact: true
    },
    {
        path: `${BASENAME}/supzzpjzjlist`,
        component: SupZzpjzjList,
        exact: true
    },
    {
        path: `${BASENAME}/supzrrd`,
        component: SupZrrd,
        exact: true
    },
    {
        path: `${BASENAME}/suppjrdss`,
        component: SupPjss,
        exact: true
    },
    {
        path: `${BASENAME}/supfshenss`,
        component: SupFshenss,
        exact: true
    },
    {
        path: `${BASENAME}/supannualaudit`,
        component: SupAnnualAudit,
        exact: true
    },
    {
        path: `${BASENAME}/suppjrdzs`,
        component: SupPjrdzs,
        exact: true
    },
    {
        path: `${BASENAME}/supreviewcertificate`,
        component: SupReviewCertificate,
        exact: true
    },
    {
        path: `${BASENAME}/suppa`,
        component: SupPa,
        exact: true
    },
    {
        path: `${BASENAME}/supdisciplinary`,
        component: SupDisciplinary,
        exact: true
    },
    {
        path: `${BASENAME}/supcleanups`,
        component: SupCleanups,
        exact: true
    },
    
    {
        path: `${BASENAME}/supcontractmanage`,
        component: SupContractManage,
        exact: true
    },
    {
        path: `${BASENAME}/reviewimplementation`,
        component: ReviewImplementation,
        exact: true
    },
    {
        path: `${BASENAME}/supannualexamination`,
        component: SupAnnualExamination,
        exact: true
    },
    {
        path: `${BASENAME}/supruku`,
        component: Supruku,
        exact: true
    },
    {
        path: `${BASENAME}/supfk`, // 供应商反馈管理
        component: Supfk,
        exact: true
    },
    {
        path: `${BASENAME}/supbzku`, // 供应商标准库管理
        component: SupBzku,
        exact: true
    },
    {
        path: `${BASENAME}/suprkgl`, // 供应商角色 入库管理
        component: Suprkgl,
        exact: true
    },
    {
        path: `${BASENAME}/login`,
        component: LoginForm,
        exact: true
    },
    //zq
    {
        path: `${BASENAME}/trainingtype`,
        component: TrainingType,
        exact: true
    },
    {
        path: `${BASENAME}/trainingapplyspecial`,
        component: TrainingApplySpecial,
        exact: true
    },
    {
        path: `${BASENAME}/trainingapplyzr`,
        component: TrainingApplyZR,
        exact: true
    },
    
    {
        path: `${BASENAME}/trainingplan`,
        component: TrainingPlan,
        exact: true
    },
    {
        path: `${BASENAME}/trainingschme`,
        component: TrainingScheme,
        exact: true
    },
    {
        path: `${BASENAME}/trainingschemetypes`,
        component: TrainingSchemeTypes,
        exact: true
    },
    
    {
        path: `${BASENAME}/trainapplication`,
        component: TrainApplication,
        exact: true
    },
    {
        path: `${BASENAME}/traininglicence`,
        component: TrainingLicence,
        exact: true
    },

    //lzy
    {
        path: `${BASENAME}/suppxssrecord`,
        component: TrainingSSRecord,
        exact: true

    },
    {
        path: `${BASENAME}/suppxsslist`,
        component: SupPxssList,
        exact: true
    },


    {
        path: `${BASENAME}/supexposureplatformquery`,
        component: SupExposurePlatformQuery,
        exact: true
    },
    {
        path: `${BASENAME}/SupExposurePlatformManagement`,
        component: SupExposurePlatformManagement,
        exact: true
    },
    {
        path: `${BASENAME}/supexcomplaintenquiry`,
        component: SupplierEnquiry,
        exact: true
    },
    {
        path: `${BASENAME}/supexcomplaintenquirylist`,
        component: SupplierEnquiryList,
        exact: true
    },
    {
        path: `${BASENAME}/supcommunication`,
        component: SupCommunication,
        exact: true
    },
    {
        path: `${BASENAME}/supshowcommunication`,
        component: SupShowCommunication,
        exact: true
    },
    {
        path: `${BASENAME}/suprelationship`,
        component: SupRelationship,
        exact: true
    },
    {
        path: `${BASENAME}/trainingcurriculum`,
        component: SupplierCurriculum,
        exact: true
    },
    {
        path: `${BASENAME}/trainingnotice`,
        component: TrainingNotice,
        exact: true
    },
    {
        path: `${BASENAME}/trainingspecial`,
        component: TrainingSpecial,
        exact: true
    },
    {
        path: `${BASENAME}/trainingadmittance`,
        component: TrainingAdmittance,
        exact: true
    },
    {
        path: `${BASENAME}/administration`,
        component: Administration,
        exact: true
    }
    
];
// ===================  //


/* 
    Router 只能包含一个子元素
    Link 标签只能在 r 内使用
    如果需要增加路由，需要在此处添加相应的代码
    exact: When true, will only match if the path matches the location.pathname exactly. ，如果为true，则仅在路径与location.pathname完全匹配时才匹配
    Redirect: 当路由没有匹配到时将被重定向到 "/" <Redirect to="/" />
    文档：https://reacttraining.com/react-router/web/api/Route
*/
class Main extends Component {
    render() {
        return (
            <div>
                <Router>
                    <div className="main_layout">
                        <Switch>
                            {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
                            <Redirect path="/" to={`${BASENAME}/supplier`} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
}

export { Main }