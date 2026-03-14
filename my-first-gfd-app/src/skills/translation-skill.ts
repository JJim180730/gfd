import type { Skill, SkillContext } from './base-skill';

/**
 * 翻译技能
 */
export const translationSkill: Skill = {
  id: 'translation',
  name: '翻译',
  description: '提供多语言翻译功能',
  parameters: [
    {
      name: 'text',
      type: 'string',
      description: '要翻译的文本',
      required: true
    },
    {
      name: 'from',
      type: 'string',
      description: '源语言，默认为auto自动检测',
      required: false
    },
    {
      name: 'to',
      type: 'string',
      description: '目标语言，默认为zh-CN',
      required: false
    }
  ],

  async execute(context: SkillContext, params: { text: string; from?: string; to?: string }): Promise<any> {
    const { text, from = 'auto', to = 'zh-CN' } = params;
    const { gfd } = context;

    gfd.logger.debug(`执行翻译技能: 文本=${text}, 源语言=${from}, 目标语言=${to}`);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 简单的翻译字典
    const translations: Record<string, Record<string, string>> = {
      'en-zh': {
        'Hello': '你好',
        'Good morning': '早上好',
        'Thank you': '谢谢',
        'How are you?': '你好吗？',
        'What is your name?': '你叫什么名字？'
      },
      'zh-en': {
        '你好': 'Hello',
        '早上好': 'Good morning',
        '谢谢': 'Thank you',
        '你好吗？': 'How are you?',
        '你叫什么名字？': 'What is your name?'
      }
    };

    // 自动检测语言
    const detectedFrom = from === 'auto' ? /[\u4e00-\u9fa5]/.test(text) ? 'zh' : 'en' : from;
    const direction = `${detectedFrom}-${to.replace('-CN', '').replace('-US', '')}`;

    if (translations[direction] && translations[direction][text]) {
      return {
        success: true,
        data: {
          originalText: text,
          translatedText: translations[direction][text],
          from: detectedFrom,
          to
        },
        message: '翻译成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: `抱歉，暂时不支持 "${text}" 的翻译`
      };
    }
  }
};
