import { Asset, AssetManager } from "cc";

/**
 * 資源加載介面
 */
export interface AssetLoader {
    /**
     * 加載
     * @param params 
     */
    load(...params: any[]): Promise<any>;
}

/**
 * 普通資源加載
 */
export class LocalLoader implements AssetLoader {
    /**
     * 加載
     * @param type 資源總類
     * @param path 加載路徑
     * @param bundle 包名
     */
    public async load<T extends Asset>(type: typeof Asset, path: string, bundle?: string): Promise<T> {
        // TODO
        return null;
    }
}

/**
 * bundle加載
 */
export class BundleLoader implements AssetLoader {
    /**
     * 加載
     * @param bundle 包名
     */
    public async load(bundle: string): Promise<AssetManager.Bundle> {
        // TODO
        return null;
    }
}

/**
 * 資料夾加載
 */
export class FolderLoader implements AssetLoader {
    /**
     * 加載
     * @param type 資源總類
     * @param path 加載路徑
     * @param bundle 包名
     */
    public async load<T extends Asset>(type: typeof Asset, path: string, bundle?: string): Promise<{ path: string, asset: T }[]> {
        // TODO
        return null;
    }
}
