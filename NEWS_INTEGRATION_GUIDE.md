# News Feed Integration Guide 📰

## Overview
This guide explains how to integrate real news data into your Public Health News page.

---

## ✅ What's Already Done

1. **News Page Created** - [src/pages/News.tsx](src/pages/News.tsx)
   - Beautiful, responsive UI with gradient header
   - Search functionality
   - Category filtering (Policy, Disease Control, Research, Mental Health, etc.)
   - Grid and featured article layouts
   - Currently uses mock data (8 sample articles)

2. **Routing Configured** - [src/App.tsx](src/App.tsx)
   - Route `/news` added
   - Accessible at: `http://localhost:5173/news`

3. **Navigation Updated**
   - Desktop menu: [src/components/Header.tsx](src/components/Header.tsx)
   - Mobile menu: [src/components/MobileMenu.tsx](src/components/MobileMenu.tsx)
   - "News" link appears between "Resources" and "Magazines"

---

## 🔌 Integration Options

### Option 1: NewsAPI.org (Recommended for Automated News)

**Best for:** Real-time automated news aggregation

#### Steps:
1. Sign up at [newsapi.org](https://newsapi.org)
2. Get your free API key (100 requests/day on free tier)
3. Install axios if not already installed:
   ```bash
   npm install axios
   ```

4. Create API service file:
   ```typescript
   // src/services/newsApi.ts
   import axios from 'axios';

   const NEWS_API_KEY = 'your_api_key_here';
   const BASE_URL = 'https://newsapi.org/v2';

   export const fetchIndiaHealthNews = async () => {
     try {
       const response = await axios.get(`${BASE_URL}/everything`, {
         params: {
           q: 'public health OR healthcare OR medical',
           language: 'en',
           sortBy: 'publishedAt',
           domains: 'thehindu.com,timesofindia.indiatimes.com,indianexpress.com,theguardian.com',
           apiKey: NEWS_API_KEY,
         }
       });

       return response.data.articles.map((article: any) => ({
         id: article.url,
         title: article.title,
         description: article.description,
         source: article.source.name,
         url: article.url,
         imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
         publishedAt: article.publishedAt,
         category: 'General',
         tags: []
       }));
     } catch (error) {
       console.error('Error fetching news:', error);
       return [];
     }
   };
   ```

5. Update News.tsx:
   ```typescript
   import { fetchIndiaHealthNews } from '@/services/newsApi';

   // In the useEffect:
   useEffect(() => {
     const loadNews = async () => {
       const articles = await fetchIndiaHealthNews();
       setNewsArticles(articles);
       setFilteredArticles(articles);
     };
     loadNews();
   }, []);
   ```

**Pros:**
- Real-time updates
- Automatic article discovery
- Large database of sources

**Cons:**
- 100 requests/day limit on free tier
- Need paid plan for production ($449/month)
- Less control over content quality

---

### Option 2: Contentful CMS (Recommended for Quality Control)

**Best for:** Curated, high-quality content with full editorial control

#### Steps:
1. Already integrated in your project! Check [src/lib/contentful.ts](src/lib/contentful.ts)

2. Create new content type in Contentful dashboard:
   - Content Type Name: `newsArticle`
   - Fields:
     - `title` (Short text)
     - `description` (Long text)
     - `content` (Rich text)
     - `source` (Short text)
     - `externalUrl` (Short text)
     - `coverImage` (Media)
     - `publishedDate` (Date & time)
     - `category` (Short text)
     - `tags` (Short text, multiple)

3. Update News.tsx to fetch from Contentful:
   ```typescript
   import client from "@/lib/contentful";

   useEffect(() => {
     const fetchNews = async () => {
       try {
         const res = await client.getEntries({
           content_type: "newsArticle",
           order: '-fields.publishedDate'
         });

         const articles = res.items.map((item: any) => ({
           id: item.sys.id,
           title: item.fields.title,
           description: item.fields.description,
           source: item.fields.source,
           url: item.fields.externalUrl,
           imageUrl: item.fields.coverImage?.fields?.file?.url || '',
           publishedAt: item.fields.publishedDate,
           category: item.fields.category,
           tags: item.fields.tags || []
         }));

         setNewsArticles(articles);
         setFilteredArticles(articles);
       } catch (err) {
         console.error("Error fetching news:", err);
       }
     };
     fetchNews();
   }, []);
   ```

**Pros:**
- Full content control
- No daily limits
- Already integrated in your project
- Can curate India-specific health news

**Cons:**
- Manual content entry
- Requires team to publish articles

---

### Option 3: RSS Feed Aggregation

**Best for:** Free, reliable news from government sources

#### Official Indian Health Sources:
- Ministry of Health & Family Welfare: `https://www.mohfw.gov.in/`
- WHO India: `https://www.who.int/india`
- ICMR: `https://www.icmr.gov.in/`
- PIB (Press Information Bureau): `https://pib.gov.in/indexd.aspx`

#### Steps:
1. Install RSS parser:
   ```bash
   npm install rss-parser
   ```

2. Create RSS service:
   ```typescript
   // src/services/rssParser.ts
   import Parser from 'rss-parser';

   const parser = new Parser();

   export const fetchRSSFeeds = async () => {
     const feeds = [
       'https://www.who.int/rss-feeds/news-english.xml',
       // Add more RSS feed URLs
     ];

     const allArticles = [];
     for (const feedUrl of feeds) {
       try {
         const feed = await parser.parseURL(feedUrl);
         const articles = feed.items.map(item => ({
           id: item.link || item.guid,
           title: item.title,
           description: item.contentSnippet,
           source: feed.title,
           url: item.link,
           imageUrl: item.enclosure?.url || '',
           publishedAt: item.pubDate,
           category: 'General',
           tags: item.categories || []
         }));
         allArticles.push(...articles);
       } catch (error) {
         console.error('Error parsing RSS feed:', error);
       }
     }
     return allArticles;
   };
   ```

**Pros:**
- Free
- Reliable government sources
- No API limits

**Cons:**
- Limited to sources with RSS feeds
- Less structured data
- May need backend proxy to avoid CORS issues

---

### Option 4: Hybrid Approach (Best Solution!)

**Combine Contentful + NewsAPI for best results:**

1. Use **Contentful** for:
   - Featured/curated articles
   - In-depth analysis pieces
   - Exclusive content

2. Use **NewsAPI** for:
   - Latest breaking news
   - Automatic updates
   - Broader coverage

3. Merge both sources in News.tsx:
   ```typescript
   useEffect(() => {
     const loadAllNews = async () => {
       const [contentfulArticles, apiArticles] = await Promise.all([
         fetchContentfulNews(),
         fetchNewsAPIArticles()
       ]);

       const combined = [...contentfulArticles, ...apiArticles];
       setNewsArticles(combined);
       setFilteredArticles(combined);
     };
     loadAllNews();
   }, []);
   ```

---

## 🎨 Current Features

### Search & Filter
- Real-time search by title, description, or tags
- Category filtering with badges
- Responsive filter buttons

### Article Display
- Featured article section (large card)
- Grid layout for regular articles
- Hover effects and animations
- External link indicators

### Categories Included
- Policy
- Disease Control
- Research
- Mental Health
- Vaccination
- Environmental Health
- Technology
- Maternal Health

---

## 🚀 Next Steps

1. **Choose your integration method** (Contentful recommended to start)
2. **Replace mock data** in News.tsx
3. **Test the integration** locally
4. **Add article detail pages** (optional):
   ```typescript
   // Add route in App.tsx
   <Route path="/news/:id" element={<NewsDetail />} />
   ```
5. **Consider adding**:
   - Pagination
   - Social sharing buttons
   - Bookmarking functionality
   - Newsletter signup

---

## 📝 Environment Variables

If using NewsAPI, add to `.env`:
```
VITE_NEWS_API_KEY=your_api_key_here
```

Access in code:
```typescript
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
```

---

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors with external APIs:
1. Set up a backend proxy
2. Use Netlify/Vercel serverless functions
3. Or configure CORS headers in your backend

### Image Loading
If images fail to load:
- Add fallback images
- Use placeholder service: `https://placehold.co/800x400/1b8ebf/white?text=News`

---

## 📚 Resources

- [NewsAPI Documentation](https://newsapi.org/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [RSS Parser NPM](https://www.npmjs.com/package/rss-parser)
- [React Query for Caching](https://tanstack.com/query/latest)

---

## ✅ Testing Checklist

- [ ] News page loads without errors
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Articles display correctly
- [ ] External links open in new tabs
- [ ] Mobile responsive design
- [ ] Loading states implemented
- [ ] Error handling in place

---

**Need Help?** Check the inline comments in `src/pages/News.tsx` for additional guidance!
