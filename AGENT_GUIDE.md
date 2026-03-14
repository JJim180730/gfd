# GFD Agent 开发指南

GFD框架原生支持智能Agent开发，本文档详细介绍如何基于GFD开发功能强大的AI Agent。

## 🤖 什么是GFD Agent

GFD Agent是基于GFD框架的智能代理，具备以下特点：
- 🧠 具备记忆能力，支持上下文理解
- 🔌 可扩展的技能系统，支持动态添加能力
- 🎯 可配置的系统提示词，适配不同场景
- 📊 内置对话历史管理和token统计
- 🔗 支持工具调用和外部API集成
- 🔒 内置权限控制和安全审计

## 🚀 快速创建第一个Agent

### 前置配置：大模型
在开发Agent之前，请确保已经配置好大模型：
- 复制 `.env.example` 为 `.env` 并填写API密钥
- 详细配置说明：[大模型配置指南](docs/LLM_CONFIG.md)

### 步骤1：安装LLM适配器
根据需要选择对应的大模型服务商包：
```bash
# OpenAI GPT系列
pnpm add @gfd/llm-openai

# 其他服务商根据需要安装
# pnpm add @gfd/llm-anthropic @gfd/llm-qwen @gfd/llm-doubao
```

### 步骤2：定义Agent基础结构
```typescript
import { Agent, AgentContext, AgentResponse } from '@gfd/core';

// 定义Agent配置
const config = {
  id: 'customer-service-agent',
  name: '智能客服',
  description: '专业的客户服务代理，处理用户咨询和问题解答',
  version: '1.0.0',
  author: 'GFD Team',
  
  // 系统提示词
  systemPrompt: `你是一个专业的客服人员，需要友好、耐心地回答用户的问题。
  1. 回答要简洁明了，避免使用专业术语
  2. 如果不知道答案，不要编造，告诉用户会转交给人工处理
  3. 始终保持礼貌和专业的态度
  4. 结尾可以询问用户是否还有其他问题`,
  
  // 技能列表
  skills: ['faq-query', 'order-query', 'return-goods', 'complaint-handling'],
  
  // 能力配置
  capabilities: {
    longTermMemory: true,
    toolCalling: true,
    multiTurn: true,
    fileUpload: false
  },
  
  // 限流配置
  rateLimit: {
    maxRequestsPerMinute: 60,
    maxTokensPerRequest: 4096
  }
};
```

### 步骤3：实现Agent核心逻辑
```typescript
import { BaseAgent } from '@gfd/core';
import { OpenAILLM } from '@gfd/llm-openai';
import { MemoryManager } from '@gfd/memory';
import { SkillManager } from '@gfd/skill-system';

export class CustomerServiceAgent extends BaseAgent {
  private llm: OpenAILLM;
  private memory: MemoryManager;
  private skillManager: SkillManager;

  constructor(config: any) {
    super(config);
    
    // 初始化LLM（从环境变量读取配置）
    this.llm = new OpenAILLM({
      apiKey: process.env.OPENAI_API_KEY!,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4096'),
      baseUrl: process.env.OPENAI_BASE_URL
    });
    
    // 初始化记忆管理器
    this.memory = new MemoryManager({
      maxHistoryLength: 20,
      ttl: 24 * 60 * 60 * 1000 // 24小时过期
    });
    
    // 初始化技能管理器
    this.skillManager = new SkillManager();
  }

  /**
   * 初始化Agent
   */
  async initialize(): Promise<void> {
    await this.skillManager.loadSkills(this.config.skills);
    this.logger.info(`🤖 Agent ${this.config.name} 初始化完成`);
  }

  /**
   * 处理用户消息
   */
  async execute(input: string, context: AgentContext = {}): Promise<AgentResponse> {
    const startTime = Date.now();
    const sessionId = context.sessionId || this.generateSessionId();
    
    try {
      // 1. 获取对话历史
      const history = await this.memory.getHistory(sessionId);
      
      // 2. 意图识别
      const intent = await this.recognizeIntent(input, history);
      
      // 3. 技能匹配和调用
      if (intent.skill) {
        const skillResult = await this.skillManager.execute(intent.skill, intent.params);
        context.skillResult = skillResult;
      }
      
      // 4. 构建Prompt
      const prompt = this.buildPrompt(input, history, context);
      
      // 5. 调用LLM
      const llmResponse = await this.llm.chat(prompt, {
        temperature: 0.7,
        max_tokens: 2048
      });
      
      // 6. 保存对话历史
      await this.memory.addMessage(sessionId, {
        role: 'user',
        content: input,
        timestamp: Date.now()
      });
      
      await this.memory.addMessage(sessionId, {
        role: 'assistant',
        content: llmResponse.content,
        timestamp: Date.now()
      });
      
      // 7. 返回结果
      return {
        success: true,
        content: llmResponse.content,
        intent: intent.name,
        sessionId,
        usage: llmResponse.usage,
        duration: Date.now() - startTime
      };
      
    } catch (error) {
      this.logger.error('Agent执行失败', error as Error);
      return {
        success: false,
        content: '非常抱歉，我现在遇到了一些问题，请稍后再试或联系人工客服。',
        error: (error as Error).message,
        sessionId,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * 意图识别
   */
  private async recognizeIntent(input: string, history: any[]): Promise<any> {
    // 简单的意图识别实现，实际项目中可以使用专用的NLU服务
    if (input.includes('订单') || input.includes('物流')) {
      return {
        name: 'order-query',
        skill: 'order-query',
        params: this.extractOrderId(input)
      };
    } else if (input.includes('退货') || input.includes('退款')) {
      return {
        name: 'return-goods',
        skill: 'return-goods',
        params: {}
      };
    } else if (input.includes('投诉') || input.includes('抱怨')) {
      return {
        name: 'complaint-handling',
        skill: 'complaint-handling',
        params: {}
      };
    } else {
      return {
        name: 'faq',
        skill: 'faq-query',
        params: { question: input }
      };
    }
  }

  /**
   * 提取订单ID
   */
  private extractOrderId(input: string): { orderId?: string } {
    const orderIdMatch = input.match(/ORD[0-9]+/i);
    if (orderIdMatch) {
      return { orderId: orderIdMatch[0] };
    }
    return {};
  }

  /**
   * 构建Prompt
   */
  private buildPrompt(input: string, history: any[], context: any): string {
    const historyStr = history
      .map(msg => `${msg.role === 'user' ? '用户' : '客服'}: ${msg.content}`)
      .join('\n');
    
    const skillContext = context.skillResult 
      ? `\n参考信息：${JSON.stringify(context.skillResult)}` 
      : '';
      
    return `${this.config.systemPrompt}

对话历史：
${historyStr}

用户最新问题：${input}
${skillContext}

请根据以上信息回答用户的问题：`;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 步骤3：在GFD应用中使用Agent
```typescript
import { GFD } from '@gfd/core';
import { AgentPlugin } from '@gfd/agent-system';
import { CustomerServiceAgent } from './agents/customer-service-agent';

const gfd = new GFD({
  config: {
    appName: '智能客服系统',
    version: '1.0.0',
    environment: 'production'
  }
});

// 安装Agent插件
const agentPlugin = new AgentPlugin();
gfd.use(agentPlugin);

// 启动应用
async function bootstrap() {
  await gfd.start();
  
  // 注册客服Agent
  const customerServiceAgent = new CustomerServiceAgent({
    id: 'customer-service',
    name: '智能客服',
    description: '专业客户服务代理',
    systemPrompt: '你是一个专业的客服人员...',
    skills: ['faq-query', 'order-query', 'return-goods']
  });
  
  await agentPlugin.registerAgent(customerServiceAgent);
  
  // 测试Agent
  const response = await agentPlugin.executeAgent('customer-service', 
    '我的订单ORD20260313001什么时候到？', 
    { sessionId: 'user-123' }
  );
  
  console.log('Agent回复:', response.content);
}

bootstrap();
```

## 🧠 记忆系统

GFD Agent内置了强大的记忆系统，支持多种记忆类型：

### 1. 短期记忆（对话历史）
```typescript
// 配置记忆
const memory = new MemoryManager({
  maxHistoryLength: 50, // 最多保存50条对话
  ttl: 7 * 24 * 60 * 60 * 1000, // 7天过期
  storage: 'redis' // 可选：memory, redis, database
});

// 获取记忆
const history = await memory.getHistory(sessionId);

// 添加记忆
await memory.addMessage(sessionId, {
  role: 'user',
  content: '你好',
  metadata: { userId: '123' }
});

// 清除记忆
await memory.clearHistory(sessionId);
```

### 2. 长期记忆（知识库）
```typescript
import { VectorStore } from '@gfd/vector-store';

// 初始化向量数据库
const vectorStore = new VectorStore({
  type: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY,
  index: 'knowledge-base'
});

// 检索相关知识
const relevantDocs = await vectorStore.search(query, {
  topK: 3,
  threshold: 0.7
});

// 将相关知识注入到Prompt中
const prompt = `参考信息：
${relevantDocs.map(doc => doc.content).join('\n\n')}

用户问题：${query}
`;
```

### 3. 实体记忆
```typescript
// 提取和保存用户实体信息
const userInfo = {
  userId: '123',
  name: '张三',
  phone: '13800138000',
  orderHistory: ['ORD20260313001', 'ORD20260215003'],
  preferences: {
    language: 'zh-CN',
    notification: 'email'
  }
};

await memory.saveEntity('user', userId, userInfo);

// 后续对话中自动获取用户信息
const userInfo = await memory.getEntity('user', userId);
```

## 🔌 技能系统

技能是Agent能力的扩展，GFD提供了完善的技能开发框架：

### 开发自定义技能
```typescript
import { Skill, SkillContext } from '@gfd/skill-system';

export class OrderQuerySkill extends Skill {
  id = 'order-query';
  name = '订单查询';
  description = '查询订单状态和物流信息';
  version = '1.0.0';
  author = 'GFD Team';
  tags = ['order', 'query', 'customer-service'];

  // 技能参数定义
  parameters = [
    {
      name: 'orderId',
      type: 'string',
      required: true,
      description: '订单ID，格式为ORD+数字'
    }
  ];

  /**
   * 执行技能
   */
  async execute(params: { orderId: string }, context: SkillContext): Promise<any> {
    const { orderId } = params;
    const { userId } = context;

    this.logger.info(`查询订单: ${orderId}, 用户: ${userId}`);

    // 调用订单服务API
    const orderInfo = await this.fetchOrderInfo(orderId, userId);
    
    if (!orderInfo) {
      return {
        success: false,
        message: `未找到订单${orderId}，请确认订单号是否正确`
      };
    }

    // 调用物流服务API
    const logisticsInfo = await this.fetchLogisticsInfo(orderInfo.logisticsId);

    return {
      success: true,
      order: orderInfo,
      logistics: logisticsInfo,
      message: `订单${orderId}当前状态：${orderInfo.status}，预计${logisticsInfo.estimatedDeliveryTime}送达`
    };
  }

  /**
   * 获取订单信息
   */
  private async fetchOrderInfo(orderId: string, userId: string): Promise<any> {
    // 实际项目中调用内部订单服务API
    const response = await fetch(`https://api.your-company.com/orders/${orderId}?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ORDER_SERVICE_API_KEY}`
      }
    });
    return response.json();
  }

  /**
   * 获取物流信息
   */
  private async fetchLogisticsInfo(logisticsId: string): Promise<any> {
    // 调用物流服务API
    const response = await fetch(`https://api.your-company.com/logistics/${logisticsId}`);
    return response.json();
  }
}
```

### 注册和使用技能
```typescript
// 注册技能
skillManager.registerSkill(new OrderQuerySkill());

// 执行技能
const result = await skillManager.execute('order-query', { 
  orderId: 'ORD20260313001' 
}, { 
  userId: '123' 
});
```

## 🎯 多Agent协作

GFD支持多个Agent之间的协作，构建复杂的工作流：

### 示例：客服工单处理流程
```
用户咨询 → 路由Agent → 客服Agent → 技术支持Agent → 售后Agent → 满意度调查Agent
```

#### 实现路由Agent
```typescript
class RoutingAgent extends BaseAgent {
  async execute(input: string, context: any): Promise<AgentResponse> {
    // 分析用户问题，路由到合适的Agent
    const category = await this.classifyProblem(input);
    
    switch (category) {
      case 'order':
        return this.agentManager.execute('customer-service', input, context);
      case 'technical':
        return this.agentManager.execute('technical-support', input, context);
      case 'refund':
        return this.agentManager.execute('after-sales', input, context);
      default:
        return this.agentManager.execute('general-service', input, context);
    }
  }
}
```

### Agent之间的通信
```typescript
// Agent发送消息给其他Agent
await this.agentManager.send('agent-b', {
  type: 'task',
  content: '请处理这个退款申请',
  data: { orderId: 'ORD20260313001' },
  from: 'agent-a'
});

// 监听其他Agent的消息
this.agentManager.on('message', (message) => {
  if (message.from === 'agent-a' && message.type === 'task') {
    this.processTask(message.data);
  }
});
```

## 📊 监控和评估

### Agent性能指标
GFD内置了全面的Agent监控指标：

```typescript
// 对话指标
- 对话轮次：平均每个会话的交互次数
- 会话时长：平均会话持续时间
- 解决率：首次对话解决问题的比例
- 转人工率：需要转人工处理的比例

// 性能指标
- 响应时间：从收到请求到返回响应的时间
- 成功率：Agent成功处理请求的比例
- 错误率：处理失败的比例
- Token消耗：每次对话的token使用量

// 质量指标
- 满意度：用户评分（1-5星）
- 准确率：回答的正确率
- 相关性：回答与问题的相关度
```

### 自定义埋点
```typescript
// 记录用户满意度
this.metrics.record('user-satisfaction', {
  sessionId,
  rating: 5,
  feedback: '回答很专业，解决了我的问题'
});

// 记录技能调用
this.metrics.record('skill-execution', {
  skillId: 'order-query',
  success: true,
  duration: 234,
  params: { orderId: 'ORD20260313001' }
});
```

## 🔒 安全和合规

### 内容安全检查
```typescript
import { ContentSafety } from '@gfd/content-safety';

const contentSafety = new ContentSafety({
  providers: ['aliyun', 'tencent'],
  enableSensitiveWordCheck: true,
  enableImageCheck: false
});

// 检查用户输入
const safetyResult = await contentSafety.check(input);
if (!safetyResult.passed) {
  return {
    success: false,
    content: '您的输入包含敏感内容，请重新输入'
  };
}

// 检查Agent输出
const outputSafetyResult = await contentSafety.check(response.content);
if (!outputSafetyResult.passed) {
  response.content = '非常抱歉，我无法回答这个问题。';
}
```

### 数据脱敏
```typescript
// 自动脱敏敏感信息
const desensitizedInput = this.dataDesensitizer.desensitize(input, {
  phone: true,
  email: true,
  idCard: true,
  bankCard: true,
  customPatterns: [/ORD[0-9]+/gi] // 自定义脱敏规则
});
```

### 审计日志
```typescript
// 记录所有对话，用于审计
this.auditLogger.log({
  sessionId,
  userId,
  userInput: input,
  agentOutput: response.content,
  intent: intent.name,
  skillsUsed: usedSkills,
  timestamp: Date.now(),
  ip: context.ip,
  userAgent: context.userAgent
});
```

## 🚀 部署最佳实践

### 资源配置
```yaml
# Kubernetes部署配置
resources:
  requests:
    memory: "512Mi"
    cpu: "200m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

### 限流配置
```typescript
const agentConfig = {
  rateLimit: {
    global: {
      maxRequestsPerSecond: 100 // 全局QPS限制
    },
    perUser: {
      maxRequestsPerMinute: 30 // 每个用户每分钟最多30次请求
    },
    perIp: {
      maxRequestsPerMinute: 60 // 每个IP每分钟最多60次请求
    }
  }
};
```

### 降级策略
```typescript
// 当LLM服务不可用时，降级到规则引擎
if (this.llm.healthCheck() !== 'healthy') {
  return this.fallbackEngine.handle(input, context);
}
```

## 📚 示例项目

- [客服Agent示例](../examples/agent-customer-service/) - 完整的智能客服Agent实现
- [代码生成Agent示例](../examples/agent-code-generator/) - 代码生成Agent
- [数据分析Agent示例](../examples/agent-data-analyst/) - 数据分析Agent
- [多Agent协作示例](../examples/multi-agent-workflow/) - 多Agent协同工作流

## 🎯 下一步

- 查看 [技能开发指南](./SKILL_GUIDE.md) 了解如何开发Agent技能
- 查看 [部署指南](./DEPLOYMENT.md) 了解如何部署Agent应用
- 查看 [API文档](./docs/api/) 获取详细的接口说明

如果在开发过程中遇到问题，欢迎提交Issue或参与社区讨论。
