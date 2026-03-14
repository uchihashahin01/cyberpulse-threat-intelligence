'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Search, Menu } from 'lucide-react';
import { ACCOUNT_KEY, readJson } from '../../lib/localStore';
import { LocalAccount } from '../../types';
import styles from './Header.module.css';

const defaultAccount: LocalAccount = {
  username: 'analyst.local',
  role: 'analyst',
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin] = useState(() => readJson<LocalAccount>(ACCOUNT_KEY, defaultAccount).role === 'admin');

  function runSearch() {
    const q = query.trim();
    const target = q ? `/?q=${encodeURIComponent(q)}#feed` : '/#feed';
    router.push(target);
    setMenuOpen(false);
  }

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Threat Map', href: '/threat-map' },
    { label: 'CVE Explorer', href: '/cve-explorer' },
    { label: 'Timeline', href: '/timeline' },
    { label: 'Alerts', href: '/alerts' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <Shield size={20} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>CyberPulse</span>
          <span className={styles.logoSubtitle}>Global Threat Intelligence</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.headerRight}>
        <div className={styles.searchContainer}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search threats..."
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                runSearch();
              }
            }}
          />
          <button className={styles.searchBtn} type="button" onClick={runSearch}>Go</button>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.livePulse}></span>
          LIVE
        </div>
        <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen((state) => !state)}>
          <Menu size={22} />
        </button>
      </div>

      {menuOpen ? (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileLink} ${pathname === item.href ? styles.mobileLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button type="button" className={styles.mobileSearchBtn} onClick={runSearch}>
            Run Search
          </button>
        </div>
      ) : null}
    </header>
  );
}
