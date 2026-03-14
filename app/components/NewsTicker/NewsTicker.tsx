'use client';

import styles from './NewsTicker.module.css';
import { breakingNews } from '../../lib/mockData';

export default function NewsTicker() {
  const doubled = [...breakingNews, ...breakingNews];

  return (
    <div className={styles.ticker}>
      <div className={styles.tickerLabel}>
        <span className={styles.liveDot}></span>
        LIVE
      </div>
      <div className={styles.tickerTrack}>
        {doubled.map((item, i) => (
          <span key={i}>
            <span className={styles.tickerItem}>{item}</span>
            {i < doubled.length - 1 && <span className={styles.tickerDivider}></span>}
          </span>
        ))}
      </div>
    </div>
  );
}
