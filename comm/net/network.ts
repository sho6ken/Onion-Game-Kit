/**
 * 數據容器
 */
export type NetBuf = string | ArrayBufferLike | Blob | ArrayBufferView;

/**
 * 協議編號
 */
export type NetCmd = string;

/**
 * 連線事件
 */
export type NetEvent = (cmd: NetCmd, buf: NetBuf) => void;

/**
 * 連線物件
 */
export interface NetObj {
    // 連線對象
    obj: any;

    // 觸發事件
    event: NetEvent;
}

/**
 * 數據請求
 */
export interface NetReq {
    // 協議編號
    cmd: NetCmd;

    // 數據內容
    buf: NetBuf;

    // 完成回調
    event: NetObj;
}

/**
 * 數據處理介面
 * @summary 因應各種server會有不同的處理方式
 */
export interface NetHandler {
    /**
     * 取得心跳包
     */
    getBeat(): { cmd: NetCmd, buf: NetBuf };

    /**
     * 取得包頭長度
     * @param buf 數據
     */
    getHeadLen(buf: NetBuf): number;

    /**
     * 取得封包長度
     * @param buf 數據
     */
    getPacketLen(buf: NetBuf): number;

    /**
     * 封包是否合法
     * @param buf 數據
     */
    isPacketLegal(buf: NetBuf): boolean;

    /**
     * 取得協議編號
     * @param buf 數據
     */
    getCmd(buf: NetBuf): NetCmd;
}

/**
 * 連線操作
 */
export interface NetConnOpt {
    // 位置
    url: string;

    // 重連次數
    count: number;
}

/**
 * socket
 * @summary 因應各種不同連線
 */
export interface NetSocket {
    // 收訊回調
    onMessage: (buf: NetBuf) => void;

    // 連線成功
    onConnected: (event: any) => void;

    // 連線錯誤
    onError: (event: any) => void;

    // 連線中斷
    onClosed: (event: any) => void;

    /**
     * 實作連線
     * @param opt 操作參數
     */
    connect(opt: NetConnOpt): boolean;

    /**
     * 發送訊息
     * @param buf 數據內容
     */
    send(buf: NetBuf): boolean;

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 原因說明
     */
    close(code?: number, reason?: string): void;
}

/**
 * 連線提示
 * @summary 給彈窗使用的介面
 */
export interface NetTip {
    /**
     * 連線中
     * @param value 
     */
    connecting(value: boolean): void;

    /**
     * 重連中
     * @param value 
     */
    reconnecting(value: boolean): void;

    /**
     * 數據請求中
     * @param value 
     */
    requesting(value: boolean): void;
}
