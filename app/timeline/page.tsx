import { incidentTimeline } from '../lib/mockData';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import styles from '../intel.module.css';

export default function TimelinePage() {
  return (
    <section className={styles.page}>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Timeline' }]} />

      <div className={styles.titleRow}>
        <h1>Incident Timeline</h1>
        <p className={styles.subtitle}>Campaign sequence from initial access through recovery.</p>
      </div>

      <div className={`${styles.panel} ${styles.stack}`}>
        {incidentTimeline.map((item) => (
          <div className={styles.heatItem} key={item.id}>
            <strong>{item.campaign}</strong>
            <p className={styles.muted}>{item.date} | {item.stage.replace('-', ' ')}</p>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
