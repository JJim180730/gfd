import { Plugin, GFD } from '@gfd/core';
import { Logger } from '@gfd/logger';

/**
 * 审计日志插件
 * 记录所有关键操作的审计日志
 */
export class AuditPlugin implements Plugin {
  name = 'audit-plugin';
  version = '1.0.0';
  description = '审计日志插件';

  private logger: Logger;
  private auditLogs: AuditLog[] = [];

  async install(gfd: GFD): Promise<void> {
    this.logger = gfd.logger;
    this.logger.info('📝 审计插件已安装');

    // 注册审计日志查询API
    gfd.api.register({
      name: 'audit:list',
      description: '获取审计日志列表',
      handler: this.getAuditLogs.bind(this)
    });

    // 监听所有API调用事件，记录审计日志
    gfd.eventBus.on('api:called', (event: any) => {
      this.logEvent({
        action: event.apiName,
        userId: event.args?.userId || 'system',
        details: {
          args: event.args,
          success: event.success
        },
        timestamp: Date.now()
      });
    });

    // 监听用户相关事件
    gfd.eventBus.on('user:registered', (event: any) => {
      this.logEvent({
        action: 'user:registered',
        userId: event.user.id,
        details: {
          username: event.user.username,
          nickname: event.user.nickname
        },
        timestamp: Date.now()
      });
    });

    gfd.eventBus.on('user:loggedIn', (event: any) => {
      this.logEvent({
        action: 'user:loggedIn',
        userId: event.user.id,
        details: {
          username: event.user.username
        },
        timestamp: Date.now()
      });
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('✅ 审计插件初始化完成');
  }

  async start(): Promise<void> {
    this.logger.info('🚀 审计插件已启动');
  }

  async stop(): Promise<void> {
    this.logger.info('🛑 审计插件已停止');
  }

  /**
   * 记录审计日志
   */
  private logEvent(log: Omit<AuditLog, 'id'>): void {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...log
    };

    this.auditLogs.push(auditLog);
    
    this.logger.debug(`📝 审计日志: ${auditLog.action} by ${auditLog.userId}`);
  }

  /**
   * 获取审计日志列表
   */
  private getAuditLogs(filter?: { action?: string; userId?: string; startTime?: number; endTime?: number }): AuditLog[] {
    let logs = [...this.auditLogs];

    if (filter) {
      if (filter.action) {
        logs = logs.filter(log => log.action === filter.action);
      }
      if (filter.userId) {
        logs = logs.filter(log => log.userId === filter.userId);
      }
      if (filter.startTime) {
        logs = logs.filter(log => log.timestamp >= filter.startTime);
      }
      if (filter.endTime) {
        logs = logs.filter(log => log.timestamp <= filter.endTime);
      }
    }

    // 按时间倒序排列
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }
}

/**
 * 审计日志接口
 */
export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  details: Record<string, any>;
  timestamp: number;
}
