import { inject as diInject } from '@gfd/di';

/**
 * 依赖注入装饰器
 * 用于类属性的依赖注入
 * @param token 可选的注入令牌，默认使用属性类型
 */
export function inject(token?: any): PropertyDecorator {
  return diInject(token) as PropertyDecorator;
}

/**
 * API装饰器
 * 用于标记类方法为API接口
 * @param options API配置选项
 */
export function Api(options: {
  name?: string;
  description?: string;
  parameters?: ApiParameter[];
  returns?: ApiReturnType;
}) {
  return function (target: any, propertyKey: string | symbol) {
    const methodName = String(propertyKey);
    const apiName = options.name || `${target.constructor.name}:${methodName}`;
    
    // 存储API元数据
    const apis = Reflect.getMetadata('gfd:apis', target.constructor) || [];
    apis.push({
      name: apiName,
      description: options.description,
      parameters: options.parameters,
      returns: options.returns,
      methodName
    });
    
    Reflect.defineMetadata('gfd:apis', apis, target.constructor);
  };
}

/**
 * 事件监听装饰器
 * 用于标记类方法为事件监听器
 * @param eventName 事件名称
 * @param options 监听选项
 */
export function OnEvent(eventName: string, options: { once?: boolean } = {}) {
  return function (target: any, propertyKey: string | symbol) {
    const methodName = String(propertyKey);
    
    // 存储事件监听元数据
    const listeners = Reflect.getMetadata('gfd:event-listeners', target.constructor) || [];
    listeners.push({
      eventName,
      methodName,
      once: options.once || false
    });
    
    Reflect.defineMetadata('gfd:event-listeners', listeners, target.constructor);
  };
}

/**
 * 定时任务装饰器
 * 用于标记类方法为定时执行的任务
 * @param cronExpression Cron表达式
 * @param options 任务选项
 */
export function Schedule(cronExpression: string, options: {
  name?: string;
  description?: string;
  timezone?: string;
  disabled?: boolean;
} = {}) {
  return function (target: any, propertyKey: string | symbol) {
    const methodName = String(propertyKey);
    const taskName = options.name || `${target.constructor.name}:${methodName}`;
    
    // 存储定时任务元数据
    const schedules = Reflect.getMetadata('gfd:schedules', target.constructor) || [];
    schedules.push({
      name: taskName,
      cronExpression,
      description: options.description,
      timezone: options.timezone,
      disabled: options.disabled || false,
      methodName
    });
    
    Reflect.defineMetadata('gfd:schedules', schedules, target.constructor);
  };
}

/**
 * 配置注入装饰器
 * 用于注入配置值
 * @param configPath 配置路径，支持点分隔符，如 'database.host'
 * @param defaultValue 默认值
 */
export function Config(configPath: string, defaultValue?: any) {
  return function (target: any, propertyKey: string | symbol) {
    // 存储配置注入元数据
    const configInjections = Reflect.getMetadata('gfd:config-injections', target.constructor) || [];
    configInjections.push({
      propertyKey,
      configPath,
      defaultValue
    });
    
    Reflect.defineMetadata('gfd:config-injections', configInjections, target.constructor);
    
    // 定义getter
    Object.defineProperty(target, propertyKey, {
      get() {
        // 从GFD实例获取配置
        if (!this.gfd) {
          throw new Error('Config装饰器只能在GFD模块或插件中使用');
        }
        
        const value = getNestedValue(this.gfd.config, configPath);
        return value !== undefined ? value : defaultValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

/**
 * 日志装饰器
 * 自动记录方法调用日志
 * @param options 日志选项
 */
export function Log(options: {
  level?: 'debug' | 'info' | 'warn' | 'error';
  logArgs?: boolean;
  logResult?: boolean;
  logError?: boolean;
} = {}) {
  const {
    level = 'debug',
    logArgs = true,
    logResult = true,
    logError = true
  } = options;

  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const logger = (this as any).gfd?.logger || console;
      
      if (logArgs) {
        logger[level](`调用 ${className}.${methodName}`, { args });
      } else {
        logger[level](`调用 ${className}.${methodName}`);
      }

      const startTime = Date.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        if (logResult) {
          logger[level](`${className}.${methodName} 执行完成，耗时 ${duration}ms`, { result });
        } else {
          logger[level](`${className}.${methodName} 执行完成，耗时 ${duration}ms`);
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        if (logError) {
          logger.error(`${className}.${methodName} 执行失败，耗时 ${duration}ms`, error);
        }

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 缓存装饰器
 * 缓存方法的返回值
 * @param options 缓存选项
 */
export function Cache(options: {
  ttl?: number; // 缓存过期时间（毫秒）
  key?: string; // 缓存键，支持参数模板，如 'user:{0}'
  invalidateOn?: string[]; // 触发缓存失效的事件列表
}) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { value: any; expiresAt: number }>();
    const methodName = String(propertyKey);

    // 注册事件监听以清除缓存
    if (options.invalidateOn && options.invalidateOn.length > 0) {
      const listeners = Reflect.getMetadata('gfd:event-listeners', target.constructor) || [];
      
      options.invalidateOn.forEach(eventName => {
        listeners.push({
          eventName,
          methodName: `__invalidate_${methodName}_cache`,
          once: false
        });
        
        // 添加缓存失效方法
        target[`__invalidate_${methodName}_cache`] = function () {
          cache.clear();
          if ((this as any).gfd?.logger) {
            (this as any).gfd.logger.debug(`缓存 ${methodName} 已被事件 ${eventName} 清空`);
          }
        };
      });
      
      Reflect.defineMetadata('gfd:event-listeners', listeners, target.constructor);
    }

    descriptor.value = async function (...args: any[]) {
      // 生成缓存键
      const cacheKey = options.key 
        ? options.key.replace(/{(\d+)}/g, (_, index) => JSON.stringify(args[Number(index)]))
        : `${methodName}:${JSON.stringify(args)}`;

      // 检查缓存
      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        if ((this as any).gfd?.logger) {
          (this as any).gfd.logger.debug(`使用缓存 ${methodName}`, { key: cacheKey });
        }
        return cached.value;
      }

      // 调用原方法
      const result = await originalMethod.apply(this, args);

      // 缓存结果
      const ttl = options.ttl || 5 * 60 * 1000; // 默认5分钟
      cache.set(cacheKey, {
        value: result,
        expiresAt: Date.now() + ttl
      });

      if ((this as any).gfd?.logger) {
        (this as any).gfd.logger.debug(`已缓存 ${methodName}`, { key: cacheKey, ttl });
      }

      return result;
    };

    return descriptor;
  };
}

// 辅助类型
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

// 辅助函数：获取嵌套对象值
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
