'use client';

import { Shield, Github, Twitter, Linkedin, Rss } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <div className={styles.footerLogoIcon}>
              <Shield size={16} />
            </div>
            <span className={styles.footerLogoText}>CyberPulse</span>
          </div>
          <p className={styles.footerDescription}>
            Your real-time source for global cybersecurity intelligence.
            Aggregating news from the world&apos;s leading security researchers and publications.
          </p>
        </div>

        <div>
          <h4 className={styles.footerColTitle}>Categories</h4>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Malware Analysis</a>
            <a href="#" className={styles.footerLink}>Data Breaches</a>
            <a href="#" className={styles.footerLink}>Vulnerabilities</a>
            <a href="#" className={styles.footerLink}>Ransomware</a>
            <a href="#" className={styles.footerLink}>APT Groups</a>
          </div>
        </div>

        <div>
          <h4 className={styles.footerColTitle}>Resources</h4>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Threat Database</a>
            <a href="#" className={styles.footerLink}>CVE Tracker</a>
            <a href="#" className={styles.footerLink}>IOC Feed</a>
            <a href="#" className={styles.footerLink}>Security Tools</a>
            <a href="#" className={styles.footerLink}>Reports</a>
          </div>
        </div>

        <div>
          <h4 className={styles.footerColTitle}>Company</h4>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Contact</a>
            <a href="#" className={styles.footerLink}>API Access</a>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Terms of Service</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 CyberPulse. All rights reserved. | Built with 🛡️ for the security community</span>
        <div className={styles.footerSocial}>
          <a href="#" className={styles.footerSocialLink}><Twitter size={16} /></a>
          <a href="#" className={styles.footerSocialLink}><Github size={16} /></a>
          <a href="#" className={styles.footerSocialLink}><Linkedin size={16} /></a>
          <a href="#" className={styles.footerSocialLink}><Rss size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
