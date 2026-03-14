import 'reflect-metadata';
import { InjectionToken, Provider, Lifecycle, ContainerConfig } from './types';
/**
 * 依赖注入容器
 */
export declare class Container {
    private static instance;
    private providers;
    private instances;
    private config;
    private static defaultConfig;
    private constructor();
    /**
     * 获取容器单例
     * @param config 容器配置
     */
    static getInstance(config?: ContainerConfig): Container;
    /**
     * 注册提供者
     * @param provider 提供者配置
     */
    register<T>(provider: Provider<T>): void;
    /**
     * 批量注册提供者
     * @param providers 提供者列表
     */
    registerAll(providers: Provider[]): void;
    /**
     * 注册类
     * @param token 注入令牌
     * @param clazz 类
     * @param lifecycle 生命周期
     */
    registerClass<T>(token: InjectionToken<T>, clazz: new (...args: any[]) => T, lifecycle?: Lifecycle): void;
    /**
     * 注册值
     * @param token 注入令牌
     * @param value 值
     */
    registerValue<T>(token: InjectionToken<T>, value: T): void;
    /**
     * 注册工厂
     * @param token 注入令牌
     * @param factory 工厂函数
     * @param inject 依赖列表
     * @param lifecycle 生命周期
     */
    registerFactory<T>(token: InjectionToken<T>, factory: (...args: any[]) => T | Promise<T>, inject?: InjectionToken[], lifecycle?: Lifecycle): void;
    /**
     * 获取实例
     * @param token 注入令牌
     */
    get<T>(token: InjectionToken<T>): T;
    /**
     * 异步获取实例
     * @param token 注入令牌
     */
    getAsync<T>(token: InjectionToken<T>): Promise<T>;
    /**
     * 解析提供者
     * @param provider 提供者
     */
    private resolveProvider;
    /**
     * 解析类实例
     * @param clazz 类
     */
    private resolveClass;
    /**
     * 注入属性
     * @param instance 类实例
     */
    private injectProperties;
    /**
     * 检查类是否可注入
     * @param clazz 类
     */
    isInjectable(clazz: Function): boolean;
    /**
     * 检查令牌是否已注册
     * @param token 注入令牌
     */
    has(token: InjectionToken): boolean;
    /**
     * 移除注册的提供者
     * @param token 注入令牌
     */
    remove(token: InjectionToken): void;
    /**
     * 清空容器
     */
    clear(): void;
    /**
     * 获取所有注册的令牌
     */
    getTokens(): InjectionToken[];
    /**
     * 创建子容器
     * @param config 子容器配置
     */
    createChild(config?: ContainerConfig): Container;
}
/**
 * 默认容器实例
 */
export declare const container: Container;
//# sourceMappingURL=container.d.ts.map