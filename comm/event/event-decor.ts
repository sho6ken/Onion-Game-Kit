import { EventMgr } from "./event-mgr";

/**
 * 事件類別裝飾
 * @param on 調用此函式時註冊事件
 * @param off 調用此函式時註銷事件
 * @summary 非cmpt使用時需自定註冊及註銷函式名稱
 */
export function eventClass(on: string = "onEnable", off: string = "onDisable"): Function {
    return function(self: any): void {
        if (on) {
            let func = self.prototype[on];

            // 替換原始函式
            self.prototype[on] = function(): void {
                EventMgr.register(this);
                func && func.call(this);
            }
        }
        else {
            console.warn(`event class=${self.name} on=${on} register failed`);
        }

        if (on && off) {
            let func = self.prototype[off];

            // 替換原始函式
            self.prototype[off] = function (): void {
                EventMgr.unregister(this);
                func && func.call(this);
            }
        }
        else if (!on) {
            console.warn(`event class=${self.name} off=${off} without register`);
        }
    }
}
