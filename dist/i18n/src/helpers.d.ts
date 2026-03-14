/**
 * i18n辅助函数
 */
/**
 * 格式化消息
 * @param message 消息模板
 * @param params 参数
 */
export declare function formatMessage(message: string, params?: Record<string, any>): string;
/**
 * 解析语言标签
 * @param locale 语言标签，如 'zh-CN', 'en-US'
 */
export declare function parseLocale(locale: string): {
    language: string;
    region?: string;
};
/**
 * 匹配最佳语言
 * @param acceptLanguages 接受的语言列表
 * @param availableLocales 可用的语言列表
 * @param defaultLocale 默认语言
 */
export declare function matchLocale(acceptLanguages: string[], availableLocales: string[], defaultLocale: string): string;
//# sourceMappingURL=helpers.d.ts.map