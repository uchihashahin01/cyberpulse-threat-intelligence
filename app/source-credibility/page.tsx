import { sourceCredibility } from '../lib/mockData';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import styles from '../intel.module.css';

export default function SourceCredibilityPage() {
  return (
    <section className={styles.page}>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Source Credibility' }]} />

      <div className={styles.titleRow}>
        <h1>Source Credibility</h1>
        <p className={styles.subtitle}>Publisher reliability scoring and rationale.</p>
      </div>

      <div className={`${styles.panel} ${styles.stack}`}>
        <ul className={styles.list}>
          {sourceCredibility.map((entry) => (
            <li className={styles.listItem} key={entry.source}>
              <div>
                <strong>{entry.source}</strong>
                <p className={styles.muted}>{entry.rationale}</p>
                <p className={styles.muted}>Last audited: {entry.lastAudited}</p>
              </div>
              <span className={styles.badge}>{entry.score}/100</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
