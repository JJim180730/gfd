/**
 * 图数据结构工具
 */
/**
 * 依赖图
 */
export class DependencyGraph {
    nodes = new Map();
    /**
     * 添加节点
     * @param id 节点ID
     * @param data 节点数据
     */
    addNode(id, data) {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, {
                id,
                data,
                dependencies: new Set(),
                dependents: new Set()
            });
        }
    }
    /**
     * 移除节点
     * @param id 节点ID
     */
    removeNode(id) {
        const node = this.nodes.get(id);
        if (!node)
            return;
        // 移除所有依赖关系
        for (const depId of node.dependencies) {
            const depNode = this.nodes.get(depId);
            if (depNode) {
                depNode.dependents.delete(id);
            }
        }
        for (const depId of node.dependents) {
            const depNode = this.nodes.get(depId);
            if (depNode) {
                depNode.dependencies.delete(id);
            }
        }
        this.nodes.delete(id);
    }
    /**
     * 添加依赖
     * @param fromId 依赖源节点ID
     * @param toId 依赖目标节点ID
     */
    addDependency(fromId, toId) {
        if (fromId === toId) {
            throw new Error('不能添加自依赖');
        }
        if (!this.nodes.has(fromId)) {
            throw new Error(`节点 ${fromId} 不存在`);
        }
        if (!this.nodes.has(toId)) {
            throw new Error(`节点 ${toId} 不存在`);
        }
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        fromNode.dependencies.add(toId);
        toNode.dependents.add(fromId);
    }
    /**
     * 移除依赖
     * @param fromId 依赖源节点ID
     * @param toId 依赖目标节点ID
     */
    removeDependency(fromId, toId) {
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        if (fromNode && toNode) {
            fromNode.dependencies.delete(toId);
            toNode.dependents.delete(fromId);
        }
    }
    /**
     * 检查是否存在循环依赖
     * @returns 循环依赖路径，如果不存在则返回 null
     */
    detectCycle() {
        const visited = new Set();
        const recursionStack = new Set();
        const cyclePath = [];
        const dfs = (nodeId) => {
            if (recursionStack.has(nodeId)) {
                cyclePath.push(nodeId);
                return true;
            }
            if (visited.has(nodeId)) {
                return false;
            }
            visited.add(nodeId);
            recursionStack.add(nodeId);
            cyclePath.push(nodeId);
            const node = this.nodes.get(nodeId);
            for (const depId of node.dependencies) {
                if (dfs(depId)) {
                    return true;
                }
            }
            recursionStack.delete(nodeId);
            cyclePath.pop();
            return false;
        };
        for (const nodeId of this.nodes.keys()) {
            if (dfs(nodeId)) {
                // 找到循环的起点
                const cycleStartIndex = cyclePath.indexOf(cyclePath[cyclePath.length - 1]);
                return cyclePath.slice(cycleStartIndex);
            }
        }
        return null;
    }
    /**
     * 拓扑排序
     * @returns 排序后的节点ID列表
     */
    topologicalSort() {
        const cycle = this.detectCycle();
        if (cycle) {
            throw new Error(`检测到循环依赖: ${cycle.join(' -> ')}`);
        }
        const visited = new Set();
        const result = [];
        const dfs = (nodeId) => {
            if (visited.has(nodeId))
                return;
            visited.add(nodeId);
            const node = this.nodes.get(nodeId);
            for (const depId of node.dependencies) {
                dfs(depId);
            }
            result.push(nodeId);
        };
        for (const nodeId of this.nodes.keys()) {
            dfs(nodeId);
        }
        return result;
    }
    /**
     * 获取节点的所有依赖
     * @param nodeId 节点ID
     * @param recursive 是否递归获取，默认 true
     */
    getDependencies(nodeId, recursive = true) {
        const node = this.nodes.get(nodeId);
        if (!node)
            return [];
        const dependencies = new Set(node.dependencies);
        if (recursive) {
            for (const depId of node.dependencies) {
                const subDeps = this.getDependencies(depId, true);
                subDeps.forEach(dep => dependencies.add(dep));
            }
        }
        return Array.from(dependencies);
    }
    /**
     * 获取节点的所有依赖者
     * @param nodeId 节点ID
     * @param recursive 是否递归获取，默认 true
     */
    getDependents(nodeId, recursive = true) {
        const node = this.nodes.get(nodeId);
        if (!node)
            return [];
        const dependents = new Set(node.dependents);
        if (recursive) {
            for (const depId of node.dependents) {
                const subDeps = this.getDependents(depId, true);
                subDeps.forEach(dep => dependents.add(dep));
            }
        }
        return Array.from(dependents);
    }
    /**
     * 检查节点是否存在
     * @param nodeId 节点ID
     */
    hasNode(nodeId) {
        return this.nodes.has(nodeId);
    }
    /**
     * 获取节点数据
     * @param nodeId 节点ID
     */
    getNodeData(nodeId) {
        return this.nodes.get(nodeId)?.data;
    }
    /**
     * 获取所有节点ID
     */
    getNodes() {
        return Array.from(this.nodes.keys());
    }
    /**
     * 清空图
     */
    clear() {
        this.nodes.clear();
    }
    /**
     * 获取节点数量
     */
    size() {
        return this.nodes.size;
    }
}
//# sourceMappingURL=graph.js.map