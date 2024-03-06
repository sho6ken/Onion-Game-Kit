import { Logger } from "../util/logger";
import { Singleton } from "../util/singleton";
import { NetNode } from "./net-node";
import { NetBuf, NetCmd, NetConnOpt, NetObj } from "./network";

/**
 * 連線管理
 */
export class NetMgr implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 頻道
    private _channels: Map<number, NetNode> = new Map();

    /**
     * 釋放
     */
    public free(): void {
        Array.from(this._channels.keys()).forEach(id => this.remove(id), this);
        this._channels.clear();
    }

    /**
     * 新增頻道
     * @param node 
     * @param id 頻道編號
     */
    public add(node: NetNode, id: number = 0): void {
        if (this._channels.has(id)) {
            Logger.net(`add node repeat, id=${id}`);
            return;
        }

        this._channels.set(id, node);
    }

    /**
     * 移除頻道
     * @param id 頻道編號
     */
    public remove(id: number = 0): void {
        if (this._channels.has(id)) {
            let node = this._channels.get(id);
            node?.close();
            node = null;

            this._channels.delete(id);

            Logger.net(`remove node, id=${id}`);
        }
    }

    /**
     * 實作連線
     * @param opt 操作參數
     * @param id 頻道編號
     */
    public connect(opt: NetConnOpt, id: number = 0): boolean {
        return this._channels.get(id).connect(opt);
    }

    /**
     * 強制斷線
     * @param id 頻道編號
     * @param code 錯誤碼
     * @param reason 斷線原因
     */
    public close(id: number = 0, code?: number, reason?: string): void {
        this._channels.get(id)?.close(code, reason);
    }

    /**
     * 發送訊息
     * @param cmd 協議編號 
     * @param buf 數據內容
     * @param force 強制發送, 不會觸發重連後的訊息重送
     * @param channel 頻道編號
     */
    public send(cmd: NetCmd, buf: NetBuf, force: boolean = false, channel: number = 0): boolean {
        return this._channels.get(channel)?.send(cmd, buf, force);
    }

    /**
     * 數據請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param event 完成後回調
     * @param tip 介面提示
     * @param force 強制發送, 不會觸發重連後的訊息重送
     * @param channel 頻道編號
     * @summary 可進行完成回調
     */
    public request(cmd: NetCmd, buf: NetBuf, event: NetObj, tip: boolean = false, force: boolean = false, channel: number = 0): void {
        this._channels.get(channel)?.request(cmd, buf, event, tip, force);
    }

    /**
     * 唯一請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param event 完成後回調
     * @param tip 介面提示
     * @param force 強制發送, 不會觸發重連後的訊息重送
     * @param channel 頻道編號
     * @summary 相同編號同時只能存在一筆
     */
    public unique(cmd: NetCmd, buf: NetBuf, event: NetObj, tip: boolean = false, force: boolean = false, channel: number = 0): boolean {
        return this._channels.get(channel)?.unique(cmd, buf, event, tip, force);
    }
}
