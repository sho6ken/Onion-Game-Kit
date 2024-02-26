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

    // 起始值
    private _begin: number = 0;

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
        // TODO
        return this;
    }

    /**
     * 開始
     */
    public start(): this {
        // TODO
        return this;
    }

    /**
     * 停止
     */
    public stop(): this {
        // TODO
        return this;
    }

    /**
     * 暫停
     */
    public pause(): this {
        // TODO
        return this;
    }

    /**
     * 繼續
     */
    public resume(): this {
        // TODO
        return this;
    }

    /**
     * 強制完成 
     */
    public finish(): this {
        // TODO
        return this;
    }

    /**
     * 緩動方式
     * @param type tweeNEasing.linear
     */
    public easing(type: Function): this {
        // TODO
        return this;
    }

    /**
     * 開始回調
     * @param event 
     */
    public onStart(event: Function): this {
        // TODO
        return this;
    }

    /**
     * 更新回調
     * @param event  
     */
    public onUpdate(event: Function): this {
        // TODO
        return this;
    }

    /**
     * 更新回調
     * @param event 
     */
    public onComplete(event: Function): this {
        // TODO
        return this;
    }
}
