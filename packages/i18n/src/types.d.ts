/**
 * 翻译字典类型
 */
export interface TranslationDict {
    [key: string]: string | TranslationDict;
}
/**
 * 区域设置类型
 */
export type Locale = string;
/**
 * 格式化选项
 */
export interface FormatOptions {
    /** 是否保留缺失的键 */
    fallback?: boolean;
    /** 默认值，当键不存在时返回 */
    defaultValue?: string;
    /** 是否转义HTML */
    escapeHtml?: boolean;
}
/**
 * 复数规则类型
 */
export type PluralRule = (count: number) => string;
/**
 * 日期格式化选项
 */
export interface DateFormatOptions extends Intl.DateTimeFormatOptions {
    /** 格式模板 */
    format?: string;
}
/**
 * 数字格式化选项
 */
export interface NumberFormatOptions extends Intl.NumberFormatOptions {
    /** 是否显示正负号 */
    signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
    /** 货币代码 */
    currency?: string;
    /** 百分比显示 */
    style?: 'decimal' | 'currency' | 'percent' | 'unit';
}
/**
 * I18n配置选项
 */
export interface I18nOptions {
    /** 默认区域设置 */
    defaultLocale: Locale;
    /** 可用的区域设置 */
    availableLocales?: Locale[];
    /** 翻译字典 */
    locales?: Record<Locale, TranslationDict>;
    /** 回退区域设置，当当前语言没有翻译时使用 */
    fallbackLocale?: Locale | Record<Locale, Locale>;
    /** 缺失翻译的处理方式 */
    missingKey?: 'warn' | 'error' | 'ignore' | ((key: string, locale: Locale) => void);
    /** 插值前缀 */
    interpolationPrefix?: string;
    /** 插值后缀 */
    interpolationSuffix?: string;
    /** 复数键后缀 */
    pluralSuffix?: string;
    /** 是否启用命名空间 */
    enableNamespaces?: boolean;
    /** 默认命名空间 */
    defaultNamespace?: string;
}
/**
 * 翻译函数类型
 */
export type TranslateFunction = (key: string, params?: Record<string, any>, options?: FormatOptions) => string;
/**
 * 复数翻译函数类型
 */
export type TranslatePluralFunction = (key: string, count: number, params?: Record<string, any>, options?: FormatOptions) => string;
//# sourceMappingURL=types.d.ts.map