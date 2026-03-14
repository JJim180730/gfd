import { LogLevel, LogMessage, LogTransport, LoggerConfig, LogFormatter } from './types';
/**
 * 日志格式化器默认实现
 */
export declare class DefaultFormatter implements LogFormatter {
    format(message: LogMessage): string;
}
/**
 * 日志类
 */
export declare class Logger {
    private config;
    private static defaultConfig;
    constructor(config?: LoggerConfig);
    /**
     * 创建子日志器
     * @param module 模块名称
     * @param context 额外上下文
     */
    child(module: string, context?: Record<string, any>): Logger;
    /**
     * 输出调试日志
     * @param message 日志消息
     * @param context 上下文
     */
    debug(message: string, context?: Record<string, any>): void;
    /**
     * 输出信息日志
     * @param message 日志消息
     * @param context 上下文
     */
    info(message: string, context?: Record<string, any>): void;
    /**
     * 输出警告日志
     * @param message 日志消息
     * @param context 上下文
     */
    warn(message: string, context?: Record<string, any>): void;
    /**
     * 输出错误日志
     * @param message 日志消息
     * @param error 错误对象
     * @param context 上下文
     */
    error(message: string, error?: Error | Record<string, any>, context?: Record<string, any>): void;
    /**
     * 输出致命错误日志
     * @param message 日志消息
     * @param error 错误对象
     * @param context 上下文
     */
    fatal(message: string, error?: Error | Record<string, any>, context?: Record<string, any>): void;
    /**
     * 记录日志
     * @param level 日志级别
     * @param message 日志消息
     * @param context 上下文
     * @param error 错误对象
     */
    private log;
    /**
     * 关闭日志器
     */
    close(): Promise<void>;
    /**
     * 设置日志级别
     * @param level 日志级别
     */
    setLevel(level: LogLevel): void;
    /**
     * 获取当前日志级别
     */
    getLevel(): LogLevel;
    /**
     * 添加传输器
     * @param transport 传输器
     */
    addTransport(transport: LogTransport): void;
    /**
     * 移除传输器
     * @param transport 传输器
     */
    removeTransport(transport: LogTransport): void;
}
/**
 * 默认日志实例
 */
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map