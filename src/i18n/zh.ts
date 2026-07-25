const zh = {
  site: {
    title: 'Lumisoph - 个人主页',
    description: '欢迎来到 Lumisoph 的个人主页',
  },
  nav: {
    home: '首页',
    projects: '项目',
    blog: '博客',
    photos: '照片墙',
  },
  home: {
    greeting: '你好，我是',
    name: 'Lumisoph',
    tagline: '',
    intro: '',
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
  footer: {
    copyright: '© 2026 Lumisoph. 保留所有权利。',
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
