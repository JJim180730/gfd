# GFD 技能开发指南

技能（Skill）是GFD Agent能力的扩展，本文档详细介绍如何开发和管理技能。

## 🎯 什么是技能

技能是Agent可以调用的功能性模块，让Agent具备解决特定问题的能力：
- 🔌 可插拔设计，支持动态加载和卸载
- 📦 独立开发、独立测试、独立部署
- 🔒 具备独立的权限控制和资源隔离
- 📊 自带监控和用量统计
- 🔄 支持版本管理和灰度发布

## 🚀 快速创建第一个技能

### 步骤1：技能基础结构
每个技能都遵循统一的目录结构：
```
skills/
└── weather-query/              # 技能ID
    ├── package.json            # 技能元数据和依赖
    ├── src/
    │   └── index.ts            # 技能主文件
    ├── tests/                  # 测试用例
    │   └── index.test.ts
    ├── docs/                   # 文档
    │   └── README.md
    └── manifest.json           # 技能清单
```

### 步骤2：创建技能清单 manifest.json
```json
{
  "id": "weather-query",
  "name": "天气查询",
  "version": "1.0.0",
  "description": "查询全球主要城市的实时天气和预报信息",
  "author": "GFD Team",
  "tags": ["weather", "tools", "query"],
  "category": "life",
  "icon": "☀️",
  
  "requirements": {
    "node": ">=18.0.0",
    "gfd": ">=1.0.0"
  },
  
  "permissions": [
    "network:fetch",
    "storage:read"
  ],
  
  "parameters": [
    {
      "name": "city",
      "type": "string",
      "required": true,
      "description": "城市名称或城市ID",
      "examples": ["北京", "Shanghai", "101010100"]
    },
    {
      "name": "days",
      "type": "number",
      "required": false,
      "default": 1,
      "min": 1,
      "max": 7,
      "description": "预报天数，最多7天"
    },
    {
      "name": "unit",
      "type": "string",
      "required": false,
      "default": "celsius",
      "enum": ["celsius", "fahrenheit"],
      "description": "温度单位"
    }
  ],
  
  "responses": {
    "success": {
      "description": "查询成功",
      "type": "object",
      "properties": {
        "city": { "type": "string", "description": "城市名称" },
        "temperature": { "type": "number", "description": "当前温度" },
        "weather": { "type": "string", "description": "天气状况" },
        "forecast": { "type": "array", "description": "未来几天预报" }
      }
    },
    "error": {
      "description": "查询失败",
      "type": "object",
      "properties": {
        "code": { "type": "string", "description": "错误码" },
        "message": { "type": "string", "description": "错误信息" }
      }
    }
  },
  
  "configuration": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "天气API密钥",
      "env": "WEATHER_API_KEY"
    },
    "apiEndpoint": {
      "type": "string",
      "required": false,
      "default": "https://api.openweathermap.org/data/2.5",
      "description": "API端点"
    }
  }
}
```

### 步骤3：实现技能逻辑
创建 `src/index.ts`：
```typescript
import { Skill, SkillContext, SkillResponse } from '@gfd/skill-system';
import axios from 'axios';

export default class WeatherQuerySkill extends Skill {
  private apiKey: string;
  private apiEndpoint: string;

  /**
   * 技能初始化
   */
  async initialize(): Promise<void> {
    this.apiKey = this.config.apiKey || process.env.WEATHER_API_KEY;
    this.apiEndpoint = this.config.apiEndpoint || 'https://api.openweathermap.org/data/2.5';
    
    if (!this.apiKey) {
      throw new Error('天气API密钥未配置，请设置WEATHER_API_KEY环境变量');
    }
    
    this.logger.info(`☀️ 天气查询技能初始化完成，API端点: ${this.apiEndpoint}`);
  }

  /**
   * 技能执行入口
   */
  async execute(params: { 
    city: string; 
    days?: number; 
    unit?: 'celsius' | 'fahrenheit' 
  }, context: SkillContext): Promise<SkillResponse> {
    const { city, days = 1, unit = 'celsius' } = params;
    const startTime = Date.now();
    
    try {
      this.logger.info(`查询天气: ${city}, 预报天数: ${days}天, 温度单位: ${unit}`, {
        userId: context.userId,
        sessionId: context.sessionId
      });

      // 1. 验证参数
      this.validateParams(params);

      // 2. 调用天气API
      const weatherData = await this.fetchWeatherData(city, days, unit);

      // 3. 格式化返回结果
      const result = this.formatResponse(weatherData, days, unit);

      // 4. 记录使用统计
      this.recordUsage({
        userId: context.userId,
        city,
        days,
        duration: Date.now() - startTime
      });

      return {
        success: true,
        data: result,
        message: `已为你查询到${city}的天气信息`,
        duration: Date.now() - startTime
      };

    } catch (error) {
      this.logger.error('天气查询失败', error as Error, { city });
      
      return {
        success: false,
        error: {
          code: (error as any).code || 'INTERNAL_ERROR',
          message: (error as Error).message
        },
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * 验证参数
   */
  private validateParams(params: any): void {
    if (!params.city || params.city.trim().length === 0) {
      throw new Error('城市名称不能为空');
    }
    
    if (params.days && (params.days < 1 || params.days > 7)) {
      throw new Error('预报天数只能在1-7天之间');
    }
  }

  /**
   * 调用天气API
   */
  private async fetchWeatherData(city: string, days: number, unit: string): Promise<any> {
    const units = unit === 'celsius' ? 'metric' : 'imperial';
    
    // 调用实时天气API
    const currentResponse = await axios.get(`${this.apiEndpoint}/weather`, {
      params: {
        q: city,
        appid: this.apiKey,
        units,
        lang: 'zh_cn'
      },
      timeout: 5000
    });

    // 如果需要多天预报，调用预报API
    let forecastResponse = null;
    if (days > 1) {
      forecastResponse = await axios.get(`${this.apiEndpoint}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units,
          lang: 'zh_cn',
          cnt: days * 8 // 每天8个时间点
        },
        timeout: 5000
      });
    }

    return {
      current: currentResponse.data,
      forecast: forecastResponse?.data
    };
  }

  /**
   * 格式化返回结果
   */
  private formatResponse(rawData: any, days: number, unit: string): any {
    const { current, forecast } = rawData;
    const unitSymbol = unit === 'celsius' ? '°C' : '°F';

    const result = {
      city: current.name,
      country: current.sys.country,
      current: {
        temperature: `${Math.round(current.main.temp)}${unitSymbol}`,
        feelsLike: `${Math.round(current.main.feels_like)}${unitSymbol}`,
        weather: current.weather[0].description,
        humidity: `${current.main.humidity}%`,
        windSpeed: `${current.wind.speed} m/s`,
        visibility: `${current.visibility / 1000} km`,
        updateTime: new Date(current.dt * 1000).toLocaleString()
      },
      forecast: [] as any[]
    };

    // 处理预报数据
    if (forecast) {
      const dailyForecast = this.processForecastData(forecast.list, days, unitSymbol);
      result.forecast = dailyForecast;
    }

    return result;
  }

  /**
   * 处理预报数据，按天聚合
   */
  private processForecastData(forecastList: any[], days: number, unitSymbol: string): any[] {
    const dailyData: Record<string, any> = {};

    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          tempMin: Infinity,
          tempMax: -Infinity,
          weather: new Set(),
          humidity: []
        };
      }

      const dayData = dailyData[date];
      dayData.tempMin = Math.min(dayData.tempMin, item.main.temp_min);
      dayData.tempMax = Math.max(dayData.tempMax, item.main.temp_max);
      dayData.weather.add(item.weather[0].description);
      dayData.humidity.push(item.main.humidity);
    });

    return Object.values(dailyData).slice(0, days).map(day => ({
      date: day.date,
      temperature: `${Math.round(day.tempMin)}${unitSymbol} ~ ${Math.round(day.tempMax)}${unitSymbol}`,
      weather: Array.from(day.weather).join(' / '),
      avgHumidity: `${Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length)}%`
    }));
  }

  /**
   * 技能销毁钩子
   */
  async destroy(): Promise<void> {
    this.logger.info('天气查询技能已卸载');
  }
}
```

### 步骤4：创建package.json
```json
{
  "name": "@gfd-skill/weather-query",
  "version": "1.0.0",
  "description": "查询全球天气信息的GFD技能",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@gfd/skill-system": "^1.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "gfd": {
    "skill": true,
    "main": "src/index.ts",
    "manifest": "manifest.json"
  }
}
```

## 🧩 技能核心概念

### 技能生命周期
每个技能都有完整的生命周期管理：

```
初始化 → 加载 → 启用 → 执行 → 禁用 → 卸载
```

#### 1. 初始化 (initialize)
```typescript
async initialize(): Promise<void> {
  // 技能加载时执行，用于初始化资源、建立连接等
  // 抛出异常会导致技能加载失败
}
```

#### 2. 执行 (execute)
```typescript
async execute(params: any, context: SkillContext): Promise<SkillResponse> {
  // 技能的核心逻辑，处理用户请求
  // params是调用时传入的参数
  // context包含调用上下文信息（用户ID、会话ID、权限等）
}
```

#### 3. 销毁 (destroy)
```typescript
async destroy(): Promise<void> {
  // 技能卸载时执行，用于释放资源、关闭连接等
}
```

### 技能上下文 (SkillContext)
技能执行时可以获取以下上下文信息：
```typescript
interface SkillContext {
  // 基础信息
  userId: string;              // 用户ID
  sessionId: string;           // 会话ID
  agentId: string;             // 调用技能的Agent ID
  requestId: string;           // 请求ID
  
  // 权限信息
  permissions: string[];       // 用户拥有的权限
  roles: string[];             // 用户角色
  
  // 环境信息
  environment: 'development' | 'test' | 'production';
  locale: string;              // 用户语言
  timezone: string;            // 用户时区
  
  // 追踪信息
  traceId: string;             // 链路追踪ID
  parentSpanId: string;        // 父Span ID
}
```

### 技能响应格式
统一的响应格式：
```typescript
interface SkillResponse {
  success: boolean;            // 是否执行成功
  data?: any;                  // 成功时返回的数据
  message?: string;            // 提示信息
  error?: {                    // 错误信息
    code: string;              // 错误码
    message: string;           // 错误描述
    details?: any;             // 错误详情
  };
  usage?: {                    // 用量统计
    tokens?: number;           // Token消耗
    credits?: number;          // 积分消耗
    duration?: number;         // 执行耗时(ms)
  };
  metadata?: Record<string, any>; // 额外元数据
}
```

## 🔧 技能开发工具

### 技能CLI工具
GFD提供了CLI工具快速创建技能模板：

```bash
# 安装技能开发工具
npm install -g @gfd/skill-cli

# 创建新技能
gfd-skill create weather-query

# 验证技能配置
gfd-skill validate

# 构建技能
gfd-skill build

# 测试技能
gfd-skill test

# 打包技能
gfd-skill pack

# 发布到技能市场
gfd-skill publish
```

### 本地测试技能
创建测试文件 `tests/index.test.ts`：
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WeatherQuerySkill from '../src/index';

describe('天气查询技能测试', () => {
  let skill: WeatherQuerySkill;
  
  beforeEach(() => {
    skill = new WeatherQuerySkill({
      apiKey: 'test-api-key'
    });
  });

  it('应该正确初始化技能', async () => {
    await skill.initialize();
    expect(skill['apiKey']).toBe('test-api-key');
  });

  it('应该验证参数正确性', async () => {
    await expect(skill.execute({ city: '' }, { userId: '123' }))
      .rejects
      .toThrow('城市名称不能为空');
  });

  it('应该正确查询天气', async () => {
    // Mock API响应
    vi.mock('axios', () => ({
      default: {
        get: vi.fn()
          .mockResolvedValueOnce({ data: mockCurrentWeather })
          .mockResolvedValueOnce({ data: mockForecast })
      }
    }));

    const response = await skill.execute({ 
      city: '北京', 
      days: 3 
    }, { userId: '123', sessionId: 'test-session' });

    expect(response.success).toBe(true);
    expect(response.data?.city).toBe('北京');
    expect(response.data?.forecast).toHaveLength(3);
  });
});

const mockCurrentWeather = {
  name: '北京',
  sys: { country: 'CN' },
  main: {
    temp: 15,
    feels_like: 13,
    humidity: 45
  },
  weather: [{ description: '晴天' }],
  wind: { speed: 3.2 },
  visibility: 10000,
  dt: Date.now() / 1000
};

const mockForecast = {
  list: [
    {
      dt: Date.now() / 1000,
      main: { temp_min: 10, temp_max: 20, humidity: 40 },
      weather: [{ description: '晴天' }]
    },
    // 更多预报数据...
  ]
};
```

## 📦 技能管理

### 安装技能
```bash
# 从技能市场安装
gfd skill install @gfd-skill/weather-query

# 从本地安装
gfd skill install ./path/to/skill

# 安装指定版本
gfd skill install @gfd-skill/weather-query@1.0.0
```

### 管理技能
```bash
# 列出已安装的技能
gfd skill list

# 查看技能详情
gfd skill show weather-query

# 启用/禁用技能
gfd skill enable weather-query
gfd skill disable weather-query

# 更新技能
gfd skill update weather-query

# 卸载技能
gfd skill uninstall weather-query
```

### 技能配置
技能配置支持三种方式，优先级从高到低：

1. **调用时动态传入**
```typescript
const result = await skill.execute(params, {
  config: {
    apiKey: 'custom-key'
  }
});
```

2. **环境变量**
```bash
export WEATHER_API_KEY=your-api-key
```

3. **配置文件**
```yaml
# config/skills.yaml
skills:
  weather-query:
    apiKey: "your-api-key"
    apiEndpoint: "https://api.custom.com/weather"
```

## 🔒 技能安全

### 权限控制
技能需要明确声明所需的权限，运行时会进行权限检查：

```json
{
  "permissions": [
    "network:fetch",          // 允许网络请求
    "storage:read",           // 允许读存储
    "storage:write",          // 允许写存储
    "database:query",         // 允许数据库查询
    "system:command"          // 允许执行系统命令（高危权限）
  ]
}
```

### 资源限制
可以为每个技能配置资源限制：
```typescript
const skillConfig = {
  resourceLimits: {
    maxExecutionTime: 10000,  // 最大执行时间10秒
    maxMemory: 128 * 1024 * 1024, // 最大内存128MB
    maxCpu: 50,               // 最大CPU使用率50%
    maxNetworkRequests: 10,   // 每次调用最多10次网络请求
    maxFileSize: 10 * 1024 * 1024 // 最大文件操作10MB
  }
};
```

### 沙箱运行
默认情况下，所有技能都运行在沙箱环境中：
- 无法直接访问宿主系统资源
- 网络请求会经过代理和审计
- 文件系统访问被限制在指定目录
- 系统调用被严格过滤

## 📊 技能监控

### 内置监控指标
GFD自动收集以下技能运行指标：

| 指标名称 | 类型 | 描述 |
|---------|------|------|
| `skill_execution_total` | Counter | 执行总次数 |
| `skill_execution_success_total` | Counter | 成功次数 |
| `skill_execution_error_total` | Counter | 失败次数 |
| `skill_execution_duration_seconds` | Histogram | 执行耗时分布 |
| `skill_tokens_used_total` | Counter | Token总消耗 |
| `skill_credits_used_total` | Counter | 积分总消耗 |

### 自定义指标
技能可以自定义监控指标：
```typescript
// 计数器
this.metrics.increment('api_calls_total', { endpoint: 'weather' });

// 直方图
this.metrics.observe('api_response_time', responseTime, { endpoint: 'weather' });

// 仪表盘
this.metrics.gauge('active_requests', currentRequests, { endpoint: 'weather' });
```

### 告警配置
可以为技能配置告警规则：
```yaml
alerts:
  - name: 技能错误率过高
    expr: sum(rate(skill_execution_error_total{skill="weather-query"}[5m])) / sum(rate(skill_execution_total{skill="weather-query"}[5m])) > 0.1
    for: 1m
    severity: warning
    annotations:
      summary: "天气查询技能错误率超过10%"
      description: "当前错误率: {{ $value | humanizePercentage }}"
```

## 🚀 技能发布

### 发布到私有技能市场
1. 配置私有技能市场地址
```bash
gfd config set skillRegistry https://skill-registry.your-company.com
```

2. 登录技能市场
```bash
gfd skill login
```

3. 发布技能
```bash
gfd skill publish --access private
```

### 版本管理
技能使用语义化版本号：`主版本号.次版本号.修订号`
- 主版本号：不兼容的API变更
- 次版本号：新增功能，向下兼容
- 修订号：bug修复，向下兼容

### 灰度发布
支持按比例灰度发布新版本：
```bash
# 20%流量使用新版本
gfd skill rollout weather-query@2.0.0 --percentage 20

# 查看发布状态
gfd skill rollout status weather-query

# 全量发布
gfd skill rollout promote weather-query@2.0.0

# 回滚
gfd skill rollout revert weather-query
```

## 📚 最佳实践

### 技能开发原则
1. **单一职责**：每个技能只做一件事，保持功能聚焦
2. **无状态设计**：技能本身不保存状态，所有状态通过上下文传递
3. **幂等性**：相同的输入应该产生相同的输出
4. **容错性**：对错误输入和外部服务故障有良好的容错处理
5. **可观测性**：提供完善的日志、指标和追踪信息

### 性能优化建议
1. 缓存频繁使用的数据，减少重复计算和外部调用
2. 异步处理非核心逻辑，缩短响应时间
3. 合理使用批量操作，减少IO次数
4. 避免内存泄漏，及时释放资源
5. 对外部调用设置合理的超时时间

### 安全最佳实践
1. 最小权限原则：只申请必要的权限
2. 对所有输入参数进行严格验证
3. 避免硬编码敏感信息，使用环境变量注入
4. 记录详细的审计日志，方便问题追溯
5. 定期进行安全漏洞扫描

## 📖 示例技能

- [天气查询](../examples/skills/weather-query) - 本文档中的完整示例
- [股票查询](../examples/skills/stock-query) - 查询股票实时行情
- [翻译](../examples/skills/translation) - 多语言文本翻译
- [代码生成](../examples/skills/code-generation) - 代码生成助手
- [数据分析](../examples/skills/data-analysis) - 数据处理和分析

## 🤝 贡献指南

1. Fork 技能模板仓库
2. 创建你的技能分支 (`git checkout -b feature/amazing-skill`)
3. 提交你的更改 (`git commit -m 'Add some amazing skill'`)
4. 推送到分支 (`git push origin feature/amazing-skill`)
5. 创建 Pull Request

## ❓ 常见问题

### Q1：技能可以依赖其他技能吗？
A：可以，在manifest.json中声明依赖：
```json
{
  "dependencies": {
    "other-skill": "^1.0.0"
  }
}
```

### Q2：如何处理长耗时的技能任务？
A：使用异步任务模式：
```typescript
async execute(params: any, context: SkillContext) {
  // 立即返回任务ID
  const taskId = this.taskManager.createTask(params);
  
  // 异步执行任务
  setImmediate(async () => {
    const result = await this.longRunningTask(params);
    this.taskManager.completeTask(taskId, result);
  });
  
  return {
    success: true,
    data: { taskId, status: 'processing' },
    message: '任务正在处理中，请稍后查询结果'
  };
}
```

### Q3：技能如何支持多语言？
A：在manifest.json中配置国际化：
```json
{
  "i18n": {
    "zh-CN": {
      "name": "天气查询",
      "description": "查询天气信息"
    },
    "en-US": {
      "name": "Weather Query",
      "description": "Query weather information"
    }
  }
}
```

更多问题请查看GitHub Issues或参与社区讨论。
