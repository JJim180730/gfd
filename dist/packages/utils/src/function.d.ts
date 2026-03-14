/**
 * 函数工具函数
 */
/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean): (...args: Parameters<T>) => void;
/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间间隔（毫秒）
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * 函数柯里化
 * @param func 要柯里化的函数
 * @param arity 参数个数，默认取函数的 length
 */
export declare function curry<T extends (...args: any[]) => any>(func: T, arity?: number): (...args: any[]) => any;
/**
 * 函数记忆
 * @param func 要记忆的函数
 * @param resolver 缓存键生成函数，默认使用第一个参数作为键
 */
export declare function memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => any): T & {
    cache: Map<any, any>;
};
/**
 * 延迟执行函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @param args 函数参数
 */
export declare function delay<T extends (...args: any[]) => any>(func: T, delay: number, ...args: Parameters<T>): Promise<ReturnType<T>>;
/**
 * 一次性函数
 * @param func 要执行的函数，只会执行一次
 */
export declare function once<T extends (...args: any[]) => any>(func: T): T;
//# sourceMappingURL=function.d.ts.map