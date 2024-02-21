import { Component, Node } from "cc";
import { ObjPool } from "./obj-pool";

/**
 * 組件池物件
 */
export interface CmptPoolObj {
    /**
     * 取出
     */
    reuse(): void;

    /**
     * 回收
     */
    unuse(): void;
}

/**
 * 鍵
 */
type CmptPoolKey = { prototype: Component };

/**
 * 組件池
 */
export class CmptPool extends ObjPool<CmptPoolKey, Node> {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 取得
     * @param key 
     */
    public get(key: CmptPoolKey): Node {
        let value = super.get(key);

        let cmpt: any = value?.getComponent(key.prototype.name);
        cmpt && cmpt.reuse && cmpt.reuse();

        return value;
    }

    /**
     * 取得物件
     * @param key 
     */
    public getCmpt(key: CmptPoolKey): Component {
        let value = super.get(key);

        let cmpt: any = value?.getComponent(key.prototype.name);
        cmpt && cmpt.reuse && cmpt.reuse();

        return cmpt;
    }

    /**
     * 回收
     * @param key 
     * @param value 
     */
    public put(key: CmptPoolKey, value: Node): boolean {
        let cmpt: any = value.getComponent(key.prototype.name);
        cmpt && cmpt.unuse && cmpt.unuse();

        return super.put(key, value);
    }
}
