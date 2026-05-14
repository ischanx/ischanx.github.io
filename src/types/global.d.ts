// 全局类型定义

interface Window {
  // 全局搜索函数
  openGlobalSearch?: () => void;
}

// 扩展 ImportMeta 接口，用于 Astro
interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | boolean | undefined;
  };
} 