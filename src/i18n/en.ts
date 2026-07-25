import type { I18nDict } from './zh';

const en: I18nDict = {
  site: {
    title: "Hi, I'm Lumisoph 👋",
    description: 'Exploring how LLM agents diagnose failures, accumulate experience, and evolve reusable capabilities.',
  },
  nav: {
    home: 'Home',
    projects: 'Projects',
    blog: 'Blog',
    photos: 'Photos',
  },
  home: {
    greeting: "Hi, I'm",
    name: 'Lumisoph 👋',
    tagline: 'Exploring how LLM agents diagnose failures, accumulate experience, and evolve reusable capabilities.',
    intro: 'LLM Agents · Tool Use · Memory · Capability Diagnosis · Skill Evolution',
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
  footer: {
    copyright: '© 2026 Lumisoph. All rights reserved.',
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
