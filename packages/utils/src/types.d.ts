/**
 * 类型工具函数
 */
/**
 * 判断是否为函数
 * @param value 要判断的值
 */
export declare function isFunction(value: any): value is Function;
/**
 * 判断是否为对象
 * @param value 要判断的值
 */
export declare function isObject(value: any): value is Record<string, any>;
/**
 * 判断是否为数组
 * @param value 要判断的值
 */
export declare function isArray(value: any): value is any[];
/**
 * 判断是否为字符串
 * @param value 要判断的值
 */
export declare function isString(value: any): value is string;
/**
 * 判断是否为数字
 * @param value 要判断的值
 */
export declare function isNumber(value: any): value is number;
/**
 * 判断是否为布尔值
 * @param value 要判断的值
 */
export declare function isBoolean(value: any): value is boolean;
/**
 * 判断是否为 undefined
 * @param value 要判断的值
 */
export declare function isUndefined(value: any): value is undefined;
/**
 * 判断是否为 null
 * @param value 要判断的值
 */
export declare function isNull(value: any): value is null;
/**
 * 判断是否为 null 或 undefined
 * @param value 要判断的值
 */
export declare function isNil(value: any): value is null | undefined;
/**
 * 判断是否为 Promise
 * @param value 要判断的值
 */
export declare function isPromise(value: any): value is Promise<any>;
/**
 * 判断是否为类
 * @param value 要判断的值
 */
export declare function isClass(value: any): value is new (...args: any[]) => any;
//# sourceMappingURL=types.d.ts.map