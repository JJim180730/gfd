/**
 * 数组工具函数
 */
/**
 * 数组去重
 * @param arr 目标数组
 */
export declare function unique<T>(arr: T[]): T[];
/**
 * 数组扁平化
 * @param arr 目标数组
 * @param depth 深度，默认 Infinity
 */
export declare function flatten<T>(arr: any[], depth?: number): T[];
/**
 * 按指定属性分组
 * @param arr 目标数组
 * @param key 分组属性或分组函数
 */
export declare function groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]>;
/**
 * 求数组交集
 * @param arrays 数组列表
 */
export declare function intersection<T>(...arrays: T[][]): T[];
/**
 * 求数组并集
 * @param arrays 数组列表
 */
export declare function union<T>(...arrays: T[][]): T[];
/**
 * 求数组差集 (a - b)
 * @param a 数组a
 * @param b 数组b
 */
export declare function difference<T>(a: T[], b: T[]): T[];
/**
 * 数组随机排序
 * @param arr 目标数组
 */
export declare function shuffle<T>(arr: T[]): T[];
/**
 * 按指定大小分块
 * @param arr 目标数组
 * @param size 块大小
 */
export declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * 获取数组最后一个元素
 * @param arr 目标数组
 */
export declare function last<T>(arr: T[]): T | undefined;
/**
 * 移除数组中的指定元素
 * @param arr 目标数组
 * @param item 要移除的元素
 */
export declare function remove<T>(arr: T[], item: T): T[];
//# sourceMappingURL=array.d.ts.map