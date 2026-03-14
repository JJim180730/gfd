import { getNestedValue, deepMerge } from '@gfd/utils';
import type {
  TranslationDict,
  Locale,
  FormatOptions,
  I18nOptions,
  TranslateFunction,
  TranslatePluralFunction,
  DateFormatOptions,
  NumberFormatOptions
} from './types';

/**
 * 国际化类
 * 提供多语言翻译、日期格式化、数字格式化等功能
 */
export class I18n {
  /** 当前区域设置 */
  private currentLocale: Locale;
  
  /** 默认区域设置 */
  private readonly defaultLocale: Locale;
  
  /** 回退区域设置 */
  private readonly fallbackLocale?: Locale | Record<Locale, Locale>;
  
  /** 所有翻译字典 */
  private readonly locales: Record<Locale, TranslationDict>;
  
  /** 可用的区域设置 */
  private availableLocales: Locale[];
  
  /** 插值前缀 */
  private readonly interpolationPrefix: string;
  
  /** 插值后缀 */
  private readonly interpolationSuffix: string;
  
  /** 复数键后缀 */
  private readonly pluralSuffix: string;
  
  /** 缺失翻译的处理方式 */
  private readonly missingKey: 'warn' | 'error' | 'ignore' | ((key: string, locale: Locale) => void);
  
  /** 日期格式化器缓存 */
  private readonly dateFormatters: Map<string, Intl.DateTimeFormat> = new Map();
  
  /** 数字格式化器缓存 */
  private readonly numberFormatters: Map<string, Intl.NumberFormat> = new Map();
  
  /** 复数规则缓存 */
  private readonly pluralRules: Map<string, Intl.PluralRules> = new Map();

  constructor(options: I18nOptions) {
    this.defaultLocale = options.defaultLocale;
    this.currentLocale = options.defaultLocale;
    this.fallbackLocale = options.fallbackLocale;
    this.locales = options.locales || {};
    this.availableLocales = options.availableLocales || Object.keys(this.locales);
    this.interpolationPrefix = options.interpolationPrefix || '{{';
    this.interpolationSuffix = options.interpolationSuffix || '}}';
    this.pluralSuffix = options.pluralSuffix || '_plural';
    this.missingKey = options.missingKey || 'warn';

    // 确保默认区域设置在可用列表中
    if (!this.availableLocales.includes(this.defaultLocale)) {
      this.availableLocales.push(this.defaultLocale);
    }
  }

  /**
   * 获取当前区域设置
   */
  get locale(): Locale {
    return this.currentLocale;
  }

  /**
   * 设置当前区域设置
   */
  set locale(locale: Locale) {
    this.setLocale(locale);
  }

  /**
   * 设置当前区域设置
   * @param locale 区域设置代码
   */
  setLocale(locale: Locale): boolean {
    // 尝试完全匹配
    if (this.availableLocales.includes(locale)) {
      this.currentLocale = locale;
      return true;
    }

    // 尝试匹配语言部分（如zh-CN不匹配时尝试zh）
    const languagePart = locale.split('-')[0];
    const matchedLocale = this.availableLocales.find(l => l.startsWith(languagePart));
    
    if (matchedLocale) {
      this.currentLocale = matchedLocale;
      return true;
    }

    // 都不匹配时使用默认
    this.currentLocale = this.defaultLocale;
    return false;
  }

  /**
   * 获取可用的区域设置列表
   */
  getAvailableLocales(): Locale[] {
    return [...this.availableLocales];
  }

  /**
   * 添加区域设置
   * @param locale 区域设置代码
   * @param translations 翻译字典
   */
  addLocale(locale: Locale, translations: TranslationDict): void {
    if (this.locales[locale]) {
      // 合并已有的翻译
      this.locales[locale] = deepMerge(this.locales[locale], translations);
    } else {
      this.locales[locale] = translations;
    }

    if (!this.availableLocales.includes(locale)) {
      this.availableLocales.push(locale);
    }
  }

  /**
   * 检查区域设置是否存在
   * @param locale 区域设置代码
   */
  hasLocale(locale: Locale): boolean {
    return this.availableLocales.includes(locale);
  }

  /**
   * 翻译文本
   * @param key 翻译键
   * @param params 插值参数
   * @param options 格式化选项
   */
  t: TranslateFunction = (key, params = {}, options = {}): string => {
    return this.translate(key, params, options);
  };

  /**
   * 翻译文本（别名）
   * @param key 翻译键
   * @param params 插值参数
   * @param options 格式化选项
   */
  translate(key: string, params: Record<string, any> = {}, options: FormatOptions = {}): string {
    const { fallback = true, defaultValue, escapeHtml = false } = options;

    // 尝试从当前语言获取翻译
    let translation = this.getTranslation(key, this.currentLocale);

    // 如果找不到且允许回退，尝试回退语言
    if (translation === undefined && fallback) {
      const fallbackLocale = this.getFallbackLocale(this.currentLocale);
      if (fallbackLocale) {
        translation = this.getTranslation(key, fallbackLocale);
      }

      // 如果还是找不到，尝试默认语言
      if (translation === undefined && this.currentLocale !== this.defaultLocale) {
        translation = this.getTranslation(key, this.defaultLocale);
      }
    }

    // 还是找不到的处理
    if (translation === undefined) {
      this.handleMissingKey(key, this.currentLocale);
      return defaultValue !== undefined ? defaultValue : key;
    }

    // 插值替换
    let result = this.interpolate(translation as string, params);

    // HTML转义
    if (escapeHtml) {
      result = this.escapeHtml(result);
    }

    return result;
  }

  /**
   * 复数翻译
   * @param key 翻译键
   * @param count 数量
   * @param params 插值参数
   * @param options 格式化选项
   */
  tp: TranslatePluralFunction = (key, count, params = {}, options = {}): string => {
    return this.translatePlural(key, count, params, options);
  };

  /**
   * 复数翻译（别名）
   * @param key 翻译键
   * @param count 数量
   * @param params 插值参数
   * @param options 格式化选项
   */
  translatePlural(key: string, count: number, params: Record<string, any> = {}, options: FormatOptions = {}): string {
    const pluralRule = this.getPluralRule(this.currentLocale);
    const category = pluralRule.select(count);
    
    // 尝试不同的复数键形式
    let pluralKey: string;
    if (category === 'other') {
      pluralKey = `${key}${this.pluralSuffix}`;
    } else {
      pluralKey = `${key}_${category}`;
    }

    // 尝试获取复数形式翻译
    let translation = this.getTranslation(pluralKey, this.currentLocale);
    
    // 如果找不到复数形式，尝试普通形式
    if (translation === undefined) {
      translation = this.getTranslation(key, this.currentLocale);
    }

    // 处理缺失的翻译
    if (translation === undefined) {
      this.handleMissingKey(pluralKey, this.currentLocale);
      return options.defaultValue !== undefined ? options.defaultValue : key;
    }

    // 合并参数，count自动加入
    const mergedParams = { ...params, count };
    
    // 插值替换
    return this.interpolate(translation as string, mergedParams);
  }

  /**
   * 格式化日期
   * @param date 日期对象或时间戳
   * @param options 格式化选项
   * @param locale 可选的区域设置，默认使用当前
   */
  formatDate(date: Date | number | string, options: DateFormatOptions = {}, locale?: Locale): string {
    const targetLocale = locale || this.currentLocale;
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    // 如果指定了格式模板，使用模板格式化
    if (options.format) {
      return this.formatDateWithTemplate(dateObj, options.format, targetLocale);
    }

    // 使用Intl.DateTimeFormat
    const cacheKey = `${targetLocale}:${JSON.stringify(options)}`;
    
    if (!this.dateFormatters.has(cacheKey)) {
      this.dateFormatters.set(cacheKey, new Intl.DateTimeFormat(targetLocale, options));
    }

    return this.dateFormatters.get(cacheKey)!.format(dateObj);
  }

  /**
   * 格式化数字
   * @param value 数字
   * @param options 格式化选项
   * @param locale 可选的区域设置，默认使用当前
   */
  formatNumber(value: number, options: NumberFormatOptions = {}, locale?: Locale): string {
    const targetLocale = locale || this.currentLocale;
    const cacheKey = `${targetLocale}:${JSON.stringify(options)}`;
    
    if (!this.numberFormatters.has(cacheKey)) {
      this.numberFormatters.set(cacheKey, new Intl.NumberFormat(targetLocale, options));
    }

    return this.numberFormatters.get(cacheKey)!.format(value);
  }

  /**
   * 格式化货币
   * @param value 金额
   * @param currency 货币代码，如'CNY'、'USD'
   * @param options 格式化选项
   * @param locale 可选的区域设置，默认使用当前
   */
  formatCurrency(value: number, currency: string, options: NumberFormatOptions = {}, locale?: Locale): string {
    return this.formatNumber(value, {
      ...options,
      style: 'currency',
      currency
    }, locale);
  }

  /**
   * 格式化百分比
   * @param value 数值，如0.75表示75%
   * @param options 格式化选项
   * @param locale 可选的区域设置，默认使用当前
   */
  formatPercent(value: number, options: NumberFormatOptions = {}, locale?: Locale): string {
    return this.formatNumber(value, {
      ...options,
      style: 'percent'
    }, locale);
  }

  /**
   * 获取指定区域设置的翻译字典
   * @param locale 区域设置代码
   */
  getTranslations(locale: Locale): TranslationDict | undefined {
    return this.locales[locale];
  }

  /**
   * 合并翻译
   * @param locale 区域设置代码
   * @param translations 要合并的翻译字典
   */
  mergeTranslations(locale: Locale, translations: TranslationDict): void {
    if (!this.locales[locale]) {
      this.locales[locale] = {};
    }
    this.locales[locale] = deepMerge(this.locales[locale], translations);
  }

  /**
   * 获取翻译值
   */
  private getTranslation(key: string, locale: Locale): string | TranslationDict | undefined {
    const translations = this.locales[locale];
    if (!translations) return undefined;

    return getNestedValue(translations, key);
  }

  /**
   * 获取回退区域设置
   */
  private getFallbackLocale(locale: Locale): Locale | undefined {
    if (!this.fallbackLocale) return undefined;

    if (typeof this.fallbackLocale === 'string') {
      return this.fallbackLocale;
    }

    return this.fallbackLocale[locale] || this.fallbackLocale['*'];
  }

  /**
   * 处理缺失的翻译键
   */
  private handleMissingKey(key: string, locale: Locale): void {
    if (this.missingKey === 'ignore') return;

    const message = `缺失翻译: [${locale}] ${key}`;

    if (this.missingKey === 'warn') {
      console.warn(message);
    } else if (this.missingKey === 'error') {
      throw new Error(message);
    } else if (typeof this.missingKey === 'function') {
      this.missingKey(key, locale);
    }
  }

  /**
   * 插值替换
   */
  private interpolate(text: string, params: Record<string, any>): string {
    if (!text || !params) return text;

    const regex = new RegExp(
      `${this.escapeRegExp(this.interpolationPrefix)}\\s*(.+?)\\s*${this.escapeRegExp(this.interpolationSuffix)}`,
      'g'
    );

    return text.replace(regex, (match, key) => {
      const value = getNestedValue(params, key.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * 获取复数规则
   */
  private getPluralRule(locale: Locale): Intl.PluralRules {
    if (!this.pluralRules.has(locale)) {
      this.pluralRules.set(locale, new Intl.PluralRules(locale));
    }
    return this.pluralRules.get(locale)!;
  }

  /**
   * 使用模板格式化日期
   */
  private formatDateWithTemplate(date: Date, format: string, locale: Locale): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const dayOfWeek = date.getDay();

    // 星期和月份的本地化
    const monthNames = new Intl.DateTimeFormat(locale, { month: 'long' }).formatToParts(date);
    const monthName = monthNames.find(p => p.type === 'month')?.value || String(month);
    
    const weekdayNames = new Intl.DateTimeFormat(locale, { weekday: 'long' }).formatToParts(date);
    const weekdayName = weekdayNames.find(p => p.type === 'weekday')?.value || String(dayOfWeek);

    return format
      .replace(/YYYY/g, String(year))
      .replace(/YY/g, String(year).slice(-2))
      .replace(/MMMM/g, monthName)
      .replace(/MM/g, String(month).padStart(2, '0'))
      .replace(/M/g, String(month))
      .replace(/DD/g, String(day).padStart(2, '0'))
      .replace(/D/g, String(day))
      .replace(/dddd/g, weekdayName)
      .replace(/HH/g, String(hours).padStart(2, '0'))
      .replace(/H/g, String(hours))
      .replace(/hh/g, String(hours % 12 || 12).padStart(2, '0'))
      .replace(/h/g, String(hours % 12 || 12))
      .replace(/mm/g, String(minutes).padStart(2, '0'))
      .replace(/m/g, String(minutes))
      .replace(/ss/g, String(seconds).padStart(2, '0'))
      .replace(/s/g, String(seconds))
      .replace(/A/g, hours >= 12 ? 'PM' : 'AM')
      .replace(/a/g, hours >= 12 ? 'pm' : 'am');
  }

  /**
   * HTML转义
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * 正则表达式转义
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 创建翻译函数（绑定当前实例）
   */
  createTranslateFunction(): TranslateFunction {
    return this.t.bind(this);
  }
}
