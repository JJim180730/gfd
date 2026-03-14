import { isFunction } from '@gfd/utils';
/**
 * 事件类实现
 */
class EventImpl {
    name;
    data;
    timestamp;
    defaultPrevented = false;
    propagationStopped = false;
    constructor(name, data) {
        this.name = name;
        this.data = data;
        this.timestamp = new Date();
    }
    preventDefault() {
        this.defaultPrevented = true;
    }
    stopPropagation() {
        this.propagationStopped = true;
    }
}
/**
 * 事件总线类
 */
export class EventBus {
    listeners = new Map();
    config;
    static defaultConfig = {
        async: true,
        maxListeners: 100
    };
    constructor(config = {}) {
        this.config = { ...EventBus.defaultConfig, ...config };
    }
    /**
     * 注册事件监听器
     * @param eventName 事件名称
     * @param listener 监听器函数
     * @param options 监听选项
     */
    on(eventName, listener, options = {}) {
        if (!isFunction(listener)) {
            throw new TypeError('监听器必须是函数');
        }
        const entry = {
            listener,
            options: {
                once: false,
                priority: 0,
                async: this.config.async,
                ...options
            }
        };
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        const eventListeners = this.listeners.get(eventName);
        // 检查监听器数量限制
        if (eventListeners.length >= this.config.maxListeners) {
            console.warn(`事件 ${eventName} 的监听器数量已超过最大限制 ${this.config.maxListeners}`);
        }
        // 按优先级排序
        eventListeners.push(entry);
        eventListeners.sort((a, b) => b.options.priority - a.options.priority);
    }
    /**
     * 注册一次性事件监听器
     * @param eventName 事件名称
     * @param listener 监听器函数
     * @param options 监听选项
     */
    once(eventName, listener, options = {}) {
        this.on(eventName, listener, { ...options, once: true });
    }
    /**
     * 移除事件监听器
     * @param eventName 事件名称
     * @param listener 监听器函数
     */
    off(eventName, listener) {
        if (!this.listeners.has(eventName)) {
            return;
        }
        const eventListeners = this.listeners.get(eventName);
        const index = eventListeners.findIndex(entry => entry.listener === listener);
        if (index > -1) {
            eventListeners.splice(index, 1);
        }
        if (eventListeners.length === 0) {
            this.listeners.delete(eventName);
        }
    }
    /**
     * 移除指定事件的所有监听器
     * @param eventName 事件名称，不指定则移除所有事件的监听器
     */
    offAll(eventName) {
        if (eventName) {
            this.listeners.delete(eventName);
        }
        else {
            this.listeners.clear();
        }
    }
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param data 事件数据
     * @returns 是否所有监听器都执行完成且未被阻止传播
     */
    async emit(eventName, data) {
        if (!this.listeners.has(eventName)) {
            return true;
        }
        const event = new EventImpl(eventName, data);
        const eventListeners = [...this.listeners.get(eventName)];
        const onceListeners = [];
        // 执行监听器
        for (const entry of eventListeners) {
            if (event.propagationStopped) {
                break;
            }
            // 记录一次性监听器
            if (entry.options.once) {
                onceListeners.push(entry.listener);
            }
            try {
                if (entry.options.async) {
                    await entry.listener(event.data, event);
                }
                else {
                    entry.listener(event.data, event);
                }
            }
            catch (error) {
                console.error(`事件 ${eventName} 的监听器执行失败:`, error);
            }
        }
        // 移除一次性监听器
        for (const listener of onceListeners) {
            this.off(eventName, listener);
        }
        return !event.propagationStopped;
    }
    /**
     * 同步触发事件
     * @param eventName 事件名称
     * @param data 事件数据
     * @returns 是否所有监听器都执行完成且未被阻止传播
     */
    emitSync(eventName, data) {
        if (!this.listeners.has(eventName)) {
            return true;
        }
        const event = new EventImpl(eventName, data);
        const eventListeners = [...this.listeners.get(eventName)];
        const onceListeners = [];
        // 执行监听器
        for (const entry of eventListeners) {
            if (event.propagationStopped) {
                break;
            }
            // 记录一次性监听器
            if (entry.options.once) {
                onceListeners.push(entry.listener);
            }
            try {
                entry.listener(event.data, event);
            }
            catch (error) {
                console.error(`事件 ${eventName} 的监听器执行失败:`, error);
            }
        }
        // 移除一次性监听器
        for (const listener of onceListeners) {
            this.off(eventName, listener);
        }
        return !event.propagationStopped;
    }
    /**
     * 获取指定事件的监听器数量
     * @param eventName 事件名称
     */
    listenerCount(eventName) {
        return this.listeners.get(eventName)?.length || 0;
    }
    /**
     * 获取所有事件名称
     */
    eventNames() {
        return Array.from(this.listeners.keys());
    }
    /**
     * 检查是否有指定事件的监听器
     * @param eventName 事件名称
     */
    hasListeners(eventName) {
        return this.listenerCount(eventName) > 0;
    }
    /**
     * 设置最大监听器数量
     * @param maxListeners 最大监听器数量
     */
    setMaxListeners(maxListeners) {
        this.config.maxListeners = maxListeners;
    }
    /**
     * 获取最大监听器数量
     */
    getMaxListeners() {
        return this.config.maxListeners;
    }
}
/**
 * 默认事件总线实例
 */
export const eventBus = new EventBus();
//# sourceMappingURL=event-bus.js.map