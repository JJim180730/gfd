import 'reflect-metadata';
import { Lifecycle, METADATA_KEYS } from './types';
import { isNil } from '@gfd/utils';
/**
 * 标记类为可注入
 * @param lifecycle 生命周期，默认 SINGLETON
 */
export function Injectable(lifecycle = Lifecycle.SINGLETON) {
    return function (target) {
        Reflect.defineMetadata(METADATA_KEYS.INJECTABLE, true, target);
        Reflect.defineMetadata(METADATA_KEYS.LIFECYCLE, lifecycle, target);
    };
}
/**
 * 依赖注入装饰器
 * @param token 可选的注入令牌，默认使用参数类型
 * @param options 注入选项
 */
export function inject(token, options = {}) {
    return function (target, propertyKey, parameterIndex) {
        // 属性装饰器
        if (propertyKey !== undefined && isNil(parameterIndex)) {
            const injectToken = token || Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, target, propertyKey)?.[0];
            if (!injectToken) {
                throw new Error(`无法推断属性 ${String(propertyKey)} 的注入令牌，请显式指定`);
            }
            // 存储注入元数据
            const injections = Reflect.getMetadata(METADATA_KEYS.INJECT, target) || [];
            injections.push({
                propertyKey,
                token: injectToken,
                options
            });
            Reflect.defineMetadata(METADATA_KEYS.INJECT, injections, target);
            // 定义getter
            Object.defineProperty(target, propertyKey, {
                get() {
                    // 从容器获取实例
                    if (!this.container) {
                        throw new Error('inject装饰器只能在容器管理的类中使用');
                    }
                    try {
                        return this.container.get(injectToken);
                    }
                    catch (error) {
                        if (options.optional) {
                            return options.defaultValue;
                        }
                        throw error;
                    }
                },
                enumerable: true,
                configurable: true
            });
        }
        // 构造函数参数装饰器
        else if (parameterIndex !== undefined) {
            const paramTypes = Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, target) || [];
            const injectToken = token || paramTypes[parameterIndex];
            if (!injectToken) {
                throw new Error(`无法推断第 ${parameterIndex} 个参数的注入令牌，请显式指定`);
            }
            // 存储参数注入元数据
            const paramInjections = Reflect.getMetadata(METADATA_KEYS.INJECT, target) || [];
            paramInjections[parameterIndex] = {
                token: injectToken,
                options
            };
            Reflect.defineMetadata(METADATA_KEYS.INJECT, paramInjections, target);
        }
    };
}
/**
 * 单例生命周期装饰器
 */
export function Singleton() {
    return Injectable(Lifecycle.SINGLETON);
}
/**
 * Transient生命周期装饰器
 */
export function Transient() {
    return Injectable(Lifecycle.TRANSIENT);
}
/**
 * 请求作用域生命周期装饰器
 */
export function RequestScoped() {
    return Injectable(Lifecycle.REQUEST);
}
/**
 * 可选注入装饰器
 * @param token 注入令牌
 * @param defaultValue 默认值
 */
export function Optional(token, defaultValue) {
    return inject(token, { optional: true, defaultValue });
}
//# sourceMappingURL=decorators.js.map