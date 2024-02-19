import { Asset, AssetManager } from "cc";
import { Singleton } from "../util/singleton";

/**
 * 資源數據
 */
export interface AssetData {
    // 資源
    asset: Asset;

    // 常駐不釋放
    hold?: boolean;

    // 釋放時間
    expire?: number;
}

/**
 * 資源取得參數
 */
export interface AssetReq<T extends Asset> {
    // 資源種類
    type: T;

    // 加載路徑
    path: string;

    // 包名
    bundle?: string;

    // 常駐不釋放
    hold?: boolean;
}

/**
 * 資源管理
 */
export class AssetMgr implements Singleton {
    // 名稱
    public get name(): string { return `資源管理`; }

    // 已加載bundle
    private _bundles: Map<string, AssetManager.Bundle> = new Map();

    // 使用中資源
    private _assets: Map<string, AssetData> = new Map();

    // 現在時間
    private get _now(): number { return Date.now() / 1000; }

    // 逾期時間
    private get _expire(): number { return this._now + (5 * 60); }

    /**
     * 釋放
     */
    public free(): void {
        // TODO
    }

    /**
     * 清除
     */
    public clear(): void {
        // TODO
    }

    /**
     * 打印資訊
     */
    public info(): void {
        // TODO
    }
}
