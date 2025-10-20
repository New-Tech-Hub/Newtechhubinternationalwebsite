import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Certificate {
  id: string;
  certificate_number: string;
  issued_at: string;
  verification_url: string;
  skills_acquired: string[];
  courses: {
    title: string;
    category: string;
  };
}

const MyCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchCertificates = async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select(`
          *,
          courses (
            title,
            category
          )
        `)
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (!error && data) {
        setCertificates(data as Certificate[]);
      }
      setLoading(false);
    };

    fetchCertificates();
  }, [user, navigate]);

  const handleShare = (certNumber: string) => {
    const url = `${window.location.origin}/verify-certificate/${certNumber}`;
    navigator.clipboard.writeText(url);
    toast.success("Certificate link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Certificates</h1>
            <p className="text-muted-foreground">
              Your earned certifications and achievements
            </p>
          </div>

          {certificates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Complete courses to earn certificates and boost your career
                </p>
                <Button onClick={() => navigate("/#courses")}>Browse Courses</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{cert.courses.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {cert.courses.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Certificate Number</p>
                        <p className="font-mono text-sm">{cert.certificate_number}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Issued Date</p>
                        <p className="text-sm">
                          {new Date(cert.issued_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {cert.skills_acquired && cert.skills_acquired.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Skills Acquired</p>
                          <div className="flex flex-wrap gap-2">
                            {cert.skills_acquired.map((skill, idx) => (
                              <Badge key={idx} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(cert.certificate_number)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        {cert.verification_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(cert.verification_url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyCertificates;