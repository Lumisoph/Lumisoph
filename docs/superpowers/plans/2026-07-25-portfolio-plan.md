# 个人主页实现计划

> **对于 agentic workers：** 执行此计划时需要使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans。步骤使用 checkbox (`- [ ]`) 语法跟踪进度。

**目标：** 构建一个基于 Astro + React + Tailwind CSS 的多页面个人作品集网站，支持中英双语、日/夜双主题、手机/电脑双端适配。

**架构：** Astro 处理静态页面和路由，React 负责交互组件（主题切换、语言切换、背景动效、照片墙瀑布流、Spotify 嵌入），内容通过 Markdown 文件管理，URL 路由前缀实现国际化。

**技术栈：** Astro 5、React 19、Tailwind CSS 4、TypeScript、Formspree、Spotify Embed API

## 全局约束

- 所有页面需支持中英双语，通过 `/zh/` `/en/` 路由前缀区分
- 日/夜双主题，默认跟随系统偏好，用户选择存入 localStorage
- 响应式适配，断点 md (768px)
- 温馨亲和风格：天蓝主色调（日间）+ 金黄主色调（夜间），圆角卡片
- 所有文案使用 i18n 字典，禁止硬编码
- 注释和文档使用中文

---

### Task 1: 项目脚手架

**文件：**
- 创建：`package.json`、`astro.config.mjs`、`tsconfig.json`、`tailwind.config.mjs`、`src/styles/global.css`

**产出：** 可运行的 Astro 项目骨架

- [ ] **步骤 1: 初始化 Astro 项目**

```bash
npm create astro@latest . -- --template minimal --typescript strict --skip-houston
```

- [ ] **步骤 2: 安装 React 和 Tailwind 集成**

```bash
npx astro add react
npx astro add tailwind
npm install @fontsource/inter
```

- [ ] **步骤 3: 配置 `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

- [ ] **步骤 4: 配置 `tailwind.config.mjs`**

```js
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#7EC8E3',
        'primary-dark': '#E9C46A',
        'bg-light': '#FFFAF5',
        'bg-dark': '#0D0F13',
        'card-light': '#FFFFFF',
        'card-dark': 'rgba(20, 22, 28, 0.85)',
        'text-light': '#2D1B1E',
        'text-dark': '#F5F0E1',
        accent: '#E76F51',
        'accent-dark': '#F38C79',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
```

- [ ] **步骤 5: 写入 `src/styles/global.css`**

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

@import 'tailwindcss';

:root {
  --color-primary: #7EC8E3;
  --color-accent: #E76F51;
  --color-bg: #FFFAF5;
  --color-card: #FFFFFF;
  --color-card-border: rgba(126, 200, 227, 0.15);
  --color-text: #2D1B1E;
  --color-text-muted: #6B5B5E;
}

.dark {
  --color-primary: #E9C46A;
  --color-accent: #F38C79;
  --color-bg: #0D0F13;
  --color-card: rgba(20, 22, 28, 0.85);
  --color-card-border: rgba(233, 196, 106, 0.2);
  --color-text: #F5F0E1;
  --color-text-muted: #A09888;
}

html {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}
```

- [ ] **步骤 6: 运行构建验证**

```bash
npm run build
```

期望：构建成功，无报错。

- [ ] **步骤 7: 提交**

```bash
git add -A
git commit -m "feat: 初始化 Astro + React + Tailwind 项目脚手架"
```

---

### Task 2: 全局布局与 i18n 系统

**文件：**
- 创建：`src/layouts/Layout.astro`、`src/i18n/zh.ts`、`src/i18n/en.ts`、`src/i18n/utils.ts`

**接口：**
- 产出：`Layout.astro` 接收 `lang: 'zh' | 'en'`、`title: string`、`currentPath: string` props
- 产出：`getI18n(lang)` 返回对应语言的字典对象
- 产出：`type I18nDict = typeof zh`

- [ ] **步骤 1: 创建中文文案字典 `src/i18n/zh.ts`**

```ts
const zh = {
  site: {
    title: '个人主页',
    description: '欢迎来到我的个人主页',
  },
  nav: {
    home: '首页',
    projects: '项目',
    blog: '博客',
    photos: '照片墙',
    contact: '联系',
  },
  home: {
    greeting: '你好，我是',
    name: '你的名字',
    tagline: '一句标语',
    intro: '这是一段自我介绍文字，简要描述你的背景、兴趣和专长。',
    cta: '查看作品',
  },
  projects: {
    title: '我的项目',
    description: '这里是我做过的一些项目',
    viewProject: '查看项目',
    viewDemo: '演示',
  },
  blog: {
    title: '博客',
    description: '分享一些想法和记录',
    readMore: '阅读更多',
    publishedOn: '发布于',
    backToList: '返回列表',
  },
  photos: {
    title: '照片墙',
    description: '记录生活中的美好瞬间',
  },
  contact: {
    title: '联系我',
    description: '有任何问题或合作意向，欢迎联系',
    name: '姓名',
    email: '邮箱',
    message: '留言',
    send: '发送',
    sending: '发送中...',
    success: '发送成功！感谢你的留言。',
    error: '发送失败，请稍后重试。',
  },
  footer: {
    copyright: '© 2026 你的名字. 保留所有权利。',
  },
  theme: {
    light: '日间模式',
    dark: '夜间模式',
  },
  lang: {
    switchTo: 'Switch to English',
  },
  notFound: {
    title: '页面未找到',
    description: '你访问的页面不存在',
    backHome: '返回首页',
  },
} as const;

export default zh;
export type I18nDict = typeof zh;
```

- [ ] **步骤 2: 创建英文文案字典 `src/i18n/en.ts`**

```ts
import type { I18nDict } from './zh';

const en: I18nDict = {
  site: {
    title: 'Personal Homepage',
    description: 'Welcome to my personal homepage',
  },
  nav: {
    home: 'Home',
    projects: 'Projects',
    blog: 'Blog',
    photos: 'Photos',
    contact: 'Contact',
  },
  home: {
    greeting: "Hi, I'm",
    name: 'Your Name',
    tagline: 'A tagline',
    intro: 'A short self-introduction describing your background, interests, and expertise.',
    cta: 'View My Work',
  },
  projects: {
    title: 'My Projects',
    description: 'Here are some projects I have worked on',
    viewProject: 'View Project',
    viewDemo: 'Demo',
  },
  blog: {
    title: 'Blog',
    description: 'Thoughts and notes',
    readMore: 'Read More',
    publishedOn: 'Published on',
    backToList: 'Back to list',
  },
  photos: {
    title: 'Photo Wall',
    description: 'Beautiful moments in life',
  },
  contact: {
    title: 'Contact Me',
    description: 'Have questions or want to collaborate? Feel free to reach out.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    success: 'Message sent successfully! Thank you.',
    error: 'Failed to send. Please try again later.',
  },
  footer: {
    copyright: '© 2026 Your Name. All rights reserved.',
  },
  theme: {
    light: 'Light Mode',
    dark: 'Dark Mode',
  },
  lang: {
    switchTo: '切换到中文',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist',
    backHome: 'Back to Home',
  },
} as const;

export default en;
```

- [ ] **步骤 3: 创建 i18n 工具函数 `src/i18n/utils.ts`**

```ts
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
```

- [ ] **步骤 4: 创建全局布局 `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';

export interface Props {
  lang: 'zh' | 'en';
  title?: string;
  description?: string;
  image?: string;
}

const {
  lang,
  title = '个人主页',
  description = '欢迎来到我的个人主页',
  image = '/images/og-default.png',
} = Astro.props;
---

<!doctype html>
<html lang={lang === 'zh' ? 'zh-CN' : 'en'} dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <script is:inline>
      // 防止页面加载时的主题闪烁
      (function() {
        const saved = localStorage.getItem('theme');
        const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefers)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
    <slot />
  </body>
</html>
```

- [ ] **步骤 5: 验证构建**

```bash
npm run build
```

期望：构建成功。

- [ ] **步骤 6: 提交**

```bash
git add -A
git commit -m "feat: 添加全局布局与 i18n 系统"
```

---

### Task 3: 主题切换与语言切换 React 组件

**文件：**
- 创建：`src/react/ThemeToggle.tsx`、`src/react/LangToggle.tsx`、`src/react/BackgroundEffect.tsx`

**接口：**
- 产出：`<ThemeToggle />` — 无 props，读写 localStorage + class 切换
- 产出：`<LangToggle currentPath: string, currentLang: string />` — 语言切换按钮
- 产出：`<BackgroundEffect />` — 夜间金黄粒子动效，仅在 `.dark` 下激活

- [ ] **步骤 1: 创建 `ThemeToggle.tsx`**

```tsx
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
      className="p-2 rounded-btn transition-colors duration-300 hover:bg-[var(--color-card-border)]"
    >
      {isDark ? (
        <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **步骤 2: 创建 `LangToggle.tsx`**

```tsx
interface Props {
  currentPath: string;
  currentLang: string;
}

export default function LangToggle({ currentPath, currentLang }: Props) {
  const targetLang = currentLang === 'zh' ? 'en' : 'zh';
  const targetPath = currentPath.replace(/^\/(zh|en)/, `/${targetLang}`);

  return (
    <a
      href={targetPath}
      className="px-3 py-1.5 rounded-btn text-sm font-medium transition-colors duration-300
                 border border-[var(--color-card-border)] hover:bg-[var(--color-card-border)]"
    >
      {targetLang === 'zh' ? '中文' : 'EN'}
    </a>
  );
}
```

- [ ] **步骤 3: 创建 `BackgroundEffect.tsx`**

```tsx
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number;
  fadeIn: boolean;
}

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const GOLD = '#E9C46A';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random(),
        fadeIn: Math.random() > 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      if (!isDark) {
        animId = requestAnimationFrame(draw);
        return;
      }

      for (const p of particles) {
        // 淡入淡出
        p.alpha += p.fadeIn ? 0.002 : -0.002;
        if (p.alpha >= 0.8) p.fadeIn = false;
        if (p.alpha <= 0.1) p.fadeIn = true;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = GOLD;
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
```

- [ ] **步骤 4: 验证构建和 React 组件编译**

```bash
npm run build
```

期望：构建成功，无 TypeScript 错误。

- [ ] **步骤 5: 提交**

```bash
git add -A
git commit -m "feat: 添加主题切换、语言切换和背景粒子动效组件"
```

---

### Task 4: 导航栏组件

**文件：**
- 创建：`src/components/Nav.astro`

**接口：**
- 消费：`getI18n(lang)`、`ThemeToggle`、`LangToggle`
- 产出：`<Nav lang: 'zh' | 'en', currentPath: string />`

- [ ] **步骤 1: 创建 `Nav.astro`**

```astro
---
import { getI18n } from '../i18n/utils';
import ThemeToggle from '../react/ThemeToggle';
import LangToggle from '../react/LangToggle';

interface Props {
  lang: 'zh' | 'en';
  currentPath: string;
}

const { lang, currentPath } = Astro.props;
const t = getI18n(lang);

const links = [
  { href: `/${lang}/`, label: t.nav.home },
  { href: `/${lang}/projects`, label: t.nav.projects },
  { href: `/${lang}/blog`, label: t.nav.blog },
  { href: `/${lang}/photos`, label: t.nav.photos },
  { href: `/${lang}/contact`, label: t.nav.contact },
];

const isActive = (href: string) => {
  if (href === `/${lang}/`) return currentPath === `/${lang}/`;
  return currentPath.startsWith(href);
};
---

<nav class="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-card-border)]">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href={`/${lang}/`} class="text-lg font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-300">
        {t.home.name}
      </a>

      <!-- 桌面端链接 -->
      <div class="hidden md:flex items-center gap-6">
        {links.map((link) => (
          <a
            href={link.href}
            class={`text-sm transition-colors duration-300 ${
              isActive(link.href)
                ? 'text-[var(--color-primary)] font-medium'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {link.label}
          </a>
        ))}
        <div class="flex items-center gap-2">
          <ThemeToggle client:load />
          <LangToggle client:load currentPath={currentPath} currentLang={lang} />
        </div>
      </div>

      <!-- 移动端汉堡按钮 -->
      <div class="md:hidden flex items-center gap-2">
        <ThemeToggle client:load />
        <LangToggle client:load currentPath={currentPath} currentLang={lang} />
        <button
          id="hamburger"
          class="p-2 rounded-btn hover:bg-[var(--color-card-border)] transition-colors duration-300"
          aria-label="菜单"
          onclick="document.getElementById('mobile-menu')?.classList.toggle('hidden')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <div class="flex flex-col gap-2">
        {links.map((link) => (
          <a
            href={link.href}
            class={`px-3 py-2 rounded-btn text-sm transition-colors duration-300 ${
              isActive(link.href)
                ? 'bg-[var(--color-card-border)] text-[var(--color-primary)] font-medium'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-card-border)]'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </div>
</nav>
```

- [ ] **步骤 2: 验证构建**

```bash
npm run build
```

- [ ] **步骤 3: 提交**

```bash
git add -A
git commit -m "feat: 添加导航栏组件（响应式 + 主题/语言切换）"
```

---

### Task 5: 根路径重定向与首页框架

**文件：**
- 创建：`src/pages/index.astro`、`src/pages/zh/index.astro`、`src/pages/en/index.astro`、`src/components/Hero.astro`
- 创建：`public/images/` 占位目录

**接口：**
- 消费：`Layout`、`Nav`、`getI18n`
- 产出：首页可访问，展示英雄区

- [ ] **步骤 1: 创建根重定向 `src/pages/index.astro`**

```astro
---
// 重定向到默认中文首页
return Astro.redirect('/zh/', 302);
---
```

- [ ] **步骤 2: 创建 `src/components/Hero.astro`**

```astro
---
import { getLangFromPath } from '../i18n/utils';
import { getI18n } from '../i18n/utils';

interface Props {
  currentPath: string;
  socialLinks?: { name: string; url: string; icon: string }[];
}

const { currentPath, socialLinks = [] } = Astro.props;
const lang = getLangFromPath(currentPath);
const t = getI18n(lang);

// 平台预设图标 SVG path
const iconPaths: Record<string, string> = {
  github: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  bilibili: 'M16.5 2.5h-9c-3.038 0-5.5 2.462-5.5 5.5v8c0 3.038 2.462 5.5 5.5 5.5h9c3.038 0 5.5-2.462 5.5-5.5V8c0-3.038-2.462-5.5-5.5-5.5zM7.5 8.5a1 1 0 011.707-.707l2.793 2.793 2.793-2.793A1 1 0 0116.5 8.5v7a1 1 0 01-1.707.707L12 13.414l-2.793 2.793A1 1 0 017.5 15.5v-7z',
  email: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
};
---

<section class="min-h-[calc(100vh-4rem)] flex items-center justify-center relative">
  <div class="max-w-4xl mx-auto px-4 py-20 text-center z-10">
    <!-- 头像 -->
    <div class="mb-8 flex justify-center">
      <img
        src="/images/avatar.jpg"
        alt={t.home.name}
        class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-[var(--color-primary)] shadow-lg"
        width="160"
        height="160"
      />
    </div>

    <!-- 问候语 -->
    <p class="text-lg text-[var(--color-text-muted)] mb-2">
      {t.home.greeting}
    </p>

    <!-- 名字 -->
    <h1 class="text-4xl md:text-6xl font-bold mb-4 text-[var(--color-text)]">
      {t.home.name}
    </h1>

    <!-- 标语 -->
    <p class="text-xl md:text-2xl text-[var(--color-primary)] mb-6">
      {t.home.tagline}
    </p>

    <!-- 介绍 -->
    <p class="max-w-2xl mx-auto text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
      {t.home.intro}
    </p>

    <!-- CTA 按钮 -->
    <a
      href={`/${lang}/projects`}
      class="inline-block px-8 py-3 bg-[var(--color-primary)] text-white font-medium
             rounded-btn transition-all duration-300 hover:opacity-90 hover:shadow-lg
             hover:-translate-y-0.5 active:translate-y-0"
    >
      {t.home.cta}
    </a>

    <!-- 社交链接 -->
    {
      socialLinks.length > 0 && (
        <div class="flex justify-center gap-4 mt-10">
          {socialLinks.map((link) => (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              class="w-10 h-10 flex items-center justify-center rounded-full
                     text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
                     hover:bg-[var(--color-card-border)] transition-colors duration-300"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox={iconPaths[link.icon] ? '0 0 24 24' : undefined}>
                {iconPaths[link.icon] && <path d={iconPaths[link.icon]} />}
              </svg>
            </a>
          ))}
        </div>
      )
    }
  </div>
</section>
```

- [ ] **步骤 3: 创建 `src/pages/zh/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Hero from '../../components/Hero.astro';
import BackgroundEffect from '../../react/BackgroundEffect';
import { getI18n } from '../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);
const currentPath = '/zh/';

const socialLinks = [
  // 用户后续提供实际链接
];
---

<Layout lang={lang} title={t.site.title} description={t.site.description}>
  <Nav lang={lang} currentPath={currentPath} />
  <main>
    <Hero currentPath={currentPath} socialLinks={socialLinks} />
  </main>
  <BackgroundEffect client:load />
</Layout>
```

- [ ] **步骤 4: 创建 `src/pages/en/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Hero from '../../components/Hero.astro';
import BackgroundEffect from '../../react/BackgroundEffect';
import { getI18n } from '../../i18n/utils';

const lang = 'en';
const t = getI18n(lang);
const currentPath = '/en/';

const socialLinks = [
  // 用户后续提供实际链接
];
---

<Layout lang={lang} title={t.site.title} description={t.site.description}>
  <Nav lang={lang} currentPath={currentPath} />
  <main>
    <Hero currentPath={currentPath} socialLinks={socialLinks} />
  </main>
  <BackgroundEffect client:load />
</Layout>
```

- [ ] **步骤 5: 验证首页可用**

```bash
npm run dev
```

访问 `http://localhost:4321/` → 自动重定向到 `/zh/`，显示英雄区。

- [ ] **步骤 6: 提交**

```bash
git add -A
git commit -m "feat: 添加根重定向与首页（英雄区）"
```

---

### Task 6: Logo墙组件

**文件：**
- 创建：`src/components/LogoWall.astro`

**接口：**
- 产出：`<LogoWall logos: { src: string; alt: string }[] />`

- [ ] **步骤 1: 创建 `LogoWall.astro`**

```astro
---
interface Props {
  logos: { src: string; alt: string }[];
  speed?: number; // 秒
}

const { logos, speed = 20 } = Astro.props;
const duration = logos.length * speed;
---

<section class="py-16 overflow-hidden">
  <div class="relative max-w-6xl mx-auto px-4">
    <style>
      @keyframes scroll-logos {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .logo-scroll {
        animation: scroll-logos var(--duration) linear infinite;
        animation-duration: ${duration}s;
      }
      .logo-scroll:hover {
        animation-play-state: paused;
      }
    </style>
    <div class="logo-scroll flex gap-12 items-center whitespace-nowrap w-max">
      {logos.map((logo) => (
        <img
          src={logo.src}
          alt={logo.alt}
          class="h-10 md:h-12 w-auto opacity-50 hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
      ))}
      <!-- 复制一份实现无缝滚动 -->
      {logos.map((logo) => (
        <img
          src={logo.src}
          alt={logo.alt}
          class="h-10 md:h-12 w-auto opacity-50 hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
      ))}
    </div>
  </div>
</section>
```

- [ ] **步骤 2: 将 LogoWall 加入首页，更新 `src/pages/zh/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Hero from '../../components/Hero.astro';
import LogoWall from '../../components/LogoWall.astro';
import BackgroundEffect from '../../react/BackgroundEffect';
import { getI18n } from '../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);
const currentPath = '/zh/';

const socialLinks: { name: string; url: string; icon: string }[] = [];

const logos: { src: string; alt: string }[] = [
  // 用户后续提供
];
---

<Layout lang={lang} title={t.site.title} description={t.site.description}>
  <Nav lang={lang} currentPath={currentPath} />
  <main>
    <Hero currentPath={currentPath} socialLinks={socialLinks} />
    <LogoWall logos={logos} />
  </main>
  <BackgroundEffect client:load />
</Layout>
```

- [ ] **步骤 3: 同步更新 `src/pages/en/index.astro`**（同上结构，lang 为 'en'）

- [ ] **步骤 4: 验证构建**

```bash
npm run build
```

- [ ] **步骤 5: 提交**

```bash
git add -A
git commit -m "feat: 添加 Logo 墙组件并集成到首页"
```

---

### Task 7: 项目页（含内容集合和卡片组件）

**文件：**
- 创建：`src/content/config.ts`、`src/content/projects/zh/demo.md`、`src/content/projects/en/demo.md`
- 创建：`src/components/ProjectCard.astro`、`src/pages/zh/projects.astro`、`src/pages/en/projects.astro`

**接口：**
- 产出：内容集合 `projects`，schema 含 `title`、`description`、`tags`、`github`、`demo`、`order`
- 产出：`<ProjectCard project: CollectionEntry<'projects'>, lang: string />`

- [ ] **步骤 1: 创建内容集合配置 `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    order: z.number().default(0),
    image: z.string().optional(),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
```

- [ ] **步骤 2: 创建示例项目 `src/content/projects/zh/demo.md`**

```md
---
title: 示例项目
description: 这是一个示例项目的简短描述，介绍项目是做什么的。
tags:
  - React
  - TypeScript
  - Tailwind CSS
github: https://github.com/user/repo
demo: https://demo.example.com
order: 1
image: /images/projects/demo.png
---

这里可以写更详细的项目说明，会在详情页展示。
```

- [ ] **步骤 3: 创建示例项目 `src/content/projects/en/demo.md`**

```md
---
title: Demo Project
description: A short description of this demo project and what it does.
tags:
  - React
  - TypeScript
  - Tailwind CSS
github: https://github.com/user/repo
demo: https://demo.example.com
order: 1
image: /images/projects/demo.png
---

More detailed project description goes here, shown on the detail page.
```

- [ ] **步骤 4: 创建 `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { title, description, tags, github, demo } = project.data;
---

<div class="rounded-card bg-[var(--color-card)] border border-[var(--color-card-border)]
            overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
            hover:-translate-y-1">
  {project.data.image && (
    <img src={project.data.image} alt={title} class="w-full h-48 object-cover" loading="lazy" />
  )}
  <div class="p-6">
    <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">{title}</h3>
    <p class="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-3">{description}</p>

    <!-- 技术标签 -->
    {tags.length > 0 && (
      <div class="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span class="px-2 py-0.5 text-xs rounded-full bg-[var(--color-card-border)] text-[var(--color-text-muted)]">
            {tag}
          </span>
        ))}
      </div>
    )}

    <!-- 链接 -->
    <div class="flex gap-3">
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer"
           class="text-sm text-[var(--color-primary)] hover:underline transition-colors duration-300">
          GitHub
        </a>
      )}
      {demo && (
        <a href={demo} target="_blank" rel="noopener noreferrer"
           class="text-sm text-[var(--color-primary)] hover:underline transition-colors duration-300">
          演示
        </a>
      )}
    </div>
  </div>
</div>
```

- [ ] **步骤 5: 创建 `src/pages/zh/projects.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { getI18n } from '../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);
const currentPath = '/zh/projects';

const projects = (await getCollection('projects', ({ id }) => id.startsWith('zh/')))
  .sort((a, b) => a.data.order - b.data.order);
---

<Layout lang={lang} title={`${t.projects.title} - ${t.site.title}`}>
  <Nav lang={lang} currentPath={currentPath} />
  <main class="max-w-6xl mx-auto px-4 py-16">
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-4">{t.projects.title}</h1>
    <p class="text-center text-[var(--color-text-muted)] mb-12">{t.projects.description}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>

    {projects.length === 0 && (
      <p class="text-center text-[var(--color-text-muted)] py-20">暂无项目</p>
    )}
  </main>
</Layout>
```

- [ ] **步骤 6: 创建 `src/pages/en/projects.astro`**（同上结构，lang 改为 'en'，筛选 `en/` 前缀的内容）

- [ ] **步骤 7: 验证构建和内容集合**

```bash
npm run build
```

期望：`/zh/projects` 和 `/en/projects` 页面正常显示。

- [ ] **步骤 8: 提交**

```bash
git add -A
git commit -m "feat: 添加项目页面（内容集合 + 卡片网格）"
```

---

### Task 8: 博客页面（列表 + 文章详情）

**文件：**
- 创建：`src/components/BlogCard.astro`、`src/pages/zh/blog/index.astro`、`src/pages/zh/blog/[...slug].astro`
- 创建：`src/pages/en/blog/index.astro`、`src/pages/en/blog/[...slug].astro`
- 创建：`src/content/blog/zh/demo.md`、`src/content/blog/en/demo.md`

**接口：**
- 消费：`collections.blog` 配置（已在 Task 7 创建）
- 产出：博客列表页 + 文章详情页

- [ ] **步骤 1: 创建中文示例文章 `src/content/blog/zh/demo.md`**

```md
---
title: 示例博客文章
description: 这是一篇示例博客文章的摘要，简要概括文章内容。
date: 2026-07-25
tags:
  - 技术
  - Astro
cover: /images/blog/placeholder.jpg
draft: false
---

## 这是文章正文

这里是文章的主要内容。你可以使用 Markdown 语法编写丰富的内容。

### 代码块示例

```js
console.log('Hello, World!');
```

> 这是一段引用。

文章内容可以自由扩展...
```

- [ ] **步骤 2: 创建英文示例文章 `src/content/blog/en/demo.md`**

```md
---
title: Demo Blog Post
description: A demo blog post summary that briefly describes the content.
date: 2026-07-25
tags:
  - Tech
  - Astro
cover: /images/blog/placeholder.jpg
draft: false
---

## Article Content

This is the main content. Write rich content using Markdown syntax.

### Code Block Example

```js
console.log('Hello, World!');
```

> This is a blockquote.

Feel free to expand...
```

- [ ] **步骤 3: 创建 `src/components/BlogCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
  lang: string;
}

const { post, lang } = Astro.props;
const { title, description, date, tags, cover } = post.data;
const t = {
  readMore: lang === 'zh' ? '阅读更多' : 'Read More',
  publishedOn: lang === 'zh' ? '发布于' : 'Published on',
};

const slug = post.id.replace(/^(zh|en)\//, '');
---

<article class="rounded-card bg-[var(--color-card)] border border-[var(--color-card-border)]
                overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
                hover:-translate-y-1 flex flex-col">
  {cover && (
    <img src={cover} alt={title} class="w-full h-48 object-cover" loading="lazy" />
  )}
  <div class="p-6 flex flex-col flex-1">
    <time class="text-xs text-[var(--color-text-muted)] mb-2">
      {t.publishedOn} {date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
    </time>
    <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">{title}</h3>
    <p class="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-3 flex-1">{description}</p>

    {tags.length > 0 && (
      <div class="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span class="px-2 py-0.5 text-xs rounded-full bg-[var(--color-card-border)] text-[var(--color-text-muted)]">
            {tag}
          </span>
        ))}
      </div>
    )}

    <a href={`/${lang}/blog/${slug}`}
       class="text-sm text-[var(--color-primary)] hover:underline transition-colors duration-300">
      {t.readMore} →
    </a>
  </div>
</article>
```

- [ ] **步骤 4: 创建 `src/pages/zh/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../../layouts/Layout.astro';
import Nav from '../../../components/Nav.astro';
import BlogCard from '../../../components/BlogCard.astro';
import { getI18n } from '../../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);
const currentPath = '/zh/blog';

const posts = (await getCollection('blog', ({ id, data }) =>
  id.startsWith('zh/') && !data.draft
)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<Layout lang={lang} title={`${t.blog.title} - ${t.site.title}`}>
  <Nav lang={lang} currentPath={currentPath} />
  <main class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-4">{t.blog.title}</h1>
    <p class="text-center text-[var(--color-text-muted)] mb-12">{t.blog.description}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <BlogCard post={post} lang={lang} />
      ))}
    </div>

    {posts.length === 0 && (
      <p class="text-center text-[var(--color-text-muted)] py-20">暂无文章</p>
    )}
  </main>
</Layout>
```

- [ ] **步骤 5: 创建 `src/pages/zh/blog/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from '../../../layouts/Layout.astro';
import Nav from '../../../components/Nav.astro';
import { getI18n } from '../../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ id }) => id.startsWith('zh/'));
  return posts.map((post) => ({
    params: { slug: post.id.replace(/^zh\//, '') },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const currentPath = `/zh/blog/${post.id.replace(/^zh\//, '')}`;
---

<Layout lang={lang} title={`${post.data.title} - ${t.site.title}`} description={post.data.description}>
  <Nav lang={lang} currentPath={currentPath} />
  <main class="max-w-3xl mx-auto px-4 py-16">
    <!-- 返回链接 -->
    <a href={`/${lang}/blog`} class="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)]
              hover:text-[var(--color-primary)] transition-colors duration-300 mb-8">
      ← {t.blog.backToList}
    </a>

    <article>
      <!-- 文章头 -->
      <header class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
          {post.data.title}
        </h1>
        <time class="text-sm text-[var(--color-text-muted)]">
          {post.data.date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        {post.data.tags.length > 0 && (
          <div class="flex flex-wrap gap-2 mt-3">
            {post.data.tags.map((tag) => (
              <span class="px-2 py-0.5 text-xs rounded-full bg-[var(--color-card-border)] text-[var(--color-text-muted)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <!-- 文章正文 -->
      <div class="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-[var(--color-text)]
                  prose-p:text-[var(--color-text-muted)]
                  prose-a:text-[var(--color-primary)]
                  prose-code:text-[var(--color-accent)]
                  prose-pre:bg-[var(--color-card)]
                  prose-pre:border prose-pre:border-[var(--color-card-border)]">
        <Content />
      </div>
    </article>
  </main>
</Layout>
```

- [ ] **步骤 6: 创建 `src/pages/en/blog/index.astro` 和 `src/pages/en/blog/[...slug].astro`**（同中文结构，lang 改为 'en'）

- [ ] **步骤 7: 验证**

```bash
npm run build
```

- [ ] **步骤 8: 提交**

```bash
git add -A
git commit -m "feat: 添加博客页面（列表 + 文章详情 + 内容集合）"
```

---

### Task 9: 照片墙页面

**文件：**
- 创建：`src/react/PhotoWallMasonry.tsx`、`src/components/PhotoWall.astro`
- 创建：`src/pages/zh/photos.astro`、`src/pages/en/photos.astro`
- 创建：`public/images/photos/.gitkeep`

**接口：**
- 消费：照片数据从 `public/images/photos/` 读取（运行时通过 fetch 或构建时通过 import.meta.glob）
- 产出：瀑布流照片墙 + 灯箱

- [ ] **步骤 1: 创建 `src/react/PhotoWallMasonry.tsx`**

```tsx
import { useState, useEffect, useCallback } from 'react';

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Props {
  photos: Photo[];
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                   rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="关闭"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={photo.src}
        alt={photo.alt}
        className="max-w-full max-h-[90vh] object-contain rounded-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function PhotoWallMasonry({ photos }: Props) {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columnPhotos: Photo[][] = Array.from({ length: columns }, () => []);
  const columnHeights = Array(columns).fill(0);

  // 贪心分配到最短列
  for (const photo of photos) {
    const shortest = columnHeights.indexOf(Math.min(...columnHeights));
    columnPhotos[shortest].push(photo);
    columnHeights[shortest] += photo.height / photo.width;
  }

  return (
    <>
      <div className="flex gap-4">
        {columnPhotos.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((photo, pi) => (
              <div
                key={pi}
                className="rounded-card overflow-hidden cursor-pointer
                           hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                onClick={() => setActivePhoto(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {activePhoto && (
        <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
      )}
    </>
  );
}
```

- [ ] **步骤 2: 创建 `src/components/PhotoWall.astro`**

```astro
---
import PhotoWallMasonry from '../react/PhotoWallMasonry';

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Props {
  photos: Photo[];
}

const { photos } = Astro.props;

// 无照片时显示占位提示
if (photos.length === 0) {
  return (
    <div class="text-center text-[var(--color-text-muted)] py-20">
      <p>即将更新照片...</p>
    </div>
  );
}
---

<div class="max-w-6xl mx-auto">
  <PhotoWallMasonry client:load photos={photos} />
</div>
```

- [ ] **步骤 3: 创建 `src/pages/zh/photos.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import PhotoWall from '../../components/PhotoWall.astro';
import { getI18n } from '../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);
const currentPath = '/zh/photos';

// 用户后续替换为实际照片数据
const photos: { src: string; alt: string; width: number; height: number }[] = [];
---

<Layout lang={lang} title={`${t.photos.title} - ${t.site.title}`}>
  <Nav lang={lang} currentPath={currentPath} />
  <main class="px-4 py-16">
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-4">{t.photos.title}</h1>
    <p class="text-center text-[var(--color-text-muted)] mb-12">{t.photos.description}</p>
    <PhotoWall photos={photos} />
  </main>
</Layout>
```

- [ ] **步骤 4: 创建 `src/pages/en/photos.astro`**（同上，lang 为 'en'）

- [ ] **步骤 5: 验证构建**

```bash
npm run build
```

- [ ] **步骤 6: 提交**

```bash
git add -A
git commit -m "feat: 添加照片墙页面（瀑布流 + 灯箱）"
```

---

### Task 10: 联系页面

**文件：**
- 创建：`src/components/ContactForm.astro`、`src/pages/zh/contact.astro`、`src/pages/en/contact.astro`

**接口：**
- 产出：`<ContactForm formspreeEndpoint: string, lang: string />` — 用 React 客户端组件处理表单提交

- [ ] **步骤 1: 创建 React 联系表单 `src/react/ContactFormReact.tsx`**

```tsx
import { useState, type FormEvent } from 'react';

interface Props {
  endpoint: string;
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
  };
}

export default function ContactFormReact({ endpoint, labels }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {status === 'success' ? (
        <div className="text-center py-12 rounded-card bg-[var(--color-card)] border border-[var(--color-card-border)]">
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-[var(--color-text)]">{labels.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {labels.name}
            </label>
            <input
              id="name" type="text" name="name" required
              placeholder={labels.namePlaceholder}
              className="w-full px-4 py-2.5 rounded-btn bg-[var(--color-card)] border border-[var(--color-card-border)]
                     text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                     transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {labels.email}
            </label>
            <input
              id="email" type="email" name="email" required
              placeholder={labels.emailPlaceholder}
              className="w-full px-4 py-2.5 rounded-btn bg-[var(--color-card)] border border-[var(--color-card-border)]
                     text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                     transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {labels.message}
            </label>
            <textarea
              id="message" name="message" rows={5} required
              placeholder={labels.messagePlaceholder}
              className="w-full px-4 py-2.5 rounded-btn bg-[var(--color-card)] border border-[var(--color-card-border)]
                     text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                     transition-all duration-300 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 px-6 bg-[var(--color-primary)] text-white font-medium rounded-btn
                   hover:opacity-90 hover:shadow-lg transition-all duration-300
                   disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? labels.sending : labels.send}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">{labels.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
```

- [ ] **步骤 2: 创建 `src/components/ContactForm.astro`**

```astro
---
import ContactFormReact from '../react/ContactFormReact';
import { getI18n } from '../i18n/utils';

interface Props {
  lang: string;
  endpoint?: string;
}

const { lang, endpoint = '' } = Astro.props;
const t = getI18n(lang);

const labels = {
  name: t.contact.name,
  email: t.contact.email,
  message: t.contact.message,
  send: t.contact.send,
  sending: t.contact.sending,
  success: t.contact.success,
  error: t.contact.error,
  namePlaceholder: lang === 'zh' ? '请输入你的姓名' : 'Enter your name',
  emailPlaceholder: lang === 'zh' ? '请输入你的邮箱' : 'Enter your email',
  messagePlaceholder: lang === 'zh' ? '请输入你想说的话...' : 'Enter your message...',
};

const formspreeEndpoint = endpoint || import.meta.env.FORMSPREE_ENDPOINT || '';
---

<ContactFormReact client:load endpoint={formspreeEndpoint} labels={labels} />
```

- [ ] **步骤 3: 创建 `src/pages/zh/contact.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import ContactForm from '../../components/ContactForm.astro';
import { getI18n } from '../../i18n/utils';

const lang = 'zh';
const t = getI18n(lang);
const currentPath = '/zh/contact';
---

<Layout lang={lang} title={`${t.contact.title} - ${t.site.title}`}>
  <Nav lang={lang} currentPath={currentPath} />
  <main class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-4">{t.contact.title}</h1>
    <p class="text-center text-[var(--color-text-muted)] mb-12">{t.contact.description}</p>
    <ContactForm lang={lang} />
  </main>
</Layout>
```

- [ ] **步骤 4: 创建 `src/pages/en/contact.astro`**（同上，lang 为 'en'）

- [ ] **步骤 5: 验证构建**

```bash
npm run build
```

- [ ] **步骤 6: 提交**

```bash
git add -A
git commit -m "feat: 添加联系页面（Formspree 表单）"
```

---

### Task 11: 页脚组件

**文件：**
- 创建：`src/components/Footer.astro`、`src/react/SpotifyEmbed.tsx`
- 修改：所有页面添加 Footer

**接口：**
- 产出：`<Footer lang: string, socialLinks: { name: string; url: string; icon: string }[] />`

- [ ] **步骤 1: 创建 `src/react/SpotifyEmbed.tsx`**

```tsx
import { useState, useEffect } from 'react';

interface Props {
  /** Spotify 专辑/播放列表 ID，例如 "0s6b6gPfvCzBSy0LWSfI5O" */
  albumId?: string;
  /** 嵌入类型: album 或 playlist */
  type?: 'album' | 'playlist';
}

export default function SpotifyEmbed({ albumId, type = 'album' }: Props) {
  if (!albumId) return null;

  return (
    <div className="w-full max-w-sm mx-auto rounded-card overflow-hidden">
      <iframe
        src={`https://open.spotify.com/embed/${type}/${albumId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify 播放器"
        className="rounded-card"
      ></iframe>
    </div>
  );
}
```

- [ ] **步骤 2: 创建 `src/components/Footer.astro`**

```astro
---
import { getI18n } from '../i18n/utils';
import SpotifyEmbed from '../react/SpotifyEmbed';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface Props {
  lang: string;
  socialLinks?: SocialLink[];
  spotifyAlbumId?: string;
  spotifyType?: 'album' | 'playlist';
}

const { lang, socialLinks = [], spotifyAlbumId, spotifyType = 'album' } = Astro.props;
const t = getI18n(lang);
---

<footer class="border-t border-[var(--color-card-border)] mt-auto">
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Spotify 嵌入 -->
    {spotifyAlbumId && (
      <div class="mb-8">
        <SpotifyEmbed client:load albumId={spotifyAlbumId} type={spotifyType} />
      </div>
    )}

    <!-- 社交链接 -->
    {socialLinks.length > 0 && (
      <div class="flex justify-center gap-4 mb-6">
        {socialLinks.map((link) => (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            class="w-10 h-10 flex items-center justify-center rounded-full
                   text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
                   hover:bg-[var(--color-card-border)] transition-colors duration-300"
          >
            <span class="text-sm font-medium">{link.name}</span>
          </a>
        ))}
      </div>
    )}

    <!-- 版权 -->
    <p class="text-center text-sm text-[var(--color-text-muted)]">
      {t.footer.copyright}
    </p>
  </div>
</footer>
```

- [ ] **步骤 3: 将所有页面的 Layout 中添加 Footer**

在每个页面的 `</Layout>` 前添加：
```astro
<Footer lang={lang} socialLinks={socialLinks} />
```

- [ ] **步骤 4: 验证构建**

```bash
npm run build
```

- [ ] **步骤 5: 提交**

```bash
git add -A
git commit -m "feat: 添加页脚组件（版权 + 社交链接 + Spotify 嵌入）"
```

---

### Task 12: 404 页面与环境变量

**文件：**
- 创建：`src/pages/404.astro`、`.env.example`
- 修改：`src/pages/zh/contact.astro`、`src/pages/en/contact.astro`

**接口：**
- 产出：404 页面（根据 URL 自动判断语言）、环境变量模板

- [ ] **步骤 1: 创建 `src/pages/404.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getLangFromPath, getI18n } from '../i18n/utils';

const url = Astro.url?.pathname ?? '';
const lang = getLangFromPath(url) as 'zh' | 'en';
const t = getI18n(lang);
---

<Layout lang={lang} title={t.notFound.title}>
  <main class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
      <p class="text-xl text-[var(--color-text-muted)] mb-8">{t.notFound.description}</p>
      <a href={`/${lang}/`}
         class="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-medium
                rounded-btn hover:opacity-90 hover:shadow-lg transition-all duration-300">
        {t.notFound.backHome}
      </a>
    </div>
  </main>
</Layout>
```

- [ ] **步骤 2: 创建 `.env.example`**

```
# Formspree 表单 endpoint
FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

- [ ] **步骤 3: 验证**

```bash
npm run build
```

- [ ] **步骤 4: 提交**

```bash
git add -A
git commit -m "feat: 添加 404 页面与环境变量配置"
```

---

### Task 13: 最终整合 — 配置文件与部署

**文件：**
- 修改：`src/i18n/zh.ts`、`src/i18n/en.ts`（填入用户实际信息）
- 修改：`astro.config.mjs`（站点 URL）
- 创建：`.gitignore` 补充

- [ ] **步骤 1: 确保 `.gitignore` 完整**

确认包含：
```
node_modules/
dist/
.env
.DS_Store
```

- [ ] **步骤 2: 更新 astro.config.mjs 添加站点 URL**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [react(), tailwind()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

- [ ] **步骤 3: 全量构建验证**

```bash
npm run build
```

检查 `dist/` 目录生成的所有页面和资源。

- [ ] **步骤 4: 开发预览验证**

```bash
npm run dev
```

手动检查所有页面和功能：
- `/` → 重定向
- 每个页面的主题切换
- 语言切换
- 移动端汉堡菜单
- 照片墙瀑布流
- 联系表单提交

- [ ] **步骤 5: 提交**

```bash
git add -A
git commit -m "feat: 最终整合 — 配置文件、部署准备"
```

---

## 部署说明

1. 将 `.env.example` 复制为 `.env`，填入 Formspree endpoint
2. 修改 `astro.config.mjs` 中 `site` 为实际域名
3. 修改 `src/i18n/zh.ts` 和 `src/i18n/en.ts` 中个人信息
4. 将头像、背景图、项目图片、Logo、照片放入 `public/images/`
5. 编写实际的项目和博客 Markdown 文件
6. 部署到 Vercel：`npm run build` + 导入 Vercel，或 `npx astro build` + GitHub Pages
