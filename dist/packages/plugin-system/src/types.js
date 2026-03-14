/**
 * 插件状态
 */
export var PluginStatus;
(function (PluginStatus) {
    /** 已注册 */
    PluginStatus["REGISTERED"] = "registered";
    /** 已安装 */
    PluginStatus["INSTALLED"] = "installed";
    /** 已初始化 */
    PluginStatus["INITIALIZED"] = "initialized";
    /** 运行中 */
    PluginStatus["RUNNING"] = "running";
    /** 已停止 */
    PluginStatus["STOPPED"] = "stopped";
    /** 已卸载 */
    PluginStatus["UNINSTALLED"] = "uninstalled";
    /** 错误状态 */
    PluginStatus["ERROR"] = "error";
})(PluginStatus || (PluginStatus = {}));
/**
 * 插件错误
 */
export class PluginError extends Error {
    pluginName;
    code;
    cause;
    constructor(message, pluginName, code, cause) {
        super(`[Plugin ${pluginName}] ${message}`);
        this.pluginName = pluginName;
        this.code = code;
        this.cause = cause;
        this.name = 'PluginError';
    }
}
//# sourceMappingURL=types.js.map