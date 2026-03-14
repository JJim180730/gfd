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
