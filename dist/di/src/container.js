import 'reflect-metadata';
import { Lifecycle, METADATA_KEYS } from './types';
import { isClass, isPromise } from '@gfd/utils';
/**
 * 依赖注入容器
 */
export class Container {
    static instance;
    providers = new Map();
    instances = new Map();
    config;
    static defaultConfig = {
        autoRegister: true,
        defaultLifecycle: Lifecycle.SINGLETON
    };
    constructor(config = {}) {
        this.config = { ...Container.defaultConfig, ...config };
    }
    /**
     * 获取容器单例
     * @param config 容器配置
     */
    static getInstance(config) {
        if (!Container.instance) {
            Container.instance = new Container(config);
        }
        return Container.instance;
    }
    /**
     * 注册提供者
     * @param provider 提供者配置
     */
    register(provider) {
        this.providers.set(provider.provide, {
            lifecycle: this.config.defaultLifecycle,
            ...provider
        });
    }
    /**
     * 批量注册提供者
     * @param providers 提供者列表
     */
    registerAll(providers) {
        providers.forEach(provider => this.register(provider));
    }
    /**
     * 注册类
     * @param token 注入令牌
     * @param clazz 类
     * @param lifecycle 生命周期
     */
    registerClass(token, clazz, lifecycle = this.config.defaultLifecycle) {
        this.register({
            provide: token,
            useClass: clazz,
            lifecycle
        });
    }
    /**
     * 注册值
     * @param token 注入令牌
     * @param value 值
     */
    registerValue(token, value) {
        this.register({
            provide: token,
            useValue: value
        });
    }
    /**
     * 注册工厂
     * @param token 注入令牌
     * @param factory 工厂函数
     * @param inject 依赖列表
     * @param lifecycle 生命周期
     */
    registerFactory(token, factory, inject = [], lifecycle = this.config.defaultLifecycle) {
        this.register({
            provide: token,
            useFactory: factory,
            inject,
            lifecycle
        });
    }
    /**
     * 获取实例
     * @param token 注入令牌
     */
    get(token) {
        // 检查是否已有单例实例
        if (this.instances.has(token)) {
            return this.instances.get(token);
        }
        // 检查是否有注册的提供者
        if (!this.providers.has(token)) {
            // 自动注册可注入类
            if (this.config.autoRegister && isClass(token) && this.isInjectable(token)) {
                this.registerClass(token, token);
            }
            else {
                throw new Error(`没有找到令牌 ${token.toString()} 的提供者`);
            }
        }
        const provider = this.providers.get(token);
        const instance = this.resolveProvider(provider);
        // 单例模式缓存实例
        if (provider.lifecycle === Lifecycle.SINGLETON) {
            this.instances.set(token, instance);
        }
        return instance;
    }
    /**
     * 异步获取实例
     * @param token 注入令牌
     */
    async getAsync(token) {
        const instance = this.get(token);
        return isPromise(instance) ? await instance : instance;
    }
    /**
     * 解析提供者
     * @param provider 提供者
     */
    resolveProvider(provider) {
        // 值提供者
        if ('useValue' in provider) {
            return provider.useValue;
        }
        // 类提供者
        if ('useClass' in provider) {
            return this.resolveClass(provider.useClass);
        }
        // 工厂提供者
        if ('useFactory' in provider) {
            const dependencies = provider.inject?.map(dep => this.get(dep)) || [];
            return provider.useFactory(...dependencies);
        }
        throw new Error(`无效的提供者: ${provider.provide.toString()}`);
    }
    /**
     * 解析类实例
     * @param clazz 类
     */
    resolveClass(clazz) {
        // 获取构造函数参数类型
        const paramTypes = Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, clazz) || [];
        // 获取参数注入元数据
        const paramInjections = Reflect.getMetadata(METADATA_KEYS.INJECT, clazz) || [];
        // 解析依赖
        const dependencies = paramTypes.map((paramType, index) => {
            const injection = paramInjections[index];
            const token = injection?.token || paramType;
            try {
                return this.get(token);
            }
            catch (error) {
                if (injection?.options?.optional) {
                    return injection.options.defaultValue;
                }
                throw new Error(`无法解析类 ${clazz.name} 的第 ${index} 个参数: ${error.message}`);
            }
        });
        // 创建实例
        const instance = new clazz(...dependencies);
        // 注入属性
        this.injectProperties(instance);
        return instance;
    }
    /**
     * 注入属性
     * @param instance 类实例
     */
    injectProperties(instance) {
        const injections = Reflect.getMetadata(METADATA_KEYS.INJECT, instance) || [];
        for (const injection of injections) {
            if (injection.propertyKey) {
                try {
                    instance[injection.propertyKey] = this.get(injection.token);
                }
                catch (error) {
                    if (!injection.options?.optional) {
                        throw new Error(`无法注入属性 ${String(injection.propertyKey)}: ${error.message}`);
                    }
                    instance[injection.propertyKey] = injection.options.defaultValue;
                }
            }
        }
    }
    /**
     * 检查类是否可注入
     * @param clazz 类
     */
    isInjectable(clazz) {
        return Reflect.hasMetadata(METADATA_KEYS.INJECTABLE, clazz);
    }
    /**
     * 检查令牌是否已注册
     * @param token 注入令牌
     */
    has(token) {
        return this.providers.has(token);
    }
    /**
     * 移除注册的提供者
     * @param token 注入令牌
     */
    remove(token) {
        this.providers.delete(token);
        this.instances.delete(token);
    }
    /**
     * 清空容器
     */
    clear() {
        this.providers.clear();
        this.instances.clear();
    }
    /**
     * 获取所有注册的令牌
     */
    getTokens() {
        return Array.from(this.providers.keys());
    }
    /**
     * 创建子容器
     * @param config 子容器配置
     */
    createChild(config = {}) {
        const child = new Container({ ...this.config, ...config });
        // 继承父容器的提供者
        this.providers.forEach((provider, token) => {
            child.register(provider);
        });
        return child;
    }
}
/**
 * 默认容器实例
 */
export const container = Container.getInstance();
//# sourceMappingURL=container.js.map