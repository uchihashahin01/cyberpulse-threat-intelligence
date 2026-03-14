"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import HeroSection from './components/HeroSection/HeroSection';
import NewsFeed from './components/NewsFeed/NewsFeed';
import Sidebar from './components/Sidebar/Sidebar';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import { mockArticles } from './lib/mockData';
import { filterArticles, generateInsight, scoreArticle } from './lib/utils';
import { Article, Category, LocalAccount, NewsResponse } from './types';
import { ACCOUNT_KEY, BOOKMARKS_KEY, readJson, writeJson } from './lib/localStore';
import styles from './home.module.css';

const defaultAccount: LocalAccount = {
  username: 'analyst.local',
  role: 'analyst',
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [urlQueryValue, setUrlQueryValue] = useState('');
  const [account, setAccount] = useState<LocalAccount>(defaultAccount);
  const [bookmarkStore, setBookmarkStore] = useState<Record<string, string[]>>({});
  const [summaryArticle, setSummaryArticle] = useState<Article | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setUrlQueryValue(q);
    setSearchTerm(q);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === urlQueryValue.trim()) {
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (searchTerm.trim()) {
        params.set('q', searchTerm.trim());
      } else {
        params.delete('q');
      }

      const query = params.toString();
      const target = query ? `/?${query}#feed` : '/#feed';
      window.history.replaceState({}, '', target);
      setUrlQueryValue(searchTerm.trim());
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm, urlQueryValue]);

  useEffect(() => {
    const storedAccount = readJson<LocalAccount>(ACCOUNT_KEY, defaultAccount);
    const storedBookmarks = readJson<Record<string, string[]>>(BOOKMARKS_KEY, {});
    setAccount(storedAccount);
    setBookmarkStore(storedBookmarks);
  }, []);

  useEffect(() => {
    writeJson(ACCOUNT_KEY, account);
  }, [account]);

  useEffect(() => {
    writeJson(BOOKMARKS_KEY, bookmarkStore);
  }, [bookmarkStore]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      setLoading(false);
      return;
    }

    let ignore = false;

    async function loadNews() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/news?limit=40');
        if (!response.ok) {
          throw new Error('Unable to load latest intelligence');
        }

        const payload = (await response.json()) as NewsResponse;
        if (!ignore && payload.articles?.length) {
          setArticles(payload.articles);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Unable to load latest intelligence');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(
    () => filterArticles(articles, activeCategory, searchTerm),
    [articles, activeCategory, searchTerm],
  );

  const featuredArticle = filtered[0] || articles[0] || mockArticles[0];
  const feedArticles = filtered.filter((article) => article.id !== featuredArticle.id);
  const bookmarkedIds = bookmarkStore[account.username] || [];
  const summaryInsight = summaryArticle ? generateInsight(summaryArticle) : null;
  const summaryScore = summaryArticle ? scoreArticle(summaryArticle) : null;

  function toggleBookmark(articleId: string) {
    setBookmarkStore((current) => {
      const currentList = current[account.username] || [];
      const exists = currentList.includes(articleId);
      const nextList = exists
        ? currentList.filter((id) => id !== articleId)
        : [...currentList, articleId];

      return {
        ...current,
        [account.username]: nextList,
      };
    });
  }

  return (
    <div id="dashboard" className={`page-content ${styles.dashboard}`}>
      <div className={styles.section}>
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      </div>

      <div className={styles.section}>
        <HeroSection article={featuredArticle} />
      </div>

      <div id="feed" className={`${styles.statusRow} ${styles.section}`}>
        <div className="section-header">
          <h2>Latest Intelligence</h2>
          <span className="badge">
            {loading ? 'syncing...' : `${filtered.length} reports`}
          </span>
        </div>
        <div className={styles.statusPills}>
          <span>Account: {account.username}</span>
          <span>Bookmarks: {bookmarkedIds.length}</span>
        </div>
      </div>

      {error ? <p style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>{error}</p> : null}

      <div className={`${styles.section} content-grid`}>
        <div>
          <NewsFeed
            articles={feedArticles}
            loading={loading}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onOpenSummary={setSummaryArticle}
          />
        </div>
        <Sidebar />
      </div>

      <section className={styles.section}>
        <div className="section-header">
          <h2>Intelligence Modules</h2>
        </div>
        <div className={styles.modulesGrid}>
          <Link href="/account" className={styles.moduleCard}>
            <h3>Account & Bookmarks</h3>
            <p>Manage local analyst profile and saved reports.</p>
          </Link>
          <Link href="/threat-map" className={styles.moduleCard}>
            <h3>Threat Map</h3>
            <p>Regional heat view with incident intensity and top threats.</p>
          </Link>
          <Link href="/cve-explorer" className={styles.moduleCard}>
            <h3>CVE Explorer</h3>
            <p>Filter by severity, vendor, and product.</p>
          </Link>
          <Link href="/source-credibility" className={styles.moduleCard}>
            <h3>Source Credibility</h3>
            <p>Publisher confidence scoring and rationale.</p>
          </Link>
          <Link href="/timeline" className={styles.moduleCard}>
            <h3>Incident Timeline</h3>
            <p>Campaign phase progression and response milestones.</p>
          </Link>
          <Link href="/alerts" className={styles.moduleCard}>
            <h3>Alert Subscriptions</h3>
            <p>Email/Telegram routing rules by category and keywords.</p>
          </Link>
          {account.role === 'admin' ? (
            <Link href="/admin" className={styles.moduleCard}>
              <h3>Admin Curation</h3>
              <p>Pin stories and manage feed source states.</p>
            </Link>
          ) : null}
        </div>
      </section>

      {summaryArticle ? (
        <div className={styles.insightModal}>
          <div className={styles.insightCard}>
            <h3>{summaryArticle.title}</h3>
            <p className={styles.insightMeta}>
              {summaryArticle.source} | Risk {summaryScore?.risk} | Sentiment {summaryScore?.sentiment}
            </p>

            <div className={styles.insightSection}>
              <h4>AI Summary</h4>
              <p>{summaryInsight?.summary}</p>
            </div>

            <div className={styles.insightSection}>
              <h4>Key IOCs</h4>
              <ul>
                {summaryInsight?.keyIOCs.map((ioc) => (
                  <li key={ioc}>{ioc}</li>
                ))}
              </ul>
            </div>

            <div className={styles.insightSection}>
              <h4>Recommended Mitigations</h4>
              <ul>
                {summaryInsight?.mitigations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.insightActions}>
              <button type="button" onClick={() => setSummaryArticle(null)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
