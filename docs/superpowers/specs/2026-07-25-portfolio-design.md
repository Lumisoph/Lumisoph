# 个人主页设计方案（最终版）

## 概述

基于 Astro + React + Tailwind CSS 的多页面个人作品集网站，支持中英双语和日/夜双主题，温馨亲和风格融合水墨画美学。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Astro 5 |
| UI 库 | React 19（仅交互组件） |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3.4 |
| 内容管理 | Markdown（Astro Content Collections） |
| 国际化 | URL 路由前缀式 `/zh/` `/en/` |
| 音乐播放 | 本地 `<audio>` 元素 + 网易云 LRC 歌词解析 |
| 字体 | Inter（UI）+ Ma Shan Zheng 马山正楷（歌词书法） |
| 部署 | Vercel / GitHub Pages |

## 路由结构

```
/               → 重定向到 /zh/
/zh/            → 中文首页
/zh/projects    → 中文项目页
/zh/blog        → 中文博客列表
/zh/blog/[slug] → 中文文章详情
/zh/photos      → 中文照片墙
/en/            → 英文首页
/en/projects    → 英文项目页
/en/blog        → 英文博客列表
/en/blog/[slug] → 英文文章详情
/en/photos      → 英文照片墙
```

## 目录结构

```
src/
├── pages/
│   ├── index.astro              → 根路径重定向
│   ├── 404.astro                → 自适应语言 404
│   ├── zh/
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── photos.astro
│   └── en/
│       ├── index.astro
│       ├── projects.astro
│       ├── blog/
│       │   ├── index.astro
│       │   └── [...slug].astro
│       └── photos.astro
├── i18n/
│   ├── zh.ts                    → 中文文案字典
│   ├── en.ts                    → 英文文案字典
│   └── utils.ts                 → getI18n / getLangFromPath / switchLang
├── components/
│   ├── Nav.astro                → 全局导航（玻璃态 + 响应式汉堡菜单）
│   ├── Footer.astro             → 页脚（渐变分隔线 + 版权 + 社交链接）
│   ├── Hero.astro               → 首页英雄区（头像光环 + 标语 + CTA）
│   ├── Skills.astro             → 技能标签区（分类徽章）
│   ├── ProjectCard.astro        → 项目卡片
│   ├── BlogCard.astro           → 博客卡片
│   └── PhotoWall.astro          → 照片墙容器
├── react/
│   ├── ThemeToggle.tsx          → 日/夜主题切换
│   ├── LangToggle.tsx           → 语言切换
│   ├── BackgroundEffect.tsx     → 夜间金黄粒子动效
│   ├── MusicEmbed.tsx           → 音乐播放器（悬浮按钮 + 毛玻璃卡片）
│   ├── LyricsBackground.tsx     → 歌词水墨背景（书法字体 + SVG 滤镜）
│   └── PhotoWallMasonry.tsx     → 照片墙瀑布流 + 灯箱
├── content/
│   ├── config.ts                → 内容集合 schema
│   ├── projects/{zh,en}/        → 项目 Markdown（待填充）
│   └── blog/{zh,en}/            → 博客 Markdown（待填充）
├── layouts/
│   └── Layout.astro             → 全局布局（SEO meta + 主题脚本 + 背景图层）
└── styles/
    └── global.css               → Tailwind + CSS 变量主题 + 水墨滤镜
```

## 页面与组件

### 共享组件

- **导航栏**：玻璃态毛玻璃背景，Logo（左），页面链接（首页/项目/博客/照片墙），主题切换 + 语言切换（右）。当前页有发光圆点指示器。移动端汉堡菜单折叠。滚动固定顶部。
- **页脚**：渐变分隔线 + 版权信息 + 社交链接。

### 首页

- **英雄区**：头像（多层光环）+ 标语 + 简介 + CTA 按钮
- **技能标签**：分类徽章式展示（算法与方法 / 开发能力），带微交互悬浮效果
- **背景**：日间 `day.jpg` 铺满 + 磨砂遮罩；夜间 `night.jpg` 铺满 + 金黄粒子动效

### 项目页

- 卡片网格（3列→1列响应式），每张卡片有悬浮上浮 + 发光边框效果
- 数据来自 `content/projects/{zh,en}/` Markdown 文件

### 博客页

- 卡片列表（2列→1列响应式），封面图 + 日期 + 标签 + 摘要
- 文章详情：Markdown 渲染 + Prose 排版
- 数据来自 `content/blog/{zh,en}/` Markdown 文件

### 照片墙

- CSS `columns` 瀑布流布局（桌面 3-4 列，手机 2 列）
- 点击放大灯箱，ESC/点击背景关闭
- 构建时 `readdirSync` 自动扫描 `public/images/photos/`，无需手动配置

### 音乐播放器

- 右下角悬浮音符按钮 + 呼吸光环动画
- 展开后毛玻璃卡片：封面图 + 歌名「南墙小子」+ 歌手「鲜克」
- 可点击进度条 + 时间显示 + 播放/暂停/停止
- 本地 `<audio>` 方案，`beforeunload` 保存进度，跨页面恢复播放位置
- 播放状态通过 `sessionStorage` 持久化

### 歌词背景特效

- Ma Shan Zheng（马山正楷）毛笔书法字体
- SVG 滤镜模拟水墨晕染：`feTurbulence` + `feDisplacementMap` +
  `feGaussianBlur` + `feMerge`
- 两阶段动画：湿润期（墨迹晕开，光晕强烈）→ 墨干期（纹理精细，光晕柔和）
- 竖排书写（`writing-mode: vertical-rl`），左右交替展示
- 当前句：大字 + 逐字浮现 + 水墨特效；下一句：小字淡墨预览
- 宣纸纹理背景
- 播放时显示，暂停/停止即隐藏

## 视觉方案

### 日间模式

| 元素 | 值 |
|------|-----|
| 主色调 | 天蓝 `#4A9ABB` |
| 背景 | 白色基底 `#EDF4F9` + 天蓝渐变遮罩 + `day.jpg` 背景图 |
| 卡片 | 白底 `rgba(255,255,255,0.88)` + 多层次阴影 + 毛玻璃 |
| 文字 | 深蓝灰 `#1A2630` |
| 辅助文字 | `#5C7688` |
| 圆角 | 卡片 16px / 按钮 8px |
| 装饰 | 渐变分隔线、头像多层光环 |

### 夜间模式

| 元素 | 值 |
|------|-----|
| 主色调 | 金黄 `#D4B858` |
| 背景 | 深黑 `#090B0F` + 深色渐变遮罩 + `night.jpg` 背景图 |
| 卡片 | 深黑半透明 `rgba(16,18,24,0.92)` + 金黄微弱边框 |
| 文字 | 暖白 `#EAE5D8` |
| 辅助文字 | `#8A8275` |
| 圆角 | 卡片 16px / 按钮 8px |
| 装饰 | 金黄粒子 Canvas 动效 |

### 阴影系统

| 级别 | 用途 |
|------|------|
| `--shadow-sm` | 默认卡片 |
| `--shadow-md` | 卡片悬浮 |
| `--shadow-lg` | 弹出层 |
| `--shadow-glow` | 发光效果 |

### 字体

- UI：Inter（系统无衬线回退），抗锯齿渲染
- 歌词：Ma Shan Zheng（Google Fonts），毛笔楷书风格，回退楷体

### 过渡与动效

- 通用过渡：`0.35s ease`
- 卡片悬浮：`hover:-translate-y-1.5`
- 标签悬浮：边框高亮
- 导航激活指示器：底部发光圆点
- 按钮微动：`btn-lift` 类（悬浮上浮 + 阴影加深，按下回弹）

## 响应式适配

| 页面 | 桌面端 | 手机端 |
|------|--------|--------|
| 导航栏 | 水平展开全部链接 | 汉堡菜单折叠 |
| 首页英雄区 | 大号头像 + 横向排列 | 头像缩小 + 纵向堆叠 |
| 项目卡片 | 3 列网格 | 单列 |
| 博客卡片 | 2 列网格 | 单列 |
| 照片墙 | 3-4 列瀑布流 | 2 列瀑布流 |
| 歌词 | 大字竖排左右分列 | 缩小字号 |

断点：`md`（768px），使用 Tailwind 响应式类。

## 交互

- **主题切换**：`ThemeToggle` 组件操作 `<html>` 上 `class="dark"`，值存入
  `localStorage`。默认跟随系统 `prefers-color-scheme`
- **语言切换**：路由跳转到对应语言版本，保持当前页面路径
- **音乐跨页面**：`sessionStorage` 保存播放状态和进度，
  `beforeunload` 写入、`useEffect` 恢复，浏览器自动播放策略优雅降级
- **歌词同步**：`music-tick` 自定义事件驱动，`music-pause` 事件控制显隐
- **照片灯箱**：`Escape` 键或点击背景关闭
- **背景粒子**：夜间模式下金黄粒子 Canvas 缓慢浮动

## 外部资源

| 资源 | 用途 |
|------|------|
| Ma Shan Zheng | Google Fonts 毛笔楷书，歌词专用 |
| Inter | 系统 UI 字体（npm `@fontsource/inter`） |

## 构建时自动化

- 照片墙：`readdirSync` 扫描 `public/images/photos/`，构建时生成图片列表
- 内容集合：Astro Content Collections，Markdown 文件自动生成路由

## 用户提供的内容清单

| 项目 | 位置 | 状态 |
|------|------|------|
| 日间背景图 | `public/images/day.jpg` | 已提供 |
| 夜间背景图 | `public/images/night.jpg` | 已提供 |
| 头像 | `public/profile.jpg` | 已提供 |
| 名字 | i18n 字典 | 已填入：Lumisoph |
| 中英标语/介绍 | i18n 字典 | 已填入 |
| 音乐文件 | `public/music/` | 已提供（MP3 + 封面 + LRC） |
| 照片墙图片 | `public/images/photos/` | 已提供，自动扫描 |
| 项目数据 | `content/projects/{zh,en}/` | 待提供 |
| 博客文章 | `content/blog/{zh,en}/` | 待提供 |
| 社交链接 | 各页面 socialLinks 变量 | 待提供 |
