import type { Agent } from '../plugins/agent-plugin';
import type { GFD } from '@gfd/core';

/**
 * 智能助手Agent
 * 支持用户管理、计算、多语言等功能
 */
export function createSmartAssistantAgent(gfd: GFD): Agent {
  return {
    id: 'smart-assistant',
    name: '智能助手',
    description: '多功能智能助手，支持用户管理、计算、多语言交流',
    systemPrompt: '你是一个 helpful 的智能助手，可以帮用户处理各种问题。',
    skills: ['calculator'],

    async execute(input: string, context?: Record<string, any>): Promise<string> {
      const logger = gfd.logger;
      const i18n = gfd.i18n;
      
      logger.info(`💬 用户输入: ${input}`);

      // 简单的意图识别
      if (input.includes('注册') || input.includes('register')) {
        // 解析用户名和密码
        const usernameMatch = input.match(/用户名[:：]\s*(\w+)/);
        const passwordMatch = input.match(/密码[:：]\s*(\w+)/);
        
        if (usernameMatch && passwordMatch) {
          const username = usernameMatch[1];
          const password = passwordMatch[1];
          
          const result = await gfd.api.call('user:register', {
            username,
            password,
            nickname: username
          });
          
          if (result.success) {
            // 触发用户注册事件
            gfd.eventBus.emit('user:registered', { user: result.user });
            return `🎉 ${i18n.t('user.register.success')}！欢迎您，${result.user.nickname}！`;
          } else {
            return `❌ ${result.message}`;
          }
        } else {
          return '请告诉我您想要注册的用户名和密码，格式：用户名: xxx，密码: xxx';
        }
      } else if (input.includes('登录') || input.includes('login')) {
        const usernameMatch = input.match(/用户名[:：]\s*(\w+)/);
        const passwordMatch = input.match(/密码[:：]\s*(\w+)/);
        
        if (usernameMatch && passwordMatch) {
          const username = usernameMatch[1];
          const password = passwordMatch[1];
          
          const result = await gfd.api.call('user:login', username, password);
          
          if (result.success) {
            // 触发用户登录事件
            gfd.eventBus.emit('user:loggedIn', { user: result.user });
            return `🎉 ${i18n.t('user.login.success')}！欢迎回来，${result.user.nickname}！`;
          } else {
            return `❌ ${result.message}`;
          }
        } else {
          return '请告诉我您的用户名和密码，格式：用户名: xxx，密码: xxx';
        }
      } else if (input.includes('用户信息') || input.includes('user info')) {
        const usernameMatch = input.match(/用户[:：]\s*(\w+)/);
        
        if (usernameMatch) {
          const username = usernameMatch[1];
          const result = await gfd.api.call('user:getInfo', username);
          
          if (result.success) {
            const user = result.user;
            return `📋 用户信息：\n用户名：${user.username}\n昵称：${user.nickname}\n邮箱：${user.email}\n角色：${user.role}\n注册时间：${user.createdAt.toLocaleString()}`;
          } else {
            return `❌ ${result.message}`;
          }
        } else {
          return '请告诉我要查询的用户名，格式：用户: xxx';
        }
      } else if (input.includes('计算') || input.match(/^[\d\s\+\-\*\/\(\)\.%]+$/)) {
        // 提取表达式
        const expression = input.replace(/计算|等于多少|是多少/g, '').trim();
        
        if (!expression) {
          return '请告诉我您要计算的表达式，例如：计算 1 + 2 * 3';
        }
        
        const result = await gfd.api.call('skill:execute', 'calculator', { expression });
        
        if (result.success) {
          return `🧮 ${result.data.formatted}`;
        } else {
          return `❌ ${result.message}`;
        }
      } else if (input.includes('切换语言') || input.includes('switch language')) {
        if (input.includes('英文') || input.includes('English')) {
          gfd.i18n.setLocale('en-US');
          return '🌍 已切换到英文界面 / Switched to English interface';
        } else if (input.includes('中文') || input.includes('Chinese')) {
          gfd.i18n.setLocale('zh-CN');
          return '🌍 已切换到中文界面 / Switched to Chinese interface';
        } else {
          return '请指定要切换的语言：中文 / 英文';
        }
      } else if (input.includes('审计日志') || input.includes('audit log')) {
        const logs = await gfd.api.call('audit:list');
        const recentLogs = logs.slice(0, 5); // 只显示最近5条
        
        if (recentLogs.length === 0) {
          return '📝 暂无审计日志';
        }
        
        return `📝 最近5条审计日志：\n${recentLogs.map((log: any, index: number) => 
          `${index + 1}. [${new Date(log.timestamp).toLocaleString()}] ${log.action} by ${log.userId}`
        ).join('\n')}`;
      } else if (input.includes('帮助') || input.includes('help')) {
        return `📖 我可以帮您做以下事情：
1. 👤 用户管理：注册、登录、查询用户信息
2. 🧮 计算器：进行数学计算
3. 🌍 多语言：切换中英文界面
4. 📝 审计日志：查看操作日志
5. ❓ 帮助：查看使用说明

您可以试试：
- "注册 用户名: test 密码: 123456"
- "登录 用户名: admin 密码: admin123"
- "计算 1 + 2 * 3"
- "切换语言 英文"`;
      } else {
        return `${i18n.t('agent.notUnderstand')}\n您可以输入"帮助"查看我能做的事情。`;
      }
    }
  };
}
