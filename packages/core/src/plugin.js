/**
 * 插件基类
 * 所有插件都应该继承此类
 */
export class Plugin {
    /** 可选元数据 */
    description;
    author;
    dependencies;
    optionalDependencies;
    compatibleGFDVersion;
    tags;
    /** GFD实例 */
    gfd;
    /** 插件是否已安装 */
    installed = false;
    /** 插件是否已初始化 */
    initialized = false;
    /** 插件是否正在运行 */
    running = false;
    /**
     * 获取插件元数据
     */
    getMetadata() {
        return {
            name: this.name,
            version: this.version,
            description: this.description,
            author: this.author,
            dependencies: this.dependencies,
            optionalDependencies: this.optionalDependencies,
            compatibleGFDVersion: this.compatibleGFDVersion,
            tags: this.tags
        };
    }
    /**
     * 设置GFD实例
     * 由插件管理器自动调用
     */
    setGFD(gfd) {
        this.gfd = gfd;
    }
    /**
     * 安装插件
     * 在插件注册时调用，只执行一次
     */
    async install(gfd) {
        if (this.installed) {
            return;
        }
        this.installed = true;
        this.gfd.logger.debug(`插件 ${this.name} v${this.version} 已安装`);
    }
    /**
     * 初始化插件
     * 可以重写此方法实现自定义初始化逻辑
     */
    async initialize() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.gfd.logger.debug(`插件 ${this.name} 已初始化`);
    }
    /**
     * 启动插件
     * 可以重写此方法实现自定义启动逻辑
     */
    async start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.gfd.logger.debug(`插件 ${this.name} 已启动`);
    }
    /**
     * 停止插件
     * 可以重写此方法实现自定义停止逻辑
     */
    async stop() {
        if (!this.running) {
            return;
        }
        this.running = false;
        this.gfd.logger.debug(`插件 ${this.name} 已停止`);
    }
    /**
     * 卸载插件
     * 在插件被移除时调用
     */
    async uninstall() {
        if (this.running) {
            await this.stop();
        }
        this.installed = false;
        this.initialized = false;
        this.gfd.logger.debug(`插件 ${this.name} 已卸载`);
    }
    /**
     * 检查插件是否已安装
     */
    isInstalled() {
        return this.installed;
    }
    /**
     * 检查插件是否已初始化
     */
    isInitialized() {
        return this.initialized;
    }
    /**
     * 检查插件是否正在运行
     */
    isRunning() {
        return this.running;
    }
}
/**
 * 插件装饰器
 * 用于标记类为GFD插件
 */
export function PluginDecorator(options) {
    return function (target) {
        // 挂载元数据到类
        Reflect.defineMetadata('gfd:plugin', options, target);
        // 自动设置属性
        for (const [key, value] of Object.entries(options)) {
            target.prototype[key] = value;
        }
        return target;
    };
}
//# sourceMappingURL=plugin.js.map