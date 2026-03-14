/**
 * 异步工具函数
 */
/**
 * 等待指定时间
 * @param ms 等待时间（毫秒）
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * 重试异步函数
 * @param fn 要重试的函数
 * @param retries 重试次数，默认 3
 * @param delay 重试间隔（毫秒），默认 1000
 */
export declare function retry<T>(fn: () => Promise<T>, retries?: number, delay?: number): Promise<T>;
/**
 * 带超时的异步函数
 * @param promise 要执行的 Promise
 * @param timeoutMs 超时时间（毫秒）
 * @param timeoutError 超时错误
 */
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutError?: Error): Promise<T>;
/**
 * 并行执行异步函数，限制并发数
 * @param tasks 任务列表
 * @param concurrency 并发数，默认 5
 */
export declare function parallel<T>(tasks: Array<() => Promise<T>>, concurrency?: number): Promise<T[]>;
/**
 * 顺序执行异步函数
 * @param tasks 任务列表
 */
export declare function series<T>(tasks: Array<() => Promise<T>>): Promise<T[]>;
/**
 * 忽略错误执行异步函数
 * @param fn 要执行的函数
 * @param defaultValue 出错时返回的默认值
 */
export declare function suppressError<T>(fn: () => Promise<T>, defaultValue?: T): Promise<T | undefined>;
/**
 * 执行函数并捕获错误
 * @param fn 要执行的函数
 */
export declare function tryCatch<T>(fn: () => Promise<T>): Promise<[Error | null, T | null]>;
//# sourceMappingURL=async.d.ts.map