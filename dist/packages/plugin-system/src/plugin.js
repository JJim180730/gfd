/**
 * 插件基类（可选，提供默认实现）
 */
export class BasePlugin {
    description;
    author;
    dependencies;
    optionalDependencies;
    compatibleGFDVersion;
    gfd;
    /**
     * 设置GFD实例
     * 由插件管理器自动调用
     */
    setGFD(gfd) {
        this.gfd = gfd;
    }
    /**
     * 默认安装方法
     */
    async install(gfd) {
        this.gfd = gfd;
        this.gfd.logger.debug(`插件 ${this.name} 已安装`);
    }
    /**
     * 默认初始化方法
     */
    async initialize() {
        this.gfd.logger.debug(`插件 ${this.name} 已初始化`);
    }
    /**
     * 默认启动方法
     */
    async start() {
        this.gfd.logger.debug(`插件 ${this.name} 已启动`);
    }
    /**
     * 默认停止方法
     */
    async stop() {
        this.gfd.logger.debug(`插件 ${this.name} 已停止`);
    }
    /**
     * 默认卸载方法
     */
    async uninstall() {
        this.gfd.logger.debug(`插件 ${this.name} 已卸载`);
    }
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
            compatibleGFDVersion: this.compatibleGFDVersion
        };
    }
}
//# sourceMappingURL=plugin.js.map