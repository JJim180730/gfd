import { LogLevel, LogLevelPriority } from './types';
import { ConsoleTransport } from './transports/console';
import { merge } from '@gfd/utils';
/**
 * 日志格式化器默认实现
 */
export class DefaultFormatter {
    format(message) {
        const timestamp = message.timestamp.toISOString();
        const level = message.level.toUpperCase().padEnd(5);
        const module = message.module ? `[${message.module}]` : '';
        const context = message.context ? ` ${JSON.stringify(message.context)}` : '';
        const error = message.error ? `\n${message.error.stack || message.error.message}` : '';
        return `${timestamp} ${level} ${module} ${message.message}${context}${error}`;
    }
}
/**
 * 日志类
 */
export class Logger {
    config;
    static defaultConfig = {
        level: LogLevel.INFO,
        transports: [new ConsoleTransport()],
        formatter: new DefaultFormatter(),
        timestamp: true,
        defaultContext: {},
        module: ''
    };
    constructor(config = {}) {
        this.config = merge({}, Logger.defaultConfig, config || {});
    }
    /**
     * 创建子日志器
     * @param module 模块名称
     * @param context 额外上下文
     */
    child(module, context = {}) {
        return new Logger({
            ...this.config,
            module,
            defaultContext: merge({}, this.config.defaultContext, context)
        });
    }
    /**
     * 输出调试日志
     * @param message 日志消息
     * @param context 上下文
     */
    debug(message, context) {
        this.log(LogLevel.DEBUG, message, context);
    }
    /**
     * 输出信息日志
     * @param message 日志消息
     * @param context 上下文
     */
    info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    /**
     * 输出警告日志
     * @param message 日志消息
     * @param context 上下文
     */
    warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    /**
     * 输出错误日志
     * @param message 日志消息
     * @param error 错误对象
     * @param context 上下文
     */
    error(message, error, context) {
        const errorObj = error instanceof Error ? error : undefined;
        const ctx = error instanceof Error ? context : merge({}, error || {}, context || {});
        this.log(LogLevel.ERROR, message, ctx, errorObj);
    }
    /**
     * 输出致命错误日志
     * @param message 日志消息
     * @param error 错误对象
     * @param context 上下文
     */
    fatal(message, error, context) {
        const errorObj = error instanceof Error ? error : undefined;
        const ctx = error instanceof Error ? context : merge({}, error || {}, context || {});
        this.log(LogLevel.FATAL, message, ctx, errorObj);
    }
    /**
     * 记录日志
     * @param level 日志级别
     * @param message 日志消息
     * @param context 上下文
     * @param error 错误对象
     */
    log(level, message, context, error) {
        // 检查日志级别
        if (LogLevelPriority[level] < LogLevelPriority[this.config.level]) {
            return;
        }
        const logMessage = {
            level,
            timestamp: this.config.timestamp ? new Date() : new Date(0),
            message,
            context: merge({}, this.config.defaultContext, context || {}),
            error,
            module: this.config.module
        };
        // 发送到所有传输器
        for (const transport of this.config.transports) {
            try {
                transport.log(logMessage);
            }
            catch (transportError) {
                console.error('日志传输失败:', transportError);
            }
        }
    }
    /**
     * 关闭日志器
     */
    async close() {
        for (const transport of this.config.transports) {
            if (transport.close) {
                try {
                    await transport.close();
                }
                catch (error) {
                    console.error('关闭日志传输器失败:', error);
                }
            }
        }
    }
    /**
     * 设置日志级别
     * @param level 日志级别
     */
    setLevel(level) {
        this.config.level = level;
    }
    /**
     * 获取当前日志级别
     */
    getLevel() {
        return this.config.level;
    }
    /**
     * 添加传输器
     * @param transport 传输器
     */
    addTransport(transport) {
        this.config.transports.push(transport);
    }
    /**
     * 移除传输器
     * @param transport 传输器
     */
    removeTransport(transport) {
        const index = this.config.transports.indexOf(transport);
        if (index > -1) {
            this.config.transports.splice(index, 1);
        }
    }
}
/**
 * 默认日志实例
 */
export const logger = new Logger();
//# sourceMappingURL=logger.js.map