import 'reflect-metadata';
import { InjectionToken, Lifecycle, InjectOptions } from './types';
/**
 * 标记类为可注入
 * @param lifecycle 生命周期，默认 SINGLETON
 */
export declare function Injectable(lifecycle?: Lifecycle): ClassDecorator;
/**
 * 依赖注入装饰器
 * @param token 可选的注入令牌，默认使用参数类型
 * @param options 注入选项
 */
export declare function inject(token?: InjectionToken, options?: InjectOptions): PropertyDecorator | ParameterDecorator;
/**
 * 单例生命周期装饰器
 */
export declare function Singleton(): ClassDecorator;
/**
 * Transient生命周期装饰器
 */
export declare function Transient(): ClassDecorator;
/**
 * 请求作用域生命周期装饰器
 */
export declare function RequestScoped(): ClassDecorator;
/**
 * 可选注入装饰器
 * @param token 注入令牌
 * @param defaultValue 默认值
 */
export declare function Optional(token?: InjectionToken, defaultValue?: any): PropertyDecorator | ParameterDecorator;
//# sourceMappingURL=decorators.d.ts.map