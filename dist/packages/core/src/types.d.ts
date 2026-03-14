/**
 * GFD配置选项
 */
export interface GFDConfig {
    /** 应用名称 */
    appName: string;
    /** 应用版本 */
    version: string;
    /** 运行环境 */
    environment: 'development' | 'production' | 'test';
    /** 是否启用调试模式 */
    debug?: boolean;
    /** 插件配置 */
    plugins?: Record<string, any>;
    /** 模块配置 */
    modules?: Record<string, any>;
    /** 其他自定义配置 */
    [key: string]: any;
}
/**
 * 生命周期钩子
 */
export interface Lifecycle {
    /**
     * 初始化阶段
     * 在实例创建后调用
     */
    initialize?(): Promise<void> | void;
    /**
     * 启动阶段
     * 在所有依赖准备就绪后调用
     */
    start?(): Promise<void> | void;
    /**
     * 停止阶段
     * 在应用关闭前调用
     */
    stop?(): Promise<void> | void;
}
/**
 * 模块元数据
 */
export interface ModuleMetadata {
    /** 模块名称 */
    name: string;
    /** 模块版本 */
    version?: string;
    /** 模块描述 */
    description?: string;
    /** 依赖的其他模块 */
    dependencies?: string[];
    /** 是否为可选依赖 */
    optionalDependencies?: string[];
}
/**
 * 插件元数据
 */
export interface PluginMetadata {
    /** 插件名称 */
    name: string;
    /** 插件版本 */
    version: string;
    /** 插件描述 */
    description?: string;
    /** 作者信息 */
    author?: string;
    /** 依赖的插件 */
    dependencies?: string[];
    /** 可选依赖的插件 */
    optionalDependencies?: string[];
    /** 兼容的GFD版本范围 */
    compatibleGFDVersion?: string;
    /** 插件标签 */
    tags?: string[];
}
/**
 * API接口定义
 */
export interface ApiDefinition {
    /** API名称 */
    name: string;
    /** API描述 */
    description?: string;
    /** 参数定义 */
    parameters?: ApiParameter[];
    /** 返回值定义 */
    returns?: ApiReturnType;
    /** 处理函数 */
    handler: (...args: any[]) => any;
}
/**
 * API参数定义
 */
export interface ApiParameter {
    /** 参数名称 */
    name: string;
    /** 参数类型 */
    type: string;
    /** 是否必填 */
    required?: boolean;
    /** 参数描述 */
    description?: string;
    /** 默认值 */
    default?: any;
}
/**
 * API返回值定义
 */
export interface ApiReturnType {
    /** 返回类型 */
    type: string;
    /** 返回描述 */
    description?: string;
}
/**
 * 事件定义
 */
export interface EventDefinition {
    /** 事件名称 */
    name: string;
    /** 事件描述 */
    description?: string;
    /** 事件数据类型 */
    dataType?: string;
}
//# sourceMappingURL=types.d.ts.map