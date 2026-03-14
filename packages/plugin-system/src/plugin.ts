import type { GFD } from '@gfd/core';
import type { PluginMetadata } from './types';

/**
 * 插件接口
 */
export interface Plugin {
  /** 插件元数据 */
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly author?: string;
  readonly dependencies?: string[];
  readonly optionalDependencies?: string[];
  readonly compatibleGFDVersion?: string;

  /**
   * 安装插件
   * 在插件首次加载时调用
   */
  install?(gfd: GFD): Promise<void> | void;

  /**
   * 初始化插件
   * 在所有插件安装完成后调用
   */
  initialize?(): Promise<void> | void;

  /**
   * 启动插件
   * 在应用启动时调用
   */
  start?(): Promise<void> | void;

  /**
   * 停止插件
   * 在应用停止时调用
   */
  stop?(): Promise<void> | void;

  /**
   * 卸载插件
   * 在插件被移除时调用
   */
  uninstall?(): Promise<void> | void;

  /**
   * 获取插件元数据
   */
  getMetadata?(): PluginMetadata;
}

/**
 * 插件基类（可选，提供默认实现）
 */
export abstract class BasePlugin implements Plugin {
  abstract readonly name: string;
  abstract readonly version: string;
  
  readonly description?: string;
  readonly author?: string;
  readonly dependencies?: string[];
  readonly optionalDependencies?: string[];
  readonly compatibleGFDVersion?: string;

  protected gfd!: GFD;

  /**
   * 设置GFD实例
   * 由插件管理器自动调用
   */
  setGFD(gfd: GFD): void {
    this.gfd = gfd;
  }

  /**
   * 默认安装方法
   */
  async install(gfd: GFD): Promise<void> {
    this.gfd = gfd;
    this.gfd.logger.debug(`插件 ${this.name} 已安装`);
  }

  /**
   * 默认初始化方法
   */
  async initialize(): Promise<void> {
    this.gfd.logger.debug(`插件 ${this.name} 已初始化`);
  }

  /**
   * 默认启动方法
   */
  async start(): Promise<void> {
    this.gfd.logger.debug(`插件 ${this.name} 已启动`);
  }

  /**
   * 默认停止方法
   */
  async stop(): Promise<void> {
    this.gfd.logger.debug(`插件 ${this.name} 已停止`);
  }

  /**
   * 默认卸载方法
   */
  async uninstall(): Promise<void> {
    this.gfd.logger.debug(`插件 ${this.name} 已卸载`);
  }

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
      compatibleGFDVersion: this.compatibleGFDVersion
    };
  }
}
