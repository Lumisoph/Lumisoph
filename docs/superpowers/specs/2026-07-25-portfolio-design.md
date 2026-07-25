# 个人主页设计方案

## 概述

基于 Astro + React + Tailwind CSS 的多页面个人作品集网站，支持中英双语和日/夜双主题，温馨亲和风格。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Astro |
| UI 库 | React（仅交互组件） |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 内容管理 | Markdown |
| 国际化 | URL 路由前缀式 `/zh/` `/en/` |
| 表单服务 | Formspree |
| 音乐嵌入 | Spotify Embed API |
| 部署 | Vercel / GitHub Pages |

## 路由结构

```
/               → 重定向到 /zh/
/zh/            → 中文首页
/zh/projects    → 中文项目页
/zh/blog        → 中文博客列表
/zh/blog/[slug] → 中文文章详情
/zh/contact     → 中文联系页
/zh/photos      → 中文照片墙
/en/            → 英文首页
/en/projects    → 英文项目页
/en/blog        → 英文博客列表
/en/blog/[slug] → 英文文章详情
/en/contact     → 英文联系页
/en/photos      → 英文照片墙
```

## 目录结构

```
src/
├── pages/
│   ├── index.astro              → 根路径重定向
│   ├── zh/
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── photos.astro
│   │   └── contact.astro
│   └── en/
│       ├── index.astro
│       ├── projects.astro
│       ├── blog/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── photos.astro
│       └── contact.astro
├── i18n/
│   ├── zh.ts
│   └── en.ts
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── LogoWall.astro
│   ├── ProjectCard.astro
│   ├── BlogCard.astro
│   ├── PhotoWall.astro
│   └── ContactForm.astro
├── react/
│   ├── ThemeToggle.tsx
│   ├── LangToggle.tsx
│   ├── BackgroundEffect.tsx
│   ├── SpotifyEmbed.tsx
│   └── PhotoWallMasonry.tsx
├── content/
│   ├── projects/
│   │   ├── zh/
│   │   └── en/
│   └── blog/
│       ├── zh/
│       └── en/
├── layouts/
│   └── Layout.astro
└── styles/
    └── global.css
```

## 页面与组件

### 共享组件

- **导航栏**：Logo/名字（左），页面链接（首页/项目/博客/照片墙/联系），语言切换按钮，主题切换按钮（右）。移动端折叠为汉堡菜单。滚动固定顶部。
- **页脚**：版权信息 + 社交链接 + Spotify 专辑嵌入播放器

### 首页

- **英雄区**：头像 + 名字 + 标语 + 简短自我介绍 + CTA 按钮（查看作品）+ 社交图标
- **Logo墙**：技术/工具 Logo 自动滚动展示
- **背景**：日间模式用用户提供的背景图；夜间模式用用户提供的背景图 + 金黄粒子动效（BackgroundEffect.tsx）

### 项目页

- 卡片网格布局
- 每张卡片：标题、简述、技术标签、GitHub/演示链接
- 数据来自 `content/projects/{zh,en}/` Markdown 文件

### 博客页

- 卡片列表布局，每张卡片：封面图、标题、日期、摘要
- 文章详情页：Markdown 全文渲染
- 数据来自 `content/blog/{zh,en}/` Markdown 文件

### 照片墙

- 瀑布流/Masonry 网格布局
- 照片存放在 `public/images/photos/`
- React 组件实现瀑布流排列和图片灯箱（点击放大）

### 联系页

- 表单：姓名、邮箱、留言
- 提交到 Formspree，无自建后端

## 视觉方案

### 日间模式

| 元素 | 值 |
|------|-----|
| 主色调 | 天蓝 `#7EC8E3` |
| 背景 | 白色基底 + 天蓝渐变/光晕 |
| 卡片 | 白底 + 柔和阴影 |
| 文字 | 深色 |
| 圆角 | 卡片 12px / 按钮 8px |

### 夜间模式

| 元素 | 值 |
|------|-----|
| 主色调 | 金黄 `#E9C46A` |
| 背景 | 黑色基底 + 金黄斑点/粒子 |
| 卡片 | 深黑半透明 + 金黄微弱边框 |
| 文字 | 暖白 `#F5F0E1` |
| 圆角 | 卡片 12px / 按钮 8px |

### 字体

- 中文：系统默认字体栈
- 英文：Inter

### 过渡

- 通用过渡：`ease-in-out 0.3s`
- 主题切换：平滑过渡

## 响应式适配

| 页面 | 桌面端 | 手机端 |
|------|--------|--------|
| 导航栏 | 水平展开全部链接 | 汉堡菜单折叠 |
| 首页英雄区 | 大号头像 + 横向排列 | 头像缩小 + 纵向堆叠 |
| Logo墙 | 多行滚动 | 减少显示行数 |
| 项目卡片 | 3列网格 | 单列 |
| 博客卡片 | 2-3列网格 | 单列 |
| 照片墙 | 3-4列瀑布流 | 2列瀑布流 |
| 联系表单 | 居中最大宽度 | 全宽 |

断点：`md`（768px），使用 Tailwind 响应式类。

## 交互

- **主题切换**：用户选择存入 `localStorage`，默认跟随系统偏好
- **语言切换**：路由跳转到对应语言版本，保持当前页面路径
- **背景粒子**：夜间模式下，金黄粒子缓慢浮动动效

## 外部服务

| 服务 | 用途 |
|------|------|
| Formspree | 联系表单邮件处理 |
| Spotify Embed API | 页脚专辑播放器 |

## 待用户提供

- 日间模式背景图
- 夜间模式背景图
- 头像图片
- 个人名字/标语/介绍文本（中英文）
- 项目列表（标题、描述、技术标签、链接）（中英文）
- 博客文章（Markdown 格式）（中英文）
- 技术栈 Logo 图片
- 社交链接
- Spotify 专辑/播放列表 ID
- Formspree 表单 endpoint
- 照片墙图片（放入 `public/images/photos/`）
