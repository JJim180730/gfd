import type { TranslationDict, Locale, FormatOptions, I18nOptions, TranslateFunction, TranslatePluralFunction, DateFormatOptions, NumberFormatOptions } from './types';
/**
 * 国际化类
 * 提供多语言翻译、日期格式化、数字格式化等功能
 */
export declare class I18n {
    /** 当前区域设置 */
    private currentLocale;
    /** 默认区域设置 */
    private readonly defaultLocale;
    /** 回退区域设置 */
    private readonly fallbackLocale?;
    /** 所有翻译字典 */
    private readonly locales;
    /** 可用的区域设置 */
    private availableLocales;
    /** 插值前缀 */
    private readonly interpolationPrefix;
    /** 插值后缀 */
    private readonly interpolationSuffix;
    /** 复数键后缀 */
    private readonly pluralSuffix;
    /** 缺失翻译的处理方式 */
    private readonly missingKey;
    /** 日期格式化器缓存 */
    private readonly dateFormatters;
    /** 数字格式化器缓存 */
    private readonly numberFormatters;
    /** 复数规则缓存 */
    private readonly pluralRules;
    constructor(options: I18nOptions);
    /**
     * 获取当前区域设置
     */
    get locale(): Locale;
    /**
     * 设置当前区域设置
     */
    set locale(locale: Locale);
    /**
     * 设置当前区域设置
     * @param locale 区域设置代码
     */
    setLocale(locale: Locale): boolean;
    /**
     * 获取可用的区域设置列表
     */
    getAvailableLocales(): Locale[];
    /**
     * 添加区域设置
     * @param locale 区域设置代码
     * @param translations 翻译字典
     */
    addLocale(locale: Locale, translations: TranslationDict): void;
    /**
     * 检查区域设置是否存在
     * @param locale 区域设置代码
     */
    hasLocale(locale: Locale): boolean;
    /**
     * 翻译文本
     * @param key 翻译键
     * @param params 插值参数
     * @param options 格式化选项
     */
    t: TranslateFunction;
    /**
     * 翻译文本（别名）
     * @param key 翻译键
     * @param params 插值参数
     * @param options 格式化选项
     */
    translate(key: string, params?: Record<string, any>, options?: FormatOptions): string;
    /**
     * 复数翻译
     * @param key 翻译键
     * @param count 数量
     * @param params 插值参数
     * @param options 格式化选项
     */
    tp: TranslatePluralFunction;
    /**
     * 复数翻译（别名）
     * @param key 翻译键
     * @param count 数量
     * @param params 插值参数
     * @param options 格式化选项
     */
    translatePlural(key: string, count: number, params?: Record<string, any>, options?: FormatOptions): string;
    /**
     * 格式化日期
     * @param date 日期对象或时间戳
     * @param options 格式化选项
     * @param locale 可选的区域设置，默认使用当前
     */
    formatDate(date: Date | number | string, options?: DateFormatOptions, locale?: Locale): string;
    /**
     * 格式化数字
     * @param value 数字
     * @param options 格式化选项
     * @param locale 可选的区域设置，默认使用当前
     */
    formatNumber(value: number, options?: NumberFormatOptions, locale?: Locale): string;
    /**
     * 格式化货币
     * @param value 金额
     * @param currency 货币代码，如'CNY'、'USD'
     * @param options 格式化选项
     * @param locale 可选的区域设置，默认使用当前
     */
    formatCurrency(value: number, currency: string, options?: NumberFormatOptions, locale?: Locale): string;
    /**
     * 格式化百分比
     * @param value 数值，如0.75表示75%
     * @param options 格式化选项
     * @param locale 可选的区域设置，默认使用当前
     */
    formatPercent(value: number, options?: NumberFormatOptions, locale?: Locale): string;
    /**
     * 获取指定区域设置的翻译字典
     * @param locale 区域设置代码
     */
    getTranslations(locale: Locale): TranslationDict | undefined;
    /**
     * 合并翻译
     * @param locale 区域设置代码
     * @param translations 要合并的翻译字典
     */
    mergeTranslations(locale: Locale, translations: TranslationDict): void;
    /**
     * 获取翻译值
     */
    private getTranslation;
    /**
     * 获取回退区域设置
     */
    private getFallbackLocale;
    /**
     * 处理缺失的翻译键
     */
    private handleMissingKey;
    /**
     * 插值替换
     */
    private interpolate;
    /**
     * 获取复数规则
     */
    private getPluralRule;
    /**
     * 使用模板格式化日期
     */
    private formatDateWithTemplate;
    /**
     * HTML转义
     */
    private escapeHtml;
    /**
     * 正则表达式转义
     */
    private escapeRegExp;
    /**
     * 创建翻译函数（绑定当前实例）
     */
    createTranslateFunction(): TranslateFunction;
}
//# sourceMappingURL=i18n.d.ts.map