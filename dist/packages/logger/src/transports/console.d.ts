import { LogMessage, LogTransport, LogFormatter } from '../types';
/**
 * 控制台传输器
 */
export declare class ConsoleTransport implements LogTransport {
    private formatter;
    constructor(formatter?: LogFormatter);
    log(message: LogMessage): void;
}
//# sourceMappingURL=console.d.ts.map