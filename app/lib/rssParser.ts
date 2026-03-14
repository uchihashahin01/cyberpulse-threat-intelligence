import { XMLParser } from 'fast-xml-parser';
import { Article } from '../types';
import { detectCategory } from './utils';

interface RssSource {
  name: string;
  url: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  trimValues: true,
  parseTagValue: false,
});

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200&q=80';

export const rssSources: RssSource[] = [
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
  { name: 'SecurityWeek', url: 'https://www.securityweek.com/feed/' },
];

function coerceArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function pickImage(item: Record<string, unknown>): string {
  const mediaContent = item['media:content'] as { url?: string } | { url?: string }[] | undefined;
  const enclosure = item.enclosure as { url?: string } | undefined;
  const mediaThumbnail = item['media:thumbnail'] as { url?: string } | undefined;

  const mediaUrl = Array.isArray(mediaContent) ? mediaContent[0]?.url : mediaContent?.url;

  return mediaUrl || mediaThumbnail?.url || enclosure?.url || FALLBACK_IMAGE;
}

function parseRssItems(sourceName: string, channel: Record<string, unknown>): Article[] {
  const items = coerceArray(channel.item as Record<string, unknown> | Record<string, unknown>[]);
  const parsedItems: Article[] = [];

  items.forEach((item, index) => {
    const title = String(item.title || '').trim();
    const description = stripHtml(String(item.description || item['content:encoded'] || '').trim());
    const url = String(item.link || '').trim();
    const publishedAt = String(item.pubDate || item.published || new Date().toISOString());

    if (!title || !url) {
      return;
    }

    const category = detectCategory(`${title} ${description}`);

    parsedItems.push({
      id: `rss-${sourceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}-${Date.parse(publishedAt) || Date.now()}`,
      title,
      description: description || 'Read the full report for detailed technical analysis.',
      url,
      image: pickImage(item),
      source: sourceName,
      category,
      publishedAt: new Date(publishedAt).toISOString(),
    });
  });

  return parsedItems;
}

function parseAtomItems(sourceName: string, feed: Record<string, unknown>): Article[] {
  const entries = coerceArray(feed.entry as Record<string, unknown> | Record<string, unknown>[]);
  const parsedEntries: Article[] = [];

  entries.forEach((entry, index) => {
    const title = String(entry.title || '').trim();
    const summary = stripHtml(String(entry.summary || entry.content || '').trim());
    const links = coerceArray(entry.link as Record<string, unknown> | Record<string, unknown>[]);
    const href = String(links.find((link) => link.href)?.href || '').trim();
    const publishedAt = String(entry.updated || entry.published || new Date().toISOString());

    if (!title || !href) {
      return;
    }

    const category = detectCategory(`${title} ${summary}`);

    parsedEntries.push({
      id: `atom-${sourceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}-${Date.parse(publishedAt) || Date.now()}`,
      title,
      description: summary || 'Read the full report for detailed technical analysis.',
      url: href,
      image: FALLBACK_IMAGE,
      source: sourceName,
      category,
      publishedAt: new Date(publishedAt).toISOString(),
    });
  });

  return parsedEntries;
}

export async function parseRssFeed(source: RssSource): Promise<Article[]> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'CyberPulseBot/1.0 (+https://example.local)',
      },
    });

    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    const parsed = parser.parse(xml) as Record<string, unknown>;

    const channel = parsed.rss && (parsed.rss as Record<string, unknown>).channel;
    if (channel && typeof channel === 'object') {
      return parseRssItems(source.name, channel as Record<string, unknown>);
    }

    const feed = parsed.feed;
    if (feed && typeof feed === 'object') {
      return parseAtomItems(source.name, feed as Record<string, unknown>);
    }

    return [];
  } catch {
    return [];
  }
}

export async function fetchRssNews(): Promise<Article[]> {
  const results = await Promise.all(rssSources.map((source) => parseRssFeed(source)));
  return results.flat();
}
