if (process.env.dev === 'AppTpl') {
    require('module').Module._initPaths();
}
import * as minimist from 'minimist';
import { WindowManager, WindowLayout, ProtocalManager, ModuleApp, ModuleBase, ServiceBase, StorageManager, EventManager, ConfigManager, NetworkManager } from "asp-os";
import { AppTplModule } from './modules/index';
import { UserToken } from '../../system/launcher/modules/user/model/remote';
import { MqttService } from "../../system/launcher/modules/mqtt/service/index";
import * as uri from 'urijs';
import { AuthService } from "../../system/launcher/modules/user/service/index";
import { MicroAppMgrService } from '../../system/microapp/modules/services/index';


class AppTpl extends ModuleApp {
    [x: string]: any;
    private user: UserToken;
    private usersrc: AuthService;

    constructor(appId: string, appToken: string) {
        super(appId, appToken);
        this.usersrc = this.getServiceByClassName('AuthService');
        this.user = this.usersrc.CurrentUser;
    }

    async initModules(modules: ModuleBase[]): Promise<boolean> {
        let mqttService = this.getServiceByClassName('MqttService');
        modules.push(new AppTplModule(this.user, this.appId, mqttService));
        return true;
    }

    //根据传入的参数启动不同的UI
    async start(args: string[], newinstance?: boolean): Promise<boolean> {
        let argv = minimist(args);
        let parg: string = argv["protocal"];
        let arg = argv["shellapp"];
        let win;
        if ((parg != undefined) && (parg.startsWith('asp://shellapp/AppTpl'))) {
            let urlobj = new uri(parg).segment();
            win = WindowManager.Instance.showWindow(this.appId, {
                type: urlobj[1],
                key: urlobj[2]
            });
        }
        else {
            if (arg == 'AppTpl') {
                win = WindowManager.Instance.showWindow(this.appId);
            }
            else {
                return true;
            }
        }


        if (process.env.dev !== 'AppTpl') {
            //win.object.setAlwaysOnTop(true);
            win.object.setIgnoreMouseEvents(true, { forward: true });
            EventManager.Instance.listen("disable-click-through", () => {
                win.object.setIgnoreMouseEvents(false, { forward: true });
            })
            EventManager.Instance.listen("enable-click-through", () => {
                win.object.setIgnoreMouseEvents(true, { forward: true });
            })
        }
    }

    stop(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

export = AppTpl;