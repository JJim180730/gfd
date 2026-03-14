import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import type { Plugin } from './plugin';
import type { PluginManifest, PluginLoadOptions } from './types';
import { PluginError } from './types';
import type { PluginManager } from './plugin-manager';

/**
 * 插件加载器
 * 负责从文件系统加载插件
 */
export class PluginLoader {
  private readonly logger: Logger;
  private readonly pluginManager: PluginManager;

  constructor(
    private readonly gfd: GFD,
    private readonly pluginDirs: string[] = []
  ) {
    this.logger = gfd.logger;
    this.pluginManager = gfd.pluginManager;
  }

  /**
   * 添加插件搜索目录
   * @param dir 目录路径
   */
  addPluginDir(dir: string): void {
    const resolvedDir = path.resolve(dir);
    if (!this.pluginDirs.includes(resolvedDir)) {
      this.pluginDirs.push(resolvedDir);
      this.logger.debug(`已添加插件目录: ${resolvedDir}`);
    }
  }

  /**
   * 从目录加载所有插件
   * @param dir 目录路径
   * @param options 加载选项
   */
  async loadFromDir(dir: string, options: PluginLoadOptions = {}): Promise<Plugin[]> {
    const resolvedDir = path.resolve(dir);
    const loadedPlugins: Plugin[] = [];

    try {
      const entries = await fs.readdir(resolvedDir, { withFileTypes: true });

      for (const entry of entries) {
        const pluginPath = path.join(resolvedDir, entry.name);
        
        // 只加载目录
        if (!entry.isDirectory()) {
          continue;
        }

        try {
          const plugin = await this.loadFromPath(pluginPath, options);
          loadedPlugins.push(plugin);
        } catch (error) {
          this.logger.error(`加载插件失败 ${pluginPath}`, error as Record<string, any> | Error | undefined);
        }
      }

      this.logger.info(`从目录 ${resolvedDir} 加载了 ${loadedPlugins.length} 个插件`);
      return loadedPlugins;
    } catch (error) {
      this.logger.error(`读取插件目录失败 ${resolvedDir}`, error as Record<string, any> | Error | undefined);
      return [];
    }
  }

  /**
   * 从指定路径加载插件
   * @param pluginPath 插件路径
   * @param options 加载选项
   */
  async loadFromPath(pluginPath: string, options: PluginLoadOptions = {}): Promise<Plugin> {
    const resolvedPath = path.resolve(pluginPath);
    
    try {
      // 读取插件清单
      const manifest = await this.readPluginManifest(resolvedPath);
      
      // 加载插件模块
      const pluginModule = await this.loadPluginModule(resolvedPath, manifest);
      
      // 获取插件类
      const PluginClass = this.getPluginClass(pluginModule, manifest);
      
      // 实例化插件
      const plugin = this.instantiatePlugin(PluginClass, manifest, options);
      
      // 安装插件
      await this.pluginManager.install(plugin, options);
      
      return plugin;
    } catch (error) {
      throw new PluginError(
        `加载插件失败: ${(error as Error).message}`,
        path.basename(resolvedPath),
        'LOAD_FAILED',
        error as Error
      );
    }
  }

  /**
   * 从NPM包加载插件
   * @param packageName NPM包名
   * @param options 加载选项
   */
  async loadFromNpm(packageName: string, options: PluginLoadOptions = {}): Promise<Plugin> {
    try {
      // 尝试导入包
      const pluginModule = await import(packageName);
      
      // 读取package.json
      const packageJsonPath = require.resolve(`${packageName}/package.json`);
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      
      // 获取插件清单
      const manifest = this.parseManifestFromPackageJson(packageJson, packageName);
      
      // 获取插件类
      const PluginClass = this.getPluginClass(pluginModule, manifest);
      
      // 实例化插件
      const plugin = this.instantiatePlugin(PluginClass, manifest, options);
      
      // 安装插件
      await this.pluginManager.install(plugin, options);
      
      this.logger.info(`从NPM包加载插件成功: ${packageName} v${manifest.version}`);
      return plugin;
    } catch (error) {
      throw new PluginError(
        `从NPM加载插件失败: ${(error as Error).message}`,
        packageName,
        'NPM_LOAD_FAILED',
        error as Error
      );
    }
  }

  /**
   * 批量加载插件
   * @param pluginSpecs 插件规格，可以是路径、包名或插件实例
   * @param options 加载选项
   */
  async loadBatch(pluginSpecs: Array<string | Plugin>, options: PluginLoadOptions = {}): Promise<Plugin[]> {
    const loadedPlugins: Plugin[] = [];

    for (const spec of pluginSpecs) {
      try {
        let plugin: Plugin;
        
        if (typeof spec === 'string') {
          // 尝试判断是路径还是NPM包
          if (spec.startsWith('.') || spec.startsWith('/') || path.isAbsolute(spec)) {
            plugin = await this.loadFromPath(spec, options);
          } else {
            plugin = await this.loadFromNpm(spec, options);
          }
        } else {
          // 已经是插件实例
          await this.pluginManager.install(spec, options);
          plugin = spec;
        }
        
        loadedPlugins.push(plugin);
      } catch (error) {
        this.logger.error(`加载插件失败 ${spec}`, error as Record<string, any> | Error | undefined);
      }
    }

    return loadedPlugins;
  }

  /**
   * 读取插件清单
   */
  private async readPluginManifest(pluginPath: string): Promise<PluginManifest> {
    const packageJsonPath = path.join(pluginPath, 'package.json');
    
    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      return this.parseManifestFromPackageJson(packageJson, path.basename(pluginPath));
    } catch (error) {
      throw new Error(`读取插件清单失败: ${(error as Error).message}`);
    }
  }

  /**
   * 从package.json解析插件清单
   */
  private parseManifestFromPackageJson(packageJson: any, defaultName: string): PluginManifest {
    // 优先使用gfd字段
    const gfdConfig = packageJson.gfd || {};
    
    return {
      name: gfdConfig.name || packageJson.name || defaultName,
      version: gfdConfig.version || packageJson.version || '0.0.0',
      description: gfdConfig.description || packageJson.description,
      author: gfdConfig.author || packageJson.author,
      dependencies: gfdConfig.dependencies || [],
      optionalDependencies: gfdConfig.optionalDependencies || [],
      compatibleGFDVersion: gfdConfig.compatibleGFDVersion || '*',
      main: gfdConfig.main || packageJson.main || 'index.js',
      type: gfdConfig.type || 'common',
      configSchema: gfdConfig.configSchema,
      permissions: gfdConfig.permissions || [],
      homepage: packageJson.homepage,
      repository: packageJson.repository?.url || packageJson.repository,
      license: packageJson.license,
      tags: gfdConfig.tags || packageJson.keywords || []
    };
  }

  /**
   * 加载插件模块
   */
  private async loadPluginModule(pluginPath: string, manifest: PluginManifest): Promise<any> {
    const entryPath = path.join(pluginPath, manifest.main);
    
    try {
      // 动态导入模块
      return await import(entryPath);
    } catch (error) {
      throw new Error(`加载插件模块失败 ${entryPath}: ${(error as Error).message}`);
    }
  }

  /**
   * 获取插件类
   */
  private getPluginClass(module: any, manifest: PluginManifest): new () => Plugin {
    // 优先使用default导出
    let PluginClass = module.default || module.Plugin || module[manifest.name];
    
    if (!PluginClass) {
      // 尝试查找所有导出中符合插件特征的类
      for (const exportName of Object.keys(module)) {
        const exported = module[exportName];
        if (typeof exported === 'function' && exported.prototype && 
            ('name' in exported.prototype || 'install' in exported.prototype)) {
          PluginClass = exported;
          break;
        }
      }
    }

    if (!PluginClass) {
      throw new Error('在插件模块中找不到有效的插件类');
    }

    return PluginClass as new () => Plugin;
  }

  /**
   * 实例化插件
   */
  private instantiatePlugin(PluginClass: new () => Plugin, manifest: PluginManifest, options: PluginLoadOptions): Plugin {
    try {
      // 尝试从容器解析（支持依赖注入）
      if (this.gfd.container) {
        return this.gfd.container.get(PluginClass);
      }
      
      // 简单实例化
      return new PluginClass();
    } catch (error) {
      // 如果解析失败，尝试直接实例化
      try {
        return new PluginClass();
      } catch (fallbackError) {
        throw new Error(`实例化插件失败: ${(fallbackError as Error).message}`);
      }
    }
  }

  /**
   * 搜索所有可用的插件
   * 遍历所有插件目录，返回可用的插件列表
   */
  async searchAvailablePlugins(): Promise<Array<{ path: string; manifest: PluginManifest }>> {
    const availablePlugins: Array<{ path: string; manifest: PluginManifest }> = [];

    for (const dir of this.pluginDirs) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const pluginPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            try {
              const manifest = await this.readPluginManifest(pluginPath);
              availablePlugins.push({
                path: pluginPath,
                manifest
              });
            } catch {
              // 忽略无效的插件目录
              continue;
            }
          }
        }
      } catch (error) {
        this.logger.warn(`无法读取插件目录 ${dir}: ${(error as Error).message}`);
      }
    }

    return availablePlugins;
  }
}
