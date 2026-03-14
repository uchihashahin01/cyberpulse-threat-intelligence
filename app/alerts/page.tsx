'use client';

import { useEffect, useState } from 'react';
import styles from '../intel.module.css';
import { AlertSubscription, Category } from '../types';
import { ALERTS_KEY, readJson, writeJson } from '../lib/localStore';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertSubscription[]>(() => readJson<AlertSubscription[]>(ALERTS_KEY, []));
  const [channel, setChannel] = useState<'email' | 'telegram'>('email');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    writeJson(ALERTS_KEY, alerts);
  }, [alerts]);

  function addAlert() {
    const target = destination.trim();
    if (!target) return;

    const entry: AlertSubscription = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      channel,
      destination: target,
      category,
      keywords: keywords.split(',').map((item) => item.trim()).filter(Boolean),
      enabled: true,
    };

    setAlerts((current) => [entry, ...current]);
    setDestination('');
    setKeywords('');
  }

  return (
    <section className={styles.page}>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Alerts' }]} />

      <div className={styles.titleRow}>
        <h1>Alert Subscriptions</h1>
        <p className={styles.subtitle}>Create local Email/Telegram routing rules by category and keywords.</p>
      </div>

      <div className={`${styles.panel} ${styles.stack}`}>
        <div className={styles.inputRow}>
          <select className={styles.select} value={channel} onChange={(event) => setChannel(event.target.value as 'email' | 'telegram')}>
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
          </select>
          <input
            className={styles.input}
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder={channel === 'email' ? 'soc@example.com' : '@ops_channel'}
          />
          <select className={styles.select} value={category} onChange={(event) => setCategory(event.target.value as Category)}>
            <option value="all">All Categories</option>
            <option value="malware">Malware</option>
            <option value="data-breach">Data Breach</option>
            <option value="vulnerability">Vulnerability</option>
            <option value="ransomware">Ransomware</option>
            <option value="phishing">Phishing</option>
            <option value="apt">APT</option>
            <option value="privacy">Privacy</option>
            <option value="general">General</option>
          </select>
        </div>
        <input
          className={styles.input}
          value={keywords}
          onChange={(event) => setKeywords(event.target.value)}
          placeholder="keywords, comma separated"
        />
        <button type="button" className={styles.actionBtn} onClick={addAlert}>Add Subscription</button>

        <ul className={styles.list}>
          {alerts.map((alert) => (
            <li className={styles.listItem} key={alert.id}>
              <span>
                {alert.channel} | {alert.destination} | {alert.category}
                {alert.keywords.length ? ` | ${alert.keywords.join(', ')}` : ''}
              </span>
              <button className={styles.actionBtn} type="button" onClick={() => setAlerts((current) => current.filter((entry) => entry.id !== alert.id))}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
