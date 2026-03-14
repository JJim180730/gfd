/**
 * 数组工具函数
 */

/**
 * 数组去重
 * @param arr 目标数组
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * 数组扁平化
 * @param arr 目标数组
 * @param depth 深度，默认 Infinity
 */
export function flatten<T>(arr: any[], depth: number = Infinity): T[] {
  return arr.flat(depth);
}

/**
 * 按指定属性分组
 * @param arr 目标数组
 * @param key 分组属性或分组函数
 */
export function groupBy<T>(
  arr: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * 求数组交集
 * @param arrays 数组列表
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((a, b) => a.filter(c => b.includes(c)));
}

/**
 * 求数组并集
 * @param arrays 数组列表
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/**
 * 求数组差集 (a - b)
 * @param a 数组a
 * @param b 数组b
 */
export function difference<T>(a: T[], b: T[]): T[] {
  return a.filter(item => !b.includes(item));
}

/**
 * 数组随机排序
 * @param arr 目标数组
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 按指定大小分块
 * @param arr 目标数组
 * @param size 块大小
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * 获取数组最后一个元素
 * @param arr 目标数组
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * 移除数组中的指定元素
 * @param arr 目标数组
 * @param item 要移除的元素
 */
export function remove<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
