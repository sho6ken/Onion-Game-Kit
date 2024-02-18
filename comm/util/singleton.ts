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
    free?(): void;

    /**
     * 清除數據
     */
    clear?(): void;
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

/**
 * 單例管理
 */
export class SingleMgr implements Singleton {
    // 名稱
    public get name(): string { return `單例管理`; }

    // 常駐不釋放
    public get hold(): boolean { return true; }

    // 實例
    private static _inst: SingleMgr = null;
    public static get inst(): SingleMgr { return this._inst || (this._inst = new SingleMgr()); }

    // 單例數據
    private _data: Map<string, Singleton> = new Map();

    /**
     * 取得
     * @param type 單例類別
     * @param isCreate 當查無此類時, 是否生成新的實例
     * @param params 建構單例時的初始化參數
     */
    public static get<T extends Singleton>(type: SingleType<T>, isCreate: boolean = false, ...params: any[]): T | null {
        let data = SingleMgr.inst._data;
        let name = type.name;

        if (data.has(name)) {
            return <T>(data.get(name));
        }
        else if (isCreate) {
            // 優先使用外部已建立實體
            let inst = type.inst ?? new type();
            data.set(name, inst);

            console.log(`${name}單例初始化`);
            inst.init && inst.init(...params);

            return inst;
        }

        return null;
    }

    /**
     * 釋放
     * @param type 空值代表釋放所有非常駐對象
     */
    public static free<T extends Singleton>(type?: SingleType<T>): void {
        let data = SingleMgr.inst._data;

        // 執行銷毀
        const execute = function(name: string): void {
            let inst = data.get(name);

            if (inst && inst.hold) {
                console.log(`${name}單例釋放`);

                inst.free && inst.free();
                data.delete(name);
            }
        };

        type ? execute(type.name) : data.forEach(elm => execute(elm.name));
    }

    /**
     * 清除數據
     */
    public static clear(): void {
        SingleMgr.inst._data.forEach(elm => elm.clear && elm.clear());
    }
}
