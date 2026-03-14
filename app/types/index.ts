export interface Article {
  id: string;
  slug?: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  image: string;
  source: string;
  sourceIcon?: string;
  category: Category;
  publishedAt: string;
  author?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface ArticleInsight {
  summary: string;
  keyIOCs: string[];
  mitigations: string[];
}

export interface ArticleScore {
  readTimeMinutes: number;
  sentiment: Sentiment;
  risk: RiskLevel;
  sourceCredibility: number;
}

export type Category =
  | 'all'
  | 'malware'
  | 'data-breach'
  | 'vulnerability'
  | 'ransomware'
  | 'phishing'
  | 'apt'
  | 'privacy'
  | 'general';

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  color: string;
}

export interface ThreatLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  color: string;
  description: string;
}

export interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface NewsQueryParams {
  category?: Category;
  search?: string;
  limit?: number;
}

export interface NewsResponse {
  articles: Article[];
  meta: {
    total: number;
    source: 'live' | 'fallback';
    updatedAt: string;
  };
}

export interface ThreatLocation {
  id: string;
  region: string;
  latitude: number;
  longitude: number;
  intensity: number;
  incidents: number;
  primaryThreat: string;
}

export interface CVERecord {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  vendor: string;
  product: string;
  publishedAt: string;
  summary: string;
  exploited: boolean;
}

export interface SourceCredibility {
  source: string;
  score: number;
  rationale: string;
  lastAudited: string;
}

export interface IncidentMilestone {
  id: string;
  campaign: string;
  date: string;
  stage: 'initial-access' | 'lateral-movement' | 'exfiltration' | 'response' | 'recovery';
  detail: string;
}

export interface AlertSubscription {
  id: string;
  channel: 'email' | 'telegram';
  destination: string;
  category: Category;
  keywords: string[];
  enabled: boolean;
}

export interface LocalAccount {
  username: string;
  role: 'analyst' | 'admin';
}

export interface AdminState {
  pinnedArticleIds: string[];
  disabledSources: string[];
}
