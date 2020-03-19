import {WindowManager,WindowLayout,ProtocalManager,ModuleApp,ModuleBase,ServiceBase,StorageManager,EventManager,ConfigManager,NetworkManager} from "asp-os";
import { User, UserToken } from "../../../system/launcher/modules/user/model/remote";
import { AppTplService, AppTplServiceImpl } from "./service/index";
import { MqttService } from "../../../system/launcher/modules/mqtt/service/index";
import * as path from "path";
import { MicroAppMgrService } from "../../../system/microapp/modules/services/index";

var {
    decodeToken,
    getTokenExpirationDate,
    isTokenExpired,
} = require('jwt-node-decoder');

class AppTplModule implements ModuleBase {
    async onInited() {
    }

    mdlId: string;

    private user: UserToken;
    private appid: string;
    private mqttService: MqttService;
    private AppTplSer:AppTplServiceImpl;

    constructor(user: UserToken, appid: string, mqttService: MqttService) {
        this.appid = appid;
        this.user = user;
        this.mqttService = mqttService;
    }

    async initUI(): Promise<boolean> {
        WindowManager.Instance.registerWindow({
            appid: this.appid,
            winid: this.appid,
            title: "AppTpl", 
            url: process.env.dev==='AppTpl'?"http://localhost:9000":"asp-os://AppTpl/index.html",
            option: { layout: 'none' ,position:'right'},
            width: 390,
            height: 714
        });
        return true;
    }
    // win.setIgnoreMouseEvents(ignore[, options])

    async initService(service: Map<string, ServiceBase>): Promise<boolean> {
        this.AppTplSer = new AppTplServiceImpl(this.appid, this.mqttService, this.user);
        service.set('AppTplService', this.AppTplSer);
        return true;
    }

    onEventMessage(message: string, content: any): void {
        throw new Error("Method not implemented.");
    }

}

export { AppTplModule }