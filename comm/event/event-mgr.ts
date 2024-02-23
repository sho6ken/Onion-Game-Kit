import { SingleMgr, Singleton } from "../util/singleton";

/**
 * 事件種類
 */
export type EventType = string;

/**
 * 事件管理
 */
export class EventMgr implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 類別事件紀錄
    public static rec: Map<Function, { type: EventType, cb: string, once: boolean }[]> = new Map();

    // 監聽註冊
    private static _register: Function = null;

    // 監聽註銷
    private static _unregister: Function = null;

    // 回調列表
    private _events: Map<EventType, Map<Object, { cb: Function, once: boolean }[]>> = new Map();

    /**
     * 註冊
     * @param src 目標類別
     */
    public static register(src: Object): void {
        this._register && this.rec.get(src.constructor).forEach(elm => {
            this._register(src, elm.type, src[elm.cb], elm.once);
        }, this);
    }

    /**
     * 註銷
     * @param src 目標類別
     */
    public static unregister(src: Object): void {
        this._unregister && this._unregister(src);
    }

    /**
     * 
     */
    constructor() {
        // TODO
    }

    /**
     * 釋放
     */
    public free(): void {
        // TODO
    }

    /**
     * 加入回調列表
     * @param src 目標類別
     * @param type 事件種類
     * @param cb 事件回調
     * @param once 是否只觸發單次
     */
    private add(src: Object, type: EventType, cb: Function, once: boolean): void {
        // TODO
    }

    /**
     * 從回調列表中移除
     * @param src 目標類別
     * @param type 事件種類
     * @param cb 事件回調
     */
    private remove(src: Object, type: EventType, cb: Function): void {
        // TODO
    }

    /**
     * 觸發事件
     * @param type 事件種類
     * @param params 
     */
    public emit(type: EventType, ...params: any[]): void {
        // TODO
    }

    /**
     * 取得事件
     * @param type 事件種類
     */
    private getEvents(type: EventType): { obj: Object, cb: Function }[] {
        // TODO
        return [];
    }

    /**
     * 資訊
     */
    public info(): void {
        // TODO
    }
}

/**
 * 讓事件管理在cocos之前啟動
 */
SingleMgr.get(EventMgr, true);
