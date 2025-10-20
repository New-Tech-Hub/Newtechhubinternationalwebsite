import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Calendar, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

const Community = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForums = async () => {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setForums(data);
      }
      setLoading(false);
    };

    fetchForums();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Join Our Learning Community
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with fellow learners, share knowledge, get support, and grow together
              </p>
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>
        </section>

        {/* Community Features */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Discussion Forums</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions, share insights, and learn from peers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Peer Groups</h3>
                  <p className="text-sm text-muted-foreground">
                    Join study groups and collaborate on projects
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Live Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Weekly Q&A sessions and expert webinars
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Mentorship</h3>
                  <p className="text-sm text-muted-foreground">
                    Get guidance from industry professionals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Active Forums */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Active Discussions</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : forums.length > 0 ? (
                <div className="space-y-4">
                  {forums.map((forum) => (
                    <Card key={forum.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="mb-2">{forum.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{forum.description}</p>
                          </div>
                          <Badge variant="secondary">{forum.category}</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No active discussions yet. Be the first to start a conversation!
                    </p>
                    <Button onClick={() => navigate("/auth")}>Join Community</Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-primary/5 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Web Development Career Q&A</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join our senior developers for a live Q&A session about breaking into tech
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Every Friday, 6PM WAT</span>
                      <Button size="sm">Register</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>AI/ML Study Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Collaborative learning sessions for AI enthusiasts
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Wednesdays, 7PM WAT</span>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;