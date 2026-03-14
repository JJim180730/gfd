/**
 * 依赖注入类型定义
 */

/**
 * 注入令牌类型
 */
export type InjectionToken<T = any> = string | symbol | (new (...args: any[]) => T);

/**
 * 生命周期类型
 */
export enum Lifecycle {
  /**
   * 单例：全局唯一实例
   */
  SINGLETON = 'singleton',
  
  /**
   *  transient：每次注入都创建新实例
   */
  TRANSIENT = 'transient',
  
  /**
   * 请求作用域：每个请求创建一个实例
   */
  REQUEST = 'request'
}

/**
 * 提供者配置
 */
export interface Provider<T = any> {
  /**
   * 注入令牌
   */
  provide: InjectionToken<T>;
  
  /**
   * 生命周期，默认 SINGLETON
   */
  lifecycle?: Lifecycle;
  
  /**
   * 类提供者
   */
  useClass?: new (...args: any[]) => T;
  
  /**
   * 值提供者
   */
  useValue?: T;
  
  /**
   * 工厂提供者
   */
  useFactory?: (...args: any[]) => T | Promise<T>;
  
  /**
   * 工厂依赖
   */
  inject?: InjectionToken[];
}

/**
 * 类提供者
 */
export interface ClassProvider<T = any> extends Omit<Provider<T>, 'useValue' | 'useFactory' | 'inject'> {
  useClass: new (...args: any[]) => T;
}

/**
 * 值提供者
 */
export interface ValueProvider<T = any> extends Omit<Provider<T>, 'useClass' | 'useFactory' | 'inject'> {
  useValue: T;
}

/**
 * 工厂提供者
 */
export interface FactoryProvider<T = any> extends Omit<Provider<T>, 'useClass' | 'useValue'> {
  useFactory: (...args: any[]) => T | Promise<T>;
  inject?: InjectionToken[];
}

/**
 * 注入选项
 */
export interface InjectOptions {
  /**
   * 可选依赖，注入不存在时返回 undefined 而不报错
   */
  optional?: boolean;
  
  /**
   * 默认值
   */
  defaultValue?: any;
}

/**
 * 容器配置
 */
export interface ContainerConfig {
  /**
   * 是否自动注册可注入类
   */
  autoRegister?: boolean;
  
  /**
   * 默认生命周期
   */
  defaultLifecycle?: Lifecycle;
}

/**
 * 元数据键
 */
export const METADATA_KEYS = {
  INJECTABLE: 'gfd:di:injectable',
  INJECT: 'gfd:di:inject',
  PARAM_TYPES: 'design:paramtypes',
  LIFECYCLE: 'gfd:di:lifecycle'
} as const;
