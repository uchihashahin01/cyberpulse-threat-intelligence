'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { mockArticles } from '../lib/mockData';
import { createArticleSlug } from '../lib/utils';
import { LocalAccount } from '../types';
import { ACCOUNT_KEY, BOOKMARKS_KEY, readJson, writeJson } from '../lib/localStore';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import styles from '../intel.module.css';

const defaultAccount: LocalAccount = {
  username: 'analyst.local',
  role: 'analyst',
};

export default function AccountPage() {
  const [account, setAccount] = useState<LocalAccount>(() => readJson<LocalAccount>(ACCOUNT_KEY, defaultAccount));
  const [bookmarkStore, setBookmarkStore] = useState<Record<string, string[]>>(() => readJson<Record<string, string[]>>(BOOKMARKS_KEY, {}));

  useEffect(() => {
    writeJson(ACCOUNT_KEY, account);
  }, [account]);

  useEffect(() => {
    writeJson(BOOKMARKS_KEY, bookmarkStore);
  }, [bookmarkStore]);

  const bookmarks = useMemo(() => {
    const ids = new Set(bookmarkStore[account.username] || []);
    return mockArticles.filter((article) => ids.has(article.id));
  }, [account.username, bookmarkStore]);

  return (
    <section className={styles.page}>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Account' }]} />

      <div className={styles.titleRow}>
        <h1>Account & Bookmarks</h1>
        <p className={styles.subtitle}>Local analyst profile and saved articles.</p>
      </div>

      <div className={`${styles.panel} ${styles.stack}`}>
        <div className={styles.inputRow}>
          <input className={styles.input} value={account.username} onChange={(event) => setAccount({ ...account, username: event.target.value })} />
          <select className={styles.select} value={account.role} onChange={(event) => setAccount({ ...account, role: event.target.value as LocalAccount['role'] })}>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <h3>Bookmarks ({bookmarks.length})</h3>
        <ul className={styles.list}>
          {bookmarks.length ? bookmarks.map((article) => (
            <li className={styles.listItem} key={article.id}>
              <Link href={`/article/${createArticleSlug(article)}`}>{article.title}</Link>
              <button
                className={styles.actionBtn}
                type="button"
                onClick={() => {
                  setBookmarkStore((current) => {
                    const currentList = current[account.username] || [];
                    return {
                      ...current,
                      [account.username]: currentList.filter((id) => id !== article.id),
                    };
                  });
                }}
              >
                Remove
              </button>
            </li>
          )) : <li className={styles.listItem}>No saved reports yet.</li>}
        </ul>
      </div>
    </section>
  );
}
