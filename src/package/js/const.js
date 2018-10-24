/**
 * @name 盒子接口
 */
// 盒子相关属性
var PageTitle = document.title.split('-').length > 1 ? document.title.split('-')[1].toLowerCase() : "";
try {
    Authentication.CTCGetConfig("UserID");
}
catch (err) {
    var Authentication;
    Authentication = {
        CTCGetConfig: function () {
            return undefined;
        }
    };
}
var UserID = Authentication.CTCGetConfig("UserID") || 'zhuoying1';
var UserGroupID = Authentication.CTCGetConfig("UserGroupNMB") || '';
var UserToken = Authentication.CTCGetConfig("UserToken") || '';
var EpgGroupID = Authentication.CTCGetConfig("AreaNode") || '';
var STBID = Authentication.CTCGetConfig("STBID") || '';
var STBType = Authentication.CTCGetConfig("STBType") || 'Browser';
var TerminalType = Authentication.CTCGetConfig("TerminalType") || '';
var AreaNode = Authentication.CTCGetConfig("AreaNode") || '';
var IP = Authentication.CTCGetConfig("IP") || '';
var MAC = Authentication.CTCGetConfig("MAC") || '';
var CountyID = Authentication.CTCGetConfig("CountyID") || '';
var Version = "game";
// 盒子对象
var Utility;
if (!Utility) {
    Utility = {
        setValueByName: function (command) {
            return undefined;
        }
    };
}
// 返回launcher
var Util = {
    /**
     * 安徽
     * 0 成功 -1 失败
     */
    setValueByName: function () {
        return Utility.setValueByName("exitIptvApp");
    },
    /**
     * 云南
     */
    getDomainUrl: function () {
        return Authentication.CTCGetConfig("EPGDomain");
    },
};
/**
 * 设备配置映射
 * type：厂商 安徽盒子
 * is4K：是否是4k盒子
 * needAnimate：加载页面是否需要动画效果
 * supportSmallWin：是否支持小窗口播放视频
 * supportXiri: 是否支持讯飞语音 （在讯飞功能没有正式上线之前，该处统一设置为false）
 */
var DEV_MAP = {
    /**
     * 中兴
     */
    "B760EV3": {
        type: "ZH",
        is4K: false,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: false
    },
    "B760H": {
        type: "ZH",
        is4K: false,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: false
    },
    "B860A": {
        type: "ZH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "B860AV1.1": {
        type: "ZH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "B860AV1.1-T": {
        type: "ZH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "B860AV1.1-T2": {
        type: "ZH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "B860GV1.1": {
        type: "ZH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: false,
        supportXiri: false
    },
    /**
     * 创维
     */
    "E8205": {
        type: "CW",
        is4K: false,
        needAnimate: false,
        supportSmallWin: false,
        supportXiri: false
    },
    "E910": {
        type: "CW",
        is4K: false,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: false
    },
    "E909": {
        type: "CW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: true
    },
    "E900": {
        type: "CW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "E900-s": {
        type: "CW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "E910V10D": {
        type: "CW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: true
    },
    "E910V10C": {
        type: "CW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: true
    },
    "E950": {
        type: "CW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: true
    },
    /**
     * 数码视讯
     * 的两款盒子，不支持Velocity来做页面加载的上滑效果,所以就算开启了动画也要把上滑效果屏蔽掉
     */
    "Q5": {
        type: "SMSX",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: false
    },
    "S6CT": {
        type: "SMSX",
        is4K: false,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: false
    },
    /**
     * 烽火 HG680
     */
    "HG680": {
        type: "FH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    "HG680-J": {
        type: "FH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 烽火 MR820
     */
    "MR820": {
        type: "FH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 烽火 MR622
     */
    "MR622": {
        type: "FH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 海信
     */
    "IP906H_36T1": {
        type: "HX",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 天翼 TY1208-Z
     */
    "TY1208-Z": {
        type: "TY",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 九州 PTV-8098
     */
    "PTV-8098": {
        type: "JZ",
        is4K: true,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: true
    },
    /**
     * 九州 PTV-8508
     */
    "PTV-8508": {
        type: "JZ",
        is4K: false,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: false
    },
    "EC6108V9C": {
        type: "HW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "EC6108V9_pub_ahwdx": {
        type: "HW",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 四创
     */
    "SCIP906H_R": {
        type: "SC",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 长虹
     */
    "IHO-3000S": {
        type: "CH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    "GP920": {
        type: "CH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 中通服
     */
    "YiX-G110": {
        type: "CH",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 器贸
     */
    "AHQM-RG01": {
        type: "QM",
        is4K: true,
        needAnimate: false,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 贝尔
     */
    "RG020ET-CA": {
        type: "CH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "G-120WT-P": {
        type: "CH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 瑞斯康达
     */
    "HT660": {
        type: "CH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    "HT670-GP-V": {
        type: "CH",
        is4K: true,
        needAnimate: true,
        supportSmallWin: true,
        supportXiri: true
    },
    /**
     * 浏览器
     */
    "Browser": {
        type: "PC",
        is4K: true,
        needAnimate: true,
        supportSmallWin: false,
        supportXiri: false
    }
};
function hasSupportSmallWin(stbType) {
    if (DEV_MAP[stbType] && !DEV_MAP[stbType].supportSmallWin) {
        return false;
    }
    else {
        return true;
    }
}
function hasDesignatedBox(stbType, stbName) {
    if (DEV_MAP[stbType] && stbName == DEV_MAP[stbType].type) {
        return true;
    }
    else {
        return false;
    }
}
// 安徽是否支持统一播放器
function hasUnifyPlayer() {
    return STBAppManager.isAppInstalled("com.anhui.tv");
}
// 安徽打开统一播放器
/**
 *
 * @param playUrl 播放地址
 * @param type 0：点播、1直播，2回看
 */
function openUnifyPlayer(params) {
    // document.getElementById("message").innerText = "{'intentType':0,'appName':'com.anhui.tv', 'className':'com.anhui.tv.activity.AnHuiPlayDemandActivity','extra':[{'Title':'" + params.title + "'},{'Type':'" + params.type + "'},{'Type2':'0'},{'PlayUrl':'" + params.playUrl + "'},{'License':'ahdx'},{'MenuType':'1'},{'IsUnivideo':'1'}]}";
    // return;
    // 支持统一播放器调用此播放器
    // 海信盒子
    if (hasDesignatedBox(STBType, 'HX')) {
        STBAppManager.startAppByIntent("{'intentType':0,'appName':'com.anhui.tv', 'className':'com.anhui.tv.activity.AnHuiPlayDemandActivity','extra':[{'Title':'" + params.title + "'},{'Type':'" + params.type + "'},{'PlayUrl':'" + params.playUrl + "'},{'License':'ahdx'},{'MenuType':'1'},{'IsUnivideo':'1'}]}");
    }
    else {
        STBAppManager.startAppByIntent("{'intentType':0,'appName':'com.anhui.tv', 'className':'com.anhui.tv.activity.AnHuiPlayDemandActivity','extra':[{'name':'Title', 'value':'" + params.title + "'},{'name':'Type', 'value':'" + params.type + "'},{'name':'PlayUrl', 'value':'" + params.playUrl + "'},{'name':'License', 'value':'ahdx'},{'name':'MenuType', 'value':'1'},{'name':'IsUnivideo', 'value':'1'}]}");
    }
}
