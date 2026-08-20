export interface ProjectCardData {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  image?: string;
}

// 要展示的 GitHub 仓库（构建时拉取 README 作为简介）
const repos: { owner: string; repo: string; tags: string[]; demo?: string }[] = [
  {
    owner: 'Lumisoph',
    repo: 'Lumisoph',
    tags: ['Astro', 'React', 'Tailwind CSS'],
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
    repos.map(async ({ owner, repo, tags, demo }) => {
      const raw = await fetchReadme(owner, repo);
      const { title, description } = parseReadme(raw, repo);
      return {
        title,
        description,
        tags,
        github: `https://github.com/${owner}/${repo}`,
        demo,
      };
    }),
  );
}
