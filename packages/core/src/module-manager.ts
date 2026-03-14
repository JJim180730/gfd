import type { GFD } from './gfd';
import type { Module } from './module';
import { DependencyGraph } from '@gfd/utils';

/**
 * 模块管理器
 * 负责模块的注册、初始化、启动和停止
 */
export class ModuleManager {
  private readonly gfd: GFD;
  private readonly modules: Map<string, Module> = new Map();
  private readonly dependencyGraph: DependencyGraph = new DependencyGraph();

  constructor(gfd: GFD) {
    this.gfd = gfd;
  }

  /**
   * 注册模块
   * @param moduleOrClass 模块实例或类
   */
  register(moduleOrClass: any): Module {
    let module: Module;

    // 如果是类，实例化
    if (typeof moduleOrClass === 'function') {
      // 从容器解析依赖
      module = this.gfd.container.get(moduleOrClass) as Module;
    } else {
      module = moduleOrClass as Module;
    }

    const moduleName = module.name;

    if (this.modules.has(moduleName)) {
      this.gfd.logger.warn(`模块 ${moduleName} 已经注册，跳过重复注册`);
      return this.modules.get(moduleName)!;
    }

    // 设置GFD实例
    module.setGFD(this.gfd);

    // 注册到容器
    this.gfd.container.registerValue(moduleName, module);

    // 添加到依赖图
    this.dependencyGraph.addNode(moduleName, module);
    
    // 添加依赖
    if (module.dependencies) {
      for (const dep of module.dependencies) {
        this.dependencyGraph.addDependency(moduleName, dep);
      }
    }

    this.modules.set(moduleName, module);
    this.gfd.logger.debug(`模块 ${moduleName} 注册成功`);

    return module;
  }

  /**
   * 获取已注册的模块
   * @param name 模块名称
   */
  get<T extends Module>(name: string): T | undefined {
    return this.modules.get(name) as T | undefined;
  }

  /**
   * 获取所有已注册的模块
   */
  getRegisteredModules(): Module[] {
    return Array.from(this.modules.values());
  }

  /**
   * 检查模块是否已注册
   * @param name 模块名称
   */
  has(name: string): boolean {
    return this.modules.has(name);
  }

  /**
   * 初始化所有模块
   * 按照依赖顺序初始化
   */
  async initializeAll(): Promise<void> {
    // 检查依赖是否满足
    this.checkDependencies();

    // 按照拓扑排序顺序初始化
    const orderedModules = this.dependencyGraph.topologicalSort();

    for (const moduleName of orderedModules) {
      const module = this.modules.get(moduleName);
      if (!module) continue;

      try {
        await module.initialize();
      } catch (error) {
        this.gfd.logger.error(`模块 ${moduleName} 初始化失败`, error as Record<string, any> | Error | undefined);
        throw error;
      }
    }

    this.gfd.logger.info(`所有模块初始化完成，共 ${this.modules.size} 个模块`);
  }

  /**
   * 启动所有模块
   * 按照依赖顺序启动
   */
  async startAll(): Promise<void> {
    // 按照拓扑排序顺序启动
    const orderedModules = this.dependencyGraph.topologicalSort();

    for (const moduleName of orderedModules) {
      const module = this.modules.get(moduleName);
      if (!module) continue;

      try {
        await module.start();
      } catch (error) {
        this.gfd.logger.error(`模块 ${moduleName} 启动失败`, error as Record<string, any> | Error | undefined);
        throw error;
      }
    }

    this.gfd.logger.info(`所有模块启动完成，共 ${this.modules.size} 个模块`);
  }

  /**
   * 停止所有模块
   * 按照依赖逆序停止
   */
  async stopAll(): Promise<void> {
    // 按照拓扑排序逆序停止
    const orderedModules = this.dependencyGraph.topologicalSort().reverse();

    for (const moduleName of orderedModules) {
      const module = this.modules.get(moduleName);
      if (!module) continue;

      try {
        await module.stop();
      } catch (error) {
        this.gfd.logger.error(`模块 ${moduleName} 停止失败`, error as Record<string, any> | Error | undefined);
        throw error;
      }
    }

    this.gfd.logger.info(`所有模块停止完成，共 ${this.modules.size} 个模块`);
  }

  /**
   * 检查依赖是否满足
   */
  private checkDependencies(): void {
    const missingDependencies: string[] = [];

    for (const [moduleName, module] of this.modules) {
      // 检查必填依赖
      if (module.dependencies) {
        for (const dep of module.dependencies) {
          if (!this.modules.has(dep)) {
            missingDependencies.push(`模块 ${moduleName} 依赖的 ${dep} 未注册`);
          }
        }
      }

      // 检查可选依赖，只警告不报错
      if (module.optionalDependencies) {
        for (const dep of module.optionalDependencies) {
          if (!this.modules.has(dep)) {
            this.gfd.logger.warn(`模块 ${moduleName} 的可选依赖 ${dep} 未注册，部分功能可能不可用`);
          }
        }
      }
    }

    if (missingDependencies.length > 0) {
      const errorMessage = `依赖检查失败:\n${missingDependencies.join('\n')}`;
      this.gfd.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // 检查循环依赖
    const cycle = this.dependencyGraph.detectCycle();
    if (cycle) {
      const errorMessage = `检测到模块循环依赖: ${cycle.join(' -> ')}`;
      this.gfd.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.gfd.logger.debug('模块依赖检查通过');
  }
}
