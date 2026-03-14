# GFD 大模型配置指南

本文档详细介绍如何在GFD框架中配置和使用大模型（LLM）。

## 📋 前置准备
1. 申请对应大模型服务商的API密钥
2. 确保网络可以访问对应的API端点（如需代理请配置baseUrl）

## 🚀 快速配置

### 步骤1：安装依赖包
根据需要使用的大模型服务商安装对应的LLM适配器包：

```bash
# OpenAI GPT系列
pnpm add @gfd/llm-openai

# Anthropic Claude系列
pnpm add @gfd/llm-anthropic

# 阿里云通义千问
pnpm add @gfd/llm-qwen

# 字节跳动豆包
pnpm add @gfd/llm-doubao

# 百度文心一言
pnpm add @gfd/llm-ernie

# 腾讯混元
pnpm add @gfd/llm-hunyuan

# 科大讯飞星火
pnpm add @gfd/llm-spark
```

### 步骤2：配置环境变量
1. 复制项目根目录下的 `.env.example` 为 `.env`
2. 填写对应大模型服务商的API密钥和配置参数
3. 敏感信息不要提交到代码仓库，`.env` 文件已经默认加入 `.gitignore`

```env
# 示例：配置OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.7
```

### 步骤3：在Agent中使用LLM
```typescript
import { BaseAgent, AgentContext, AgentResponse } from '@gfd/core';
import { OpenAILLM } from '@gfd/llm-openai';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export class MyAgent extends BaseAgent {
  private llm: OpenAILLM;

  constructor(config: any) {
    super(config);
    
    // 初始化LLM实例
    this.llm = new OpenAILLM({
      apiKey: process.env.OPENAI_API_KEY!,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4096'),
      baseUrl: process.env.OPENAI_BASE_URL
    });
  }

  async execute(input: string, context: AgentContext = {}): Promise<AgentResponse> {
    // 调用LLM生成回复
    const response = await this.llm.chat([
      { role: 'system', content: this.config.systemPrompt },
      { role: 'user', content: input }
    ]);

    return {
      content: response.content,
      usage: response.usage,
      model: response.model
    };
  }
}
```

## 🎛️ 配置参数说明

### 通用配置参数
| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| apiKey | string | 必填 | API密钥 |
| model | string | 必填 | 模型名称 |
| temperature | number | 0.7 | 温度参数，0-1之间，值越高回复越随机 |
| maxTokens | number | 4096 | 最大生成token数 |
| baseUrl | string | 官方地址 | API端点，可配置代理或兼容服务 |
| timeout | number | 60000 | 请求超时时间（毫秒） |
| streaming | boolean | false | 是否启用流式响应 |

### 各服务商常用模型
#### OpenAI
- `gpt-3.5-turbo` - 性价比高，适合常规对话
- `gpt-4o` - 最新多模态模型，效果最好
- `gpt-4-turbo` - 高性能，支持128k上下文

#### Anthropic
- `claude-3-sonnet-20240229` - 平衡性能和速度
- `claude-3-opus-20240229` - 最高性能，适合复杂任务
- `claude-3-haiku-20240307` - 轻量快速，适合简单任务

#### 通义千问
- `qwen-turbo` - 高效版，响应速度快
- `qwen-plus` - 增强版，效果更好
- `qwen-max` - 旗舰版，支持128k上下文

#### 豆包
- `doubao-lite-4k` - 轻量版，速度快
- `doubao-pro-32k` - 专业版，支持32k上下文
- `doubao-pro-128k` - 大上下文版本

## 🔧 高级配置

### 多模型切换
在同一个应用中可以同时配置多个大模型，根据场景动态切换：

```typescript
const llmProviders = {
  openai: new OpenAILLM({ /* 配置 */ }),
  qwen: new QwenLLM({ /* 配置 */ }),
  doubao: new DoubaoLLM({ /* 配置 */ })
};

// 根据任务类型选择模型
function getLLMForTask(taskType: 'chat' | 'reasoning' | 'generation') {
  switch (taskType) {
    case 'reasoning':
      return llmProviders.openai; // 复杂推理用GPT-4
    case 'chat':
      return llmProviders.doubao; // 日常对话用豆包
    case 'generation':
      return llmProviders.qwen; // 内容生成用通义千问
    default:
      return llmProviders.openai;
  }
}
```

### 自定义LLM适配器
如果需要接入其他大模型服务商，可以实现自定义LLM适配器：

```typescript
import { BaseLLM, LLMConfig, LLMResponse } from '@gfd/core';

export class CustomLLM extends BaseLLM {
  constructor(config: LLMConfig) {
    super(config);
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse> {
    // 实现自定义的API调用逻辑
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      model: data.model
    };
  }
}
```

## 📝 最佳实践
1. **密钥安全**：永远不要把API密钥硬编码在代码中，使用环境变量或密钥管理服务
2. **异常处理**：添加请求重试和异常捕获机制，处理API调用失败的情况
3. **成本控制**：根据业务场景选择合适的模型，避免大材小用
4. **监控告警**：监控API调用量和token消耗，设置用量告警
5. **内容审核**：对输入输出内容进行合规性审核，避免违规内容

## 🆘 常见问题
### Q: 国内访问OpenAI慢怎么办？
A: 可以配置代理地址，将`baseUrl`设置为可用的反向代理地址。

### Q: 如何降低API调用成本？
A: 1. 根据场景选择合适的模型；2. 优化prompt减少不必要的token消耗；3. 对高频请求添加缓存。

### Q: 支持流式响应吗？
A: 是的，将`streaming`参数设置为`true`即可使用流式响应。

### Q: 如何统计token消耗？
A: LLM响应中会返回`usage`字段，包含prompt、completion和total的token数量，可以自行统计。
