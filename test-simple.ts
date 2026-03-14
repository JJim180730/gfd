// 简单测试GFD框架基本功能
import { GFD } from './packages/core/src/gfd';
import { Logger } from './packages/logger/src/logger';

// 创建日志实例
const logger = new Logger({
  level: 'debug',
  enableColors: true
});

logger.info('GFD框架测试启动');
logger.debug('调试信息', { foo: 'bar' });
logger.warn('警告信息');
logger.error('错误信息', new Error('测试错误'));

// 创建GFD实例
const gfd = new GFD({
  config: {
    appName: 'GFD Test App',
    version: '1.0.0',
    environment: 'development'
  }
});

// 启动应用
gfd.start().then(() => {
  logger.info('✅ GFD应用启动成功！');
  logger.info('应用名称:', gfd.config.appName);
  logger.info('应用版本:', gfd.config.version);
  logger.info('运行环境:', gfd.config.environment);
  logger.info('🎉 GFD通用开发框架测试通过！');
}).catch(err => {
  logger.error('GFD应用启动失败', err);
});
