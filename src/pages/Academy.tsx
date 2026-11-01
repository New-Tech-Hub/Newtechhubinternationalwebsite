import Navigation from "@/components/Navigation";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const Academy = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main id="main-content">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Academy</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Explore every course module — filter by category or search for what you want to learn.
          </p>
        </Reveal>
      </header>
      <Courses />
    </main>
    <Footer />
  </div>
);

export default Academy;