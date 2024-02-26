import { SingleMgr } from "../util/singleton";
import { FixedTweeN, TweeNGroup } from "./twee-n-group";

/**
 * 自製簡易緩動
 * @summary 因為要處理如暫停加速...等等額外功能, 但又不想修改引擎
 * @summary 只處理單個數值的變化
 */
export class TweeN {
    // 計數器
    private static _count: number = 0;

    // 編號
    private _pid: number = -1;
    public get id(): number { return this._pid; }

    // 群組
    private _group: TweeNGroup = null;

    // 已開始
    private _stared: boolean = false;

    // 已暫停
    private _paused: boolean = false;

    // 起始值
    private _begin: number = 0;

    // 當前值
    private _curr: number = 0;

    // 最終值
    private _end: number = 0;

    // 漸變值
    private _fade: number = 0;

    // 緩動方式
    private _easing: Function = null;

    // 延遲開始
    private _delay: number = 0;

    // 緩動時間
    private _time: number = 0;

    // 剩餘秒數
    private _left: number = 0;

    // 開始回調
    private _onStart: Function = null;

    // 更新回調
    private _onUpdate: Function = null;

    // 結束回調
    private _onComplete: Function = null;

    // 接續緩動
    private _next: TweeN = null;

    /**
     * 
     * @param value 初始值
     * @param group 速度變化群組
     */
    constructor(value: number, group: TweeNGroup = SingleMgr.get(FixedTweeN)) {
        this._pid = TweeN._count++;
        this._begin = value;
        this._group = group;
    }

    /**
     * 更新
     * @param dt 
     * @returns 是否已經完畢
     */
    public update(dt: number): boolean {
        // TODO
        return false;
    }

    /**
     * 批量緩動
     * @param act 
     */
    public then(act: TweeN[]): this {
        // TODO
        return this;
    }

    /**
     * 緩動
     * @param sec 
     * @param value 終值
     */
    public to(sec: number, value: number): this {
        // TODO
        return this;
    }

    /**
     * 延遲開始
     * @param sec  
     */
    public delay(sec: number): this {
        this._delay = sec;
        return this;
    }

    /**
     * 開始
     */
    public start(): this {
        if (!this._stared) {
            this._stared = true;
            this._paused = false;
            this._group.add(this);
        }

        return this;
    }

    /**
     * 停止
     */
    public stop(): this {
        if (this._stared) {
            this._stared = false;
            this._paused = false;
            this._group.remove(this);
        }

        return this;
    }

    /**
     * 暫停
     */
    public pause(): this {
        if (this._stared && !this._paused) {
            this._paused = true;
            this._group.remove(this);
        }

        return this;
    }

    /**
     * 繼續
     */
    public resume(): this {
        if (this._stared && this._paused) {
            this._paused = false;
            this._group.add(this);
        }

        return this;
    }

    /**
     * 強制完成 
     */
    public finish(): this {
        this.update(Infinity);
        return this;
    }

    /**
     * 緩動方式
     * @param type tweeNEasing.linear
     */
    public easing(type: Function): this {
        this._easing = type;
        return this;
    }

    /**
     * 開始回調
     * @param event 
     */
    public onStart(event: Function): this {
        this._onStart = event;
        return this;
    }

    /**
     * 更新回調
     * @param event  
     */
    public onUpdate(event: Function): this {
        this._onUpdate = event;
        return this;
    }

    /**
     * 更新回調
     * @param event 
     */
    public onComplete(event: Function): this {
        this._onComplete = event;
        return this;
    }
}
