import type { Lifecycle, PluginMetadata } from './types';
import type { GFD } from './gfd';

/**
 * 插件基类
 * 所有插件都应该继承此类
 */
export abstract class Plugin implements Lifecycle {
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
  protected gfd!: GFD;

  /** 插件是否已安装 */
  protected installed = false;
  
  /** 插件是否已初始化 */
  protected initialized = false;
  
  /** 插件是否正在运行 */
  protected running = false;

  /**
   * 获取插件元数据
   */
  getMetadata(): PluginMetadata {
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
  setGFD(gfd: GFD): void {
    this.gfd = gfd;
  }

  /**
   * 安装插件
   * 在插件注册时调用，只执行一次
   */
  async install(gfd: GFD): Promise<void> {
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
  async initialize(): Promise<void> {
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
  async start(): Promise<void> {
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
  async stop(): Promise<void> {
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
  async uninstall(): Promise<void> {
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
  isInstalled(): boolean {
    return this.installed;
  }

  /**
   * 检查插件是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 检查插件是否正在运行
   */
  isRunning(): boolean {
    return this.running;
  }
}

/**
 * 插件装饰器
 * 用于标记类为GFD插件
 */
export function PluginDecorator(options: Omit<PluginMetadata, 'name' | 'version'> & { 
  name: string; 
  version: string;
}) {
  return function (target: any) {
    // 挂载元数据到类
    Reflect.defineMetadata('gfd:plugin', options, target);
    
    // 自动设置属性
    for (const [key, value] of Object.entries(options)) {
      target.prototype[key] = value;
    }
    
    return target;
  };
}
