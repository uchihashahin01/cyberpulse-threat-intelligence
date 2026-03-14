import { threatLocations } from '../lib/mockData';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import styles from '../intel.module.css';

export default function ThreatMapPage() {
  return (
    <section className={styles.page}>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Threat Map' }]} />

      <div className={styles.titleRow}>
        <h1>Threat Map</h1>
        <p className={styles.subtitle}>Regional heat intensity and dominant threat families.</p>
      </div>

      <div className={`${styles.panel} ${styles.stack}`}>
        {threatLocations.map((location) => (
          <div key={location.id} className={styles.heatItem}>
            <strong>{location.region}</strong>
            <div className={styles.heatBarTrack}>
              <div className={styles.heatBar} style={{ width: `${location.intensity}%` }}></div>
            </div>
            <p className={styles.muted}>
              {location.intensity}% intensity | {location.incidents} incidents | {location.primaryThreat}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
