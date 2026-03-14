'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockArticles } from '../lib/mockData';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import { AdminState, LocalAccount } from '../types';
import { ACCOUNT_KEY, ADMIN_KEY, readJson, writeJson } from '../lib/localStore';
import styles from '../intel.module.css';

const defaultAdminState: AdminState = {
  pinnedArticleIds: [],
  disabledSources: [],
};

const defaultAccount: LocalAccount = {
  username: 'analyst.local',
  role: 'analyst',
};

export default function AdminPage() {
  const router = useRouter();
  const [account] = useState<LocalAccount>(() => readJson<LocalAccount>(ACCOUNT_KEY, defaultAccount));
  const [adminState, setAdminState] = useState<AdminState>(() => readJson<AdminState>(ADMIN_KEY, defaultAdminState));
  const sources = Array.from(new Set(mockArticles.map((item) => item.source))).sort((a, b) => a.localeCompare(b));
  const isAdmin = account.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/account?denied=admin');
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    writeJson(ADMIN_KEY, adminState);
  }, [adminState, isAdmin]);

  if (!isAdmin) {
    return (
      <section className={styles.page}>
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Admin' }]} />
        <div className={styles.panel}>
          <p className={styles.muted}>Admin access required. Redirecting to Account...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Admin' }]} />

      <div className={styles.titleRow}>
        <h1>Admin Curation</h1>
        <p className={styles.subtitle}>Pin stories and control feed source visibility.</p>
      </div>

      <div className={styles.grid2}>
        <div className={`${styles.panel} ${styles.stack}`}>
          <h3>Pinned Stories</h3>
          <ul className={styles.list}>
            {mockArticles.slice(0, 12).map((article) => (
              <li className={styles.listItem} key={article.id}>
                <span>{article.title}</span>
                <button
                  className={styles.actionBtn}
                  type="button"
                  onClick={() => {
                    setAdminState((current) => {
                      const exists = current.pinnedArticleIds.includes(article.id);
                      return {
                        ...current,
                        pinnedArticleIds: exists
                          ? current.pinnedArticleIds.filter((id) => id !== article.id)
                          : [...current.pinnedArticleIds, article.id],
                      };
                    });
                  }}
                >
                  {adminState.pinnedArticleIds.includes(article.id) ? 'Unpin' : 'Pin'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.panel} ${styles.stack}`}>
          <h3>Feed Sources</h3>
          <ul className={styles.list}>
            {sources.map((source) => (
              <li className={styles.listItem} key={source}>
                <span>{source}</span>
                <button
                  className={styles.actionBtn}
                  type="button"
                  onClick={() => {
                    setAdminState((current) => {
                      const exists = current.disabledSources.includes(source);
                      return {
                        ...current,
                        disabledSources: exists
                          ? current.disabledSources.filter((entry) => entry !== source)
                          : [...current.disabledSources, source],
                      };
                    });
                  }}
                >
                  {adminState.disabledSources.includes(source) ? 'Enable' : 'Disable'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
