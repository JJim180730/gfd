import { Module as BaseModule, GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';

/**
 * 用户模块
 * 提供用户管理功能：注册、登录、信息查询
 */
export class UserModule extends BaseModule {
  name = 'user-module';
  version = '1.0.0';
  description = '用户管理模块';

  private logger: Logger;
  private users: Map<string, UserInfo> = new Map();

  async initialize(): Promise<void> {
    await super.initialize();
    this.logger = this.gfd.logger;
    this.logger.info('👤 用户模块初始化中...');
    
    // 注册用户管理API
    this.gfd.api.register({
      name: 'user:register',
      description: '用户注册',
      handler: this.register.bind(this)
    });
    
    this.gfd.api.register({
      name: 'user:login',
      description: '用户登录',
      handler: this.login.bind(this)
    });
    
    this.gfd.api.register({
      name: 'user:getInfo',
      description: '获取用户信息',
      handler: this.getUserInfo.bind(this)
    });
    
    // 初始化测试用户
    this.users.set('admin', {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      email: 'admin@gfd.com',
      role: 'admin',
      createdAt: new Date()
    });
    
    this.logger.info('✅ 用户模块初始化完成');
  }

  async start(): Promise<void> {
    this.logger.info('🚀 用户模块已启动');
  }

  async stop(): Promise<void> {
    this.logger.info('🛑 用户模块已停止');
  }

  /**
   * 用户注册
   */
  private register(userData: { username: string; password: string; nickname?: string; email?: string }): { success: boolean; message: string; user?: UserInfo } {
    if (this.users.has(userData.username)) {
      return {
        success: false,
        message: '用户名已存在'
      };
    }

    const user: UserInfo = {
      id: Date.now().toString(),
      username: userData.username,
      nickname: userData.nickname || userData.username,
      email: userData.email || '',
      role: 'user',
      createdAt: new Date()
    };

    this.users.set(userData.username, user);
    
    this.logger.info(`👤 新用户注册: ${user.username} (${user.nickname})`);
    
    return {
      success: true,
      message: '注册成功',
      user
    };
  }

  /**
   * 用户登录
   */
  private login(username: string, password: string): { success: boolean; message: string; token?: string; user?: UserInfo } {
    const user = this.users.get(username);
    
    if (!user) {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }

    // 简单密码验证（实际项目中应该加密存储和验证）
    if (password === '123456' || password === 'admin123') {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      this.logger.info(`👤 用户登录: ${username}`);
      
      return {
        success: true,
        message: '登录成功',
        token,
        user
      };
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }
  }

  /**
   * 获取用户信息
   */
  private getUserInfo(username: string): { success: boolean; message: string; user?: UserInfo } {
    const user = this.users.get(username);
    
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    return {
      success: true,
      message: '获取成功',
      user
    };
  }
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}
