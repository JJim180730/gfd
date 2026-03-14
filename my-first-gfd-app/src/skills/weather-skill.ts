import type { Skill, SkillContext } from './base-skill';

/**
 * 天气查询技能
 */
export const weatherSkill: Skill = {
  id: 'weather-query',
  name: '天气查询',
  description: '查询指定城市的天气信息',
  parameters: [
    {
      name: 'city',
      type: 'string',
      description: '要查询的城市名称',
      required: true
    },
    {
      name: 'date',
      type: 'string',
      description: '查询日期，格式为YYYY-MM-DD，默认为今天',
      required: false
    }
  ],

  async execute(context: SkillContext, params: { city: string; date?: string }): Promise<any> {
    const { city, date = new Date().toISOString().split('T')[0] } = params;
    const { gfd } = context;

    gfd.logger.debug(`执行天气查询技能: 城市=${city}, 日期=${date}`);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟返回天气数据
    const weatherData: Record<string, any> = {
      '北京': {
        city: '北京',
        date,
        temperature: '15°C ~ 25°C',
        weather: '晴转多云',
        wind: '南风2级',
        humidity: '45%',
        airQuality: '优'
      },
      '上海': {
        city: '上海',
        date,
        temperature: '18°C ~ 28°C',
        weather: '小雨',
        wind: '东风3级',
        humidity: '75%',
        airQuality: '良'
      },
      '广州': {
        city: '广州',
        date,
        temperature: '22°C ~ 30°C',
        weather: '雷阵雨',
        wind: '东南风4级',
        humidity: '85%',
        airQuality: '轻度污染'
      }
    };

    if (weatherData[city]) {
      return {
        success: true,
        data: weatherData[city],
        message: `查询成功：${city}${date}的天气信息`
      };
    } else {
      return {
        success: false,
        data: null,
        message: `抱歉，暂时没有${city}的天气信息`
      };
    }
  }
};
