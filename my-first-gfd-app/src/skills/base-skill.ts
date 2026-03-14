import type { GFD } from '@gfd/core';

/**
 * Skill 基础接口
 */
export interface Skill {
  /** 技能ID */
  id: string;
  /** 技能名称 */
  name: string;
  /** 技能描述 */
  description: string;
  /** 技能参数定义 */
  parameters?: SkillParameter[];
  /** 执行技能 */
  execute: (context: SkillContext, params: Record<string, any>) => Promise<any>;
}

/**
 * 技能参数定义
 */
export interface SkillParameter {
  /** 参数名称 */
  name: string;
  /** 参数类型 */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  /** 参数描述 */
  description: string;
  /** 是否必填 */
  required?: boolean;
  /** 默认值 */
  default?: any;
}

/**
 * 技能执行上下文
 */
export interface SkillContext {
  /** GFD实例 */
  gfd: GFD;
  /** 调用者信息 */
  caller?: {
    id: string;
    type: 'agent' | 'user' | 'system';
  };
  /** 执行ID */
  executionId: string;
  /** 执行时间 */
  timestamp: number;
}
