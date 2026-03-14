'use client';

import styles from './NewsFeed.module.css';
import NewsCard from '../NewsCard/NewsCard';
import { Article, Category } from '../../types';
import { categories } from '../../lib/mockData';
import SearchBar from '../SearchBar/SearchBar';
import { scoreArticle } from '../../lib/utils';

interface NewsFeedProps {
  articles: Article[];
  loading: boolean;
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (articleId: string) => void;
  onOpenSummary: (article: Article) => void;
}

export default function NewsFeed({
  articles,
  loading,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  bookmarkedIds,
  onToggleBookmark,
  onOpenSummary,
}: NewsFeedProps) {
  const skeletonCards = Array.from({ length: 6 });
  const bookmarkSet = new Set(bookmarkedIds);

  return (
    <div className={styles.feed}>
      <div className={styles.controls}>
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${
                activeCategory === cat.id ? styles.filterBtnActive : ''
              }`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {skeletonCards.map((_, index) => (
            <div key={index} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className={styles.grid}>
          {articles.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              index={i}
              score={scoreArticle(article)}
              bookmarked={bookmarkSet.has(article.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenSummary={onOpenSummary}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          {'> No articles matched your current filters_'}
        </div>
      )}
    </div>
  );
}
