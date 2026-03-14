/**
 * 类型工具函数
 */
/**
 * 判断是否为函数
 * @param value 要判断的值
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * 判断是否为对象
 * @param value 要判断的值
 */
export function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
/**
 * 判断是否为数组
 * @param value 要判断的值
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * 判断是否为字符串
 * @param value 要判断的值
 */
export function isString(value) {
    return typeof value === 'string';
}
/**
 * 判断是否为数字
 * @param value 要判断的值
 */
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
/**
 * 判断是否为布尔值
 * @param value 要判断的值
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * 判断是否为 undefined
 * @param value 要判断的值
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}
/**
 * 判断是否为 null
 * @param value 要判断的值
 */
export function isNull(value) {
    return value === null;
}
/**
 * 判断是否为 null 或 undefined
 * @param value 要判断的值
 */
export function isNil(value) {
    return value === null || typeof value === 'undefined';
}
/**
 * 判断是否为 Promise
 * @param value 要判断的值
 */
export function isPromise(value) {
    return value instanceof Promise || (!isNil(value) &&
        isFunction(value.then) &&
        isFunction(value.catch));
}
/**
 * 判断是否为类
 * @param value 要判断的值
 */
export function isClass(value) {
    return isFunction(value) && /^class\s/.test(Function.prototype.toString.call(value));
}
//# sourceMappingURL=types.js.map