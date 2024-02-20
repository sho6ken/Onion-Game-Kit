import { Asset, AssetManager, assetManager } from "cc";
import { Singleton } from "../util/singleton";
import { BundleLoader, FolderLoader, LocalLoader } from "./asset-loader";

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
    public get name(): string { return this.constructor.name; }

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
        this._assets.forEach(data => data.asset = null);
        this._assets.clear();

        this._bundles.forEach(bundle => {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        });

        this._bundles.clear();
    }

    /**
     * 清除
     */
    public clear(): void {
        let jobs = [];

        this._assets.forEach((data, key) => {
            if (!data.hold && this._now >= data.expire) {
                data.asset = null;
                jobs.push(key);
            }
        });

        jobs.forEach(key => this._assets.delete(key), this);
    }

    /**
     * 打印資訊
     */
    public info(): void {
        console.group(`asset mgr info`);
        console.table(Array.from(this._bundles.keys()));
        console.table(Array.from(this._assets.keys()));
        console.groupEnd();
    }

    /**
     * 新增資源
     * @param path 加載路徑
     * @param asset 資源
     * @param hold 常駐不釋放
     */
    private add<T extends Asset>(path: string, asset: T, hold: boolean): void {
        path && this._assets.set(path, { asset: asset, hold: hold, expire: hold ? undefined : this._expire });
    }

    /**
     * 本地加載
     * @param req 資源取得參數
     */
    public async loadLocal<T extends Asset>(req: AssetReq<T>): Promise<T> {
        if (!this._assets.has(req.path)) {
            console.timeEnd(req.path);

            // 先佔位防止多次加載
            this.add(req.path, null, true);

            try {
                await this.loadBundle(req.bundle);
                this.add(req.path, await LocalLoader.load(<any>req.type, req.path, req.bundle), req.hold);
            }
            catch (err) {
                this._assets.delete(req.path);
            }

            console.timeEnd(req.path);
        }

        return await this.doLoadLocal(req);
    }

    /**
     * 實作本地加載
     * @param req 資源取得參數
     * @summary 處理重複加載問題
     */
    private async doLoadLocal<T extends Asset>(req: AssetReq<T>): Promise<T> {
        return await new Promise((resolve, reject) => {
            let data = null;

            do {
                data = this._assets.get(req.path);

                // 鍵值因故被移除
                if (!data) {
                    reject();
                }
            }
            while (!data.asset)

            resolve(data.asset);
        });
    }

    /**
     * bundle加載
     * @param name 包名
     */
    private async loadBundle(name: string): Promise<void> {
        if (name && !this._bundles.has(name)) {
            console.time(name);
            this._bundles.set(name, await BundleLoader.load(name));
            console.timeEnd(name);
        }
    }

    /**
     * 資料夾加載
     * @param req 
     */
    public async loadFolder<T extends Asset>(req: AssetReq<T>): Promise<void> {
        console.time(req.path);

        await BundleLoader.load(req.bundle);

        let list = await FolderLoader.load(<any>req.type, req.path, req.bundle);
        list.forEach(elm => this.add(elm.path, elm.asset, req.hold));

        console.timeEnd(req.path);
    }
}
