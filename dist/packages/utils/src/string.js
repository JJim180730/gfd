/**
 * 字符串工具函数
 */
/**
 * 驼峰命名转短横线命名
 * @param str 驼峰命名字符串
 */
export function camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
/**
 * 短横线命名转驼峰命名
 * @param str 短横线命名字符串
 */
export function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}
/**
 * 驼峰命名转下划线命名
 * @param str 驼峰命名字符串
 */
export function camelToSnake(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase();
}
/**
 * 下划线命名转驼峰命名
 * @param str 下划线命名字符串
 */
export function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
/**
 * 首字母大写
 * @param str 字符串
 */
export function capitalize(str) {
    if (!str.length)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * 首字母小写
 * @param str 字符串
 */
export function lowercaseFirst(str) {
    if (!str.length)
        return str;
    return str.charAt(0).toLowerCase() + str.slice(1);
}
/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param charset 字符集
 */
export function randomString(length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    const charactersLength = charset.length;
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/**
 * 去除字符串两端的空白字符
 * @param str 字符串
 */
export function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
/**
 * 截断字符串并添加省略号
 * @param str 字符串
 * @param maxLength 最大长度
 * @param suffix 后缀，默认 '...'
 */
export function truncate(str, maxLength, suffix = '...') {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
}
/**
 * 模板字符串插值
 * @param template 模板字符串，支持 ${key} 格式
 * @param data 数据对象
 */
export function template(template, data) {
    return template.replace(/\${(\w+)}/g, (match, key) => {
        return data[key] !== undefined ? String(data[key]) : match;
    });
}
//# sourceMappingURL=string.js.map