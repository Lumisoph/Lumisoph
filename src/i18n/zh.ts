const zh = {
  site: {
    title: "Lumisoph",
    description: '探索 LLM 智能体如何诊断故障、积累经验，并演化可复用的能力。',
  },
  nav: {
    home: '首页',
    projects: '项目',
    blog: '博客',
    photos: '照片墙',
    contact: '联系',
  },
  home: {
    greeting: "Hi, welcome to my personal website, I'm",
    name: 'Lumisoph',
    tagline: '探索 LLM 智能体如何诊断故障、积累经验，并演化可复用的能力。',
    intro: 'LLM 智能体 · 工具使用 · 记忆 · 能力诊断 · 技能演化',
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
    description: '有问题或想合作？欢迎联系。',
    name: '姓名',
    email: '邮箱',
    message: '消息',
    send: '发送',
    sending: '发送中...',
    success: '消息发送成功！谢谢。',
    error: '发送失败，请稍后重试。',
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
