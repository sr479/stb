import { PageEvent } from "./pageEvent";
import { SetTimeout } from "../basic/setTimeout";
import { SetInterval } from "../basic/setInterval";

/**
 * @name 播放器 直播
 */
/// <reference path="./player.d.ts" />

// 此类做枚举使用
export var PlayerTypeF = {
    StartPlaying: 'PlayerType.StartPlaying',                        // 开始（通常真实进度会有延迟，在调用 播放后直接触发）
    PausePlaying: 'PlayerType.PausePlaying',                        // 暂停
    Released: 'PlayerType.ReleasePlaying',                          // 结束并释放（返回参数释放成功或失败）
    ResumePlaying: 'PlayerType.ResumePlaying',                      // 恢复
    FinishPlay: 'PlayerType.FinishPlay',                            // 完毕
    ProgressChanging: 'PlayerType.ProgressChanging',                // 进度改变进行
    ProgressChanged: 'PlayerType.ProgressChanged',                  // 进度改变完成
    TotalProgressInit: 'PlayerType.TotalProgressInit',              // 总进度初始化
    VolumeInit: "PlayerType.CurrentVolumeInit",                     // 音量初始完毕
    VolumeChanged: 'PlayerType.CurrentVolumeChanged',               // 音量改变完成
    VolumeChanging: 'PlayerType.CurrentVolumeChanging',             // 音量改变进行
    MuteVolume: "PlayerType.MuteVolume",                            // 设置静音
    ResumeVolume: "PlayerType.ResumeVolume"                         // 从静音恢复
}
// 1.播放 2.固定窗口大小位置
export class PlayerF {
    mediaPlay: MediaPlayer = null;
    private playUrl: string;
    private instanceId: number = -100;                   // 默认 -100 非 -100 则为播放器实例
    private totalTime: number = 0;
    private currentTime: number = 0;
    private currentVolume: number = 0;
    private pageEvent: PageEvent;
    private customTotalTime: number = 0;
    public readonly identCode: number = null;

    // 播放完毕
    private finish = false;

    // private settingVolumeTimer = new SetTimeout(1000);
    private settingProgressTimer = new SetTimeout(1000);
    private progressMonitor = new SetInterval(1000); // 视频播放进度以 秒 为单位进行播放，该参数禁止改变（部分盒子进度不会到达最后一或二秒便依赖该定时器进行模拟进度进行）

    private startPlayCount = 0; // 开始播放触发次数

    constructor(params: { identCode: number }, pageEvent: PageEvent) {
        this.identCode = params.identCode;
        this.pageEvent = pageEvent;
        this.createPlayer(pageEvent);
    }
    /**
     * 从头播放
     */
    play(playUrl: string) {
        this.configPlayUrl(playUrl);
        if (this.playUrl) {
            this.currentTime = 0;
            this.totalTime = 0;
            this.startPlayCount = 0;

            // // 在播放过程中调用此方法可能异常，原因未深纠所以做结束处理再重新播放
            // this.pause(false);
            // this.stop();
            this.mediaPlay.setSingleMedia(this.playUrl);      // 播放源
            this.mediaPlay.playFromStart();
            this.startMonitorProgress(true);
        }
    }
    resume(isTrigger = true) {
        if (!this.finish) {
            this.mediaPlay.resume();
            isTrigger && this.pageEvent.trigger(this.identCode, PlayerTypeF.ResumePlaying);
        }
    }
    playPoint(playUrl: string, point: number) {

        this.configPlayUrl(playUrl);
        if (this.playUrl) {
            this.currentTime = 0;
            this.totalTime = 0;
            this.startPlayCount = 0;

            this.mediaPlay.setSingleMedia(this.playUrl);      // 播放源
            this.mediaPlay.playByTime(1, parseInt(<any>this.currentTime), 1);
            this.startMonitorProgress(true);
        }
    }
    pause(triggerPlayerTypeEvent = true) {
        if (!this.finish) {
            this.mediaPlay.pause();        //视频状态

            if (triggerPlayerTypeEvent) {
                this.pageEvent.trigger(this.identCode, PlayerTypeF.PausePlaying);
            }
        }
    }
    stop() {
        this.stopMonitorProgress();
        this.mediaPlay.pause();
        this.mediaPlay.stop();
    }
    release() {
        this.stopMonitorProgress();
        // 暂停
        this.pause(false);
        // 停止流
        this.mediaPlay.stop();

        // 10 秒 之内未释放 mediaPly 则自动跳出
        let r = -100; // -1 默认值 ；0 跳出
        let timer = setTimeout(function () {
            r = r === -100 ? 0 : r;
            clearTimeout(timer);
        }, 10000);

        do {
            r = this.mediaPlay.releaseMediaPlayer(this.instanceId);
        } while (r == -100);
        let b = false;
        if (r !== -100) {
            // 释放成功
            b = true;
            clearTimeout(timer);
        }
        this.pageEvent.trigger(this.identCode, PlayerTypeF.Released, <IReleased>{ success: b });
    }
    plusVolume(value: number) {
        this.setCurrentVolume(value, true);
    }
    minusVolume(value: number) {
        this.setCurrentVolume(value, false);
    }
    getVolume(): number {
        return this.mediaPlay.getVolume();
    }
    getTime(): number {
        return this.currentTime;
    }
    setMute() {
        this.mediaPlay.setMuteFlag(1);
        this.pageEvent.trigger(this.identCode, PlayerTypeF.MuteVolume, <IMuteVolume>{ currentVolume: this.currentVolume });
    }
    resumeVolume() {
        this.mediaPlay.setMuteFlag(0);
        this.pageEvent.trigger(this.identCode, PlayerTypeF.ResumeVolume, <IResumeVolume>{ currentVolume: this.currentVolume });
    }
    isMute(): boolean {
        return Boolean(this.mediaPlay.getMuteFlag());
    }
    speed(value: number) {
        this.setCurrentProgress(value, true);
    }
    reverse(value: number) {
        this.setCurrentProgress(value, false);
    }
    displayFull() {
        this.configDisplay("full");
    }
    displaySmall(displayArea: { left: number, top: number, width: number, height: number }) {
        this.configDisplay("size", displayArea);
    }
    private createPlayer(pageEvent: PageEvent) {
        // 创建实例
        this.mediaPlay = new MediaPlayer();

        // 10 秒 之内未创建 mediaPly 则自动跳出
        let r = -1; // -1 默认值 ；0 跳出
        let timer = setTimeout(function () {
            r = r === -1 ? 0 : r;
            clearTimeout(timer);
        }, 10000);

        do {
            if (this.mediaPlay) {
                if (this.instanceId === -100) {
                    this.instanceId = parseInt(<any>this.mediaPlay.getNativePlayerInstanceID());/*读取本地的媒体播放实例的标识*/
                }
            }
        } while (this.instanceId == -100 && -1 == r);

        if (this.mediaPlay) {
            this.currentVolume = this.getVolume();
            this.pageEvent.trigger(this.identCode, PlayerTypeF.VolumeInit, <IVolumeInit>{ currentVolume: this.getVolume() });
        }

        // 播放器默认已经是全屏播放，这里不做重复处理，小窗播放情况下会重复配置，所以手动配置
        // 配置默认视频状态为全屏。
        // this.displayFull();
    }
    /**
     * 在播放之后执行才会生效
     */
    private startMonitorProgress(isTriggerStartPlayingEvent = true) {
        let stopTime = 0;      // 进度停止了多少秒（异常状态）
        let finishCount = 0;    // 播放完毕事件触发次数
        let buffer = 0;         // 缓冲时间
        let difference = 0;     // 误差

        // 部分盒子到最后 1 或 2 s直接停止
        // 盒子开始播放时 当前进度返回 0 延迟 部分时间才返回当前进度
        // 完善模拟进度，因此在最后 3 秒内按暂停键的话需要
        let method = () => {
            let time = parseInt(<any>this.mediaPlay.getCurrentPlayTime() || -1);

            // document.getElementById('msg').innerHTML = `to:${++lock}time:${time}`;

            // 播放到最后(0-3)秒视频已经结束
            // let num = (this.totalTime - this.currentTime);
            // if (0 < this.currentTime && 0 < this.totalTime) {
            //     if (num <= 3 && num >= 0) {
            //         // time 可能为 -1
            //         if (time == this.currentTime || time < 0) {
            //             stopTime++;
            //         }
            //     }
            // }
            // 模拟真实进度
            // if (0 < stopTime) {
            //     time = this.currentTime + stopTime;
            // }
            // 播放中 当前进度在进行中且至少是 1
            if (time > 0) {
                // 真实进度与界面进度误差不超过 5 s
                difference = 0;
                if (time < this.currentTime) {
                    difference = this.currentTime - time;
                }
                if (time > this.currentTime || difference > 5) {
                    this.currentTime = time;
                    // 视频总时间如果未获取到那么不做最大播放进度的异常处理
                    if (this.totalTime) {
                        this.currentTime = this.currentTime > this.totalTime ? this.totalTime : this.currentTime;
                    }
                    // 播放中
                    if (this.currentTime <= this.totalTime) {
                        this.pageEvent.trigger(this.identCode, PlayerTypeF.ProgressChanging, <IProgressChanging>{ currentTime: this.currentTime, totalTime: this.totalTime });
                        this.pageEvent.trigger(this.identCode, PlayerTypeF.ProgressChanged, <IProgressChanged>{ currentTime: this.currentTime, totalTime: this.totalTime });
                    }
                    if (0 == finishCount) {
                        // if (this.totalTime) {
                        //     // 如果播放器计时器已经停止工作，并且总时间还未初始化，那么触发结束播放事件
                        //     // 排除刚开始播放情况
                        //     if (this.currentTime >= this.totalTime && 0 < this.currentTime && 0 < this.totalTime) {
                        //         // 播放完毕
                        //         finishCount++;
                        //     }
                        // } else {
                        //     // 视频流停止 3 s 时
                        //     if (3 <= stopTime) {
                        //         finishCount++;
                        //     }
                        // }
                    }
                    // 延迟一秒
                    else if (1 == finishCount) {
                        finishCount++;
                    }
                    else if (2 == finishCount) {
                        // this.finish = true;
                        // stopTime = 0;
                        // this.stopMonitorProgress();
                        // this.stop();
                        // this.pageEvent.trigger(this.identCode, PlayerType.FinishPlay);
                    }
                }
            }
            // 开始播放 当前进度可以等于或大于 0 且仅触发一次
            if (0 == this.startPlayCount && 0 <= this.currentTime) {
                // 续播时结束后，重叠多个快件或快退事件对新进度进行干扰，这里进行重置
                this.currentTime = 1;
                // 开始播放事件触发，条件是影片从头开始播放，并且当前进度大于等于 1 ，并且仅执行一次
                if (isTriggerStartPlayingEvent == true) {
                    // document.getElementById('msg').innerHTML = `触发开始播放事件第:${++startPlayCount}次`;
                    this.pageEvent.trigger(this.identCode, PlayerTypeF.StartPlaying, <IStartPlaying>{ totalTime: this.totalTime });
                    this.pageEvent.trigger(this.identCode, PlayerTypeF.ProgressChanging, <IProgressChanging>{ currentTime: this.currentTime, totalTime: this.totalTime });
                    this.pageEvent.trigger(this.identCode, PlayerTypeF.ProgressChanged, <IProgressChanged>{ currentTime: this.currentTime, totalTime: this.totalTime });

                    this.finish = false;
                }
                this.startPlayCount++;
            }
            if (this.totalTime <= 0) {
                // 自定义总市场
                if (this.customTotalTime > 0) {
                    this.totalTime = this.customTotalTime;
                } else {
                    this.totalTime = parseInt(<any>this.mediaPlay.getMediaDuration()) || 0;
                }

                if (this.totalTime > 0) {
                    this.pageEvent.trigger(this.identCode, PlayerTypeF.TotalProgressInit, <ITotalProgressInit>{ totalTime: this.totalTime, currentTime: this.currentTime });
                }
            }
        };
        // 第一次执行无延迟
        method();
        // 1s 后开始自动监听进度
        this.progressMonitor.enable(method);
    }
    private stopMonitorProgress() {
        this.progressMonitor.clear();
    }
    private configDisplay(displayMethod: 'full' | 'size' | 'hidden', displayArea = { left: 0, top: 0, width: 1280, height: 720 }) {
        if (displayMethod === 'full') {
            // 全屏显示
            this.mediaPlay.setVideoDisplayArea(displayArea.left, displayArea.top, displayArea.width, displayArea.height);/*left ,top,width,height*/
            this.mediaPlay.setVideoDisplayMode(0);/*指定屏幕大小 0:按给定大小显示 1：全屏*/
        } else if (displayMethod === 'size') {
            // 窗口显示
            this.mediaPlay.setVideoDisplayArea(displayArea.left, displayArea.top, displayArea.width, displayArea.height);/*left ,top,width,height*/
            this.mediaPlay.setVideoDisplayMode(0);/*指定屏幕大小 0:按给定大小显示 1：全屏*/
        }
        // 公用配置部分
        this.mediaPlay.refreshVideoDisplay();/*调整视频显示，需要上面两函数配合*/
        this.mediaPlay.setNativeUIFlag(0);/*播放器是否显示缺省的Native UI，  0:不允许 1：允许*/
    }
    private setCurrentProgress(value: number, speedOrReverse: boolean) {
        if (!this.finish) {
            this.stopMonitorProgress();

            let setVal: any;

            if (speedOrReverse) {
                this.currentTime += value;
            } else {
                this.currentTime -= value;
            }

            this.currentTime = this.currentTime <= 0 ? 1 : this.currentTime;
            this.currentTime = this.currentTime > this.totalTime ? this.totalTime : this.currentTime;

            // 及时更新目标进度已便让界面实时更新
            this.pageEvent.trigger(this.identCode, PlayerTypeF.ProgressChanging, <IProgressChanging>{ currentTime: this.currentTime, totalTime: this.totalTime });

            // 显示加载真实进度
            this.settingProgressTimer.enable(() => {
                // 暂停
                this.pause(false);

                this.mediaPlay.playByTime(1, parseInt(<any>this.currentTime), 1);
                this.pageEvent.trigger(this.identCode, PlayerTypeF.ProgressChanged, <IProgressChanged>{ currentTime: this.currentTime, totalTime: this.totalTime });

                // 恢复
                this.resume(false);

                this.startMonitorProgress(false);
            });
        }
    }
    private setCurrentVolume(value: number, plusOrMinus: boolean) {
        if (!this.finish) {
            if (plusOrMinus) {
                this.currentVolume += value;
            } else {
                this.currentVolume -= value;
            }
            this.currentVolume = this.currentVolume < 0 ? 0 : this.currentVolume;
            this.currentVolume = this.currentVolume > 100 ? 100 : this.currentVolume;

            // 及时更新界面音量状态
            this.pageEvent.trigger(this.identCode, PlayerTypeF.VolumeChanging, <IVolumeChanging>{ currentVolume: this.currentVolume });

            this.mediaPlay.setVolume(parseInt(<any>this.currentVolume));
            this.pageEvent.trigger(this.identCode, PlayerTypeF.VolumeChanged, <IVolumeChanged>{ currentVolume: this.currentVolume });
            // // 延时设置真实音量
            // this.settingVolumeTimer.enable(() => {

            // });
        }
    }
    private configPlayUrl(playUrl: string) {
        var mediaStr = '[{mediaUrl:"' + playUrl +
            '",mediaCode:"media1",' +
            'mediaType:2,' +
            'audioType:1,' +
            'videoType:1,' +
            'streamType:2,' +
            'drmType:1,' +
            'fingerPrint:0,' +
            'copyProtection:1,' +
            'allowTrickmode:1,' +
            'startTime:0,' +
            'endTime:5000,' +
            'entryID:"entry1"}]';
        this.playUrl = mediaStr;
    }
    setTotalTime(total: number) {
        this.customTotalTime = total;
    }
    getTotal() {
        return this.totalTime;
    }
}
// 使用说明
// 1. this.media = new Player({ identCode: ModuleType.Video }, this.event);
// 2. this.media.displayFull(); 或者 this.media.displaySmall();
// 3. this.media.play(url);
// 如果续播部分盒子需要 先调用 this.media.release(); 需要注意释放并未注销相关事件

declare class MediaPlayer {
    /**
     * 创建播放器
     */
    constructor(MediaPlayer?: string)
    /**
     * 获 得 STB 本 地 播 放 器 实 例 的 instanceID。
     */
    getNativePlayerInstanceID(): number
    /**
     * 0：单媒体的播放模式(默认值);1：播放列表的播放模式
     */
    setSingleOrPlaylistMode(mode: Enum.PlaylistMode): void
    /**
     * 
     */
    getSingleOrPlaylistModeg(): Enum.PlaylistMode
    /**
     * 设置显示窗口模式 1：为默认 0：为设置值 2：按宽度 3：按高度 255：窗口将被关闭
     */
    setVideoDisplayMode(mode: Enum.DisplayMode): void
    /**
     * 获取显示窗口模式
     */
    getVideoDisplayMode(): Enum.DisplayMode
    /**
     * 设置宽高，位置；refreshVideoDisplay()后才会刷新
     */
    setVideoDisplayArea(left: number, top: number, width: number, height: number): void
    /**
     * 右向偏移
     */
    getVideoDisplayLeft(): number
    /**
     * 向下偏移
     */
    getVideoDisplayTop(): number
    /**
     * 显示视频的窗口宽度
     */
    getVideoDisplayWidth(): number
    /**
     * 显示视频的窗口高度
     */
    getVideoDisplayHeight(): number
    /**
     * 0：设置为有声(默认值) 1：设置为静音
     */
    setMuteFlag(flag: Enum.MuteFlag): void
    /**
     * 获取是否有音量
     */
    getMuteFlag(): Enum.MuteFlag
    /**
     * 0：不使用 Player 的本地 UI 显示功能 1：使用 Player 的本地 UI 显示功能(默 认值)
     */
    setNativeUIFlag(flag: Enum.NativeUIFlag): void
    /**
     * 0：不使用 Player 的本地 UI 显示功能 1：使用 Player 的本地 UI 显示功能(默 认值)
     */
    getNativeUIFlag(): Enum.NativeUIFlag
    /**
     * 0：不使用静音提示的本地 UI 显示功 能 1：使用静音提示的本地 UI 显示功能 （默认值）
     */
    setMuteUIFlag(flag: Enum.MuteUIFlag): void
    /**
     * 0：不使用静音提示的本地 UI 显示功 能 1：使用静音提示的本地 UI 显示功能 （默认值）
     */
    getMuteUIFlag(): Enum.MuteFlag
    /**
     * 0：不使用音量调节的本地 UI 显示功 能 1：使用音量调节的本地 UI 显示功能 （默认值）
     */
    setAudioVolumeUIFlag(params:any): void
    /**
     * 0：不使用音量调节的本地 UI 显示功 能 1：使用音量调节的本地 UI 显示功能 （默认值）
     */
    getAudioVolumeUIFlag(): number
    /**
     * 0：不使用音轨选择的本地 UI 显示功 能 1：使用音轨选择的本地 UI 显示功能 （默认值
     */
    setAudioTrackUIFlag(params:any): void
    /**
     * 0：不使用音轨选择的本地 UI 显示功 能 1：使用音轨选择的本地 UI 显示功能 （默认值
     */
    getAudioTrackUIFlag(): number
    /**
     *0：不使用进度条的本地 UI 显示功能 1：使用进度条的本地 UI 显示功能（默 认值）
     */
    setProgressBarUIFlag(flag: number): void
    /**
     * 0：不使用进度条的本地 UI 显示功能 1：使用进度条的本地 UI 显示功能（默 认值）
     */
    getProgressBarUIFlag(): number
    /**
     * 0：不使用频道号的本地 UI 显示功能 1：使用频道号的本地 UI 显示功能（默 认值）
     */
    setChannelNoUIFlag(): void
    /**
     * 0：不使用频道号的本地 UI 显示功能 1：使用频道号的本地 UI 显示功能（默 认值）
     */
    getChannelNoUIFlag(): number
    /**
     * 0：不显示字幕(默认值) 1：显示字幕
     */
    setSubtitileFlag(): void
    /**
     * 0：不显示字幕(默认值) 1：显示字幕
     */
    getSubtitileFlag(): number
    /**
     * 0－100 之间的整数值，0 表示不透明， 100 表示完全透明。 (默认值为 0)
     */
    setVideoAlpha(alpha: number): void
    /**
     * 0－100 之间的整数值，0 表示不透明， 100 表示完全透明。 (默认值为 0)
     */
    getVideoAlpha(): number
    /**
     * 0：允许 TrickMode 操做 1：不允许 TrickMode 操作(默认值
     */
    setAllowTrickmodeFlag(params:any): void
    /**
     * 0：允许 TrickMode 操做 1：不允许 TrickMode 操作(默认值
     */
    getAllowTrickmodeFlag(): number
    /**
     * 0：设置为循环播放 1：设置为单次播放（默认值）
     */
    setCycleFlag(params:any): void
    /**
     * 0：设置为循环播放 1：设置为单次播放（默认值）
     */
    getCycleFlag(): number
    /**
     * 0：设置为随机播放（默认值） 1：设置为随机播放
     */
    setRandomFlag(): void
    /**
     * 0：设置为随机播放（默认值） 1：设置为随机播放
     */
    getRandomFlag(): number
    /**
     * 留作厂商的扩展属性设置和获取，格 式由厂商自己确定
     */
    setVendorSpecificAttr(): void
    /**
     * 留作厂商的扩展属性设置和获取，格 式由厂商自己确定
     */
    getVendorSpecificAttr(value: string): any

    /**
     * 获取当前播放的媒体的标识（节目，频道）使用系统定义的ContentID当播放器在播放列表模式时MediaCode是动态改变的。
     */
    getMediaCode(): string
    /**
     * 获取当前播放的媒体的总时长
     */
    getMediaDuration(): number
    /**
     * 媒体播放到的当前时间点
     */
    getCurrentPlayTime(): number
    /**
     * 播放器的当前播放模式。返回值为 JSON 字符串
     */
    getPlaybackMode(): JSON | string
    /**
     * 返回终端当前播放的频道号，不能获 得有效的频道号时，返回-1。
     */
    getChannelNum(): number
    /**
     * 获取当前的声道类型
     */
    getCurrentAudioChannel(): string
    /**
     * 获取当前的的音轨类型 
     */
    getAudioTrack(): string
    /**
     * 获取当前选择的字幕类型
     */
    getSubtitle(): string
    /**
     * 获取播放列表中的媒体数量
     */
    getMediaCount(): number
    /**
     * 获取当前播的媒体，在播放列表中的 索引值 
     */
    getCurrentIndex(): number
    /**
     * 获取当前播放的媒体的 EntryID
     */
    getEntryID(): string
    /**
     * 封 装播放列表数据
     */
    getPlaylist(): JSON | string

    /**
     * 终端上某个媒体流或播放器实例的标识
     */
    bindNativePlayerInstance(nativePlayerInstanceID: number): number
    /**
     * 播放器的配置属性
     */
    initMediaPlayer(): void
    /**
     * 释 放 终 端 MediaPlayer 的 对 象 ， 结 束 对 应 MediaPlayer 的生命周期
     */
    releaseMediaPlayer(id: number): number
    /**
     * 设置单个播放的媒体。传 入 字 符 串 mediaStr 中 的 媒 体 对 象 的 mediaURL。 
     */
    setSingleMedia(mediaStr: MediaStr | any): void
    /**
     * 要求终端访问指定的频道，并立即返回。 对由本地设置为跳过的频道，也返回-1。 
     */
    joinChannel(): number
    /**
     * 要求终端离开指定的频道，并立即返回
     */
    leaveChannel(): number
    /**
     * 在播放列表末端，添加单个媒体。传入字符串。 
     */
    addSingleMedia(str: MediaStr): void
    /**
     * 在播放列表末端，添加一批媒体。传入字符串
     */
    addBatchMedia(batchMediaStr: BatchMediaStr): void
    /**
     * 清空播放列表
     */
    clearAllMedia(): void
    /**
     * 根据 index 将指定的媒体在播放列表中移动
     */
    moveMediaByIndex(entryID: string | number, index: number): void
    /**
     * 根据偏移量将指定的媒体在播放列表中移动
     */
    moveMediaByOffset(entryId: string | number, offset: number): void
    /**
     * 根据 index 将指定的媒体在播放列表中移动
     */
    moveMediaByIndex1(now: number, after: number): void
    /**
     * 根据偏移量将指定的媒体在播放列表中移动
     */
    moveMediaByOffset1(now: number, after: number): void
    /**
     * 将指定的媒体下移
     */
    moveMediaToNext(entryID: string | number): void
    /**
     * 将指定的媒体上移
     */
    moveMediaToPrevious(entryID: string | number): void
    /**
     * 将指定的媒体移到列表顶端
     */
    moveMediaToFirst(): void
    /**
     * 将指定的媒体移到列表末端
     */
    moveMediaToLast(): void
    /**
     * 将指定的媒体下移
     */
    moveMediaToNext1(): void
    /**
     * 将指定的媒体上移
     */
    moveMediaToPrevious1(): void
    /**
     * 将指定的媒体移到列表顶端
     */
    moveMediaToFirst1(): void
    /**
     * 将指定的媒体移到列表末端
     */
    moveMediaToLast1(): void
    /**
     * 按媒体在播放列表中的索引选中为当前候选播 放节目
     */
    selectMediaByIndex(): void
    /**
     * 按与当前媒体索引的偏移量选中媒体，作为当前 候选播放节目
     */
    selectMediaByOffset(): void
    /**
     * 选取播放列表中的下一个媒体，作为当前候选播 放节目
     */
    selectNext(): void
    /**
     * 选取播放列表中的上一个媒体，作为当前候选播 放节目
     */
    selectPrevious(): void
    /**
     * 选取播放列表中的第一个媒体，作为当前候选播 放节目
     */
    selectFirst(): void
    /**
     * 选取播放列表中的最后第一个媒体，作为当前候选播 放节目
     */
    selectLast(): void
    /**
     *  按某个媒体条目的唯一标识选中为当前候选播 放节目
     */
    selectMediaByEntryID(): void

    /**
     * 从媒体起始点开始播放。 
     */
    playFromStart(): void
    /**
     * 从当前媒体的某个时间点开始播放媒体（对 playlist 而言是指当 前已经选中的媒体，对实时播放的 TVchannel 该调用无效，但对处于时移状态的 TV channel 有效。
     */
    playByTime(type: number, time: number, speed: number): void
    /**
     * 暂停正在播放的媒体
     */
    pause(): void
    /**
     * 快进
     */
    fastForward(speed: number): void
    /**
     * 快退
     */
    fastRewind(speed: number): void;
    /**
     * 从当前媒体的暂停/快进/快退状态恢复正常播 放。
     */
    resume(): void
    /**
     * 跳到媒体末端播放
     */
    gotoEnd(): void
    /**
     * 跳到媒体起始点播放
     */
    gotoStart(): void
    /**
     * 停止正在播放的媒体
     */
    stop(): void
    /**
     * 根 据 videoDisplayMode,vedioDisplayArea 属 性,调整视频的显示
     */
    refreshVideoDisplay(): void
    /**
     * 设置系统音量
     */
    setVolume(value: number): void
    /**
     * 获取系统音量
     */
    getVolume(): number

    /*可选方法*/
    /**
     * 
     */
    switchAudioChannel(): void
}

declare namespace Enum {
    const enum MuteFlag { }
    const enum PlaylistMode { }
    const enum DisplayMode { }
    const enum NativeUIFlag { }
    const enum MuteUIFlag { }
}

interface MediaStr {
    mediaURL: string
    mediaCode: string
    mediaType: number
    audioType: number
    videoType: number
    streamType: number
    drmType: number
    fingerPrint: number
    copyProtection: number
    allowTrickmode: number
    startTime: number
    endTime: number
    timeShiftURL?: string
    timeShift?: number
    entryID: string | number
}
interface BatchMediaStr {

}