import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Newspaper, Loader2 } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  category: string;
}

const CATEGORIES = ["All", "AI", "Tech", "STEM", "Innovation", "Conferences", "Opportunities"];

const News = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    document.title = "Daily Tech & AI News | New Tech Hub";
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("tech-news");
        if (error) throw error;
        setItems(data?.items || []);
      } catch (e) {
        console.error("Failed to load news", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.category === active)),
    [items, active]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Newspaper className="h-4 w-4" /> Daily Updates
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3">
            Tech, AI & Innovation News
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated daily updates across Technology, STEM, Artificial Intelligence, conferences, innovation and opportunities.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={active === c ? "default" : "outline"}
              onClick={() => setActive(c)}
              className={active === c ? "bg-primary text-white" : ""}
            >
              {c}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No news available right now. Please check back later.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <Card key={i} className="p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground truncate">{item.source}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 line-clamp-3 leading-snug">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ""}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent text-sm font-semibold inline-flex items-center gap-1"
                  >
                    Read <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default News;
