import { I18n } from './i18n';
/**
 * 翻译装饰器
 * 自动翻译方法的返回值
 * @param keyPrefix 翻译键前缀
 * @param options 格式化选项
 */
export function Translate(keyPrefix, options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const result = originalMethod.apply(this, args);
            // 确保实例上有i18n
            const instance = this;
            if (!instance || !instance.i18n || !(instance.i18n instanceof I18n)) {
                return result;
            }
            const i18n = instance.i18n;
            // 如果返回的是字符串，尝试翻译
            if (typeof result === 'string') {
                const key = keyPrefix ? `${keyPrefix}.${result}` : result;
                return i18n.t(key, {}, options);
            }
            // 如果返回的是数组，翻译每个元素
            if (Array.isArray(result)) {
                return result.map(item => {
                    if (typeof item === 'string') {
                        const key = keyPrefix ? `${keyPrefix}.${item}` : item;
                        return i18n.t(key, {}, options);
                    }
                    return item;
                });
            }
            // 如果返回的是对象，翻译值
            if (typeof result === 'object' && result !== null) {
                const translated = {};
                for (const [k, v] of Object.entries(result)) {
                    if (typeof v === 'string') {
                        const key = keyPrefix ? `${keyPrefix}.${v}` : v;
                        translated[k] = i18n.t(key, {}, options);
                    }
                    else {
                        translated[k] = v;
                    }
                }
                return translated;
            }
            return result;
        };
        return descriptor;
    };
}
/**
 * 翻译参数装饰器
 * 自动翻译方法的指定参数
 * @param paramIndex 要翻译的参数索引
 * @param options 格式化选项
 */
export function TranslateParam(paramIndex, options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const instance = this;
            if (!instance || !instance.i18n || !(instance.i18n instanceof I18n)) {
                return originalMethod.apply(this, args);
            }
            const i18n = instance.i18n;
            // 翻译指定参数
            if (args[paramIndex] && typeof args[paramIndex] === 'string') {
                args[paramIndex] = i18n.t(args[paramIndex], {}, options);
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
/**
 * 动态翻译装饰器
 * 根据返回的翻译键和参数进行翻译
 * @param getKey 从返回值中获取翻译键的函数
 * @param getParams 从返回值中获取翻译参数的函数
 * @param options 格式化选项
 */
export function TranslateDynamic(getKey, getParams, options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await originalMethod.apply(this, args);
            const instance = this;
            if (!instance || !instance.i18n || !(instance.i18n instanceof I18n)) {
                return result;
            }
            const i18n = instance.i18n;
            const key = getKey(result);
            const params = getParams ? getParams(result) : {};
            return i18n.t(key, params, options);
        };
        return descriptor;
    };
}
/**
 * 复数翻译装饰器
 * 自动处理复数形式的翻译
 * @param key 翻译键
 * @param countSelector 从参数中获取数量的函数
 * @param options 格式化选项
 */
export function TranslatePlural(key, countSelector, options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const count = countSelector(...args);
            const instance = this;
            if (!instance || !instance.i18n || !(instance.i18n instanceof I18n)) {
                return originalMethod.apply(this, args);
            }
            const i18n = instance.i18n;
            const result = originalMethod.apply(this, args);
            return i18n.t(key, { count, ...result }, options);
        };
        return descriptor;
    };
}
//# sourceMappingURL=decorators.js.map