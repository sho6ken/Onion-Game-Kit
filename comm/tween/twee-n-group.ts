import { Singleton } from "../util/singleton";
import { TweeN } from "./twee-n";

/**
 * 緩動群組
 */
export class TweeNGroup {
    // 工作中緩動
    private _working: { [id: number]: TweeN } = {};

    // 等待加入工作的緩動
    private _waiting: { [id: number]: TweeN } = {};

    /**
     * 新增
     * @param tween 
     */
    public add(tween: TweeN): void {
        // TODO
    }

    /**
     * 取得
     * @param id 編號, 不傳代表取得全部工作中的緩動
     */
    public get(id?: number): TweeN[] {
        // TODO
        return [];
    } 

    /**
     * 移除
     * @param ref 緩動或是編號
     */
    public remove(ref: TweeN | number): void {
        // TODO
    }

    /**
     * 移除全部
     */
    public removeAll(): void {
        // TODO
    }

    /**
     * 更新
     * @param dt 
     */
    public update(dt: number): void {
        // TODO
    }
}

/**
 * 固定速度緩動
 */
export class FixedTweeN extends TweeNGroup implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 初始化
     */
    public init(): void {
        // TODO
    }
}

/**
 * 變動速度緩動
 */
export class BounceTweeN extends TweeNGroup implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 初始化
     */
    public init(): void {
        // TODO
    }
}
