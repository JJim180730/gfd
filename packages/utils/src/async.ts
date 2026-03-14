import { isPromise } from './types';

/**
 * 异步工具函数
 */

/**
 * 等待指定时间
 * @param ms 等待时间（毫秒）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试异步函数
 * @param fn 要重试的函数
 * @param retries 重试次数，默认 3
 * @param delay 重试间隔（毫秒），默认 1000
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
}

/**
 * 带超时的异步函数
 * @param promise 要执行的 Promise
 * @param timeoutMs 超时时间（毫秒）
 * @param timeoutError 超时错误
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: Error = new Error('Operation timed out')
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(timeoutError), timeoutMs);
    })
  ]);
}

/**
 * 并行执行异步函数，限制并发数
 * @param tasks 任务列表
 * @param concurrency 并发数，默认 5
 */
export async function parallel<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number = 5
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task()).then(result => {
      results.push(result);
      executing.splice(executing.indexOf(p), 1);
    });
    
    executing.push(p);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  return results;
}

/**
 * 顺序执行异步函数
 * @param tasks 任务列表
 */
export async function series<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
  const results: T[] = [];
  
  for (const task of tasks) {
    results.push(await task());
  }
  
  return results;
}

/**
 * 忽略错误执行异步函数
 * @param fn 要执行的函数
 * @param defaultValue 出错时返回的默认值
 */
export async function suppressError<T>(
  fn: () => Promise<T>,
  defaultValue?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch {
    return defaultValue;
  }
}

/**
 * 执行函数并捕获错误
 * @param fn 要执行的函数
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[Error | null, T | null]> {
  try {
    const result = await fn();
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
}
