/**
 * 图数据结构工具
 */
/**
 * 依赖图
 */
export declare class DependencyGraph<T = any> {
    private nodes;
    /**
     * 添加节点
     * @param id 节点ID
     * @param data 节点数据
     */
    addNode(id: string, data: T): void;
    /**
     * 移除节点
     * @param id 节点ID
     */
    removeNode(id: string): void;
    /**
     * 添加依赖
     * @param fromId 依赖源节点ID
     * @param toId 依赖目标节点ID
     */
    addDependency(fromId: string, toId: string): void;
    /**
     * 移除依赖
     * @param fromId 依赖源节点ID
     * @param toId 依赖目标节点ID
     */
    removeDependency(fromId: string, toId: string): void;
    /**
     * 检查是否存在循环依赖
     * @returns 循环依赖路径，如果不存在则返回 null
     */
    detectCycle(): string[] | null;
    /**
     * 拓扑排序
     * @returns 排序后的节点ID列表
     */
    topologicalSort(): string[];
    /**
     * 获取节点的所有依赖
     * @param nodeId 节点ID
     * @param recursive 是否递归获取，默认 true
     */
    getDependencies(nodeId: string, recursive?: boolean): string[];
    /**
     * 获取节点的所有依赖者
     * @param nodeId 节点ID
     * @param recursive 是否递归获取，默认 true
     */
    getDependents(nodeId: string, recursive?: boolean): string[];
    /**
     * 检查节点是否存在
     * @param nodeId 节点ID
     */
    hasNode(nodeId: string): boolean;
    /**
     * 获取节点数据
     * @param nodeId 节点ID
     */
    getNodeData(nodeId: string): T | undefined;
    /**
     * 获取所有节点ID
     */
    getNodes(): string[];
    /**
     * 清空图
     */
    clear(): void;
    /**
     * 获取节点数量
     */
    size(): number;
}
//# sourceMappingURL=graph.d.ts.map