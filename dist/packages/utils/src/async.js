/**
 * 异步工具函数
 */
/**
 * 等待指定时间
 * @param ms 等待时间（毫秒）
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 重试异步函数
 * @param fn 要重试的函数
 * @param retries 重试次数，默认 3
 * @param delay 重试间隔（毫秒），默认 1000
 */
export async function retry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    }
    catch (error) {
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
export function withTimeout(promise, timeoutMs, timeoutError = new Error('Operation timed out')) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(timeoutError), timeoutMs);
        })
    ]);
}
/**
 * 并行执行异步函数，限制并发数
 * @param tasks 任务列表
 * @param concurrency 并发数，默认 5
 */
export async function parallel(tasks, concurrency = 5) {
    const results = [];
    const executing = [];
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
export async function series(tasks) {
    const results = [];
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
export async function suppressError(fn, defaultValue) {
    try {
        return await fn();
    }
    catch {
        return defaultValue;
    }
}
/**
 * 执行函数并捕获错误
 * @param fn 要执行的函数
 */
export async function tryCatch(fn) {
    try {
        const result = await fn();
        return [null, result];
    }
    catch (error) {
        return [error, null];
    }
}
//# sourceMappingURL=async.js.map