/**
 * 日志类型定义
 */
/**
 * 日志级别
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
/**
 * 日志级别优先级
 */
export declare const LogLevelPriority: Record<LogLevel, number>;
/**
 * 日志消息
 */
export interface LogMessage {
    level: LogLevel;
    timestamp: Date;
    message: string;
    context?: Record<string, any>;
    error?: Error;
    module?: string;
}
/**
 * 日志传输器接口
 */
export interface LogTransport {
    /**
     * 传输日志
     * @param message 日志消息
     */
    log(message: LogMessage): void | Promise<void>;
    /**
     * 关闭传输器
     */
    close?(): void | Promise<void>;
}
/**
 * 日志格式化器接口
 */
export interface LogFormatter {
    /**
     * 格式化日志消息
     * @param message 日志消息
     */
    format(message: LogMessage): string;
}
/**
 * 日志配置
 */
export interface LoggerConfig {
    /**
     * 日志级别，默认 INFO
     */
    level?: LogLevel;
    /**
     * 日志传输器，默认使用 ConsoleTransport
     */
    transports?: LogTransport[];
    /**
     * 日志格式化器
     */
    formatter?: LogFormatter;
    /**
     * 是否启用时间戳，默认 true
     */
    timestamp?: boolean;
    /**
     * 默认上下文
     */
    defaultContext?: Record<string, any>;
    /**
     * 模块名称
     */
    module?: string;
}
//# sourceMappingURL=types.d.ts.map