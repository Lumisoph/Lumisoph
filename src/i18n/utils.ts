import zh from './zh';
import en from './en';
import type { I18nDict } from './zh';

const dicts: Record<string, I18nDict> = { zh, en };

/** 获取指定语言的字典 */
export function getI18n(lang: string): I18nDict {
  return dicts[lang] ?? zh;
}

/** 从 URL 路径提取语言 */
export function getLangFromPath(pathname: string): string {
  const match = pathname.match(/^\/(zh|en)(\/|$)/);
  return match ? match[1] : 'zh';
}

/** 切换语言的 URL */
export function switchLang(currentPath: string, currentLang: string): string {
  const target = currentLang === 'zh' ? 'en' : 'zh';
  return currentPath.replace(/^\/(zh|en)/, `/${target}`);
}

/** 去除路径中的语言前缀 */
export function stripLang(path: string): string {
  return path.replace(/^\/(zh|en)/, '') || '/';
}
