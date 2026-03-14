import type { Lifecycle, PluginMetadata } from './types';
import type { GFD } from './gfd';
/**
 * 插件基类
 * 所有插件都应该继承此类
 */
export declare abstract class Plugin implements Lifecycle {
    /** 插件元数据 - 必须实现 */
    abstract readonly name: string;
    abstract readonly version: string;
    /** 可选元数据 */
    readonly description?: string;
    readonly author?: string;
    readonly dependencies?: string[];
    readonly optionalDependencies?: string[];
    readonly compatibleGFDVersion?: string;
    readonly tags?: string[];
    /** GFD实例 */
    protected gfd: GFD;
    /** 插件是否已安装 */
    protected installed: boolean;
    /** 插件是否已初始化 */
    protected initialized: boolean;
    /** 插件是否正在运行 */
    protected running: boolean;
    /**
     * 获取插件元数据
     */
    getMetadata(): PluginMetadata;
    /**
     * 设置GFD实例
     * 由插件管理器自动调用
     */
    setGFD(gfd: GFD): void;
    /**
     * 安装插件
     * 在插件注册时调用，只执行一次
     */
    install(gfd: GFD): Promise<void>;
    /**
     * 初始化插件
     * 可以重写此方法实现自定义初始化逻辑
     */
    initialize(): Promise<void>;
    /**
     * 启动插件
     * 可以重写此方法实现自定义启动逻辑
     */
    start(): Promise<void>;
    /**
     * 停止插件
     * 可以重写此方法实现自定义停止逻辑
     */
    stop(): Promise<void>;
    /**
     * 卸载插件
     * 在插件被移除时调用
     */
    uninstall(): Promise<void>;
    /**
     * 检查插件是否已安装
     */
    isInstalled(): boolean;
    /**
     * 检查插件是否已初始化
     */
    isInitialized(): boolean;
    /**
     * 检查插件是否正在运行
     */
    isRunning(): boolean;
}
/**
 * 插件装饰器
 * 用于标记类为GFD插件
 */
export declare function PluginDecorator(options: Omit<PluginMetadata, 'name' | 'version'> & {
    name: string;
    version: string;
}): (target: any) => any;
//# sourceMappingURL=plugin.d.ts.map