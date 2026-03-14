import type { Metadata } from 'next';
import './globals.css';
import NewsTicker from './components/NewsTicker/NewsTicker';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

export const metadata: Metadata = {
  title: 'CyberPulse — Global Cybersecurity News & Threat Intelligence',
  description:
    'Stay ahead of cyber threats. Real-time cybersecurity news aggregation from the world\'s leading security researchers and publications.',
  keywords: [
    'cybersecurity',
    'security news',
    'threat intelligence',
    'data breach',
    'malware',
    'vulnerability',
    'hacking',
    'infosec',
    'cyber threats',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="main-container">
          <NewsTicker />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
