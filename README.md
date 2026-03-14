# GFD - General Framework for Development

通用开发框架（General Framework for Development，简称GFD）是一个现代化的Harness开发框架，具备完整的插件系统、多语言支持、模块化架构，以及良好的可扩展性和可维护性。

## ✨ 特性

- 🧩 **插件系统**：完全可扩展的插件架构，支持动态加载/卸载
- 🌐 **多语言支持**：内置i18n国际化支持，轻松扩展新语言
- 📦 **模块化架构**：松耦合的模块设计，便于独立开发和维护
- 🔌 **统一API**：标准化的接口设计，降低学习成本
- 🛡️ **类型安全**：完整的TypeScript类型定义
- 🚀 **高性能**：优化的核心引擎，低 overhead
- 🧪 **可测试性**：内置测试工具和Mock支持
- 🤖 **AI Agent 支持**：原生支持智能Agent开发和技能管理
- 📚 **完整文档**：详尽的开发指南和API参考

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────────┐
│                  Application                    │
├─────────────────────────────────────────────────┤
│  Plugins  │  Modules  │  I18n  │  Configuration │
├─────────────────────────────────────────────────┤
│                  GFD Core Engine                │
├─────────────────────────────────────────────────┤
│  Utilities  │  Logger  │  Event Bus  │  DI Container │
└─────────────────────────────────────────────────┘
```

### 核心概念

1. **核心引擎 (Core Engine)**：框架的心脏，负责管理所有组件的生命周期
2. **插件系统 (Plugin System)**：允许扩展框架功能的动态组件
3. **模块系统 (Module System)**：组织业务逻辑的模块化单元
4. **国际化 (i18n)**：多语言支持层
5. **配置系统 (Configuration)**：统一的配置管理
6. **工具集 (Utilities)**：通用工具函数库
7. **技能系统 (Skill System)**：AI Agent 技能的注册、发现和执行

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- TypeScript >= 5.x
- 包管理器：npm / yarn / pnpm (推荐使用pnpm)

### 安装

#### 方式1：通过npm安装（推荐）
```bash
npm install @gfd/core @gfd/plugin-system @gfd/logger
# 或
yarn add @gfd/core @gfd/plugin-system @gfd/logger
# 或
pnpm add @gfd/core @gfd/plugin-system @gfd/logger
```

#### 方式2：本地源码构建
```bash
# 克隆仓库
git clone https://github.com/your-org/gfd.git
cd gfd

# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 链接到本地npm仓库
pnpm -r link
```

### 第一个GFD应用

#### 步骤1：创建项目结构
```
my-gfd-app/
├── src/
│   ├── main.ts          # 应用入口
│   ├── plugins/         # 自定义插件目录
│   └── locales/         # 国际化文件目录
├── package.json
└── tsconfig.json
```

#### 步骤2：配置package.json
创建`package.json`文件，添加GFD依赖：
```json
{
  "name": "my-gfd-app",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@gfd/core": "^1.0.0",
    "@gfd/logger": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

> 💡 如果你的应用创建在GFD源码的`examples/`目录下（用于框架开发测试），依赖可以使用workspace引用：
> ```json
> "dependencies": {
>   "@gfd/core": "workspace:^",
>   "@gfd/logger": "workspace:^"
> }
> ```

然后安装依赖：
```bash
pnpm install
```

#### 步骤3：配置TypeScript
在`tsconfig.json`中添加以下配置：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": ".",
    "paths": {
      "@gfd/*": ["node_modules/@gfd/*/src"]
    }
  }
  },
  "include": ["src/**/*"]
}
```

> 💡 如果你的应用创建在GFD源码的`examples/`目录下，paths配置需要调整为：
> ```json
> "paths": {
>   "@gfd/*": ["../../packages/*/src"]
> }
> ```
```

#### 步骤4：编写应用入口
创建`src/main.ts`：
```typescript
import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';

// 初始化日志
const logger = new Logger({
  level: 'info',
  enableColors: true
});

// 初始化GFD实例
const gfd = new GFD({
  config: {
    appName: '我的第一个GFD应用',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }
});

// 全局错误处理
process.on('unhandledRejection', (err) => {
  logger.error('未处理的异常', err as Error);
});

// 启动应用
async function bootstrap() {
  try {
    await gfd.start();
    logger.info('🎉 GFD应用启动成功！');
    logger.info(`应用名称: ${gfd.config.appName}`);
    logger.info(`应用版本: ${gfd.config.version}`);
    logger.info(`运行环境: ${gfd.config.environment}`);
  } catch (err) {
    logger.error('❌ GFD应用启动失败', err as Error);
    process.exit(1);
  }
}

bootstrap();
```

#### 步骤5：运行应用
```bash
# 使用tsx运行（推荐）
npx tsx src/main.ts

# 或先编译再运行
tsc
node dist/main.js
```

预期输出：
```
2026-03-13T06:00:00.000Z INFO  [我的第一个GFD应用] 正在启动GFD应用: 我的第一个GFD应用 v1.0.0 {}
2026-03-13T06:00:00.001Z INFO  [我的第一个GFD应用] GFD应用启动成功，运行环境: development {}
2026-03-13T06:00:00.001Z INFO   🎉 GFD应用启动成功！ {}
2026-03-13T06:00:00.001Z INFO   应用名称: 我的第一个GFD应用 {}
2026-03-13T06:00:00.001Z INFO   应用版本: 1.0.0 {}
2026-03-13T06:00:00.001Z INFO   运行环境: development {}
```

## 🤖 AI Agent 开发指南

GFD原生支持智能Agent开发，以下是创建一个Agent的完整步骤：

### 前置配置：大模型
在开发Agent之前，需要先配置大模型。详细配置请参考：
- [大模型配置指南](docs/LLM_CONFIG.md)
- 环境变量配置模板：[.env.example](.env.example)


### 步骤1：创建Agent插件
```typescript
// src/plugins/agent-plugin.ts
import { Plugin, GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';

/**
 * Agent 基础接口
 */
interface Agent {
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
    gfd.api.register('agent:create', this.createAgent.bind(this));
    gfd.api.register('agent:list', this.listAgents.bind(this));
    gfd.api.register('agent:execute', this.executeAgent.bind(this));
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
```

### 步骤2：创建具体的Agent实现
```typescript
// src/agents/customer-service-agent.ts
import type { Agent } from '../plugins/agent-plugin';

export const customerServiceAgent: Agent = {
  id: 'customer-service',
  name: '智能客服',
  description: '处理客户咨询和问题解答',
  systemPrompt: '你是一个专业的客服人员，友好、耐心地回答用户的问题。',
  skills: ['faq', 'order-query', 'return-goods'],
  
  async execute(input: string, context?: Record<string, any>): Promise<string> {
    // 这里可以集成真实的LLM API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (input.includes('订单')) {
      return `您好，您的订单${context?.orderId || 'xxx'}当前状态为已发货，预计3天内送达。`;
    } else if (input.includes('退货')) {
      return '您好，退货流程如下：1. 提交退货申请 2. 等待审核 3. 寄回商品 4. 退款完成。';
    } else {
      return `您好，很高兴为您服务！您的问题是："${input}"，我会尽快为您解答。`;
    }
  }
};
```

### 步骤3：在应用中使用Agent
```typescript
// src/main.ts
import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import { AgentPlugin } from './plugins/agent-plugin';
import { customerServiceAgent } from './agents/customer-service-agent';
import { weatherSkill, translationSkill } from './skills';

const logger = new Logger({ level: 'info' });

async function bootstrap() {
  const gfd = new GFD({
    config: {
      appName: '智能客服系统',
      version: '1.0.0',
      environment: 'development'
    }
  });

  // 安装Agent插件
  const agentPlugin = new AgentPlugin();
  gfd.use(agentPlugin);

  // 启动应用
  await gfd.start();
  logger.info('🤖 智能客服系统启动成功！');

  // 注册客服Agent
  agentPlugin.createAgent(customerServiceAgent);

  // 测试Agent
  const response1 = await agentPlugin.executeAgent('customer-service', '我的订单什么时候到？', { orderId: 'ORD20260313001' });
  logger.info('客服回复1:', response1);

  const response2 = await agentPlugin.executeAgent('customer-service', '我想退货');
  logger.info('客服回复2:', response2);
}

bootstrap();
```

### 运行Agent应用
```bash
npx tsx src/main.ts
```

预期输出：
```
2026-03-13T06:00:00.000Z INFO   🤖 Agent管理插件已安装 {}
2026-03-13T06:00:00.001Z INFO  [智能客服系统] GFD应用启动成功，运行环境: development {}
2026-03-13T06:00:00.001Z INFO   🤖 智能客服系统启动成功！ {}
2026-03-13T06:00:00.001Z INFO   ✅ 已创建Agent: 智能客服 (customer-service) {}
2026-03-13T06:00:00.002Z INFO   ⚡ 执行Agent: 智能客服 (customer-service) {}
2026-03-13T06:00:01.003Z INFO   ✅ Agent执行完成: 智能客服, 耗时 1001ms {}
2026-03-13T06:00:01.003Z INFO   客服回复1: 您好，您的订单ORD20260313001当前状态为已发货，预计3天内送达。 {}
2026-03-13T06:00:01.003Z INFO   ⚡ 执行Agent: 智能客服 (customer-service) {}
2026-03-13T06:00:02.004Z INFO   ✅ Agent执行完成: 智能客服, 耗时 1001ms {}
2026-03-13T06:00:02.004Z INFO   客服回复2: 您好，退货流程如下：1. 提交退货申请 2. 等待审核 3. 寄回商品 4. 退款完成。 {}
```

## 🧩 插件开发指南

### 创建一个简单插件
```typescript
import { Plugin, GFD } from '@gfd/core';

export class MyPlugin extends Plugin {
  name = 'my-plugin';
  version = '1.0.0';
  description = '我的第一个GFD插件';
  dependencies = ['other-plugin@^1.0.0']; // 可选：声明依赖的其他插件

  async install(gfd: GFD) {
    // 插件安装逻辑
    gfd.logger.info('MyPlugin 已安装');
    
    // 注册API
    gfd.api.register({
      name: 'my-plugin:greet',
      description: '打招呼API',
      parameters: [
        { name: 'name', type: 'string', required: true, description: '姓名' }
      ],
      handler: (name: string) => {
        return `Hello, ${name}!`;
      }
    });
  }

  async start() {
    // 插件启动逻辑
    this.gfd.logger.info('MyPlugin 已启动');
  }

  async stop() {
    // 插件停止逻辑
    this.gfd.logger.info('MyPlugin 已停止');
  }
}
```

### 使用插件
```typescript
import { MyPlugin } from './plugins/my-plugin';

// 安装插件
gfd.use(new MyPlugin());

// 调用插件API
const result = await gfd.api.call('my-plugin:greet', '张三');
console.log(result); // 输出: Hello, 张三!
```

## 📦 模块开发指南

### 创建一个功能模块
```typescript
import { Module, inject } from '@gfd/core';
import { UserService } from './services/user.service';

export class UserModule extends Module {
  name = 'user-module';
  version = '1.0.0';

  @inject()
  private userService: UserService;

  async initialize() {
    // 模块初始化逻辑
    this.logger.info('用户模块初始化完成');
  }

  // 模块方法
  async getUser(id: string) {
    return this.userService.findById(id);
  }
}
```

## 🌐 多语言支持

### 添加翻译文件
```typescript
// src/locales/zh-CN.ts
export default {
  common: {
    welcome: '欢迎使用GFD框架',
    success: '操作成功',
    error: '操作失败'
  },
  user: {
    notFound: '用户不存在'
  }
};
```

### 配置多语言
```typescript
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

const gfd = new GFD({
  config: { /* ... */ },
  locales: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  defaultLocale: 'zh-CN'
});
```

### 使用翻译
```typescript
// 基础使用
gfd.i18n.t('common.welcome'); // 欢迎使用GFD框架
gfd.i18n.t('user.notFound'); // 用户不存在

// 带参数的翻译
gfd.i18n.t('user.greeting', { name: '张三' }); // 你好，张三！

// 切换语言
gfd.i18n.setLocale('en-US');
gfd.i18n.t('common.welcome'); // Welcome to GFD Framework
```

## 🔧 命令行工具

GFD提供了CLI工具来加速开发：

```bash
# 安装CLI
npm install -g @gfd/cli

# 创建新的GFD项目
gfd create my-app

# 生成插件模板
gfd generate plugin my-plugin

# 生成模块模板
gfd generate module user

# 生成Agent模板
gfd generate agent customer-service

# 启动开发服务器
gfd dev

# 构建生产版本
gfd build
```

## 📁 项目结构

```
gfd/
├── packages/
│   ├── core/                 # 核心引擎
│   ├── cli/                  # 命令行工具
│   ├── plugin-system/        # 插件系统
│   ├── i18n/                 # 国际化模块
│   ├── di/                   # 依赖注入容器
│   ├── logger/               # 日志系统
│   ├── event-bus/            # 事件总线
│   ├── config/               # 配置系统
│   ├── utils/                # 工具函数库
│   └── skill-system/         # 技能系统
├── examples/                 # 示例项目
│   ├── simple-app/           # 基础应用示例
│   ├── agent-app/            # AI Agent示例
│   └── skill-system-demo/    # 技能系统演示
├── docs/                     # 详细文档
│   ├── api/                  # API参考
│   ├── guide/                # 开发指南
│   └── tutorials/            # 教程
├── tests/                    # 测试用例
└── README.md
```

## 🔍 常见问题

### Q1：启动应用时提示"reflect-metadata"相关错误？
A：请确保在`tsconfig.json`中开启了以下配置：
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Q2：如何实现插件之间的通信？
A：使用事件总线进行通信：
```typescript
// 插件A中发布事件
gfd.eventBus.emit('user:created', { userId: '123', name: '张三' });

// 插件B中订阅事件
gfd.eventBus.on('user:created', (payload) => {
  console.log('新用户创建:', payload);
});
```

### Q3：如何处理配置文件？
A：GFD支持多种配置方式：
```typescript
const gfd = new GFD({
  config: {
    appName: 'MyApp',
    // 从环境变量读取
    databaseUrl: process.env.DATABASE_URL,
    // 嵌套配置
    server: {
      port: parseInt(process.env.PORT || '3000'),
      host: '0.0.0.0'
    }
  }
});

// 读取配置
console.log(gfd.config.server.port); // 3000
```

### Q4：如何进行性能监控？
A：GFD内置了性能监控：
```typescript
// 监听插件启动耗时
gfd.eventBus.on('plugin:started', (payload) => {
  console.log(`插件${payload.pluginName}启动耗时: ${payload.duration}ms`);
});

// 监听API调用耗时
gfd.eventBus.on('api:called', (payload) => {
  console.log(`API${payload.apiName}调用耗时: ${payload.duration}ms`);
});
```

### Q5：如何部署GFD应用？
A：GFD应用可以像普通Node.js应用一样部署：
```bash
# 构建应用
tsc

# 使用pm2部署
pm2 start dist/main.js --name my-gfd-app

# 或使用Docker部署
docker build -t my-gfd-app .
docker run -p 3000:3000 my-gfd-app
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 💬 社区支持

- GitHub Issues: [提交问题](https://github.com/your-org/gfd/issues)
- Discord: [加入社区](https://discord.gg/gfd)
- 文档站点: [https://gfd.dev](https://gfd.dev)
