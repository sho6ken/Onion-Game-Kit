/**
 * 單例介面
 */
export interface Singleton {
    // 名稱
    name: string;

    // 常駐不釋放
    hold?: boolean;

    /**
     * 初始化
     * @param params 
     */
    init?(...params: any[]): void;

    /**
     * 釋放
     * @param params 
     */
    free?(): any;

    /**
     * 顯示資訊
     */
    info?(): void;
}

/**
 * 單例型別
 * @summary 用來限制當作參數傳遞的物件一定要具備指定功能
 */
interface SingleType<T extends Singleton> {
    // 名稱
    name: string;

    // 指定在其他地方建立的實體, 用在cmpt的單例
    inst?: T;

    /**
     * 建構子
     */
    new(): T;
}
