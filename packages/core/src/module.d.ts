import type { Lifecycle, ModuleMetadata } from './types';
import type { GFD } from './gfd';
/**
 * 模块基类
 * 所有功能模块都应该继承此类
 */
export declare abstract class Module implements Lifecycle {
    /** 模块元数据 */
    abstract readonly name: string;
    readonly version?: string;
    readonly description?: string;
    readonly dependencies?: string[];
    readonly optionalDependencies?: string[];
    /** GFD实例 */
    protected gfd: GFD;
    /** 模块是否已初始化 */
    protected initialized: boolean;
    /** 模块是否正在运行 */
    protected running: boolean;
    /**
     * 获取模块元数据
     */
    getMetadata(): ModuleMetadata;
    /**
     * 设置GFD实例
     * 由模块管理器自动调用
     */
    setGFD(gfd: GFD): void;
    /**
     * 初始化模块
     * 可以重写此方法实现自定义初始化逻辑
     */
    initialize(): Promise<void>;
    /**
     * 启动模块
     * 可以重写此方法实现自定义启动逻辑
     */
    start(): Promise<void>;
    /**
     * 停止模块
     * 可以重写此方法实现自定义停止逻辑
     */
    stop(): Promise<void>;
    /**
     * 检查模块是否已初始化
     */
    isInitialized(): boolean;
    /**
     * 检查模块是否正在运行
     */
    isRunning(): boolean;
}
/**
 * 模块装饰器
 * 用于标记类为GFD模块
 */
export declare function ModuleDecorator(options: Omit<ModuleMetadata, 'name'> & {
    name: string;
}): (target: any) => any;
//# sourceMappingURL=module.d.ts.map