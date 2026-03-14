/**
 * i18n辅助函数
 */
/**
 * 格式化消息
 * @param message 消息模板
 * @param params 参数
 */
export function formatMessage(message, params = {}) {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] !== undefined ? String(params[key]) : match;
    });
}
/**
 * 解析语言标签
 * @param locale 语言标签，如 'zh-CN', 'en-US'
 */
export function parseLocale(locale) {
    const parts = locale.split('-');
    return {
        language: parts[0].toLowerCase(),
        region: parts[1]?.toUpperCase()
    };
}
/**
 * 匹配最佳语言
 * @param acceptLanguages 接受的语言列表
 * @param availableLocales 可用的语言列表
 * @param defaultLocale 默认语言
 */
export function matchLocale(acceptLanguages, availableLocales, defaultLocale) {
    for (const acceptLang of acceptLanguages) {
        const { language } = parseLocale(acceptLang);
        // 精确匹配
        if (availableLocales.includes(acceptLang)) {
            return acceptLang;
        }
        // 语言匹配
        const matched = availableLocales.find(locale => parseLocale(locale).language === language);
        if (matched) {
            return matched;
        }
    }
    return defaultLocale;
}
//# sourceMappingURL=helpers.js.map