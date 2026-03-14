import { categories, sourceCredibility } from './mockData';
import { Article, ArticleInsight, ArticleScore, Category, RiskLevel, Sentiment } from '../types';

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getCategoryColor(category: Category): string {
  const cat = categories.find((c) => c.id === category);
  return cat?.color ?? '#00f0ff';
}

export function getCategoryLabel(category: Category): string {
  const cat = categories.find((c) => c.id === category);
  return cat?.label ?? 'General';
}

export function getCategoryIcon(category: Category): string {
  const cat = categories.find((c) => c.id === category);
  return cat?.icon ?? '📰';
}

export function detectCategory(text: string): Exclude<Category, 'all'> {
  const normalized = text.toLowerCase();

  if (/(ransomware|extortion|lockbit|encrypt)/.test(normalized)) {
    return 'ransomware';
  }

  if (/(breach|leak|exposed|database dump|stolen records)/.test(normalized)) {
    return 'data-breach';
  }

  if (/(phishing|credential theft|spoofed|smishing)/.test(normalized)) {
    return 'phishing';
  }

  if (/(apt|nation-state|state-sponsored|espionage)/.test(normalized)) {
    return 'apt';
  }

  if (/(privacy|gdpr|surveillance|tracking|consent)/.test(normalized)) {
    return 'privacy';
  }

  if (/(vulnerability|cve-|zero-day|patch|exploit|remote code execution)/.test(normalized)) {
    return 'vulnerability';
  }

  if (/(malware|trojan|worm|botnet|rootkit|backdoor)/.test(normalized)) {
    return 'malware';
  }

  return 'general';
}

export function createArticleSlug(article: Pick<Article, 'id' | 'title'>): string {
  const sanitizedTitle = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

  return `${article.id}-${sanitizedTitle}`;
}

export function filterArticles(
  articles: Article[],
  category: Category,
  searchTerm: string,
): Article[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return articles.filter((article) => {
    const categoryMatch = category === 'all' || article.category === category;
    if (!categoryMatch) return false;

    if (!normalizedSearch) return true;

    return [article.title, article.description, article.source, article.author]
      .filter(Boolean)
      .some((part) => part!.toLowerCase().includes(normalizedSearch));
  });
}

export function estimateReadTime(article: Pick<Article, 'title' | 'description' | 'content'>): number {
  const words = `${article.title} ${article.description} ${article.content || ''}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export function getSourceCredibility(source: string): number {
  const entry = sourceCredibility.find((item) => item.source.toLowerCase() === source.toLowerCase());
  return entry?.score ?? 70;
}

export function getSentiment(text: string): Sentiment {
  const normalized = text.toLowerCase();
  if (/(critical|severe|massive|urgent|attack|breach|ransomware|exploit)/.test(normalized)) {
    return 'negative';
  }

  if (/(patched|mitigated|contained|recovered|secured)/.test(normalized)) {
    return 'positive';
  }

  return 'neutral';
}

export function getRiskLevel(text: string): RiskLevel {
  const normalized = text.toLowerCase();
  if (/(critical|zero-day|active exploitation|rce|wormable|nation-state)/.test(normalized)) {
    return 'critical';
  }

  if (/(high|ransomware|breach|apt|credential theft|botnet)/.test(normalized)) {
    return 'high';
  }

  if (/(medium|misconfiguration|phishing|policy bypass)/.test(normalized)) {
    return 'moderate';
  }

  return 'low';
}

export function scoreArticle(article: Article): ArticleScore {
  const content = `${article.title} ${article.description} ${article.content || ''}`;
  return {
    readTimeMinutes: estimateReadTime(article),
    sentiment: getSentiment(content),
    risk: getRiskLevel(content),
    sourceCredibility: getSourceCredibility(article.source),
  };
}

export function generateInsight(article: Article): ArticleInsight {
  const normalized = `${article.title} ${article.description}`.toLowerCase();

  const keyIOCs: string[] = [];
  if (normalized.includes('ransomware')) keyIOCs.push('Extension mutation and shadow copy deletion');
  if (normalized.includes('phishing')) keyIOCs.push('Spoofed sender infrastructure with lookalike domains');
  if (normalized.includes('zero-day') || normalized.includes('cve-')) keyIOCs.push('Unauthenticated exploit path in internet-facing endpoint');
  if (normalized.includes('apt')) keyIOCs.push('Long-dwell lateral movement through credential re-use');
  if (!keyIOCs.length) keyIOCs.push('Unusual authentication and data egress anomalies');

  const mitigations = [
    'Enforce MFA and conditional access for privileged identities',
    'Apply emergency patching window for exposed assets',
    'Deploy IOC hunt queries across EDR, SIEM, and DNS telemetry',
  ];

  return {
    summary: `Analyst summary: ${article.source} reports a ${getRiskLevel(normalized)}-risk event with likely operational impact to exposed environments. Prioritize validation of exposure and active threat hunting in affected systems.`,
    keyIOCs,
    mitigations,
  };
}
