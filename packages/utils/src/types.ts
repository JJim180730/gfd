/**
 * 类型工具函数
 */

/**
 * 判断是否为函数
 * @param value 要判断的值
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * 判断是否为对象
 * @param value 要判断的值
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 判断是否为数组
 * @param value 要判断的值
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

/**
 * 判断是否为字符串
 * @param value 要判断的值
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * 判断是否为数字
 * @param value 要判断的值
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 判断是否为布尔值
 * @param value 要判断的值
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * 判断是否为 undefined
 * @param value 要判断的值
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

/**
 * 判断是否为 null
 * @param value 要判断的值
 */
export function isNull(value: any): value is null {
  return value === null;
}

/**
 * 判断是否为 null 或 undefined
 * @param value 要判断的值
 */
export function isNil(value: any): value is null | undefined {
  return value === null || typeof value === 'undefined';
}

/**
 * 判断是否为 Promise
 * @param value 要判断的值
 */
export function isPromise(value: any): value is Promise<any> {
  return value instanceof Promise || (
    !isNil(value) &&
    isFunction(value.then) &&
    isFunction(value.catch)
  );
}

/**
 * 判断是否为类
 * @param value 要判断的值
 */
export function isClass(value: any): value is new (...args: any[]) => any {
  return isFunction(value) && /^class\s/.test(Function.prototype.toString.call(value));
}
