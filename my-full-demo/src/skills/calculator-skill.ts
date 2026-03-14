import type { Skill, SkillContext } from './base-skill';

/**
 * 计算器技能
 * 提供数学计算功能
 */
export const calculatorSkill: Skill = {
  id: 'calculator',
  name: '计算器',
  description: '提供数学计算功能，支持加减乘除、百分比、平方等基本运算',
  parameters: [
    {
      name: 'expression',
      type: 'string',
      description: '要计算的数学表达式，例如："1 + 2 * 3"',
      required: true
    }
  ],

  async execute(context: SkillContext, params: { expression: string }): Promise<any> {
    const { expression } = params;
    const { gfd } = context;

    gfd.logger.debug(`执行计算器技能: 表达式=${expression}`);

    try {
      // 简单的表达式验证，防止恶意代码执行
      if (!/^[\d\s\+\-\*\/\(\)\.%]+$/.test(expression)) {
        return {
          success: false,
          data: null,
          message: '表达式包含非法字符，只允许数字和 +-*/()% 运算符'
        };
      }

      // 计算结果（简单实现，实际项目中应该使用更安全的计算库）
      // eslint-disable-next-line no-eval
      const result = eval(expression);

      return {
        success: true,
        data: {
          expression,
          result,
          formatted: `${expression} = ${result}`
        },
        message: '计算成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `计算失败：${(error as Error).message}`
      };
    }
  }
};
