import { Plugin, GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';

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
}
