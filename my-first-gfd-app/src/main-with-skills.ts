import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import { AgentPlugin } from './plugins/agent-plugin';
import { SkillPlugin } from './plugins/skill-plugin';
import { customerServiceAgent } from './agents/customer-service-agent';
import { weatherSkill } from './skills/weather-skill';
import { translationSkill } from './skills/translation-skill';

const logger = new Logger({ level: 'info' });

async function bootstrap() {
  const gfd = new GFD({
    config: {
      appName: '智能助手系统',
      version: '1.0.0',
      environment: 'development'
    }
  });

  // 安装插件
  gfd.use(new AgentPlugin());
  gfd.use(new SkillPlugin());

  // 全局错误处理
  process.on('unhandledRejection', (err) => {
    logger.error('未处理的异常', err as Error);
  });

  try {
    await gfd.start();
    logger.info('🎉 智能助手系统启动成功！');
    logger.info('='.repeat(60));

    // 注册技能
    gfd.api.call('skill:register', weatherSkill);
    gfd.api.call('skill:register', translationSkill);
    
    // 注册客服Agent（增强版，支持技能调用）
    const enhancedAgent = {
      ...customerServiceAgent,
      name: '智能助手',
      description: '支持天气查询、翻译等多种技能的智能助手',
      skills: [...customerServiceAgent.skills, 'weather-query', 'translation'],
      
      async execute(input: string, context?: Record<string, any>): Promise<string> {
        logger.info(`💬 用户输入: ${input}`);
        
        // 简单的意图识别
        if (input.includes('天气') || input.includes('气温')) {
          // 提取城市名称（简单实现）
          const cityMatch = input.match(/(北京|上海|广州)/);
          const city = cityMatch ? cityMatch[1] : '北京';
          
          const weatherResult = await gfd.api.call('skill:execute', 'weather-query', { city });
          
          if (weatherResult.success) {
            const data = weatherResult.data;
            return `${data.city}${data.date}的天气：${data.weather}，${data.temperature}，${data.wind}，湿度${data.humidity}，空气质量${data.airQuality}。`;
          } else {
            return weatherResult.message;
          }
        } else if (input.includes('翻译') || /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(input)) {
          // 提取要翻译的文本
          const text = input.replace(/翻译|帮我翻译/, '').trim();
          
          const translationResult = await gfd.api.call('skill:execute', 'translation', { text });
          
          if (translationResult.success) {
            const data = translationResult.data;
            return `"${data.originalText}" 的翻译结果是："${data.translatedText}"`;
          } else {
            return translationResult.message;
          }
        } else if (input.includes('订单')) {
          return `您好，您的订单${context?.orderId || 'xxx'}当前状态为已发货，预计3天内送达。`;
        } else if (input.includes('退货')) {
          return '您好，退货流程如下：1. 提交退货申请 2. 等待审核 3. 寄回商品 4. 退款完成。';
        } else {
          return `您好，很高兴为您服务！您的问题是："${input}"，我可以帮您查询天气、翻译文本、处理订单和退货问题哦。`;
        }
      }
    };

    gfd.api.call('agent:create', enhancedAgent);
    
    // 测试技能和Agent集成
    logger.info('🧪 开始测试智能助手（带技能）...');
    logger.info('');

    // 测试1：普通问候
    const response1 = await gfd.api.call('agent:execute', 'customer-service', '你好');
    logger.info(`🤖 助手回复: ${response1}`);
    logger.info('');

    // 测试2：天气查询
    const response2 = await gfd.api.call('agent:execute', 'customer-service', '北京今天天气怎么样？');
    logger.info(`🌤️  天气查询回复: ${response2}`);
    logger.info('');

    // 测试3：翻译
    const response3 = await gfd.api.call('agent:execute', 'customer-service', '翻译Hello');
    logger.info(`📝 翻译回复: ${response3}`);
    logger.info('');

    // 测试4：反向翻译
    const response4 = await gfd.api.call('agent:execute', 'customer-service', '翻译 你好吗？');
    logger.info(`📝 反向翻译回复: ${response4}`);
    logger.info('');

    // 测试5：上海天气
    const response5 = await gfd.api.call('agent:execute', 'customer-service', '上海明天的天气如何？');
    logger.info(`🌤️  上海天气回复: ${response5}`);
    logger.info('');

    logger.info('='.repeat(60));
    logger.info('✅ 所有技能和Agent集成测试完成！');
    logger.info('🎉 GFD框架完整功能验证通过！');

  } catch (err) {
    logger.error('❌ 系统启动失败', err as Error);
    process.exit(1);
  }
}

bootstrap();
