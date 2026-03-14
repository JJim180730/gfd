import { Plugin, GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import type { SkillContext } from '../skills/base-skill';

/**
 * Agent 基础接口
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  skills: string[];
  execute: (input: string, context?: Record<string, any>) => Promise<string>;
}

export class AgentPlugin extends Plugin {
  name = 'agent-manager';
  version = '1.0.0';
  description = '智能Agent管理插件';

  private logger: Logger;
  private agents: Map<string, Agent> = new Map();
  private skills: Map<string, any> = new Map();

  async install(gfd: GFD) {
    this.logger = gfd.logger;
    this.logger.info('🤖 Agent管理插件已安装');

    // 注册Agent管理API
    gfd.api.register({
      name: 'agent:create',
      description: '创建Agent',
      handler: this.createAgent.bind(this)
    });
    
    gfd.api.register({
      name: 'agent:list',
      description: '获取Agent列表',
      handler: this.listAgents.bind(this)
    });
    
    gfd.api.register({
      name: 'agent:execute',
      description: '执行Agent',
      handler: this.executeAgent.bind(this)
    });

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

  async initialize(): Promise<void> {
    this.logger.info('✅ Agent管理插件初始化完成');
  }

  async start(): Promise<void> {
    this.logger.info('🚀 Agent管理插件已启动');
  }

  async stop(): Promise<void> {
    this.logger.info('🛑 Agent管理插件已停止');
  }

  /**
   * 创建Agent
   */
  createAgent(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      this.logger.warn(`Agent ${agent.id} 已存在，将被覆盖`);
    }
    this.agents.set(agent.id, agent);
    this.logger.info(`✅ 已创建Agent: ${agent.name} (${agent.id})`);
  }

  /**
   * 获取Agent列表
   */
  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * 执行Agent
   */
  async executeAgent(agentId: string, input: string, context: Record<string, any> = {}): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} 不存在`);
    }

    this.logger.info(`⚡ 执行Agent: ${agent.name} (${agentId})`);
    const startTime = Date.now();
    
    try {
      const result = await agent.execute(input, context);
      const duration = Date.now() - startTime;
      this.logger.info(`✅ Agent执行完成: ${agent.name}, 耗时 ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ Agent执行失败: ${agent.name}, 耗时 ${duration}ms`, error as Error);
      throw error;
    }
  }

  /**
   * 注册技能
   */
  registerSkill(skill: any): void {
    if (this.skills.has(skill.id)) {
      this.logger.warn(`技能 ${skill.id} 已存在，将被覆盖`);
    }
    this.skills.set(skill.id, skill);
    this.logger.info(`✅ 已注册技能: ${skill.name} (${skill.id})`);
  }

  /**
   * 获取技能列表
   */
  listSkills(): any[] {
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
