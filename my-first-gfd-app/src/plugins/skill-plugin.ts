import { Plugin, GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import type { Skill, SkillContext } from '../skills/base-skill';

export class SkillPlugin extends Plugin {
  name = 'skill-manager';
  version = '1.0.0';
  description = '技能管理插件';

  private logger: Logger;
  private skills: Map<string, Skill> = new Map();

  async install(gfd: GFD) {
    this.logger = gfd.logger;
    this.logger.info('🛠️  技能管理插件已安装');

    // 注册技能管理API
    gfd.api.register({
      name: 'skill:register',
      description: '注册技能',
      handler: this.registerSkill.bind(this)
    });
    
    gfd.api.register({
      name: 'skill:list',
      description: '获取技能列表',
      handler: this.listSkills.bind(this)
    });
    
    gfd.api.register({
      name: 'skill:execute',
      description: '执行技能',
      handler: this.executeSkill.bind(this)
    });
  }

  /**
   * 注册技能
   */
  registerSkill(skill: Skill): void {
    if (this.skills.has(skill.id)) {
      this.logger.warn(`技能 ${skill.id} 已存在，将被覆盖`);
    }
    this.skills.set(skill.id, skill);
    this.logger.info(`✅ 已注册技能: ${skill.name} (${skill.id})`);
  }

  /**
   * 获取技能列表
   */
  listSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * 执行技能
   */
  async executeSkill(skillId: string, params: Record<string, any>, caller?: any): Promise<any> {
    const skill = this.skills.get(skillId);
    if (!skill) {
      throw new Error(`技能 ${skillId} 不存在`);
    }

    this.logger.info(`⚡ 执行技能: ${skill.name} (${skillId})`);
    const startTime = Date.now();
    
    // 创建执行上下文
    const context: SkillContext = {
      gfd: this.gfd!,
      caller,
      executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    try {
      // 验证必填参数
      if (skill.parameters) {
        for (const param of skill.parameters) {
          if (param.required && params[param.name] === undefined) {
            throw new Error(`技能 ${skill.name} 缺少必填参数: ${param.name}`);
          }
        }
      }

      const result = await skill.execute(context, params);
      const duration = Date.now() - startTime;
      this.logger.info(`✅ 技能执行完成: ${skill.name}, 耗时 ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ 技能执行失败: ${skill.name}, 耗时 ${duration}ms`, error as Error);
      throw error;
    }
  }
}
