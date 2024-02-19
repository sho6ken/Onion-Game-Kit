import { Asset, AssetManager, assetManager, resources } from "cc";

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
 * 本地資源加載
 */
export class LocalLoader implements AssetLoader {
    /**
     * 加載
     * @param type 資源總類
     * @param path 加載路徑
     * @param bundle 包名
     */
    public async load<T extends Asset>(type: typeof Asset, path: string, bundle?: string): Promise<T> {
        return new Promise((resolve, reject) => {
            let loader = bundle ? assetManager.getBundle(bundle) : resources;

            if (!loader) {
                console.error(`local asset load failed, bundle=${bundle}`);
                return;
            }

            loader.load(path, type, (err, asset) => {
                if (err) {
                    console.error(`local asset load failed, path=${path}, bundle=${bundle}`);
                    reject(err);
                }

                resolve(<T>asset);
            });
        });
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
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundle, (err, bundle) => {
                if (err) {
                    console.error(`bundle load failed, bundle=${bundle}`);
                    reject(err);
                }

                resolve(bundle);
            });
        });
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
    public async load<T extends Asset>(type: typeof Asset, path: string, bundle?: string): Promise<{ path: string, asset: T, bundle?: string }[]> {
        return new Promise((resolve, reject) => {
            let loader = bundle ? assetManager.getBundle(bundle) : resources;

            if (!loader) {
                console.error(`folder assets load failed, bundle=${bundle}`);
                return;
            }

            loader.loadDir(path, type, (err, assets) => {
                if (err) {
                    console.error(`folder assets load failed, path=${path}, bundle=${bundle}`);
                    reject(err);
                }

                let infos = loader.getDirWithPath(path, type);
                let res = [];

                assets.forEach((asset, idx) => {
                    res.push({ path: infos[idx].path, asset: <T>asset, bundle: bundle });
                });

                return res;
            });
        });
    }
}
