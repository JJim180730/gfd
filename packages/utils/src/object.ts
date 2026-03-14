import { isObject, isNil } from './types';

/**
 * 对象工具函数
 */

/**
 * 深度合并对象
 * @param target 目标对象
 * @param sources 源对象列表
 */
export function merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key] as Record<string, any>, source[key] as Record<string, any>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return merge(target, ...sources);
}

/**
 * 别名：deepMerge，兼容现有代码
 */
export const deepMerge = merge;

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export function deepClone<T>(obj: T): T {
  if (isNil(obj) || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (isObject(obj)) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

/**
 * 获取嵌套对象的值
 * @param obj 目标对象
 * @param path 路径，支持点分隔符，如 'a.b.c'
 * @param defaultValue 默认值
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (isNil(result) || !result.hasOwnProperty(key)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result as T;
}

/**
 * 别名：getNestedValue，兼容现有代码
 */
export const getNestedValue = get;

/**
 * 设置嵌套对象的值
 * @param obj 目标对象
 * @param path 路径，支持点分隔符，如 'a.b.c'
 * @param value 要设置的值
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;
  
  for (const key of keys) {
    if (isNil(current[key]) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

/**
 * 检查对象是否包含指定的键
 * @param obj 目标对象
 * @param key 要检查的键
 */
export function has(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 挑选对象的指定属性
 * @param obj 目标对象
 * @param keys 要挑选的键列表
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (has(obj, key as string)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 排除对象的指定属性
 * @param obj 目标对象
 * @param keys 要排除的键列表
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * 检查对象是否为空
 * @param obj 目标对象
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}
