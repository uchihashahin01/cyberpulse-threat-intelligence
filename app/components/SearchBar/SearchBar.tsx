'use client';

import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.searchWrap}>
      <label className={styles.searchLabel} htmlFor="news-search">
        <Search size={14} />
        terminal search
      </label>
      <div className={styles.searchFieldWrap}>
        <span className={styles.prefix}>&gt;</span>
        <input
          id="news-search"
          className={styles.searchInput}
          placeholder="search by keyword, source, campaign..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button
            className={styles.clearBtn}
            onClick={() => onChange('')}
            aria-label="Clear search"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
