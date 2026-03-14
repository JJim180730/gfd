import { EventListener, EventListenerOptions, EventBusConfig } from './types';
/**
 * 事件总线类
 */
export declare class EventBus {
    private listeners;
    private config;
    private static defaultConfig;
    constructor(config?: EventBusConfig);
    /**
     * 注册事件监听器
     * @param eventName 事件名称
     * @param listener 监听器函数
     * @param options 监听选项
     */
    on<T = any>(eventName: string, listener: EventListener<T>, options?: EventListenerOptions): void;
    /**
     * 注册一次性事件监听器
     * @param eventName 事件名称
     * @param listener 监听器函数
     * @param options 监听选项
     */
    once<T = any>(eventName: string, listener: EventListener<T>, options?: Omit<EventListenerOptions, 'once'>): void;
    /**
     * 移除事件监听器
     * @param eventName 事件名称
     * @param listener 监听器函数
     */
    off<T = any>(eventName: string, listener: EventListener<T>): void;
    /**
     * 移除指定事件的所有监听器
     * @param eventName 事件名称，不指定则移除所有事件的监听器
     */
    offAll(eventName?: string): void;
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param data 事件数据
     * @returns 是否所有监听器都执行完成且未被阻止传播
     */
    emit<T = any>(eventName: string, data?: T): Promise<boolean>;
    /**
     * 同步触发事件
     * @param eventName 事件名称
     * @param data 事件数据
     * @returns 是否所有监听器都执行完成且未被阻止传播
     */
    emitSync<T = any>(eventName: string, data?: T): boolean;
    /**
     * 获取指定事件的监听器数量
     * @param eventName 事件名称
     */
    listenerCount(eventName: string): number;
    /**
     * 获取所有事件名称
     */
    eventNames(): string[];
    /**
     * 检查是否有指定事件的监听器
     * @param eventName 事件名称
     */
    hasListeners(eventName: string): boolean;
    /**
     * 设置最大监听器数量
     * @param maxListeners 最大监听器数量
     */
    setMaxListeners(maxListeners: number): void;
    /**
     * 获取最大监听器数量
     */
    getMaxListeners(): number;
}
/**
 * 默认事件总线实例
 */
export declare const eventBus: EventBus;
//# sourceMappingURL=event-bus.d.ts.map