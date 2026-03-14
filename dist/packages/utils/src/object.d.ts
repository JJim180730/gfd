/**
 * 对象工具函数
 */
/**
 * 深度合并对象
 * @param target 目标对象
 * @param sources 源对象列表
 */
export declare function merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T;
/**
 * 别名：deepMerge，兼容现有代码
 */
export declare const deepMerge: typeof merge;
/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export declare function deepClone<T>(obj: T): T;
/**
 * 获取嵌套对象的值
 * @param obj 目标对象
 * @param path 路径，支持点分隔符，如 'a.b.c'
 * @param defaultValue 默认值
 */
export declare function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined;
/**
 * 别名：getNestedValue，兼容现有代码
 */
export declare const getNestedValue: typeof get;
/**
 * 设置嵌套对象的值
 * @param obj 目标对象
 * @param path 路径，支持点分隔符，如 'a.b.c'
 * @param value 要设置的值
 */
export declare function set(obj: any, path: string, value: any): void;
/**
 * 检查对象是否包含指定的键
 * @param obj 目标对象
 * @param key 要检查的键
 */
export declare function has(obj: object, key: string): boolean;
/**
 * 挑选对象的指定属性
 * @param obj 目标对象
 * @param keys 要挑选的键列表
 */
export declare function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * 排除对象的指定属性
 * @param obj 目标对象
 * @param keys 要排除的键列表
 */
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * 检查对象是否为空
 * @param obj 目标对象
 */
export declare function isEmpty(obj: object): boolean;
//# sourceMappingURL=object.d.ts.map