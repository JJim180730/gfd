import { DefaultFormatter } from '../logger';
/**
 * 控制台传输器
 */
export class ConsoleTransport {
    formatter;
    constructor(formatter) {
        this.formatter = formatter || new DefaultFormatter();
    }
    log(message) {
        const formatted = this.formatter.format(message);
        switch (message.level) {
            case 'debug':
                console.debug(formatted);
                break;
            case 'info':
                console.info(formatted);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            case 'error':
            case 'fatal':
                console.error(formatted);
                break;
            default:
                console.log(formatted);
        }
    }
}
//# sourceMappingURL=console.js.map