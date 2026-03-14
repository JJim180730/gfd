# GFD 快速开始向导

本指南将帮助你在5分钟内搭建并运行第一个GFD应用。

## 📋 前置准备

确保你的开发环境满足以下要求：
- Node.js >= 18.0.0 (推荐使用LTS版本)
- 包管理器：pnpm >= 8.0.0 (推荐) / npm >= 9.0.0 / yarn >= 1.22.0
- TypeScript >= 5.0.0

### （可选）大模型配置
如果需要开发AI Agent应用，建议先配置好大模型：
1. 复制项目根目录的 `.env.example` 为 `.env`
2. 填写对应大模型服务商的API密钥
3. 详细配置说明请参考 [大模型配置指南](docs/LLM_CONFIG.md)

检查环境：
```bash
node --version  # 输出应该 >= v18.0.0
pnpm --version  # 输出应该 >= 8.0.0
tsc --version   # 输出应该 >= 5.0.0
```

如果没有安装pnpm：
```bash
npm install -g pnpm
```

## ⚡ 5分钟快速上手

### 步骤1：创建项目目录
```bash
mkdir my-gfd-app
cd my-gfd-app
```

### 步骤2：初始化项目
```bash
pnpm init -y
pnpm add typescript tsx @types/node -D
```

### 步骤3：创建TypeScript配置
创建`tsconfig.json`文件：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@gfd/*": ["node_modules/@gfd/*/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 步骤4：安装GFD依赖
```bash
# 从本地源码安装（当前演示用）
pnpm add /path/to/gfd/packages/core /path/to/gfd/packages/logger /path/to/gfd/packages/plugin-system

# 或从npm仓库安装（正式发布后）
# pnpm add @gfd/core @gfd/logger @gfd/plugin-system

# 💡 如果你的应用创建在GFD源码的examples/目录下，可以直接使用workspace引用：
# pnpm add @gfd/core@workspace @gfd/logger@workspace @gfd/plugin-system@workspace
```

### 步骤5：创建应用入口
创建`src/main.ts`文件：
```typescript
import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';

// 初始化日志
const logger = new Logger({
  level: 'debug',
  enableColors: true
});

// 创建GFD应用实例
const gfd = new GFD({
  config: {
    appName: '我的第一个GFD应用',
    version: '1.0.0',
    environment: 'development'
  }
});

// 启动应用
async function bootstrap() {
  try {
    await gfd.start();
    
    logger.info('='.repeat(50));
    logger.info('🎉 GFD应用启动成功！');
    logger.info(`📱 应用名称: ${gfd.config.appName}`);
    logger.info(`🏷️  版本号: ${gfd.config.version}`);
    logger.info(`🌍 运行环境: ${gfd.config.environment}`);
    logger.info('='.repeat(50));

  } catch (error) {
    logger.error('❌ 应用启动失败', error as Error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  logger.info('收到关闭信号，正在停止应用...');
  await gfd.stop();
  logger.info('应用已停止，再见！');
  process.exit(0);
});

bootstrap();
```

### 步骤6：运行应用
```bash
npx tsx src/main.ts
```

如果一切正常，你会看到类似以下的输出：
```
2026-03-13T07:00:00.000Z DEBUG [我的第一个GFD应用] GFD实例创建成功 {"appName":"我的第一个GFD应用","version":"1.0.0","environment":"development"}
2026-03-13T07:00:00.001Z INFO  [我的第一个GFD应用] 正在启动GFD应用: 我的第一个GFD应用 v1.0.0 {}
2026-03-13T07:00:00.001Z INFO  [我的第一个GFD应用] 开始初始化GFD应用 {}
2026-03-13T07:00:00.001Z INFO  [我的第一个GFD应用] 所有模块初始化完成，共 0 个模块 {}
2026-03-13T07:00:00.002Z INFO  [我的第一个GFD应用] 所有插件初始化完成，共 0 个插件 {}
2026-03-13T07:00:00.002Z INFO  [我的第一个GFD应用] GFD应用初始化完成 {}
2026-03-13T07:00:00.002Z INFO  [我的第一个GFD应用] 所有模块启动完成，共 0 个模块 {}
2026-03-13T07:00:00.002Z INFO  [我的第一个GFD应用] 所有插件启动完成，共 0 个插件 {}
2026-03-13T07:00:00.002Z INFO  [我的第一个GFD应用] GFD应用启动成功，运行环境: development {}
2026-03-13T07:00:00.002Z INFO   ================================================== {}
2026-03-13T07:00:00.002Z INFO   🎉 GFD应用启动成功！ {}
2026-03-13T07:00:00.002Z INFO   📱 应用名称: 我的第一个GFD应用 {}
2026-03-13T07:00:00.002Z INFO   🏷️  版本号: 1.0.0 {}
2026-03-13T07:00:00.002Z INFO   🌍 运行环境: development {}
2026-03-13T07:00:00.002Z INFO   ================================================== {}
```

恭喜！你已经成功运行了第一个GFD应用！

## 🚀 进阶：添加第一个插件

接下来我们来创建一个简单的插件，扩展应用功能。

### 步骤1：创建插件文件
创建`src/plugins/hello-plugin.ts`：
```typescript
import { Plugin, GFD } from '@gfd/core';

export class HelloPlugin extends Plugin {
  // 插件基本信息
  name = 'hello-plugin';
  version = '1.0.0';
  description = '我的第一个GFD插件，提供打招呼功能';

  async install(gfd: GFD) {
    // 插件安装时执行
    gfd.logger.info(`👋 插件 ${this.name} v${this.version} 已安装`);

    // 注册API接口
    gfd.api.register({
      name: 'hello:greet',
      description: '打招呼接口',
      parameters: [
        {
          name: 'name',
          type: 'string',
          required: true,
          description: '要打招呼的人的名字'
        }
      ],
      handler: (name: string) => {
        return `你好，${name}！欢迎使用GFD框架！`;
      }
    });
  }

  async start() {
    // 插件启动时执行
    this.gfd.logger.info(`✅ 插件 ${this.name} 已启动`);
  }

  async stop() {
    // 插件停止时执行
    this.gfd.logger.info(`🛑 插件 ${this.name} 已停止`);
  }
}
```

### 步骤2：在应用中使用插件
修改`src/main.ts`，添加插件：
```typescript
import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import { HelloPlugin } from './plugins/hello-plugin'; // 导入插件

const logger = new Logger({
  level: 'debug',
  enableColors: true
});

const gfd = new GFD({
  config: {
    appName: '我的第一个GFD应用',
    version: '1.0.0',
    environment: 'development'
  }
});

// 安装插件
const helloPlugin = new HelloPlugin();
gfd.use(helloPlugin);

async function bootstrap() {
  try {
    await gfd.start();
    
    logger.info('='.repeat(50));
    logger.info('🎉 GFD应用启动成功！');
    logger.info(`📱 应用名称: ${gfd.config.appName}`);
    logger.info(`🏷️  版本号: ${gfd.config.version}`);
    logger.info(`🌍 运行环境: ${gfd.config.environment}`);
    logger.info('='.repeat(50));

    // 测试插件API
    const greeting = await gfd.api.call('hello:greet', '张三');
    logger.info(`🤖 插件返回: ${greeting}`);

  } catch (error) {
    logger.error('❌ 应用启动失败', error as Error);
    process.exit(1);
  }
}

// ... 其余代码保持不变
```

### 步骤3：再次运行应用
```bash
npx tsx src/main.ts
```

现在你会看到插件相关的输出：
```
2026-03-13T07:01:00.000Z INFO   👋 插件 hello-plugin v1.0.0 已安装 {}
2026-03-13T07:01:00.001Z DEBUG [我的第一个GFD应用] API hello:greet 注册成功 {}
2026-03-13T07:01:00.001Z INFO  [我的第一个GFD应用] 插件 hello-plugin v1.0.0 安装成功 {}
...
2026-03-13T07:01:00.002Z DEBUG [我的第一个GFD应用] 插件 hello-plugin 已启动 {}
2026-03-13T07:01:00.002Z DEBUG [我的第一个GFD应用] 插件 hello-plugin 启动成功 {}
2026-03-13T07:01:00.002Z INFO  [我的第一个GFD应用] 所有插件启动完成，共 1 个插件 {}
...
2026-03-13T07:01:00.003Z DEBUG [我的第一个GFD应用] 调用API hello:greet {"args":["张三"]}
2026-03-13T07:01:00.003Z INFO   🤖 插件返回: 你好，张三！欢迎使用GFD框架！ {}
```

完美！你已经成功创建并使用了第一个GFD插件！

## 🤖 进阶：创建第一个Agent

现在我们来创建一个简单的智能Agent。

### 步骤1：创建Agent插件
创建`src/plugins/agent-plugin.ts`：
```typescript
import { Plugin, GFD } from '@gfd/core';

interface Agent {
  id: string;
  name: string;
  description: string;
  execute: (input: string) => Promise<string>;
}

export class AgentPlugin extends Plugin {
  name = 'agent-manager';
  version = '1.0.0';
  description = '智能Agent管理插件';
  
  private agents: Map<string, Agent> = new Map();

  async install(gfd: GFD) {
    gfd.logger.info('🤖 Agent管理插件已安装');
    
    // 注册API
    gfd.api.register('agent:register', (agent: Agent) => {
      this.agents.set(agent.id, agent);
      gfd.logger.info(`✅ 已注册Agent: ${agent.name} (${agent.id})`);
    });

    gfd.api.register('agent:chat', async (agentId: string, input: string) => {
      const agent = this.agents.get(agentId);
      if (!agent) throw new Error(`Agent ${agentId} 不存在`);
      return agent.execute(input);
    });
  }
}
```

### 步骤2：创建聊天Agent
创建`src/agents/chat-agent.ts`：
```typescript
import type { Agent } from '../plugins/agent-plugin';

export const chatAgent: Agent = {
  id: 'chat-assistant',
  name: '聊天助手',
  description: '一个简单的聊天助手',
  
  async execute(input: string): Promise<string> {
    // 这里可以集成真实的LLM API
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟处理时间
    
    if (input.includes('你好')) {
      return '你好呀！有什么我可以帮助你的吗？';
    } else if (input.includes('天气')) {
      return '今天天气晴朗，温度适宜，很适合外出哦！';
    } else if (input.includes('时间')) {
      return `现在的时间是：${new Date().toLocaleString()}`;
    } else {
      return `我收到了你的消息："${input}"，我正在学习更多技能，很快就能回答你的问题了！`;
    }
  }
};
```

### 步骤3：在应用中使用Agent
修改`src/main.ts`：
```typescript
import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import { HelloPlugin } from './plugins/hello-plugin';
import { AgentPlugin } from './plugins/agent-plugin'; // 导入Agent插件
import { chatAgent } from './agents/chat-agent'; // 导入聊天Agent

const logger = new Logger({
  level: 'debug',
  enableColors: true
});

const gfd = new GFD({
  config: {
    appName: '我的第一个GFD应用',
    version: '1.0.0',
    environment: 'development'
  }
});

// 安装插件
const helloPlugin = new HelloPlugin();
const agentPlugin = new AgentPlugin();
gfd.use(helloPlugin);
gfd.use(agentPlugin);

async function bootstrap() {
  try {
    await gfd.start();
    
    logger.info('='.repeat(50));
    logger.info('🎉 GFD应用启动成功！');
    logger.info(`📱 应用名称: ${gfd.config.appName}`);
    logger.info(`🏷️  版本号: ${gfd.config.version}`);
    logger.info(`🌍 运行环境: ${gfd.config.environment}`);
    logger.info('='.repeat(50));

    // 测试插件API
    const greeting = await gfd.api.call('hello:greet', '张三');
    logger.info(`🤖 插件返回: ${greeting}`);

    // 注册Agent
    await gfd.api.call('agent:register', chatAgent);

    // 测试Agent聊天
    const response1 = await gfd.api.call('agent:chat', 'chat-assistant', '你好');
    logger.info(`💬 用户: 你好`);
    logger.info(`🤖 助手: ${response1}`);

    const response2 = await gfd.api.call('agent:chat', 'chat-assistant', '今天天气怎么样？');
    logger.info(`💬 用户: 今天天气怎么样？`);
    logger.info(`🤖 助手: ${response2}`);

    const response3 = await gfd.api.call('agent:chat', 'chat-assistant', '现在几点了？');
    logger.info(`💬 用户: 现在几点了？`);
    logger.info(`🤖 助手: ${response3}`);

  } catch (error) {
    logger.error('❌ 应用启动失败', error as Error);
    process.exit(1);
  }
}

// ... 其余代码保持不变
```

### 步骤4：运行应用
```bash
npx tsx src/main.ts
```

你会看到Agent的运行结果：
```
2026-03-13T07:02:00.000Z INFO   🤖 Agent管理插件已安装 {}
...
2026-03-13T07:02:00.003Z INFO   ✅ 已注册Agent: 聊天助手 (chat-assistant) {}
2026-03-13T07:02:00.003Z INFO   💬 用户: 你好 {}
2026-03-13T07:02:00.504Z INFO   🤖 助手: 你好呀！有什么我可以帮助你的吗？ {}
2026-03-13T07:02:00.504Z INFO   💬 用户: 今天天气怎么样？ {}
2026-03-13T07:02:01.005Z INFO   🤖 助手: 今天天气晴朗，温度适宜，很适合外出哦！ {}
2026-03-13T07:02:01.005Z INFO   💬 用户: 现在几点了？ {}
2026-03-13T07:02:01.506Z INFO   🤖 助手: 现在的时间是：2026/3/13 15:02:01 {}
```

太棒了！你已经成功创建了第一个基于GFD的智能Agent！

## 🎯 下一步

现在你已经掌握了GFD的基础使用，接下来可以：

1. **学习插件开发**：查看 [插件开发指南](./README.md#-插件开发指南)
2. **学习Agent开发**：查看 [AI Agent开发指南](./README.md#-ai-agent-开发指南)
3. **查看示例项目**：浏览 `examples/` 目录下的更多示例
4. **阅读完整文档**：查看 [完整README文档](./README.md)
5. **加入社区**：在GitHub上提交Issue和PR，参与社区讨论

## ❓ 遇到问题？

如果在使用过程中遇到问题：

1. 首先查看 [常见问题](./README.md#-常见问题) 部分
2. 搜索GitHub Issues是否有类似问题
3. 提交新的Issue，详细描述你的问题和复现步骤

祝你使用GFD开发愉快！ 🚀
