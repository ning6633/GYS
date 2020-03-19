import * as _ from 'lodash';
import {WindowManager,WindowLayout,ProtocalManager,ModuleApp,ModuleBase,ServiceBase,StorageManager,EventManager,ConfigManager,NetworkManager,DictionaryManager} from "asp-os";
import { Observable } from "rxjs";
import { User, UserToken } from "../../../../system/launcher/modules/user/model/remote";
import { MqttService } from "../../../../system/launcher/modules/mqtt/service/index";

import { ASPResponse } from "../../../../kernel/dictionary-manager/index";
import { UriOptions, CoreOptions, UrlOptions } from "request";

abstract class AppTplService extends ServiceBase {
    reference: AppTplService;
    abstract init(): Promise<boolean>;
}

class AppTplServiceImpl extends AppTplService {

    async init(): Promise<boolean> {
        // await this.model.init();
        return true;
    }
    private cv = DictionaryManager.Instance.convertResponse;
    private mqttService: MqttService;
    private user: UserToken;
    private windowthrough: string;
    constructor(appid: string, mqttService: MqttService, user: UserToken) {
        super(appid);
        this.user = user;
        this.mqttService = mqttService;
    
    }
    endisableMouse(event:string){
        if(this.windowthrough!=event){
            if(event=="disable-click-through"){
                this.windowthrough = event;
                EventManager.Instance.register("disable-click-through","disable-click-through")
            }else{
                this.windowthrough = event;
                EventManager.Instance.register("enable-click-through","enable-click-through")
            }
        }else{
            return;
        }
    }
}

export { AppTplService, AppTplServiceImpl }
