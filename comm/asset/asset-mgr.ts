import { Singleton } from "../util/singleton";

/**
 * 資源管理
 */
export class AssetMgr implements Singleton {
    // 名稱
    public get name(): string { return `資源管理`; }
}
