/**
 * 日誌類型
 * @summary 編號使用2進位制
 */
export enum LogType {
    // TODO
}

/**
 * 日誌配置
 * @summary 編號對齊類型
 */
const LogConf: { [type: number]: { title: string, color: string } } = {
    // TODO
};

/**
 * 日誌
 */
export class Logger {
    // 打印旗標
    private static _flags: number =  Number.MAX_SAFE_INTEGER;

    /**
     * 設定需要打印的種類
     * @param flags 不傳代表全關
     */
    public static setFlags(...types: LogType[]): void {
        this._flags = 0;
        types.forEach(type => this._flags |= type, this);
    }

    /**
     * 是否需要打印
     * @param flag 
     */
    private static opened(type: LogType): boolean {
        return (this._flags & type) != 0;
    }
}
