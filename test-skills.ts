// GFD技能系统演示
import { GFD } from './packages/core/src/gfd';
import { Plugin } from './packages/core/src/plugin';
import { Logger } from './packages/logger/src/logger';

const logger = new Logger({ level: 'info' });

/**
 * 基础技能接口
 */
interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  tags: string[];
  execute: (params: any) => Promise<any>;
}

/**
 * 技能管理插件
 */
class SkillManagerPlugin extends Plugin {
  name = 'skill-manager';
  version = '1.0.0';
  description = 'GFD技能管理插件，支持技能的注册、发现、执行和管理';

  private skills: Map<string, Skill> = new Map();

  async install(gfd: GFD) {
    logger.info('🧩 技能管理插件已安装');
    
    // 注册技能管理API
    gfd.api.register('skill:register', this.registerSkill.bind(this));
    gfd.api.register('skill:list', this.listSkills.bind(this));
    gfd.api.register('skill:get', this.getSkill.bind(this));
    gfd.api.register('skill:execute', this.executeSkill.bind(this));
    gfd.api.register('skill:remove', this.removeSkill.bind(this));
    gfd.api.register('skill:search', this.searchSkills.bind(this));
  }

  /**
   * 注册技能
   */
  registerSkill(skill: Skill): void {
    if (this.skills.has(skill.id)) {
      logger.warn(`技能 ${skill.id} 已存在，将被覆盖`);
    }
    this.skills.set(skill.id, skill);
    logger.info(`✅ 已注册技能: ${skill.name} (${skill.id}) v${skill.version}`);
  }

  /**
   * 获取所有技能列表
   */
  listSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * 获取指定技能
   */
  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  /**
   * 执行技能
   */
  async executeSkill(skillId: string, params: any = {}): Promise<any> {
    const skill = this.skills.get(skillId);
    if (!skill) {
      throw new Error(`技能 ${skillId} 不存在`);
    }

    logger.info(`⚡ 执行技能: ${skill.name} (${skillId})`);
    const startTime = Date.now();
    
    try {
      const result = await skill.execute(params);
      const duration = Date.now() - startTime;
      logger.info(`✅ 技能执行完成: ${skill.name}, 耗时 ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`❌ 技能执行失败: ${skill.name}, 耗时 ${duration}ms`, error as Error);
      throw error;
    }
  }

  /**
   * 移除技能
   */
  removeSkill(skillId: string): boolean {
    const skill = this.skills.get(skillId);
    if (skill) {
      this.skills.delete(skillId);
      logger.info(`🗑️  已移除技能: ${skill.name} (${skillId})`);
      return true;
    }
    return false;
  }

  /**
   * 搜索技能
   */
  searchSkills(keyword: string): Skill[] {
    const lowerKeyword = keyword.toLowerCase();
    return Array.from(this.skills.values()).filter(skill => 
      skill.name.toLowerCase().includes(lowerKeyword) ||
      skill.description.toLowerCase().includes(lowerKeyword) ||
      skill.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }
}

// ------------------------------
// 示例技能实现
// ------------------------------

/**
 * 天气查询技能
 */
const weatherSkill: Skill = {
  id: 'weather-query',
  name: '天气查询',
  description: '查询指定城市的实时天气信息',
  version: '1.0.0',
  author: 'GFD Team',
  tags: ['weather', 'tools', 'query'],
  execute: async (params: { city: string }) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      city: params.city,
      temperature: Math.floor(Math.random() * 20) + 10,
      weather: ['晴天', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20)
    };
  }
};

/**
 * 翻译技能
 */
const translationSkill: Skill = {
  id: 'translation',
  name: '文本翻译',
  description: '支持多语言之间的文本翻译',
  version: '1.1.0',
  author: 'GFD Team',
  tags: ['translation', 'language', 'tools'],
  execute: async (params: { text: string; from: string; to: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // 模拟翻译结果
    return {
      originalText: params.text,
      translatedText: `[${params.to}] ${params.text} (已翻译)`,
      from: params.from,
      to: params.to,
      confidence: 0.95
    };
  }
};

/**
 * 代码生成技能
 */
const codeGenerationSkill: Skill = {
  id: 'code-generation',
  name: '代码生成',
  description: '根据需求自动生成代码',
  version: '2.0.0',
  author: 'GFD AI Team',
  tags: ['code', 'ai', 'generation', 'development'],
  execute: async (params: { requirement: string; language: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      requirement: params.requirement,
      language: params.language,
      code: `// 自动生成的${params.language}代码\n// 功能: ${params.requirement}\nfunction hello() {\n  console.log('Hello World');\n}`,
      explanation: '这是一个示例代码实现'
    };
  }
};

// ------------------------------
// 主程序
// ------------------------------

async function main() {
  logger.info('🚀 GFD技能系统演示启动');

  // 创建GFD实例
  const gfd = new GFD({
    config: {
      appName: 'GFD Skill Demo',
      version: '1.0.0',
      environment: 'development'
    }
  });

  // 安装技能管理插件
  const skillManager = new SkillManagerPlugin();
  gfd.use(skillManager);

  // 启动GFD应用
  await gfd.start();
  logger.info('✅ GFD应用启动成功');
  logger.info('');

  // 注册示例技能
  logger.info('📦 注册示例技能...');
  skillManager.registerSkill(weatherSkill);
  skillManager.registerSkill(translationSkill);
  skillManager.registerSkill(codeGenerationSkill);
  logger.info('');

  // 列出所有技能
  logger.info('📋 已注册的技能列表:');
  const skills = skillManager.listSkills();
  skills.forEach((skill: Skill) => {
    logger.info(`  - ${skill.name} (${skill.id}) v${skill.version}`);
    logger.info(`    描述: ${skill.description}`);
    logger.info(`    标签: ${skill.tags.join(', ')}`);
    logger.info('');
  });

  // 搜索技能
  logger.info('🔍 搜索包含"工具"标签的技能:');
  const toolSkills = skillManager.searchSkills('工具');
  toolSkills.forEach((skill: Skill) => {
    logger.info(`  - ${skill.name} (${skill.id})`);
  });
  logger.info('');

  // 执行天气查询技能
  logger.info('🌤️  执行天气查询技能:');
  const weatherResult = await skillManager.executeSkill('weather-query', { city: '北京' });
  logger.info(`  城市: ${weatherResult.city}`);
  logger.info(`  天气: ${weatherResult.weather}`);
  logger.info(`  温度: ${weatherResult.temperature}°C`);
  logger.info(`  湿度: ${weatherResult.humidity}%`);
  logger.info(`  风速: ${weatherResult.windSpeed} km/h`);
  logger.info('');

  // 执行翻译技能
  logger.info('🌐 执行翻译技能:');
  const translationResult = await skillManager.executeSkill('translation', { 
    text: '你好，世界！', 
    from: 'zh-CN', 
    to: 'en-US' 
  });
  logger.info(`  原文: ${translationResult.originalText}`);
  logger.info(`  译文: ${translationResult.translatedText}`);
  logger.info(`  置信度: ${(translationResult.confidence * 100).toFixed(1)}%`);
  logger.info('');

  // 执行代码生成技能
  logger.info('💻 执行代码生成技能:');
  const codeResult = await skillManager.executeSkill('code-generation', { 
    requirement: '实现一个Hello World函数', 
    language: 'TypeScript' 
  });
  logger.info(`  需求: ${codeResult.requirement}`);
  logger.info(`  语言: ${codeResult.language}`);
  logger.info('  生成的代码:');
  logger.info(codeResult.code);
  logger.info('');

  // 移除技能演示
  logger.info('🗑️  移除翻译技能...');
  skillManager.removeSkill('translation');
  
  logger.info('📋 移除后的技能列表:');
  const remainingSkills = skillManager.listSkills();
  remainingSkills.forEach((skill: Skill) => {
    logger.info(`  - ${skill.name} (${skill.id})`);
  });

  logger.info('');
  logger.info('🎉 GFD技能系统演示完成！');
  logger.info('');
  logger.info('💡 技能系统特性:');
  logger.info('  ✅ 技能的动态注册和卸载');
  logger.info('  ✅ 技能的分类和标签管理');
  logger.info('  ✅ 技能的搜索和发现');
  logger.info('  ✅ 统一的技能执行接口');
  logger.info('  ✅ 执行日志和性能统计');
  logger.info('  ✅ 完全插件化，可扩展能力强');
}

main().catch(err => {
  logger.error('演示失败', err);
  process.exit(1);
});
