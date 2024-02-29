import { _decorator, Component, Node } from 'cc';
import { Singleton } from '../util/singleton';

const { ccclass, property, menu, disallowMultiple, executionOrder } = _decorator;

/**
 * 全局唯一計時器
 */
@ccclass
@menu(`timer`)
@disallowMultiple
@executionOrder(-1000)
export class TimerCmpt extends Component implements Singleton {
    /**
     * 加入固定更新
     * @param update 更新回調
     * @summary 不可操作delta time快慢
     */
    public addFixed(update: Function): void {
        // TODO
    }

    /**
     * 加入彈性更新
     * @param update 更新回調
     * @summary 可操作delta time快慢
     */
    public addBounce(update: Function): void {
        // TODO
    }
}


