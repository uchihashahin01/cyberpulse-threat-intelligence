'use client';

import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity, Rss, BarChart3 } from 'lucide-react';
import styles from './Sidebar.module.css';
import { currentThreatLevel, trendingTopics } from '../../lib/mockData';

export default function Sidebar() {
  const sources = [
    { name: 'The Hacker News', color: '#00f0ff' },
    { name: 'Krebs on Security', color: '#ff4757' },
    { name: 'BleepingComputer', color: '#ffa502' },
    { name: 'Dark Reading', color: '#a78bfa' },
    { name: 'SecurityWeek', color: '#00ff88' },
    { name: 'Wired Security', color: '#ff6b81' },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Threat Level */}
      <div className={styles.widget}>
        <div className={styles.widgetHeader}>
          <AlertTriangle size={14} className={styles.widgetHeaderIcon} />
          Threat Level
          <span className={styles.widgetHeaderLine}></span>
        </div>
        <div className={styles.threatLevel}>
          <div
            className={styles.threatGauge}
            style={{
              background: `conic-gradient(${currentThreatLevel.color} 75%, var(--bg-tertiary) 75%)`,
            }}
          >
            <div className={styles.threatGaugeInner}>
              <span
                className={styles.threatGaugeLabel}
                style={{ color: currentThreatLevel.color }}
              >
                {currentThreatLevel.label}
              </span>
              <span className={styles.threatGaugeSub}>threat level</span>
            </div>
          </div>
          <p className={styles.threatDescription}>
            {currentThreatLevel.description}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.widget}>
        <div className={styles.widgetHeader}>
          <BarChart3 size={14} className={styles.widgetHeaderIcon} />
          Today&apos;s Stats
          <span className={styles.widgetHeaderLine}></span>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: 'var(--accent-red)' }}>47</span>
            <span className={styles.statLabel}>Incidents</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: 'var(--accent-orange)' }}>12</span>
            <span className={styles.statLabel}>New CVEs</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: 'var(--accent-cyan)' }}>3</span>
            <span className={styles.statLabel}>Zero-Days</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: 'var(--accent-green)' }}>89</span>
            <span className={styles.statLabel}>Patches</span>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className={styles.widget}>
        <div className={styles.widgetHeader}>
          <Activity size={14} className={styles.widgetHeaderIcon} />
          Trending
          <span className={styles.widgetHeaderLine}></span>
        </div>
        <div className={styles.trendingList}>
          {trendingTopics.map((topic, i) => (
            <div key={topic.id} className={styles.trendingItem}>
              <span className={styles.trendingRank}>#{i + 1}</span>
              <span className={styles.trendingName}>{topic.name}</span>
              <div className={styles.trendingMeta}>
                <span>{topic.count}</span>
                {topic.trend === 'up' && <TrendingUp size={12} className={styles.trendUp} />}
                {topic.trend === 'down' && <TrendingDown size={12} className={styles.trendDown} />}
                {topic.trend === 'stable' && <Minus size={12} className={styles.trendStable} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className={styles.widget}>
        <div className={styles.widgetHeader}>
          <Rss size={14} className={styles.widgetHeaderIcon} />
          Sources
          <span className={styles.widgetHeaderLine}></span>
        </div>
        <div className={styles.sourcesList}>
          {sources.map((src) => (
            <a href="#" key={src.name} className={styles.sourceItem}>
              <span className={styles.sourceDot} style={{ background: src.color }}></span>
              {src.name}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
