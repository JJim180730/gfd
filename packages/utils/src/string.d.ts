/**
 * 字符串工具函数
 */
/**
 * 驼峰命名转短横线命名
 * @param str 驼峰命名字符串
 */
export declare function camelToKebab(str: string): string;
/**
 * 短横线命名转驼峰命名
 * @param str 短横线命名字符串
 */
export declare function kebabToCamel(str: string): string;
/**
 * 驼峰命名转下划线命名
 * @param str 驼峰命名字符串
 */
export declare function camelToSnake(str: string): string;
/**
 * 下划线命名转驼峰命名
 * @param str 下划线命名字符串
 */
export declare function snakeToCamel(str: string): string;
/**
 * 首字母大写
 * @param str 字符串
 */
export declare function capitalize(str: string): string;
/**
 * 首字母小写
 * @param str 字符串
 */
export declare function lowercaseFirst(str: string): string;
/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param charset 字符集
 */
export declare function randomString(length?: number, charset?: string): string;
/**
 * 去除字符串两端的空白字符
 * @param str 字符串
 */
export declare function trim(str: string): string;
/**
 * 截断字符串并添加省略号
 * @param str 字符串
 * @param maxLength 最大长度
 * @param suffix 后缀，默认 '...'
 */
export declare function truncate(str: string, maxLength: number, suffix?: string): string;
/**
 * 模板字符串插值
 * @param template 模板字符串，支持 ${key} 格式
 * @param data 数据对象
 */
export declare function template(template: string, data: Record<string, any>): string;
//# sourceMappingURL=string.d.ts.map