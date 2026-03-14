import { NextResponse } from 'next/server';
import { getCyberNews } from '@/app/lib/newsApi';
import { mockArticles } from '@/app/lib/mockData';
import { Category } from '@/app/types';

export const revalidate = 300;

const validCategories: Category[] = [
  'all',
  'malware',
  'data-breach',
  'vulnerability',
  'ransomware',
  'phishing',
  'apt',
  'privacy',
  'general',
];

export async function GET(request: Request) {
  if (process.env.STATIC_EXPORT === 'true') {
    return NextResponse.json(
      {
        articles: mockArticles.slice(0, 24),
        meta: {
          total: mockArticles.length,
          source: 'fallback',
          updatedAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      },
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const category = (searchParams.get('category') || 'all') as Category;
  const query = (searchParams.get('search') || '').trim().toLowerCase();
  const limit = Math.max(1, Math.min(Number(searchParams.get('limit') || 24), 50));

  const { articles, source } = await getCyberNews();

  const resolvedCategory = validCategories.includes(category) ? category : 'all';

  const filtered = articles.filter((article) => {
    if (resolvedCategory !== 'all' && article.category !== resolvedCategory) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchTarget = [article.title, article.description, article.source, article.author]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchTarget.includes(query);
  });

  const sliced = filtered.slice(0, limit);

  return NextResponse.json(
    {
      articles: sliced,
      meta: {
        total: filtered.length,
        source,
        updatedAt: new Date().toISOString(),
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
