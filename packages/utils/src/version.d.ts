/**
 * 版本号处理工具
 */
/**
 * 语义化版本号解析
 */
interface SemVer {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string[];
    build?: string[];
}
/**
 * 解析语义化版本号
 * @param version 版本号字符串
 */
export declare function parseVersion(version: string): SemVer;
/**
 * 比较两个版本号
 * @param v1 版本号1
 * @param v2 版本号2
 * @returns -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
 */
export declare function compareVersions(v1: string, v2: string): -1 | 0 | 1;
/**
 * 检查版本是否满足范围要求
 * @param version 要检查的版本
 * @param range 版本范围，支持 ^1.0.0, ~1.0.0, >=1.0.0 <2.0.0 等格式
 */
export declare function satisfiesVersion(version: string, range: string): boolean;
/**
 * 格式化版本号
 * @param semver 语义化版本对象
 */
export declare function formatVersion(semver: SemVer): string;
/**
 * 增加版本号
 * @param version 原版本号
 * @param type 增加类型: major, minor, patch, prerelease, prepatch, preminor, premajor
 * @param prereleaseIdentifier 预发布标识符，如 alpha, beta, rc
 */
export declare function incrementVersion(version: string, type: 'major' | 'minor' | 'patch' | 'prerelease' | 'prepatch' | 'preminor' | 'premajor', prereleaseIdentifier?: string): string;
export {};
//# sourceMappingURL=version.d.ts.map