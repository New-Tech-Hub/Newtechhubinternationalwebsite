import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const FEEDS = [
  { source: 'TechCrunch AI', category: 'AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { source: 'Wired AI', category: 'AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { source: 'ScienceDaily AI', category: 'AI', url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml' },
  { source: 'ScienceDaily STEM', category: 'STEM', url: 'https://www.sciencedaily.com/rss/matter_energy.xml' },
  { source: 'MIT News', category: 'Innovation', url: 'https://news.mit.edu/rss/topic/artificial-intelligence2' },
  { source: 'Hacker News', category: 'Tech', url: 'https://hnrss.org/frontpage' },
  { source: 'Opportunities For Africans', category: 'Opportunities', url: 'https://www.opportunitiesforafricans.com/feed/' },
  { source: 'AI Conferences', category: 'Conferences', url: 'https://www.kdnuggets.com/feed' },
];

function pick(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  if (!m) return '';
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function pickLink(xml: string): string {
  const cdata = xml.match(/<link[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/link>/i);
  if (cdata) return cdata[1].trim();
  const txt = xml.match(/<link[^>]*>([^<]+)<\/link>/i);
  if (txt && txt[1].trim()) return txt[1].trim();
  const href = xml.match(/<link[^>]*href=["']([^"']+)["']/i);
  return href ? href[1] : '';
}

async function fetchFeed(feed: typeof FEEDS[number]) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 NewTechHub/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items: any[] = [];
    const itemRe = /<(item|entry)[\s\S]*?<\/(item|entry)>/gi;
    const matches = xml.match(itemRe) || [];
    for (const raw of matches.slice(0, 8)) {
      const title = pick(raw, 'title');
      const link = pickLink(raw);
      const pubDate = pick(raw, 'pubDate') || pick(raw, 'published') || pick(raw, 'updated');
      const desc = pick(raw, 'description') || pick(raw, 'summary') || pick(raw, 'content');
      if (title && link) {
        items.push({
          title,
          link,
          pubDate,
          description: desc.slice(0, 280),
          source: feed.source,
          category: feed.category,
        });
      }
    }
    return items;
  } catch (e) {
    console.error('Feed error', feed.source, e);
    return [];
  }
}

let cache: { ts: number; data: any[] } | null = null;
const CACHE_MS = 30 * 60 * 1000; // 30 min

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (cache && Date.now() - cache.ts < CACHE_MS) {
      return new Response(JSON.stringify({ items: cache.data, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const results = await Promise.all(FEEDS.map(fetchFeed));
    const items = results.flat().sort((a, b) => {
      const ta = Date.parse(a.pubDate || '') || 0;
      const tb = Date.parse(b.pubDate || '') || 0;
      return tb - ta;
    });
    cache = { ts: Date.now(), data: items };
    return new Response(JSON.stringify({ items, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), items: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
