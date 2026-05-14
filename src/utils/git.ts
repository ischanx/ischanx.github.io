import { execSync } from 'child_process';

/**
 * 通过 git 获取文件的最后修改时间
 * @param filePath 文件路径（相对于项目根目录）
 * @returns 最后修改时间的 Date 对象，如果获取失败则返回 null
 */
export function getLastModifiedDateFromGit(filePath: string): Date | null {
  try {
    // 执行 git 命令获取文件最后修改时间
    const result = execSync(
      `git log -1 --format="%at" -- ${filePath}`,
      { encoding: 'utf-8' }
    ).trim();

    if (!result) {
      return null;
    }

    // 将 git 时间戳（秒）转换为毫秒
    const timestamp = parseInt(result, 10) * 1000;
    return new Date(timestamp);
  } catch (error) {
    console.error(`获取文件 ${filePath} 的 git 修改时间失败:`, error);
    return null;
  }
}

/**
 * 通过 git 获取文件的创建时间（第一次提交时间）
 * @param filePath 文件路径（相对于项目根目录）
 * @returns 创建时间的 Date 对象，如果获取失败则返回 null
 */
export function getCreationDateFromGit(filePath: string): Date | null {
  try {
    // 执行 git 命令获取文件首次提交时间
    const result = execSync(
      `git log --follow --format="%at" --reverse -- ${filePath} | head -1`,
      { encoding: 'utf-8' }
    ).trim();

    if (!result) {
      return null;
    }

    // 将 git 时间戳（秒）转换为毫秒
    const timestamp = parseInt(result, 10) * 1000;
    return new Date(timestamp);
  } catch (error) {
    console.error(`获取文件 ${filePath} 的 git 创建时间失败:`, error);
    return null;
  }
} 