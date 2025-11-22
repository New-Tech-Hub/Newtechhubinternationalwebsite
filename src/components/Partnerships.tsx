import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, Landmark, Wifi, Globe } from "lucide-react";
import { PartnershipSkeleton } from "@/components/SkeletonLoader";

interface Partnership {
  id: string;
  partner_name: string;
  partner_type: string;
  logo_url: string;
  description: string;
  website_url: string;
  location: string;
}

const partnerIcons = {
  university: GraduationCap,
  company: Building2,
  government: Landmark,
  telecom: Wifi,
  ngo: Globe,
};

const Partnerships = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerships = async () => {
      const { data, error } = await supabase
        .from("partnerships")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPartnerships(data);
      }
      setLoading(false);
    };

    fetchPartnerships();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-muted animate-pulse rounded w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <PartnershipSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (partnerships.length === 0) {
    return (
      <section id="partnerships" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Strategic Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building partnerships across Africa to expand opportunities
            </p>
          </div>
          <div className="bg-card rounded-xl p-12 text-center shadow-lg">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              We're actively building partnerships with leading organizations
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="partnerships" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our Strategic Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collaborating with leading organizations across Africa to empower learners and expand opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerships.map((partner) => {
            const Icon = partnerIcons[partner.partner_type as keyof typeof partnerIcons] || Building2;
            return (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.partner_name}
                          className="h-12 w-12 object-contain rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">{partner.partner_name}</h4>
                        {partner.location && (
                          <p className="text-xs text-muted-foreground">{partner.location}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {partner.partner_type}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {partner.description}
                  </p>

                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Visit partner website →
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;