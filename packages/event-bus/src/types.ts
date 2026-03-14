/**
 * 事件总线类型定义
 */

/**
 * 事件监听器函数
 */
export type EventListener<T = any> = (data: T, event: Event<T>) => void | Promise<void>;

/**
 * 事件对象
 */
export interface Event<T = any> {
  /**
   * 事件名称
   */
  name: string;
  
  /**
   * 事件数据
   */
  data: T;
  
  /**
   * 事件触发时间
   */
  timestamp: Date;
  
  /**
   * 是否阻止默认行为
   */
  defaultPrevented: boolean;
  
  /**
   * 是否停止传播
   */
  propagationStopped: boolean;
  
  /**
   * 阻止默认行为
   */
  preventDefault(): void;
  
  /**
   * 停止事件传播
   */
  stopPropagation(): void;
}

/**
 * 事件监听选项
 */
export interface EventListenerOptions {
  /**
   * 是否只执行一次
   */
  once?: boolean;
  
  /**
   * 优先级，数值越大优先级越高
   */
  priority?: number;
  
  /**
   * 是否异步执行
   */
  async?: boolean;
}

/**
 * 事件监听器条目
 */
export interface EventListenerEntry<T = any> {
  /**
   * 监听器函数
   */
  listener: EventListener<T>;
  
  /**
   * 选项
   */
  options: Required<EventListenerOptions>;
}

/**
 * 事件总线配置
 */
export interface EventBusConfig {
  /**
   * 是否启用异步执行
   */
  async?: boolean;
  
  /**
   * 最大监听器数量，默认 100
   */
  maxListeners?: number;
}
