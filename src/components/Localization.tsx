import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Briefcase } from "lucide-react";

const Localization = () => {
  const africanSuccessStories = [
    {
      name: "Chidinma Okafor",
      location: "Lagos, Nigeria",
      course: "Full Stack Web Development",
      outcome: "Now a Senior Developer at Andela, earning ₦850k/month",
      flag: "🇳🇬",
    },
    {
      name: "Kwame Mensah",
      location: "Accra, Ghana",
      course: "Digital Marketing Masterclass",
      outcome: "Started own agency with 15+ clients across West Africa",
      flag: "🇬🇭",
    },
    {
      name: "Amara Njoku",
      location: "Nairobi, Kenya",
      course: "AI & Machine Learning",
      outcome: "Joined Safaricom AI team, working on M-Pesa innovations",
      flag: "🇰🇪",
    },
    {
      name: "Thabo Mthembu",
      location: "Johannesburg, South Africa",
      course: "UI/UX Design Professional",
      outcome: "Lead Designer at Takealot, salary tripled",
      flag: "🇿🇦",
    },
  ];

  const localFeatures = [
    {
      icon: Globe,
      title: "African-Focused Content",
      description: "Case studies from Nigerian fintech, Kenyan agritech, Ghanaian e-commerce, and South African startups",
    },
    {
      icon: MapPin,
      title: "Local Language Support",
      description: "Courses available with subtitles in Yoruba, Igbo, Hausa, Swahili, Zulu, and French",
    },
    {
      icon: Briefcase,
      title: "Regional Job Market Insights",
      description: "Skills aligned with demand in Lagos, Nairobi, Accra, Cape Town tech hubs",
    },
  ];

  return (
    <section id="localization" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built for Africa, By Africans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our content reflects African realities, opportunities, and success stories
          </p>
        </div>

        {/* Local Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {localFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="bg-muted/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Success Stories from Across the Continent
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {africanSuccessStories.map((story, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{story.flag}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{story.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {story.location}
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        {story.course}
                      </Badge>
                      <p className="text-sm">{story.outcome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Language Support */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Available Languages & Subtitles</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["English", "Yoruba 🇳🇬", "Igbo 🇳🇬", "Hausa 🇳🇬", "Swahili 🇰🇪", "Zulu 🇿🇦", "Français 🇸🇳", "Amharic 🇪🇹"].map((lang) => (
              <Badge key={lang} variant="outline" className="text-sm">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Localization;