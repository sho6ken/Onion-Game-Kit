import { Logger } from "../util/logger";
import { NetBuf, NetCmd, NetConnOpt, NetEvent, NetHandler, NetObj, NetReq, NetSocket, NetTip } from "./network";

/**
 * 連線狀態
 */
export enum NetState {
    Closed,      // 連線關閉
    Connecting,  // 連線中
    Connected,   // 已連線
    Resending,   // 訊息重送中
}

/**
 * 連線節點
 */
export class NetNode {
    // 狀態
    private _state: NetState = NetState.Closed;

    // socket是否已完成初始化
    private _readied: boolean = false;

    // socket
    private _socket: NetSocket = null;

    // 數據處理
    private _handler: NetHandler = null;

    // 介面提示
    private _tip: NetTip = null;

    // 請求列表
    private _requests: NetReq[] = [];

    // 協議監聽
    private _listeners: Map<NetCmd, NetObj[]> = new Map();

    // 剩餘重連次數
    private _count: number = 0;

    // 心跳句柄
    private _beat: number = -1;

    // 斷線句柄
    private _disconn: number = -1;

    // 重連句柄
    private _reconn: number = -1;

    // 連線參數
    private _opt: NetConnOpt = null;

    /**
     * 初始化
     * @param socket 
     * @param handler 數據處理
     * @param tip 介面提示
     */
    public init(socket: NetSocket, handler: NetHandler, tip?: NetTip): void {
        this._socket = socket;
        this._handler = handler;
        this._tip = tip;
    }

    /**
     * socket初始化
     */
    private initSocket(): void {
        if (this._readied) {
            return;
        }

        this._readied = true;

        this._socket.onMessage = this.onMessage.bind(this);
        this._socket.onConnected = this.onConnected.bind(this);
        this._socket.onError = this.onError.bind(this);
        this._socket.onClosed = this.onClosed.bind(this);
    }

    /**
     * 開始連線
     * @param opt 
     */
    public connect(opt: NetConnOpt): boolean {
        if (this._state != NetState.Closed) {
            return false;
        }

        this._state = NetState.Connecting;

        Logger.net(`${opt.url} start conn`);

        this.initSocket();

        if (this._socket.connect(opt) === false) {
            this._tip?.connecting(false);
            return false;
        }

        this._tip?.connecting(true);

        this._opt = opt;
        this._count = opt.count;

        return true;
    }

    /**
     * 發送訊息
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param force 強制發送, 不會觸發重連後的訊息重送
     */
    public send(cmd: NetCmd, buf: NetBuf, force: boolean = false): boolean {
        // 正常發送或是強制發送
        if (this._state === NetState.Connected || force) {
            let res = this._socket.send(buf);
            Logger.net(`send ${res}`, cmd);

            return res;
        }
        // 等候重送
        else if (this._state === NetState.Connecting || this._state === NetState.Resending) {
            this._requests.push({ cmd: cmd, buf: buf, event: null });
            Logger.net(`send wait`, cmd);

            return true;
        }
        // 錯誤
        else {
            Logger.net(`send failed`, cmd);
            return false;
        }
    }

    /**
     * 數據請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param event 完成後回調
     * @param tip 介面提示
     * @param force 強制發送, 不會觸發重連後的訊息重送
     * @summary 可進行完成回調
     */
    public request(cmd: NetCmd, buf: NetBuf, event: NetObj, tip: boolean = false, force: boolean = false): void {
        if (this._state === NetState.Connected || force) {
            let res = this._socket.send(buf);
            Logger.net(`req ${res}`, cmd);
        }

        Logger.net(`req wait`, cmd);

        this._requests.push({ cmd: cmd, buf: buf, event: event });
        this._tip?.requesting(tip);
    }

    /**
     * 唯一請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param event 完成後回調
     * @param tip 介面提示
     * @param force 強制發送, 不會觸發重連後的訊息重送
     * @summary 相同編號同時只能存在一筆
     */
    public unique(cmd: NetCmd, buf: NetBuf, event: NetObj, tip: boolean = false, force: boolean = false): boolean {
        for (const req of this._requests) {
            if (req.cmd == cmd) {
                Logger.net(`unique false`, cmd);
                return false;
            }
        }

        Logger.net(`unique true`, cmd);
        this.request(cmd, buf, event, tip, force);

        return true;
    }

    /**
     * 強制斷線
     * @param code 錯誤碼
     * @param reason 斷線原因
     */
    public close(code?: number, reason?: string): void {
        Logger.net(`close conn, code=${code}, reason=${reason}`);

        this.resetTimer();
        this.clear();

        this._socket.onMessage = null;
        this._socket.onConnected = null;
        this._socket.onError = null;
        this._socket.onClosed = null;

        this._readied = false;
        this._state = NetState.Closed;

        this._requests = [];

        this._tip?.connecting(false);
        this._tip?.reconnecting(false);
        this._tip?.requesting(false);
    }

    /**
     * 重連成功後的處理
     */
    private afterReconn(): void {
        this._tip?.connecting(false);
        this._tip?.reconnecting(false);

        let len = this._requests.length;
        this._tip?.requesting(len > 0);

        // 開始重送
        Logger.net(`start resend, size=${len}`);
        this._requests.forEach(req => req.buf && this._socket?.send(req.buf), this);
    }

    /**
     * 接收訊息
     * @param buf 
     */
    private onMessage(buf: NetBuf): void {
        if (this._handler.isPacketLegal(buf) == false) {
            Logger.net(`rcv illegal`);
            return;
        }

        this.resetDisconn();
        this.resetBeat();

        let cmd = this._handler.getCmd(buf);
        Logger.net(`rcv`, cmd);

        // 刪除請求
        for (const idx in this._requests) {
            let req = this._requests[idx];

            if (req.cmd == cmd) {
                req.event.event.call(req.event.obj, cmd, buf);
                this._requests.splice(Number(idx), 1);
                break;
            }
        }

        // 監聽回調
        this._listeners.get(cmd)?.forEach(listener => listener.event.call(listener.obj, cmd, buf));

        this._tip?.requesting(this._requests.length <= 0);
    }

    /**
     * 連線成功
     * @param event 
     */
    private onConnected(event: any): void {
        Logger.net(`${this._opt.url} conn succeed`);

        this.resetTimer();

        this._count = this._opt.count;
        this._state = NetState.Resending;

        // 先處理重連業務
        this.afterReconn();
        this._state = NetState.Connected;
    }

    /**
     * 發生錯誤
     * @param event 
     */
    private onError(event: any): void {
        Logger.net(`conn err, res=${event}`);
    }

    /**
     * 連線中斷
     * @param event 
     */
    private onClosed(event: any): void {
        // 重連中
        if (this._reconn != -1) {
            return;
        }

        this.resetTimer();
        this._tip?.reconnecting(true);

        // 開始重連
        this._reconn = window.setTimeout(() => {
            this._state = NetState.Closed;

            if (this._count <= 0) {
                Logger.net(`run out count`);
                this.resetTimer();
                return;
            }

            Logger.net(`${this._opt.url} start reconn`);

            this._socket.close();
            this.connect(this._opt);

            this._count--;
        }, 5 * 1000);
    }

    /**
     * 註冊協議監聽
     * @param cmd 協議編號
     * @param event 觸發回調
     * @param obj 觸發對象
     */
    public register(cmd: NetCmd, event: NetEvent, obj?: any): void {
        if (this._listeners.has(cmd) == false) {
            this._listeners.set(cmd, []);
        }

        this._listeners.get(cmd).push({ obj: obj, event: event });
    }

    /**
     * 清空監聽
     */
    public clear(): void {
        this._listeners.forEach(elm => elm = []);
        this._listeners.clear();
    }

    /**
     * 重設心跳計時
     */
    private resetBeat(): void {
        window.clearTimeout(this._beat);

        this._beat = window.setTimeout(() => {
            let { cmd, buf } = this._handler.getBeat();
            this.send(cmd, buf);
        }, 30 * 1000);
    }

    /**
     * 重設斷線計時
     */
    private resetDisconn(): void {
        window.clearTimeout(this._beat);

        this._disconn = window.setTimeout(() => {
            this.close(504, `server time out`);
        }, 60 * 1000);
    }

    /**
     * 重設計時器
     */
    private resetTimer(): void {
        window.clearTimeout(this._beat);
        window.clearTimeout(this._disconn);
        window.clearTimeout(this._reconn);

    }
}
