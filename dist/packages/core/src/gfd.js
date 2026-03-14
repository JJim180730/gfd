import { Container } from '@gfd/di';
import { EventBus } from '@gfd/event-bus';
import { I18n } from '@gfd/i18n';
import { Logger, LogLevel } from '@gfd/logger';
import { PluginManager } from '@gfd/plugin-system';
import { deepMerge } from '@gfd/utils';
import { ModuleManager } from './module-manager';
import { ApiRegistry } from './api';
/**
 * GFD主类
 * 框架的核心入口点
 */
export class GFD {
    /** 配置信息 */
    config;
    /** 依赖注入容器 */
    container;
    /** 事件总线 */
    eventBus;
    /** 国际化实例 */
    i18n;
    /** 日志实例 */
    logger;
    /** 插件管理器 */
    pluginManager;
    /** 模块管理器 */
    moduleManager;
    /** API注册表 */
    api;
    /** GFD实例是否已初始化 */
    initialized = false;
    /** GFD实例是否正在运行 */
    running = false;
    /**
     * 创建GFD实例
     * @param options 配置选项
     */
    constructor(options) {
        // 合并默认配置
        this.config = deepMerge({
            appName: 'GFD App',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            debug: process.env.NODE_ENV !== 'production'
        }, options.config);
        // 初始化核心组件
        this.container = Container.getInstance();
        this.eventBus = new EventBus();
        this.logger = new Logger({
            level: this.config.debug ? LogLevel.DEBUG : LogLevel.INFO,
            module: this.config.appName
        });
        this.i18n = new I18n({
            defaultLocale: options.defaultLocale || 'en-US',
            locales: options.locales || {}
        });
        this.pluginManager = new PluginManager(this);
        this.moduleManager = new ModuleManager(this);
        this.api = new ApiRegistry(this);
        // 注册核心实例到容器
        this.container.registerValue('GFD', this);
        this.container.registerValue('Config', this.config);
        this.container.registerValue('EventBus', this.eventBus);
        this.container.registerValue('Logger', this.logger);
        this.container.registerValue('I18n', this.i18n);
        this.container.registerValue('ApiRegistry', this.api);
        this.logger.debug('GFD实例创建成功', {
            appName: this.config.appName,
            version: this.config.version,
            environment: this.config.environment
        });
    }
    /**
     * 安装插件
     * @param plugin 插件实例
     */
    use(plugin) {
        this.pluginManager.install(plugin);
        return this;
    }
    /**
     * 注册模块
     * @param module 模块类或实例
     */
    registerModule(module) {
        this.moduleManager.register(module);
        return this;
    }
    /**
     * 初始化GFD应用
     * 执行所有初始化逻辑，但不启动服务
     */
    async initialize() {
        if (this.initialized) {
            this.logger.warn('GFD已经初始化，跳过重复初始化');
            return;
        }
        this.logger.info('开始初始化GFD应用');
        try {
            // 初始化模块
            await this.moduleManager.initializeAll();
            // 初始化插件
            await this.pluginManager.initializeAll();
            this.initialized = true;
            this.logger.info('GFD应用初始化完成');
            this.eventBus.emit('gfd:initialized', {
                appName: this.config.appName,
                version: this.config.version
            });
        }
        catch (error) {
            this.logger.error('GFD应用初始化失败', error);
            throw error;
        }
    }
    /**
     * 启动GFD应用
     * 初始化并启动所有组件
     */
    async start() {
        if (this.running) {
            this.logger.warn('GFD已经在运行中，跳过重复启动');
            return;
        }
        this.logger.info(`正在启动GFD应用: ${this.config.appName} v${this.config.version}`);
        try {
            // 先初始化
            if (!this.initialized) {
                await this.initialize();
            }
            // 启动模块
            await this.moduleManager.startAll();
            // 启动插件
            await this.pluginManager.startAll();
            this.running = true;
            this.logger.info(`GFD应用启动成功，运行环境: ${this.config.environment}`);
            this.eventBus.emit('gfd:started', {
                appName: this.config.appName,
                version: this.config.version,
                environment: this.config.environment
            });
        }
        catch (error) {
            this.logger.error('GFD应用启动失败', error);
            throw error;
        }
    }
    /**
     * 停止GFD应用
     * 优雅关闭所有组件
     */
    async stop() {
        if (!this.running) {
            this.logger.warn('GFD未在运行中，跳过停止操作');
            return;
        }
        this.logger.info('正在停止GFD应用');
        try {
            // 停止插件（先启动的后停止）
            await this.pluginManager.stopAll();
            // 停止模块
            await this.moduleManager.stopAll();
            this.running = false;
            this.initialized = false;
            this.logger.info('GFD应用已成功停止');
            this.eventBus.emit('gfd:stopped', {
                appName: this.config.appName,
                version: this.config.version
            });
        }
        catch (error) {
            this.logger.error('GFD应用停止失败', error);
            throw error;
        }
    }
    /**
     * 获取应用状态
     */
    getStatus() {
        return {
            initialized: this.initialized,
            running: this.running,
            appName: this.config.appName,
            version: this.config.version,
            environment: this.config.environment,
            plugins: this.pluginManager.getInstalledPlugins().map(p => p.name),
            modules: this.moduleManager.getRegisteredModules().map(m => m.name)
        };
    }
}
//# sourceMappingURL=gfd.js.map