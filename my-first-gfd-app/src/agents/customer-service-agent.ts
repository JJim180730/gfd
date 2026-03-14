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
