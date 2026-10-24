export interface ProjectCardData {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  image?: string;
}

// 要展示的 GitHub 仓库（构建时拉取 README 作为简介）
// description 可选：手动覆盖简介（README 非中文时给中文站写中文简介）
const repos: {
  owner: string;
  repo: string;
  tags: string[];
  demo?: string;
  description?: string;
}[] = [
  {
    owner: 'Lumisoph',
    repo: 'AgentSkillOps',
    tags: ['Python', 'LLM Agent', 'Evaluation'],
    description: '面向 LLM 智能体的可审计技能效用评估与生命周期治理系统，让技能的保留、复测、停用和恢复都有可复核的证据。',
  },
  {
    owner: 'Lumisoph',
    repo: 'enterprise-travel-agent',
    tags: ['Python', 'Multi-Agent', 'RAG'],
    description: '面向企业差旅场景的多智能体助手，支持差旅需求理解、企业制度检索、实时信息查询、用户偏好记忆与行程规划。',
  },
  {
    owner: 'Lumisoph',
    repo: 'Lumisoph',
    tags: ['Astro', 'React', 'Tailwind CSS'],
    description: '探索 LLM 智能体如何诊断故障、积累经验，并演化可复用的能力。LLM 智能体 · 工具使用 · 记忆 · 能力诊断 · 技能演化。',
  },
  {
    owner: 'Lumisoph',
    repo: 'JDBC_SQLSever',
    tags: ['Java', 'JDBC', 'SQL Server'],
  },
];

async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`,
    );
    return res.ok ? await res.text() : '';
  } catch {
    return '';
  }
}

// 剥掉 HTML 标签（README 常以 <h1>/<p> 开头）
// ponytail: 不处理 HTML 实体与代码块里的尖括号，够用即可
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

// 去掉 README 首行一级标题，剩余正文作为简介
// ponytail: 只识别 `# ` 标题，正文压成单行文本（卡片 line-clamp-3 截断）
function parseReadme(raw: string, fallbackTitle: string) {
  const text = stripHtml(raw).replace(/[ \t]+/g, ' ').trim();
  if (!text) return { title: fallbackTitle, description: '' };
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const firstIsHeading = lines[0].startsWith('# ');
  const title = firstIsHeading ? lines[0].slice(2).trim() : fallbackTitle;
  const body = firstIsHeading ? lines.slice(1) : lines;
  return { title, description: body.join(' ').trim() };
}

export async function getGithubProjects(): Promise<ProjectCardData[]> {
  return Promise.all(
    repos.map(async ({ owner, repo, tags, demo, description: override }) => {
      const raw = await fetchReadme(owner, repo);
      const { title, description } = parseReadme(raw, repo);
      return {
        title,
        description: override ?? description,
        tags,
        github: `https://github.com/${owner}/${repo}`,
        demo,
      };
    }),
  );
}
