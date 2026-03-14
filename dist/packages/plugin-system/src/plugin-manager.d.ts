import type { GFD } from '@gfd/core';
import type { Plugin } from './plugin';
import type { PluginLoadOptions, PluginMetadata, PluginStatus } from './types';
/**
 * 插件管理器
 * 负责插件的安装、初始化、启动、停止和卸载
 */
export declare class PluginManager {
    private readonly gfd;
    private readonly plugins;
    private readonly pluginStatus;
    private readonly pluginOptions;
    private readonly dependencyGraph;
    constructor(gfd: GFD);
    /**
     * 安装插件
     * @param plugin 插件实例
     * @param options 加载选项
     */
    install(plugin: Plugin, options?: PluginLoadOptions): Promise<void>;
    /**
     * 批量安装插件
     * @param plugins 插件实例列表
     * @param options 加载选项
     */
    installBatch(plugins: Plugin[], options?: PluginLoadOptions): Promise<void>;
    /**
     * 初始化所有插件
     * 按照依赖顺序初始化
     */
    initializeAll(): Promise<void>;
    /**
     * 初始化单个插件
     * @param pluginName 插件名称
     */
    initialize(pluginName: string): Promise<void>;
    /**
     * 启动所有插件
     * 按照依赖顺序启动
     */
    startAll(): Promise<void>;
    /**
     * 启动单个插件
     * @param pluginName 插件名称
     */
    start(pluginName: string): Promise<void>;
    /**
     * 停止所有插件
     * 按照依赖逆序停止
     */
    stopAll(): Promise<void>;
    /**
     * 停止单个插件
     * @param pluginName 插件名称
     */
    stop(pluginName: string): Promise<void>;
    /**
     * 卸载插件
     * @param pluginName 插件名称
     */
    uninstall(pluginName: string): Promise<void>;
    /**
     * 获取插件实例
     * @param pluginName 插件名称
     */
    get<T extends Plugin = Plugin>(pluginName: string): T | undefined;
    /**
     * 获取所有已安装的插件
     */
    getInstalledPlugins(): Plugin[];
    /**
     * 获取插件状态
     * @param pluginName 插件名称
     */
    getStatus(pluginName: string): PluginStatus | undefined;
    /**
     * 检查插件是否已安装
     * @param pluginName 插件名称
     */
    isInstalled(pluginName: string): boolean;
    /**
     * 检查插件是否正在运行
     * @param pluginName 插件名称
     */
    isRunning(pluginName: string): boolean;
    /**
     * 获取插件元数据
     * @param pluginName 插件名称
     */
    getMetadata(pluginName: string): PluginMetadata | undefined;
    /**
     * 检查依赖是否满足
     */
    private checkDependencies;
}
//# sourceMappingURL=plugin-manager.d.ts.map