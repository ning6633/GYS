const {
    exec
} = require("child_process");
const minint = 60;

function schedule_getnewcode(num) {
    console.log(`开始执行每隔${num}秒定时获取,服务端最新代码任务`);
    let i=1;
    setInterval(function () {
        exec("git pull", function (err) {
            if (!err) {
                console.log(`代码拉取成功${i}`);
                i++;
            }
        })
    }, num * 1000)
}

schedule_getnewcode(minint)