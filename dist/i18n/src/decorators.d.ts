import type { FormatOptions } from './types';
/**
 * 翻译装饰器
 * 自动翻译方法的返回值
 * @param keyPrefix 翻译键前缀
 * @param options 格式化选项
 */
export declare function Translate(keyPrefix?: string, options?: FormatOptions): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * 翻译参数装饰器
 * 自动翻译方法的指定参数
 * @param paramIndex 要翻译的参数索引
 * @param options 格式化选项
 */
export declare function TranslateParam(paramIndex: number, options?: FormatOptions): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * 动态翻译装饰器
 * 根据返回的翻译键和参数进行翻译
 * @param getKey 从返回值中获取翻译键的函数
 * @param getParams 从返回值中获取翻译参数的函数
 * @param options 格式化选项
 */
export declare function TranslateDynamic(getKey: (result: any) => string, getParams?: (result: any) => Record<string, any>, options?: FormatOptions): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * 复数翻译装饰器
 * 自动处理复数形式的翻译
 * @param key 翻译键
 * @param countSelector 从参数中获取数量的函数
 * @param options 格式化选项
 */
export declare function TranslatePlural(key: string, countSelector: (...args: any[]) => number, options?: FormatOptions): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=decorators.d.ts.map