import { Logger } from "../util/logger";
import { NetBuf, NetConnOpt, NetSocket } from "./network";

/**
 * web socket
 */
export class WSocket implements NetSocket {
    // socket
    private _socket: WebSocket = null;

    // 收訊回調
    public onMessage: (buf: NetBuf) => void = null;

    // 連線成功
    public onConnected: (event: any) => void = null;

    // 連線錯誤
    public onError: (event: any) => void = null;

    // 連線中斷
    public onClosed: (event: any) => void = null;

    /**
     * 實作連線
     * @param opt 操作參數
     */
    public connect(opt: NetConnOpt): boolean {
        if (this._socket && this._socket.readyState === WebSocket.CONNECTING) {
            Logger.net(`${opt.url} already connecting`);
            return false;
        }

        this._socket = new WebSocket(new URL(opt.url));
        this._socket.binaryType = `arraybuffer`;

        this._socket.onmessage = (event) => this.onMessage(event.data);
        this._socket.onopen = this.onConnected;
        this._socket.onerror = this.onError;
        this._socket.onclose = this.onClosed;

        return true;
    }

    /**
     * 發送訊息
     * @param buf 數據內容
     */
    public send(buf: NetBuf): boolean {
        if (this._socket && this._socket.readyState === WebSocket.OPEN) {
            this._socket.send(buf);
            return true;
        }

        return false;
    }

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 原因說明
     */
    public close(code: number, reason?: string): void {
        this._socket?.close(code, reason);
    }
}
