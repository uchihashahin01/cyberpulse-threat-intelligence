# CyberPulse Threat Intelligence Hub

CyberPulse is a modern cybersecurity intelligence portal built with Next.js App Router and TypeScript. It blends live threat news, analyst workflows, and modular intelligence views into a clean multi-page experience.

## Highlights

- Live + fallback intelligence pipeline:
	- GNews API ingestion
	- Curated cybersecurity RSS aggregation
	- Automatic mock-data fallback for resilience
- Multi-page intelligence modules:
	- Dashboard
	- Threat Map
	- CVE Explorer
	- Source Credibility
	- Incident Timeline
	- Alerts
	- Account
	- Admin (role-guarded)
- Analyst-grade UX:
	- Animated active navigation
	- Page-level breadcrumbs
	- Search-driven feed filtering
	- Bookmark persistence per local account
	- AI-style incident summary modal with IOC/mitigation hints
- Performance and quality:
	- Next Image optimization (with robust remote host patterns)
	- Typed domain models and utilities
	- Lint + production build verified

## Stack

- Next.js 16 (App Router)
- TypeScript
- CSS Modules + global design tokens
- Lucide React
- fast-xml-parser

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Create environment file.

```bash
cp .env.example .env.local
```

3. Add your API key.

```env
GNEWS_API_KEY=your_gnews_api_key
```

4. Start development server.

```bash
npm run dev
```

5. Build for production check.

```bash
npm run build
```

## News API Route

Endpoint:

- GET /api/news

Query parameters:

- category: all, malware, data-breach, vulnerability, ransomware, phishing, apt, privacy, general
- search: free-text search
- limit: 1-50 (default 24)

Example:

```bash
curl "http://localhost:3000/api/news?category=malware&search=linux&limit=12"
```

## Admin Access Model

- The Account module controls role state in local storage.
- Admin route protection is enforced in UI flow:
	- Admin nav/module visibility is hidden for non-admin users.
	- Direct access to /admin redirects non-admin users to /account.

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow at:

- .github/workflows/deploy-pages.yml

How it works:

1. Push to main.
2. Workflow builds a static export and deploys it to GitHub Pages.
3. The site is published from the out artifact.

Static deployment mode notes:

- GitHub Pages is static hosting, so deployment runs in static-export mode.
- In static-export mode, the dashboard uses bundled mock intelligence when server APIs are unavailable.
- Local development and standard server deployments still support live API route behavior.

## Suggested Repository Name

- cyberpulse-threat-intelligence

## License

Use and adapt for educational and portfolio purposes.
