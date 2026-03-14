import { mockArticles } from './mockData';
import { fetchRssNews } from './rssParser';
import { Article } from '../types';
import { detectCategory } from './utils';

const GNEWS_BASE_URL = 'https://gnews.io/api/v4/search';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80';

interface GNewsItem {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  image?: string;
  publishedAt?: string;
  source?: {
    name?: string;
  };
}

interface GNewsResponse {
  articles?: GNewsItem[];
}

function normalizeGNewsItem(item: GNewsItem, index: number): Article | null {
  const title = item.title?.trim();
  const url = item.url?.trim();

  if (!title || !url) {
    return null;
  }

  const description = item.description?.trim() || item.content?.trim() || 'Open the source article for complete coverage.';
  const source = item.source?.name?.trim() || 'GNews';
  const publishedAt = item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString();
  const category = detectCategory(`${title} ${description} ${source}`);

  return {
    id: `gnews-${index}-${Date.parse(publishedAt) || Date.now()}`,
    title,
    description,
    content: item.content,
    url,
    image: item.image || FALLBACK_IMAGE,
    source,
    category,
    publishedAt,
  };
}

async function fetchFromGNews(): Promise<Article[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return [];
  }

  const params = new URLSearchParams({
    q: 'cybersecurity OR vulnerability OR malware OR ransomware OR data breach',
    lang: 'en',
    max: '25',
    token: apiKey,
    sortby: 'publishedAt',
  });

  try {
    const response = await fetch(`${GNEWS_BASE_URL}?${params.toString()}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as GNewsResponse;
    const articles = (data.articles || [])
      .map((item, index) => normalizeGNewsItem(item, index))
      .filter((item): item is Article => Boolean(item));

    return articles;
  } catch {
    return [];
  }
}

function dedupeArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  const deduped: Article[] = [];

  for (const article of articles) {
    const key = article.url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(article);
  }

  return deduped;
}

export async function getCyberNews(): Promise<{ articles: Article[]; source: 'live' | 'fallback' }> {
  const [gnewsArticles, rssArticles] = await Promise.all([fetchFromGNews(), fetchRssNews()]);

  const combined = dedupeArticles([...gnewsArticles, ...rssArticles]).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (combined.length > 0) {
    return { articles: combined, source: 'live' };
  }

  return { articles: mockArticles, source: 'fallback' };
}
