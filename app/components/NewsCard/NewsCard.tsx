'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Clock, Sparkles } from 'lucide-react';
import styles from './NewsCard.module.css';
import { Article, ArticleScore } from '../../types';
import {
  createArticleSlug,
  formatTimeAgo,
  getCategoryColor,
  getCategoryLabel,
  getCategoryIcon,
} from '../../lib/utils';

interface NewsCardProps {
  article: Article;
  index: number;
  score: ArticleScore;
  bookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onOpenSummary: (article: Article) => void;
}

export default function NewsCard({
  article,
  index,
  score,
  bookmarked,
  onToggleBookmark,
  onOpenSummary,
}: NewsCardProps) {
  const catColor = getCategoryColor(article.category);

  return (
    <article className={styles.card} style={{ animationDelay: `${index * 0.08}s` }}>
      <div className={styles.imageWrap}>
        <Image
          src={article.image}
          alt={article.title}
          className={styles.image}
          fill
          sizes="(max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.imageOverlay}></div>
        <span
          className={styles.categoryBadge}
          style={{
            background: `${catColor}20`,
            color: catColor,
            border: `1px solid ${catColor}40`,
          }}
        >
          {getCategoryIcon(article.category)} {getCategoryLabel(article.category)}
        </span>
      </div>

      <div className={styles.content}>
        <Link href={`/article/${createArticleSlug(article)}`} className={styles.titleLink}>
          <h3 className={styles.title}>{article.title}</h3>
        </Link>

        <p className={styles.description}>{article.description}</p>

        <div className={styles.scoreRow}>
          <span className={`${styles.scoreBadge} ${styles[`risk${score.risk[0].toUpperCase()}${score.risk.slice(1)}`]}`}>
            Risk: {score.risk}
          </span>
          <span className={styles.scoreBadge}>Read: {score.readTimeMinutes}m</span>
          <span className={styles.scoreBadge}>Credibility: {score.sourceCredibility}</span>
        </div>

        <div className={styles.meta}>
          <span className={styles.source}>{article.source}</span>
          <span className={styles.time}>
            <Clock size={11} />
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => onToggleBookmark(article.id)}>
            <Bookmark size={13} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          <button type="button" onClick={() => onOpenSummary(article)}>
            <Sparkles size={13} /> AI Summary
          </button>
        </div>
      </div>

      <div
        className={styles.glowLine}
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }}
      ></div>
    </article>
  );
}
