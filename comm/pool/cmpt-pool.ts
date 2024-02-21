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
 * 組件池
 */
export class CmptPool extends ObjPool<{ prototype: Component }, Node> {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 取得物件
     * @param key 
     */
    public get(key: { prototype: Component }): Node {
        let value = super.get(key);

        let cmpt: any = value?.getComponent(key.prototype.name);
        cmpt && cmpt.reuse && cmpt.reuse();

        return value;
    }

    /**
     * 取得組件
     * @param key 
     */
    public getCmpt<T extends Component>(key: { prototype: T }): T {
        let value = super.get(key);

        let cmpt: any = value?.getComponent(key.prototype.name);
        cmpt && cmpt.reuse && cmpt.reuse();

        return <T>cmpt;
    }

    /**
     * 回收
     * @param key 
     * @param value 
     */
    public put(key: { prototype: Component }, value: Node): boolean {
        let cmpt: any = value.getComponent(key.prototype.name);
        cmpt && cmpt.unuse && cmpt.unuse();

        return super.put(key, value);
    }
}
