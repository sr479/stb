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