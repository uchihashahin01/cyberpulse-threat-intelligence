'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import styles from './HeroSection.module.css';
import { Article } from '../../types';
import { createArticleSlug, formatTimeAgo } from '../../lib/utils';

interface HeroSectionProps {
  article: Article;
}

export default function HeroSection({ article }: HeroSectionProps) {
  return (
    <article className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <span className={styles.heroBadge}>🔴 Breaking</span>
            <span className={styles.heroTime}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          <h1 className={styles.heroTitle}>{article.title}</h1>
          <p className={styles.heroDescription}>{article.description}</p>
          <div className={styles.heroFooter}>
            <div className={styles.heroSource}>
              <span className={styles.heroSourceDot}></span>
              {article.source} {article.author && `• ${article.author}`}
            </div>
            <Link href={`/article/${createArticleSlug(article)}`} className={styles.heroReadBtn}>
              Read Full Report <ArrowRight size={14} />
            </Link>
          </div>

          <a href={article.url} className={styles.heroSourceLink} target="_blank" rel="noopener noreferrer">
            Open Source Article
          </a>
        </div>
        <div className={styles.heroImageWrap}>
          <div className={styles.heroImageOverlay}></div>
          <Image
            src={article.image}
            alt={article.title}
            className={styles.heroImage}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            priority
          />
        </div>
      </div>
      <div className={styles.heroGlowLine}></div>
    </article>
  );
}
