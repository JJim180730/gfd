import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import { UserModule } from './modules/user-module';
import { AgentPlugin } from './plugins/agent-plugin';
import { AuditPlugin } from './plugins/audit-plugin';
import { createSmartAssistantAgent } from './agents/smart-assistant-agent';
import { calculatorSkill } from './skills/calculator-skill';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// 加载环境变量
dotenv.config();

const logger = new Logger({
  level: 'info',
  enableColors: true
});

// 创建命令行交互接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function bootstrap() {
  logger.info('='.repeat(70));
  logger.info('🚀 正在启动GFD完整功能演示应用');
  logger.info('='.repeat(70));

  // 初始化GFD实例
  const gfd = new GFD({
    config: {
      appName: 'GFD完整功能演示',
      version: '1.0.0',
      environment: 'development'
    },
    locales: {
      'zh-CN': zhCN,
      'en-US': enUS
    },
    defaultLocale: 'zh-CN'
  });

  // 注册模块
  gfd.registerModule(new UserModule());

  // 安装插件
  gfd.use(new AgentPlugin());
  gfd.use(new AuditPlugin());

  // 全局错误处理
  process.on('unhandledRejection', (err) => {
    logger.error('未处理的异常', err as Error);
  });

  try {
    // 启动应用
    await gfd.start();
    
    logger.info('🎉 GFD应用启动成功！');
    logger.info('');

    // 注册技能
    gfd.api.call('skill:register', calculatorSkill);
    
    // 创建智能助手Agent
    const smartAssistant = createSmartAssistantAgent(gfd);
    gfd.api.call('agent:create', smartAssistant);

    logger.info('✅ 所有模块、插件、技能、Agent 初始化完成');
    logger.info('🌍 当前语言：中文 (zh-CN)');
    logger.info('');
    logger.info('💡 输入 "帮助" 查看可用功能，输入 "exit" 退出程序');
    logger.info('='.repeat(70));
    logger.info('');

    // 启动交互模式
    startInteractiveMode(gfd);

  } catch (err) {
    logger.error('❌ 系统启动失败', err as Error);
    process.exit(1);
  }
}

/**
 * 启动交互模式
 */
function startInteractiveMode(gfd: GFD) {
  rl.question('🙂 请输入您的问题：', async (input) => {
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      logger.info('👋 感谢使用，再见！');
      await gfd.stop();
      rl.close();
      process.exit(0);
    }

    try {
      const response = await gfd.api.call('agent:execute', 'smart-assistant', input);
      logger.info(`🤖 助手回复：${response}`);
    } catch (error) {
      logger.error('❌ 处理请求失败', error as Error);
    }

    logger.info('');
    startInteractiveMode(gfd);
  });
}

bootstrap();
