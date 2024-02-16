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

    /**
     * 打印日誌
     * @param type 種類
     * @param msg 訊息
     * @param hint 補充說明
     */
    public static print(type: LogType, msg: any, hint: string = ""): void {
        if (this.opened(type)) {
            let conf = LogConf[type];

            let color = conf.color;
            let time = this.getNowStr();
            let title = conf.title;
            let stack = this.getCallStack();

            console.log(`%c[%s][%s][%s][%s]:%o`, color, time, title, stack, hint, msg);
        }
    }

    /**
     * 取得當前時間
     */
    private static getNowStr(): string {
        let res = "";

        // 空位補0並加入字串
        let func = function(time: number, count: number, symbol: string = ""): void {
            res += (Array(3).join("0") + time).slice(-count) + symbol;
        }

        let date = new Date();
        func(date.getHours(), 2, `:`);
        func(date.getMinutes(), 2, `:`);
        func(date.getSeconds(), 2, `:`);
        func(date.getMilliseconds(), 3);

        return res;
    }

    /**
     * 取得呼叫堆疊
     * @param idx 
     */
    private static getCallStack(idx: number = 5): string {
        return "";
    }
}
