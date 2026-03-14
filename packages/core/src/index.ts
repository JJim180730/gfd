export * from './gfd';
export { 
  // 明确导出需要的类型，避免和plugin-system的导出冲突
  type GFDConfig as AppConfig,
  type ModuleMetadata,
  type PluginMetadata as CorePluginMetadata,
  type ApiDefinition as ApiMethod,
  type ApiParameter as ApiOptions
} from './types';
export { Module } from './module';
export { Plugin } from './plugin';
export { inject, Api, OnEvent, Schedule, Config, Log, Cache } from './decorators';
export * from './api';

// Re-export core dependencies
export type { Lifecycle } from '@gfd/di';
export * from '@gfd/event-bus';
export * from '@gfd/i18n';
export * from '@gfd/logger';
export * from '@gfd/plugin-system';
export * from '@gfd/utils';
