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
