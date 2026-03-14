import type { GFD } from './gfd';
import type { ApiDefinition } from './types';
/**
 * API注册表
 * 管理所有公开的API接口
 */
export declare class ApiRegistry {
    private readonly gfd;
    private readonly apis;
    constructor(gfd: GFD);
    /**
     * 注册API
     * @param definition API定义
     */
    register(definition: ApiDefinition): void;
    /**
     * 批量注册API
     * @param definitions API定义列表
     */
    registerBatch(definitions: ApiDefinition[]): void;
    /**
     * 获取API定义
     * @param name API名称
     */
    get(name: string): ApiDefinition | undefined;
    /**
     * 检查API是否存在
     * @param name API名称
     */
    has(name: string): boolean;
    /**
     * 调用API
     * @param name API名称
     * @param args API参数
     */
    call<T = any>(name: string, ...args: any[]): Promise<T>;
    /**
     * 同步调用API（仅当API处理函数是同步的）
     * @param name API名称
     * @param args API参数
     */
    callSync<T = any>(name: string, ...args: any[]): T;
    /**
     * 删除API
     * @param name API名称
     */
    unregister(name: string): boolean;
    /**
     * 获取所有已注册的API
     */
    getAll(): ApiDefinition[];
    /**
     * 获取API列表（名称列表）
     */
    list(): string[];
    /**
     * 验证参数
     */
    private validateParameters;
    /**
     * 创建API调用器
     * 生成一个可以直接调用的函数
     * @param name API名称
     */
    createCaller<T extends (...args: any[]) => any>(name: string): T;
    /**
     * 创建同步API调用器
     * @param name API名称
     */
    createSyncCaller<T extends (...args: any[]) => any>(name: string): T;
}
//# sourceMappingURL=api.d.ts.map