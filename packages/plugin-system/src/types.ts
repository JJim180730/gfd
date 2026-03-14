/**
 * 插件元数据
 */
export interface PluginMetadata {
  /** 插件名称（唯一标识） */
  name: string;
  /** 插件版本 */
  version: string;
  /** 插件描述 */
  description?: string;
  /** 作者信息 */
  author?: string;
  /** 依赖的插件列表 */
  dependencies?: string[];
  /** 可选依赖的插件列表 */
  optionalDependencies?: string[];
  /** 兼容的GFD版本范围 */
  compatibleGFDVersion?: string;
  /** 插件主页 */
  homepage?: string;
  /** 代码仓库地址 */
  repository?: string;
  /** 许可证 */
  license?: string;
  /** 插件标签 */
  tags?: string[];
  /** 是否为核心插件 */
  core?: boolean;
}

/**
 * 插件清单
 * 对应package.json中的gfd字段
 */
export interface PluginManifest extends PluginMetadata {
  /** 入口文件路径 */
  main: string;
  /** 插件类型 */
  type?: 'common' | 'theme' | 'module' | 'extension';
  /** 插件配置schema */
  configSchema?: Record<string, any>;
  /** 权限要求 */
  permissions?: string[];
}

/**
 * 插件状态
 */
export enum PluginStatus {
  /** 已注册 */
  REGISTERED = 'registered',
  /** 已安装 */
  INSTALLED = 'installed',
  /** 已初始化 */
  INITIALIZED = 'initialized',
  /** 运行中 */
  RUNNING = 'running',
  /** 已停止 */
  STOPPED = 'stopped',
  /** 已卸载 */
  UNINSTALLED = 'uninstalled',
  /** 错误状态 */
  ERROR = 'error'
}

/**
 * 插件加载选项
 */
export interface PluginLoadOptions {
  /** 是否自动启动 */
  autoStart?: boolean;
  /** 插件配置 */
  config?: Record<string, any>;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * 插件错误
 */
export class PluginError extends Error {
  constructor(
    message: string,
    public readonly pluginName: string,
    public readonly code?: string,
    public readonly cause?: Error
  ) {
    super(`[Plugin ${pluginName}] ${message}`);
    this.name = 'PluginError';
  }
}
