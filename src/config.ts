import { Json } from "./framework/basic/json";
import { Cookie } from "./framework/basic/cookie";

export let Config = {
    serviceDomain: '',
    imgDomain: '',
    apiPath: {
        main: ""
    },
    imgPath: {
        public: ""
    },
    debugMode: true,
    pageName: {
    },
    mainCookieName: "stbTokenCookieName"
}

// let host = window.location.host;

// 自动检测本地服务器
// if (-1 != host.indexOf("127.0.0.1:8080")) {
//     Config.serviceDomain = 'http://***.**.**.***:****';
//     Config.imgDomain = 'http://***.**.**.***:****';
// }
// // 自动检测测试服务器
// else if (-1 != host.indexOf("***.**.**.***:****")) {
//     Config.serviceDomain = 'http://***.**.**.***:****';
//     Config.imgDomain = 'http://***.**.**.***:****';
// }
// // 自动检测正式服务器
// else {
// }

/**
 * 初始化入口数据
 */
// export function initMain(): MainEntity {
    // let cokMain = new Cookie(Config.mainCookieName);
    // let lgc = new CommonLogic();

    // // TODO
    // cokMain.setCookie(Json.serializ({ global_variable: { business_code: info.data.global_variable.business_code, notice: info.data.global_variable.notice }, token: info.data.token }));
    
    // return Json.deSerializ(cokMain.getCookie());
// }
// export function clearInitMain() {
//     let cokMain = new Cookie(Config.mainCookieName);

//     if (!cokMain) {
//         cokMain.clearCookie();
//     }
// }

// export function getApiAddress(keyWorlds: string, ...args: string[]) {
//     let reg = /\{.*?\}/g;

//     let url: string = Config.apiPath[keyWorlds];

//     if (url) {
//         let arr;
//         arr = url.match(reg)
//         for (let i = 0; i < args.length; i++) {
//             url = url.replace(arr[i], args[i]);
//         }
//         return `${Config.serviceDomain}/${url}`;
//     }
// }

// /**
//  * 图片裁剪
//  */
// function getClipAddress(src: string, width: number, height: number) {
//     return src + `_${width}x${height}` + src.substr(src.lastIndexOf(".", src.length));
// }
/**
 * 图片地址
 */
// export function getImageAddress(path: string) {
//     return path ? `${Config.imgDomain}/${Config.imgPath.public}/${path}` : "";
// }

// 安徽是否支持统一播放器
// export function hasUnifyPlayer() {
//     return STBAppManager.isAppInstalled("com.anhui.tv");
// }
// 安徽打开统一播放器
/**
 * 
 * @param playUrl 播放地址
 * @param type 0：点播、1直播，2回看
 */
// export function openUnifyPlayer(params: { playUrl: string, type: 0 | 1 | 2, title: string, startTime: number }) {

//     // document.getElementById("message").innerText = "{'intentType':0,'appName':'com.anhui.tv', 'className':'com.anhui.tv.activity.AnHuiPlayDemandActivity','extra':[{'Title':'" + params.title + "'},{'Type':'" + params.type + "'},{'Type2':'0'},{'PlayUrl':'" + params.playUrl + "'},{'License':'ahdx'},{'MenuType':'1'},{'IsUnivideo':'1'}]}";

//     // return;

//     // 支持统一播放器调用此播放器
//     // 海信盒子
//     if (hasDesignatedBox(STBType, 'HX')) {
//         STBAppManager.startAppByIntent("{'intentType':0,'appName':'com.anhui.tv', 'className':'com.anhui.tv.activity.AnHuiPlayDemandActivity','extra':[{'Title':'" + params.title + "'},{'Type':'" + params.type + "'},{'PlayUrl':'" + params.playUrl + "'},{'StartTime':'" + params.startTime + "'},{'License':'ahdx'},{'MenuType':'1'},{'IsUnivideo':'1'}]}");
//     }
//     // 其他盒子
//     else {
//         STBAppManager.startAppByIntent("{'intentType':0,'appName':'com.anhui.tv', 'className':'com.anhui.tv.activity.AnHuiPlayDemandActivity','extra':[{'name':'Title', 'value':'" + params.title + "'},{'name':'Type', 'value':'" + params.type + "'},{'name':'PlayUrl', 'value':'" + params.playUrl + "'},{'name':'StartTime', 'value':'" + params.startTime + "'},{'name':'License', 'value':'ahdx'},{'name':'MenuType', 'value':'1'},{'name':'IsUnivideo', 'value':'1'}]}");
//     }
// }
/**
 * js截取字符串，中英文都能用
 * @param {sting} str：需要截取的字符串
 * @param {int} len: 需要截取的长度(英文长度)
 * @param {string} type: 截取后的后缀字符串默认"...",若不要请传参数"".
 */
// export function substr(str: string, len: number, type: any) {
//     type = type == null ? "..." : type;
//     let str_length = 0;
//     let str_len: any;
//     let str_cut = new String();
//     let str_arry: any

//     str_len = str.length;
//     let sArr = str.match(/[^\x00-\xff]/ig);
//     let strL = str_len + (sArr == null ? 0 : sArr.length);
//     if (strL <= len + 3) {
//         return str;
//     }
//     for (let i = 0; i < str_len; i++) {
//         let a = str.charAt(i);
//         str_length++;
//         if (escape(a).length > 4) {
//             str_length++;
//         }
//         str_cut = str_cut.concat(a);
//         // str_cut.push(a);
//         if (str_length >= len) {
//             str_cut = str_cut.concat(type);
//             return str_cut;
//         }
//     }
//     str_cut = null;
// }