import type { Lifecycle, ModuleMetadata } from './types';
import type { GFD } from './gfd';

/**
 * 模块基类
 * 所有功能模块都应该继承此类
 */
export abstract class Module implements Lifecycle {
  /** 模块元数据 */
  abstract readonly name: string;
  readonly version?: string;
  readonly description?: string;
  readonly dependencies?: string[];
  readonly optionalDependencies?: string[];

  /** GFD实例 */
  protected gfd!: GFD;

  /** 模块是否已初始化 */
  protected initialized = false;

  /** 模块是否正在运行 */
  protected running = false;

  /**
   * 获取模块元数据
   */
  getMetadata(): ModuleMetadata {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      dependencies: this.dependencies,
      optionalDependencies: this.optionalDependencies
    };
  }

  /**
   * 设置GFD实例
   * 由模块管理器自动调用
   */
  setGFD(gfd: GFD): void {
    this.gfd = gfd;
  }

  /**
   * 初始化模块
   * 可以重写此方法实现自定义初始化逻辑
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.gfd.logger.debug(`模块 ${this.name} 已初始化`);
  }

  /**
   * 启动模块
   * 可以重写此方法实现自定义启动逻辑
   */
  async start(): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;
    this.gfd.logger.debug(`模块 ${this.name} 已启动`);
  }

  /**
   * 停止模块
   * 可以重写此方法实现自定义停止逻辑
   */
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }
    this.running = false;
    this.gfd.logger.debug(`模块 ${this.name} 已停止`);
  }

  /**
   * 检查模块是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 检查模块是否正在运行
   */
  isRunning(): boolean {
    return this.running;
  }
}

/**
 * 模块装饰器
 * 用于标记类为GFD模块
 */
export function ModuleDecorator(options: Omit<ModuleMetadata, 'name'> & { name: string }) {
  return function (target: any) {
    // 挂载元数据到类
    Reflect.defineMetadata('gfd:module', options, target);
    
    // 自动设置属性
    for (const [key, value] of Object.entries(options)) {
      target.prototype[key] = value;
    }
    
    return target;
  };
}
