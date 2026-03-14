import { Container } from '@gfd/di';
import { EventBus } from '@gfd/event-bus';
import { I18n } from '@gfd/i18n';
import { Logger } from '@gfd/logger';
import { PluginManager, type Plugin } from '@gfd/plugin-system';
import type { GFDConfig } from './types';
import { ModuleManager } from './module-manager';
import { ApiRegistry } from './api';
/**
 * GFD主类
 * 框架的核心入口点
 */
export declare class GFD {
    /** 配置信息 */
    readonly config: GFDConfig;
    /** 依赖注入容器 */
    readonly container: Container;
    /** 事件总线 */
    readonly eventBus: EventBus;
    /** 国际化实例 */
    readonly i18n: I18n;
    /** 日志实例 */
    readonly logger: Logger;
    /** 插件管理器 */
    readonly pluginManager: PluginManager;
    /** 模块管理器 */
    readonly moduleManager: ModuleManager;
    /** API注册表 */
    readonly api: ApiRegistry;
    /** GFD实例是否已初始化 */
    private initialized;
    /** GFD实例是否正在运行 */
    private running;
    /**
     * 创建GFD实例
     * @param options 配置选项
     */
    constructor(options: {
        config: Partial<GFDConfig>;
        locales?: Record<string, Record<string, any>>;
        defaultLocale?: string;
    });
    /**
     * 安装插件
     * @param plugin 插件实例
     */
    use(plugin: Plugin): this;
    /**
     * 注册模块
     * @param module 模块类或实例
     */
    registerModule(module: any): this;
    /**
     * 初始化GFD应用
     * 执行所有初始化逻辑，但不启动服务
     */
    initialize(): Promise<void>;
    /**
     * 启动GFD应用
     * 初始化并启动所有组件
     */
    start(): Promise<void>;
    /**
     * 停止GFD应用
     * 优雅关闭所有组件
     */
    stop(): Promise<void>;
    /**
     * 获取应用状态
     */
    getStatus(): {
        initialized: boolean;
        running: boolean;
        appName: string;
        version: string;
        environment: string;
        plugins: string[];
        modules: string[];
    };
}
//# sourceMappingURL=gfd.d.ts.map