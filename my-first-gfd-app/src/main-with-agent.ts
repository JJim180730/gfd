import { GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';
import { AgentPlugin } from './plugins/agent-plugin';
import { customerServiceAgent } from './agents/customer-service-agent';

const logger = new Logger({ level: 'info' });

async function bootstrap() {
  const gfd = new GFD({
    config: {
      appName: '智能客服系统',
      version: '1.0.0',
      environment: 'development'
    }
  });

  // 安装插件
  gfd.use(new AgentPlugin());

  // 全局错误处理
  process.on('unhandledRejection', (err) => {
    logger.error('未处理的异常', err as Error);
  });

  try {
    await gfd.start();
    logger.info('🎉 智能客服系统启动成功！');
    logger.info('='.repeat(60));

    // 注册客服Agent
    gfd.api.call('agent:create', customerServiceAgent);
    
    // 测试Agent执行
    logger.info('🧪 开始测试智能客服Agent...');
    
    // 测试1：普通问题
    const response1 = await gfd.api.call('agent:execute', 'customer-service', '你好，我有一个问题');
    logger.info(`💬 普通问题回复: ${response1}`);
    
    // 测试2：订单查询
    const response2 = await gfd.api.call('agent:execute', 'customer-service', '我的订单什么时候到？', { orderId: 'ORD20240314001' });
    logger.info(`💬 订单查询回复: ${response2}`);
    
    // 测试3：退货咨询
    const response3 = await gfd.api.call('agent:execute', 'customer-service', '我想退货，应该怎么操作？');
    logger.info(`💬 退货咨询回复: ${response3}`);
    
    logger.info('='.repeat(60));
    logger.info('✅ 所有Agent测试完成！');

  } catch (err) {
    logger.error('❌ 系统启动失败', err as Error);
    process.exit(1);
  }
}

bootstrap();
