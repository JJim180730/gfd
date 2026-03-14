import type { GFD } from './gfd';
import type { Module } from './module';
/**
 * 模块管理器
 * 负责模块的注册、初始化、启动和停止
 */
export declare class ModuleManager {
    private readonly gfd;
    private readonly modules;
    private readonly dependencyGraph;
    constructor(gfd: GFD);
    /**
     * 注册模块
     * @param moduleOrClass 模块实例或类
     */
    register(moduleOrClass: any): Module;
    /**
     * 获取已注册的模块
     * @param name 模块名称
     */
    get<T extends Module>(name: string): T | undefined;
    /**
     * 获取所有已注册的模块
     */
    getRegisteredModules(): Module[];
    /**
     * 检查模块是否已注册
     * @param name 模块名称
     */
    has(name: string): boolean;
    /**
     * 初始化所有模块
     * 按照依赖顺序初始化
     */
    initializeAll(): Promise<void>;
    /**
     * 启动所有模块
     * 按照依赖顺序启动
     */
    startAll(): Promise<void>;
    /**
     * 停止所有模块
     * 按照依赖逆序停止
     */
    stopAll(): Promise<void>;
    /**
     * 检查依赖是否满足
     */
    private checkDependencies;
}
//# sourceMappingURL=module-manager.d.ts.map