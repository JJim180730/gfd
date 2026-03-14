import { isFunction } from './types';

/**
 * 函数工具函数
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间间隔（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function (...args: Parameters<T>) {
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
export function curry<T extends (...args: any[]) => any>(
  func: T,
  arity: number = func.length
): (...args: any[]) => any {
  return function curried(...args: any[]) {
    if (args.length >= arity) {
      return func(...args);
    } else {
      return curry(func.bind(null, ...args), arity - args.length);
    }
  };
}

/**
 * 函数记忆
 * @param func 要记忆的函数
 * @param resolver 缓存键生成函数，默认使用第一个参数作为键
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => any
): T & { cache: Map<any, any> } {
  const cache = new Map();
  
  const memoized = function (...args: Parameters<T>) {
    const key = resolver ? resolver(...args) : args[0];
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  } as T & { cache: Map<any, any> };
  
  memoized.cache = cache;
  return memoized;
}

/**
 * 延迟执行函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @param args 函数参数
 */
export function delay<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  ...args: Parameters<T>
): Promise<ReturnType<T>> {
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
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false;
  let result: ReturnType<T>;
  
  return function (...args: Parameters<T>) {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  } as T;
}
