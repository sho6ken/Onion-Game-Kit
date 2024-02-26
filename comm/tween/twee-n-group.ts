import { Singleton } from "../util/singleton";

/**
 * 緩動群組
 */
export class TweeNGroup {
    // TODO
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
