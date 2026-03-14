/**
 * 函数工具函数
 */
/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 */
export function debounce(func, wait, immediate = false) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate)
                func(...args);
        };
        const callNow = immediate && !timeout;
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func(...args);
    };
}
/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间间隔（毫秒）
 */
export function throttle(func, limit) {
    let inThrottle = false;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
/**
 * 函数柯里化
 * @param func 要柯里化的函数
 * @param arity 参数个数，默认取函数的 length
 */
export function curry(func, arity = func.length) {
    return function curried(...args) {
        if (args.length >= arity) {
            return func(...args);
        }
        else {
            return curry(func.bind(null, ...args), arity - args.length);
        }
    };
}
/**
 * 函数记忆
 * @param func 要记忆的函数
 * @param resolver 缓存键生成函数，默认使用第一个参数作为键
 */
export function memoize(func, resolver) {
    const cache = new Map();
    const memoized = function (...args) {
        const key = resolver ? resolver(...args) : args[0];
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func(...args);
        cache.set(key, result);
        return result;
    };
    memoized.cache = cache;
    return memoized;
}
/**
 * 延迟执行函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @param args 函数参数
 */
export function delay(func, delay, ...args) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(func(...args));
        }, delay);
    });
}
/**
 * 一次性函数
 * @param func 要执行的函数，只会执行一次
 */
export function once(func) {
    let called = false;
    let result;
    return function (...args) {
        if (!called) {
            called = true;
            result = func(...args);
        }
        return result;
    };
}
//# sourceMappingURL=function.js.map