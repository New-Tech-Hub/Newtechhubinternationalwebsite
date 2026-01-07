import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

const managementTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. James Okonkwo',
    role: 'Founder & CEO',
    department: 'Executive',
    bio: 'Visionary leader with 15+ years in tech education. Passionate about bridging the digital skills gap across Africa.',
    linkedin: '#',
    twitter: '#',
    email: 'james@newtechhub.com'
  },
  {
    id: '2',
    name: 'Sarah Adeyemi',
    role: 'Chief Operations Officer',
    department: 'Executive',
    bio: 'Operations expert specializing in scaling educational platforms. Former consultant at leading EdTech firms.',
    linkedin: '#',
    email: 'sarah@newtechhub.com'
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Chief Technology Officer',
    department: 'Executive',
    bio: 'Tech innovator with expertise in AI and learning management systems. Building the future of online education.',
    linkedin: '#',
    twitter: '#',
    email: 'michael@newtechhub.com'
  },
  {
    id: '4',
    name: 'Grace Nwachukwu',
    role: 'Head of Curriculum',
    department: 'Academic',
    bio: 'Curriculum development specialist ensuring our courses meet global industry standards.',
    linkedin: '#',
    email: 'grace@newtechhub.com'
  },
];

const staffTeam: TeamMember[] = [
  {
    id: '5',
    name: 'David Mensah',
    role: 'Senior Web Development Instructor',
    department: 'Faculty',
    bio: 'Full-stack developer with 10+ years experience. Specializes in React, Node.js, and modern web technologies.',
    linkedin: '#'
  },
  {
    id: '6',
    name: 'Amina Hassan',
    role: 'Digital Marketing Lead Instructor',
    department: 'Faculty',
    bio: 'Digital marketing strategist with expertise in SEO, social media, and growth hacking.',
    linkedin: '#',
    twitter: '#'
  },
  {
    id: '7',
    name: 'Emmanuel Eze',
    role: 'AI & Data Science Instructor',
    department: 'Faculty',
    bio: 'Data scientist passionate about making AI accessible. Former ML engineer at top tech companies.',
    linkedin: '#'
  },
  {
    id: '8',
    name: 'Fatima Bello',
    role: 'Graphic Design Instructor',
    department: 'Faculty',
    bio: 'Award-winning designer with expertise in branding, UI/UX, and visual storytelling.',
    linkedin: '#',
    twitter: '#'
  },
  {
    id: '9',
    name: 'Peter Okoro',
    role: 'Student Success Manager',
    department: 'Support',
    bio: 'Dedicated to ensuring every student achieves their learning goals and career aspirations.',
    email: 'peter@newtechhub.com'
  },
  {
    id: '10',
    name: 'Linda Afolabi',
    role: 'Admissions Coordinator',
    department: 'Support',
    bio: 'First point of contact for prospective students. Helping learners find the right path.',
    email: 'linda@newtechhub.com'
  },
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
      {member.image ? (
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center text-4xl font-bold text-primary">
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
      )}
    </div>
    <CardContent className="p-5">
      <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
      <p className="text-primary font-medium text-sm">{member.role}</p>
      <p className="text-xs text-muted-foreground mb-3">{member.department}</p>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{member.bio}</p>
      <div className="flex gap-2">
        {member.linkedin && (
          <a href={member.linkedin} className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors">
            <Linkedin className="w-4 h-4 text-muted-foreground" />
          </a>
        )}
        {member.twitter && (
          <a href={member.twitter} className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors">
            <Twitter className="w-4 h-4 text-muted-foreground" />
          </a>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors">
            <Mail className="w-4 h-4 text-muted-foreground" />
          </a>
        )}
      </div>
    </CardContent>
  </Card>
);

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Meet Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              The passionate professionals behind NewTech Hub International, dedicated to transforming lives through quality tech education.
            </p>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Leadership & Management</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our executive team brings decades of combined experience in technology, education, and business leadership.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementTeam.map((member, index) => (
              <div key={member.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Our Expert Faculty & Staff</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry professionals and dedicated support staff committed to your success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffTeam.map((member, index) => (
              <div key={member.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Join Our Growing Team</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We're always looking for passionate educators and professionals to join our mission.
          </p>
          <Link to="/#contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
