/**
 * 依赖注入类型定义
 */
/**
 * 生命周期类型
 */
export var Lifecycle;
(function (Lifecycle) {
    /**
     * 单例：全局唯一实例
     */
    Lifecycle["SINGLETON"] = "singleton";
    /**
     *  transient：每次注入都创建新实例
     */
    Lifecycle["TRANSIENT"] = "transient";
    /**
     * 请求作用域：每个请求创建一个实例
     */
    Lifecycle["REQUEST"] = "request";
})(Lifecycle || (Lifecycle = {}));
/**
 * 元数据键
 */
export const METADATA_KEYS = {
    INJECTABLE: 'gfd:di:injectable',
    INJECT: 'gfd:di:inject',
    PARAM_TYPES: 'design:paramtypes',
    LIFECYCLE: 'gfd:di:lifecycle'
};
//# sourceMappingURL=types.js.map