import type { GFD } from './gfd';
import type { ApiDefinition, ApiParameter, ApiReturnType } from './types';

/**
 * API注册表
 * 管理所有公开的API接口
 */
export class ApiRegistry {
  private readonly gfd: GFD;
  private readonly apis: Map<string, ApiDefinition> = new Map();

  constructor(gfd: GFD) {
    this.gfd = gfd;
  }

  /**
   * 注册API
   * @param definition API定义
   */
  register(definition: ApiDefinition): void {
    if (this.apis.has(definition.name)) {
      this.gfd.logger.warn(`API ${definition.name} 已经注册，将被覆盖`);
    }

    this.apis.set(definition.name, definition);
    this.gfd.logger.debug(`API ${definition.name} 注册成功`);

    // 触发API注册事件
    this.gfd.eventBus.emit('api:registered', {
      apiName: definition.name,
      definition
    });
  }

  /**
   * 批量注册API
   * @param definitions API定义列表
   */
  registerBatch(definitions: ApiDefinition[]): void {
    definitions.forEach(def => this.register(def));
  }

  /**
   * 获取API定义
   * @param name API名称
   */
  get(name: string): ApiDefinition | undefined {
    return this.apis.get(name);
  }

  /**
   * 检查API是否存在
   * @param name API名称
   */
  has(name: string): boolean {
    return this.apis.has(name);
  }

  /**
   * 调用API
   * @param name API名称
   * @param args API参数
   */
  async call<T = any>(name: string, ...args: any[]): Promise<T> {
    const api = this.apis.get(name);
    
    if (!api) {
      const error = new Error(`API ${name} 不存在`);
      this.gfd.logger.error(error.message);
      throw error;
    }

    // 参数验证
    if (api.parameters) {
      this.validateParameters(api.parameters, args);
    }

    try {
      this.gfd.logger.debug(`调用API ${name}`, { args });
      
      const result = await api.handler(...args);
      
      this.gfd.logger.debug(`API ${name} 调用成功`, { result });
      
      // 触发API调用成功事件
      this.gfd.eventBus.emit('api:called', {
        apiName: name,
        args,
        result,
        success: true
      });

      return result as T;
    } catch (error) {
      this.gfd.logger.error(`API ${name} 调用失败`, error as Record<string, any> | Error | undefined);
      
      // 触发API调用失败事件
      this.gfd.eventBus.emit('api:called', {
        apiName: name,
        args,
        error,
        success: false
      });

      throw error;
    }
  }

  /**
   * 同步调用API（仅当API处理函数是同步的）
   * @param name API名称
   * @param args API参数
   */
  callSync<T = any>(name: string, ...args: any[]): T {
    const api = this.apis.get(name);
    
    if (!api) {
      const error = new Error(`API ${name} 不存在`);
      this.gfd.logger.error(error.message);
      throw error;
    }

    // 参数验证
    if (api.parameters) {
      this.validateParameters(api.parameters, args);
    }

    try {
      this.gfd.logger.debug(`同步调用API ${name}`, { args });
      
      const result = api.handler(...args);
      
      if (result instanceof Promise) {
        throw new Error(`API ${name} 是异步的，请使用call()方法调用`);
      }

      this.gfd.logger.debug(`API ${name} 同步调用成功`, { result });
      
      return result as T;
    } catch (error) {
      this.gfd.logger.error(`API ${name} 同步调用失败`, error as Record<string, any> | Error | undefined);
      throw error;
    }
  }

  /**
   * 删除API
   * @param name API名称
   */
  unregister(name: string): boolean {
    const existed = this.apis.delete(name);
    
    if (existed) {
      this.gfd.logger.debug(`API ${name} 已注销`);
      this.gfd.eventBus.emit('api:unregistered', { apiName: name });
    }

    return existed;
  }

  /**
   * 获取所有已注册的API
   */
  getAll(): ApiDefinition[] {
    return Array.from(this.apis.values());
  }

  /**
   * 获取API列表（名称列表）
   */
  list(): string[] {
    return Array.from(this.apis.keys());
  }

  /**
   * 验证参数
   */
  private validateParameters(parameters: ApiParameter[], args: any[]): void {
    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];
      const value = args[i];

      // 检查必填参数
      if (param.required && value === undefined) {
        throw new Error(`参数 ${param.name} 是必填的`);
      }

      // 类型检查（简单实现，实际项目可以使用更完善的验证库）
      if (value !== undefined && typeof value !== param.type.toLowerCase()) {
        throw new Error(`参数 ${param.name} 类型错误，期望 ${param.type}，实际得到 ${typeof value}`);
      }
    }
  }

  /**
   * 创建API调用器
   * 生成一个可以直接调用的函数
   * @param name API名称
   */
  createCaller<T extends (...args: any[]) => any>(name: string): T {
    return ((...args: any[]) => this.call(name, ...args)) as unknown as T;
  }

  /**
   * 创建同步API调用器
   * @param name API名称
   */
  createSyncCaller<T extends (...args: any[]) => any>(name: string): T {
    return ((...args: any[]) => this.callSync(name, ...args)) as unknown as T;
  }
}
