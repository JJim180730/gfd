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
export function parseVersion(version: string): SemVer {
  const regex = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/;
  
  const match = version.match(regex);
  if (!match) {
    throw new Error(`无效的版本号: ${version}`);
  }

  const [, major, minor, patch, prerelease, build] = match;

  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    prerelease: prerelease ? prerelease.split('.') : undefined,
    build: build ? build.split('.') : undefined
  };
}

/**
 * 比较两个版本号
 * @param v1 版本号1
 * @param v2 版本号2
 * @returns -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
 */
export function compareVersions(v1: string, v2: string): -1 | 0 | 1 {
  const semver1 = parseVersion(v1);
  const semver2 = parseVersion(v2);

  // 比较主版本号
  if (semver1.major !== semver2.major) {
    return semver1.major > semver2.major ? 1 : -1;
  }

  // 比较次版本号
  if (semver1.minor !== semver2.minor) {
    return semver1.minor > semver2.minor ? 1 : -1;
  }

  // 比较修订号
  if (semver1.patch !== semver2.patch) {
    return semver1.patch > semver2.patch ? 1 : -1;
  }

  // 比较预发布版本
  const pre1 = semver1.prerelease;
  const pre2 = semver2.prerelease;

  if (pre1 && pre2) {
    const len = Math.max(pre1.length, pre2.length);
    for (let i = 0; i < len; i++) {
      const a = pre1[i];
      const b = pre2[i];

      if (a === undefined) return -1;
      if (b === undefined) return 1;

      const aIsNumber = /^\d+$/.test(a);
      const bIsNumber = /^\d+$/.test(b);

      if (aIsNumber && bIsNumber) {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (numA !== numB) {
          return numA > numB ? 1 : -1;
        }
      } else if (aIsNumber) {
        return -1;
      } else if (bIsNumber) {
        return 1;
      } else if (a !== b) {
        return a > b ? 1 : -1;
      }
    }
  } else if (pre1) {
    return -1;
  } else if (pre2) {
    return 1;
  }

  return 0;
}

/**
 * 检查版本是否满足范围要求
 * @param version 要检查的版本
 * @param range 版本范围，支持 ^1.0.0, ~1.0.0, >=1.0.0 <2.0.0 等格式
 */
export function satisfiesVersion(version: string, range: string): boolean {
  // 移除空格
  range = range.trim();

  // 处理简单范围
  if (range === '*' || range === '' || range === 'latest') {
    return true;
  }

  // 处理 ^ 范围
  if (range.startsWith('^')) {
    const minVersion = range.slice(1);
    const semver = parseVersion(minVersion);
    const maxVersion = `${semver.major + 1}.0.0`;
    return compareVersions(version, minVersion) >= 0 && compareVersions(version, maxVersion) < 0;
  }

  // 处理 ~ 范围
  if (range.startsWith('~')) {
    const minVersion = range.slice(1);
    const semver = parseVersion(minVersion);
    const maxVersion = `${semver.major}.${semver.minor + 1}.0`;
    return compareVersions(version, minVersion) >= 0 && compareVersions(version, maxVersion) < 0;
  }

  // 处理 >= 范围
  if (range.startsWith('>=')) {
    const parts = range.split(' ');
    const minVersion = parts[0].slice(2);
    if (parts.length === 1) {
      return compareVersions(version, minVersion) >= 0;
    }
    // 处理 >=x.x.x <y.y.y
    const maxPart = parts[1];
    if (maxPart.startsWith('<')) {
      const maxVersion = maxPart.slice(1);
      return compareVersions(version, minVersion) >= 0 && compareVersions(version, maxVersion) < 0;
    }
  }

  // 处理 > 范围
  if (range.startsWith('>')) {
    const minVersion = range.slice(1);
    return compareVersions(version, minVersion) > 0;
  }

  // 处理 <= 范围
  if (range.startsWith('<=')) {
    const maxVersion = range.slice(2);
    return compareVersions(version, maxVersion) <= 0;
  }

  // 处理 < 范围
  if (range.startsWith('<')) {
    const maxVersion = range.slice(1);
    return compareVersions(version, maxVersion) < 0;
  }

  // 处理精确匹配
  try {
    return compareVersions(version, range) === 0;
  } catch {
    throw new Error(`不支持的版本范围格式: ${range}`);
  }
}

/**
 * 格式化版本号
 * @param semver 语义化版本对象
 */
export function formatVersion(semver: SemVer): string {
  let version = `${semver.major}.${semver.minor}.${semver.patch}`;
  
  if (semver.prerelease && semver.prerelease.length > 0) {
    version += `-${semver.prerelease.join('.')}`;
  }
  
  if (semver.build && semver.build.length > 0) {
    version += `+${semver.build.join('.')}`;
  }
  
  return version;
}

/**
 * 增加版本号
 * @param version 原版本号
 * @param type 增加类型: major, minor, patch, prerelease, prepatch, preminor, premajor
 * @param prereleaseIdentifier 预发布标识符，如 alpha, beta, rc
 */
export function incrementVersion(
  version: string,
  type: 'major' | 'minor' | 'patch' | 'prerelease' | 'prepatch' | 'preminor' | 'premajor',
  prereleaseIdentifier: string = 'alpha'
): string {
  const semver = parseVersion(version);

  switch (type) {
    case 'major':
      semver.major += 1;
      semver.minor = 0;
      semver.patch = 0;
      semver.prerelease = undefined;
      break;
    case 'premajor':
      semver.major += 1;
      semver.minor = 0;
      semver.patch = 0;
      semver.prerelease = [prereleaseIdentifier, '0'];
      break;
    case 'minor':
      semver.minor += 1;
      semver.patch = 0;
      semver.prerelease = undefined;
      break;
    case 'preminor':
      semver.minor += 1;
      semver.patch = 0;
      semver.prerelease = [prereleaseIdentifier, '0'];
      break;
    case 'patch':
      semver.patch += 1;
      semver.prerelease = undefined;
      break;
    case 'prepatch':
      semver.patch += 1;
      semver.prerelease = [prereleaseIdentifier, '0'];
      break;
    case 'prerelease':
      if (!semver.prerelease) {
        semver.patch += 1;
        semver.prerelease = [prereleaseIdentifier, '0'];
      } else {
        const lastPart = semver.prerelease[semver.prerelease.length - 1];
        if (/^\d+$/.test(lastPart)) {
          semver.prerelease[semver.prerelease.length - 1] = String(parseInt(lastPart, 10) + 1);
        } else {
          semver.prerelease.push('0');
        }
      }
      break;
  }

  return formatVersion(semver);
}
