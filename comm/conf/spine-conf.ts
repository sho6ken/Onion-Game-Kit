import { sp } from "cc"
import { SingleMgr } from "../util/singleton"
import { AssetMgr } from "../asset/asset-mgr"

/**
 * spine種類
 */
export enum SpineType{
    None = "路徑",  // 無
}

/**
 * 設定參數
 */
const setting = {
    // 資源種類
    TYPE: sp.SkeletonData,

    // 常駐不釋放
    HOLD: false,

    // 包體名稱
    BUNDLE: "",
};

/**
 * 取得spine
 * @param type spine種類
 */
export const getSpine = async function(type: SpineType): Promise<sp.SkeletonData> {
    return await SingleMgr.get(AssetMgr).loadLocal(setting.TYPE, type, setting.HOLD, setting.BUNDLE);
}
