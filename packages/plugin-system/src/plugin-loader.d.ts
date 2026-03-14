import type { GFD } from '@gfd/core';
import type { Plugin } from './plugin';
import type { PluginManifest, PluginLoadOptions } from './types';
/**
 * 插件加载器
 * 负责从文件系统加载插件
 */
export declare class PluginLoader {
    private readonly gfd;
    private readonly pluginDirs;
    private readonly logger;
    private readonly pluginManager;
    constructor(gfd: GFD, pluginDirs?: string[]);
    /**
     * 添加插件搜索目录
     * @param dir 目录路径
     */
    addPluginDir(dir: string): void;
    /**
     * 从目录加载所有插件
     * @param dir 目录路径
     * @param options 加载选项
     */
    loadFromDir(dir: string, options?: PluginLoadOptions): Promise<Plugin[]>;
    /**
     * 从指定路径加载插件
     * @param pluginPath 插件路径
     * @param options 加载选项
     */
    loadFromPath(pluginPath: string, options?: PluginLoadOptions): Promise<Plugin>;
    /**
     * 从NPM包加载插件
     * @param packageName NPM包名
     * @param options 加载选项
     */
    loadFromNpm(packageName: string, options?: PluginLoadOptions): Promise<Plugin>;
    /**
     * 批量加载插件
     * @param pluginSpecs 插件规格，可以是路径、包名或插件实例
     * @param options 加载选项
     */
    loadBatch(pluginSpecs: Array<string | Plugin>, options?: PluginLoadOptions): Promise<Plugin[]>;
    /**
     * 读取插件清单
     */
    private readPluginManifest;
    /**
     * 从package.json解析插件清单
     */
    private parseManifestFromPackageJson;
    /**
     * 加载插件模块
     */
    private loadPluginModule;
    /**
     * 获取插件类
     */
    private getPluginClass;
    /**
     * 实例化插件
     */
    private instantiatePlugin;
    /**
     * 搜索所有可用的插件
     * 遍历所有插件目录，返回可用的插件列表
     */
    searchAvailablePlugins(): Promise<Array<{
        path: string;
        manifest: PluginManifest;
    }>>;
}
//# sourceMappingURL=plugin-loader.d.ts.map