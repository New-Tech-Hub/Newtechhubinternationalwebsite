import Navigation from "@/components/Navigation";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";

const Academy = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main id="main-content">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Academy</h1>
      </header>
      <Courses />
    </main>
    <Footer />
  </div>
);

export default Academy;