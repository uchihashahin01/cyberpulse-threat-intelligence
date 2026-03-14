import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getCyberNews } from '@/app/lib/newsApi';
import { mockArticles } from '@/app/lib/mockData';
import { createArticleSlug, formatTimeAgo, getCategoryLabel } from '@/app/lib/utils';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import styles from './page.module.css';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mockArticles.map((article) => ({ slug: createArticleSlug(article) }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const isStaticExport = process.env.STATIC_EXPORT === 'true';
  const articles = isStaticExport ? mockArticles : (await getCyberNews()).articles;

  const article = articles.find((item) => createArticleSlug(item) === slug);

  if (!article) {
    notFound();
  }

  return (
    <section className={styles.articlePage}>
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Article' },
          ]}
        />

        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to feed
        </Link>

        <div className={styles.categoryRow}>
          <span className="badge">{getCategoryLabel(article.category)}</span>
          <span className={styles.timeStamp}>
            <Clock size={12} /> {formatTimeAgo(article.publishedAt)}
          </span>
        </div>

        <h1 className={styles.title}>{article.title}</h1>

        <p className={styles.meta}>
          {article.source}
          {article.author ? ` | ${article.author}` : ''}
        </p>

        <Image
          src={article.image}
          alt={article.title}
          className={styles.heroImage}
          width={1200}
          height={720}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />

        <p className={styles.lead}>{article.description}</p>

        {article.content ? <p className={styles.content}>{article.content}</p> : null}

        <a className={styles.sourceButton} href={article.url} target="_blank" rel="noopener noreferrer">
          Open Original Source <ExternalLink size={14} />
        </a>
      </div>
    </section>
  );
}
