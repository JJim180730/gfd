import { DependencyGraph, satisfiesVersion } from '@gfd/utils';
import { PluginError } from './types';
/**
 * 插件管理器
 * 负责插件的安装、初始化、启动、停止和卸载
 */
export class PluginManager {
    gfd;
    plugins = new Map();
    pluginStatus = new Map();
    pluginOptions = new Map();
    dependencyGraph = new DependencyGraph();
    constructor(gfd) {
        this.gfd = gfd;
    }
    /**
     * 安装插件
     * @param plugin 插件实例
     * @param options 加载选项
     */
    async install(plugin, options = {}) {
        const pluginName = plugin.name;
        if (this.plugins.has(pluginName)) {
            this.gfd.logger.warn(`插件 ${pluginName} 已经安装，跳过重复安装`);
            return;
        }
        // 检查GFD版本兼容性
        if (plugin.compatibleGFDVersion) {
            const gfdVersion = this.gfd.config.version;
            if (!satisfiesVersion(gfdVersion, plugin.compatibleGFDVersion)) {
                throw new PluginError(`插件不兼容当前GFD版本，需要版本 ${plugin.compatibleGFDVersion}，当前版本 ${gfdVersion}`, pluginName, 'INCOMPATIBLE_VERSION');
            }
        }
        // 设置GFD实例
        if ('setGFD' in plugin && typeof plugin.setGFD === 'function') {
            plugin.setGFD(this.gfd);
        }
        // 执行插件安装逻辑
        if (plugin.install && typeof plugin.install === 'function') {
            try {
                await plugin.install(this.gfd);
            }
            catch (error) {
                throw new PluginError(`插件安装失败: ${error.message}`, pluginName, 'INSTALL_FAILED', error);
            }
        }
        // 添加到依赖图
        this.dependencyGraph.addNode(pluginName, plugin);
        // 添加依赖
        if (plugin.dependencies) {
            for (const dep of plugin.dependencies) {
                this.dependencyGraph.addDependency(pluginName, dep);
            }
        }
        // 保存插件实例和选项
        this.plugins.set(pluginName, plugin);
        this.pluginOptions.set(pluginName, options);
        this.pluginStatus.set(pluginName, 'installed');
        this.gfd.logger.info(`插件 ${pluginName} v${plugin.version} 安装成功`);
        // 如果设置了自动启动，启动插件
        if (options.autoStart) {
            await this.start(pluginName);
        }
    }
    /**
     * 批量安装插件
     * @param plugins 插件实例列表
     * @param options 加载选项
     */
    async installBatch(plugins, options = {}) {
        for (const plugin of plugins) {
            await this.install(plugin, options);
        }
    }
    /**
     * 初始化所有插件
     * 按照依赖顺序初始化
     */
    async initializeAll() {
        // 检查依赖是否满足
        this.checkDependencies();
        // 按照拓扑排序顺序初始化
        const orderedPlugins = this.dependencyGraph.topologicalSort();
        for (const pluginName of orderedPlugins) {
            await this.initialize(pluginName);
        }
        this.gfd.logger.info(`所有插件初始化完成，共 ${this.plugins.size} 个插件`);
    }
    /**
     * 初始化单个插件
     * @param pluginName 插件名称
     */
    async initialize(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new PluginError(`插件 ${pluginName} 不存在`, pluginName, 'NOT_FOUND');
        }
        const status = this.pluginStatus.get(pluginName);
        if (status === 'initialized' || status === 'running') {
            return;
        }
        try {
            if (plugin.initialize && typeof plugin.initialize === 'function') {
                await plugin.initialize();
            }
            this.pluginStatus.set(pluginName, 'initialized');
            this.gfd.logger.debug(`插件 ${pluginName} 初始化完成`);
        }
        catch (error) {
            this.pluginStatus.set(pluginName, 'error');
            throw new PluginError(`插件初始化失败: ${error.message}`, pluginName, 'INITIALIZE_FAILED', error);
        }
    }
    /**
     * 启动所有插件
     * 按照依赖顺序启动
     */
    async startAll() {
        // 按照拓扑排序顺序启动
        const orderedPlugins = this.dependencyGraph.topologicalSort();
        for (const pluginName of orderedPlugins) {
            const options = this.pluginOptions.get(pluginName);
            if (options?.enabled !== false) {
                await this.start(pluginName);
            }
        }
        this.gfd.logger.info(`所有插件启动完成，共 ${this.plugins.size} 个插件`);
    }
    /**
     * 启动单个插件
     * @param pluginName 插件名称
     */
    async start(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new PluginError(`插件 ${pluginName} 不存在`, pluginName, 'NOT_FOUND');
        }
        const status = this.pluginStatus.get(pluginName);
        if (status === 'running') {
            return;
        }
        // 如果还没初始化，先初始化
        if (status !== 'initialized') {
            await this.initialize(pluginName);
        }
        try {
            if (plugin.start && typeof plugin.start === 'function') {
                await plugin.start();
            }
            this.pluginStatus.set(pluginName, 'running');
            this.gfd.logger.debug(`插件 ${pluginName} 启动成功`);
            this.gfd.eventBus.emit('plugin:started', {
                pluginName,
                metadata: plugin.getMetadata?.() || { name: pluginName, version: plugin.version }
            });
        }
        catch (error) {
            this.pluginStatus.set(pluginName, 'error');
            throw new PluginError(`插件启动失败: ${error.message}`, pluginName, 'START_FAILED', error);
        }
    }
    /**
     * 停止所有插件
     * 按照依赖逆序停止
     */
    async stopAll() {
        // 按照拓扑排序逆序停止
        const orderedPlugins = this.dependencyGraph.topologicalSort().reverse();
        for (const pluginName of orderedPlugins) {
            await this.stop(pluginName);
        }
        this.gfd.logger.info(`所有插件停止完成，共 ${this.plugins.size} 个插件`);
    }
    /**
     * 停止单个插件
     * @param pluginName 插件名称
     */
    async stop(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new PluginError(`插件 ${pluginName} 不存在`, pluginName, 'NOT_FOUND');
        }
        const status = this.pluginStatus.get(pluginName);
        if (status !== 'running') {
            return;
        }
        try {
            if (plugin.stop && typeof plugin.stop === 'function') {
                await plugin.stop();
            }
            this.pluginStatus.set(pluginName, 'stopped');
            this.gfd.logger.debug(`插件 ${pluginName} 已停止`);
            this.gfd.eventBus.emit('plugin:stopped', {
                pluginName
            });
        }
        catch (error) {
            this.pluginStatus.set(pluginName, 'error');
            throw new PluginError(`插件停止失败: ${error.message}`, pluginName, 'STOP_FAILED', error);
        }
    }
    /**
     * 卸载插件
     * @param pluginName 插件名称
     */
    async uninstall(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new PluginError(`插件 ${pluginName} 不存在`, pluginName, 'NOT_FOUND');
        }
        // 先停止插件
        await this.stop(pluginName);
        try {
            if (plugin.uninstall && typeof plugin.uninstall === 'function') {
                await plugin.uninstall();
            }
            // 移除依赖图中的节点
            this.dependencyGraph.removeNode(pluginName);
            // 清理数据
            this.plugins.delete(pluginName);
            this.pluginStatus.delete(pluginName);
            this.pluginOptions.delete(pluginName);
            this.gfd.logger.info(`插件 ${pluginName} 已卸载`);
            this.gfd.eventBus.emit('plugin:uninstalled', {
                pluginName
            });
        }
        catch (error) {
            throw new PluginError(`插件卸载失败: ${error.message}`, pluginName, 'UNINSTALL_FAILED', error);
        }
    }
    /**
     * 获取插件实例
     * @param pluginName 插件名称
     */
    get(pluginName) {
        return this.plugins.get(pluginName);
    }
    /**
     * 获取所有已安装的插件
     */
    getInstalledPlugins() {
        return Array.from(this.plugins.values());
    }
    /**
     * 获取插件状态
     * @param pluginName 插件名称
     */
    getStatus(pluginName) {
        return this.pluginStatus.get(pluginName);
    }
    /**
     * 检查插件是否已安装
     * @param pluginName 插件名称
     */
    isInstalled(pluginName) {
        return this.plugins.has(pluginName);
    }
    /**
     * 检查插件是否正在运行
     * @param pluginName 插件名称
     */
    isRunning(pluginName) {
        return this.pluginStatus.get(pluginName) === 'running';
    }
    /**
     * 获取插件元数据
     * @param pluginName 插件名称
     */
    getMetadata(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin)
            return undefined;
        if (plugin.getMetadata && typeof plugin.getMetadata === 'function') {
            return plugin.getMetadata();
        }
        return {
            name: plugin.name,
            version: plugin.version,
            description: plugin.description,
            author: plugin.author,
            dependencies: plugin.dependencies,
            optionalDependencies: plugin.optionalDependencies,
            compatibleGFDVersion: plugin.compatibleGFDVersion
        };
    }
    /**
     * 检查依赖是否满足
     */
    checkDependencies() {
        const missingDependencies = [];
        for (const [pluginName, plugin] of this.plugins) {
            // 检查必填依赖
            if (plugin.dependencies) {
                for (const dep of plugin.dependencies) {
                    if (!this.plugins.has(dep)) {
                        missingDependencies.push(`插件 ${pluginName} 依赖的 ${dep} 未安装`);
                    }
                }
            }
            // 检查可选依赖，只警告不报错
            if (plugin.optionalDependencies) {
                for (const dep of plugin.optionalDependencies) {
                    if (!this.plugins.has(dep)) {
                        this.gfd.logger.warn(`插件 ${pluginName} 的可选依赖 ${dep} 未安装，部分功能可能不可用`);
                    }
                }
            }
        }
        if (missingDependencies.length > 0) {
            const errorMessage = `插件依赖检查失败:\n${missingDependencies.join('\n')}`;
            this.gfd.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        // 检查循环依赖
        const cycle = this.dependencyGraph.detectCycle();
        if (cycle) {
            const errorMessage = `检测到插件循环依赖: ${cycle.join(' -> ')}`;
            this.gfd.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        this.gfd.logger.debug('插件依赖检查通过');
    }
}
//# sourceMappingURL=plugin-manager.js.map