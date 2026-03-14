/**
 * 依赖注入装饰器
 * 用于类属性的依赖注入
 * @param token 可选的注入令牌，默认使用属性类型
 */
export declare function inject(token?: any): PropertyDecorator;
/**
 * API装饰器
 * 用于标记类方法为API接口
 * @param options API配置选项
 */
export declare function Api(options: {
    name?: string;
    description?: string;
    parameters?: ApiParameter[];
    returns?: ApiReturnType;
}): (target: any, propertyKey: string | symbol) => void;
/**
 * 事件监听装饰器
 * 用于标记类方法为事件监听器
 * @param eventName 事件名称
 * @param options 监听选项
 */
export declare function OnEvent(eventName: string, options?: {
    once?: boolean;
}): (target: any, propertyKey: string | symbol) => void;
/**
 * 定时任务装饰器
 * 用于标记类方法为定时执行的任务
 * @param cronExpression Cron表达式
 * @param options 任务选项
 */
export declare function Schedule(cronExpression: string, options?: {
    name?: string;
    description?: string;
    timezone?: string;
    disabled?: boolean;
}): (target: any, propertyKey: string | symbol) => void;
/**
 * 配置注入装饰器
 * 用于注入配置值
 * @param configPath 配置路径，支持点分隔符，如 'database.host'
 * @param defaultValue 默认值
 */
export declare function Config(configPath: string, defaultValue?: any): (target: any, propertyKey: string | symbol) => void;
/**
 * 日志装饰器
 * 自动记录方法调用日志
 * @param options 日志选项
 */
export declare function Log(options?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
    logArgs?: boolean;
    logResult?: boolean;
    logError?: boolean;
}): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * 缓存装饰器
 * 缓存方法的返回值
 * @param options 缓存选项
 */
export declare function Cache(options: {
    ttl?: number;
    key?: string;
    invalidateOn?: string[];
}): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
interface ApiParameter {
    name: string;
    type: string;
    required?: boolean;
    description?: string;
    default?: any;
}
interface ApiReturnType {
    type: string;
    description?: string;
}
export {};
//# sourceMappingURL=decorators.d.ts.map