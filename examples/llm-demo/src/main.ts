/**
 * GFD 大模型配置示例
 * 运行前请先复制 .env.example 为 .env 并填写配置
 */
import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const logger = new Logger({
  level: 'info',
  enableColors: true
});

async function bootstrap() {
  const gfd = new GFD({
    config: {
      appName: 'LLM配置示例',
      version: '1.0.0',
      environment: 'development'
    }
  });

  try {
    await gfd.start();
    logger.info('🎉 GFD应用启动成功！');
    logger.info('='.repeat(60));

    // 检查API密钥是否配置
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
      logger.error('❌ 请先在 .env 文件中配置 OPENAI_API_KEY');
      logger.info('📝 配置步骤：');
      logger.info('   1. 复制 .env.example 为 .env');
      logger.info('   2. 填写真实的 OPENAI_API_KEY');
      logger.info('   3. 重新运行本示例');
      process.exit(1);
    }

    logger.info('✅ 大模型配置加载成功');
    logger.info(`🤖 使用模型: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
    logger.info(`🌡️  温度参数: ${process.env.OPENAI_TEMPERATURE || '0.7'}`);
    logger.info(`📝 最大Token: ${process.env.OPENAI_MAX_TOKENS || '4096'}`);

    // 这里可以初始化你的LLM实例，示例：
    // import { OpenAILLM } from '@gfd/llm-openai';
    // const llm = new OpenAILLM({
    //   apiKey: process.env.OPENAI_API_KEY,
    //   model: process.env.OPENAI_MODEL || 'gpt-4o',
    //   temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    //   maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4096'),
    //   baseUrl: process.env.OPENAI_BASE_URL
    // });

    logger.info('='.repeat(60));
    logger.info('✅ 大模型配置准备完成！');
    logger.info('📝 下一步操作：');
    logger.info('   1. 安装对应的LLM适配器包，例如：pnpm add @gfd/llm-openai');
    logger.info('   2. 取消注释代码中的LLM初始化部分');
    logger.info('   3. 配置好 .env 文件中的API密钥');
    logger.info('   4. 重新运行即可测试LLM调用');
    logger.info('📚 详细配置说明请参考 docs/LLM_CONFIG.md');

  } catch (err) {
    logger.error('❌ 系统启动失败', err as Error);
    process.exit(1);
  }
}

bootstrap();
