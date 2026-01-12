import Navigation from "@/components/Navigation";
import { lazy, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = lazy(() => import("@/components/Footer"));

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using NewTech Hub's website and services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              NewTech Hub provides online educational courses, training materials, and related services in technology fields including but not limited to web development, digital marketing, graphic design, AI & data science, and cybersecurity. Our courses may include original instructional materials and curated third-party content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>To access certain features, you must register for an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Course Access and Payments</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>Access to paid courses is granted upon successful payment. Payment terms include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are displayed in Nigerian Naira (NGN) unless otherwise stated</li>
                <li>Payments are processed securely through our payment partners (Paystack)</li>
                <li>Installment payment plans are available for select courses</li>
                <li>Access codes, once redeemed, grant lifetime access to the purchased course</li>
                <li>Refunds may be requested within 7 days of purchase if less than 20% of course content has been accessed</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                All original content, including but not limited to text, graphics, logos, and instructional materials, is the property of NewTech Hub and protected by copyright laws.
              </p>
              <p>
                Third-party content, including embedded YouTube videos, remains the intellectual property of their respective creators. Such content is used for illustrative and educational purposes only under fair use principles. No ownership is claimed over third-party content.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. User Conduct</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Share, distribute, or resell course content without authorization</li>
                <li>Use screen recording, downloading, or copying tools on course materials</li>
                <li>Share login credentials with others</li>
                <li>Attempt to bypass security measures or access restrictions</li>
                <li>Use the platform for any unlawful purpose</li>
                <li>Harass, abuse, or harm other users or instructors</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Certificates</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upon successful completion of eligible courses, you may receive a certificate of completion. Certificates are for personal achievement recognition and may not guarantee employment or professional certification. The validity and acceptance of certificates are at the discretion of third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                Services are provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uninterrupted or error-free access to services</li>
                <li>That courses will meet your specific requirements</li>
                <li>Employment or income outcomes after course completion</li>
                <li>Accuracy of all third-party content</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, NewTech Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate or suspend your account and access to services at our sole discretion, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us at:{" "}
              <a href="mailto:legal@newtechhub.com" className="text-primary hover:underline">
                legal@newtechhub.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default TermsOfService;
