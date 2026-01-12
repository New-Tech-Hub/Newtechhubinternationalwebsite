import Navigation from "@/components/Navigation";
import { lazy, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = lazy(() => import("@/components/Footer"));

const PrivacyPolicy = () => {
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

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              NewTech Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Name and email address</li>
                  <li>Phone number</li>
                  <li>Payment information (processed securely through Paystack)</li>
                  <li>Profile information and preferences</li>
                  <li>Course progress and completion data</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Automatically Collected Information</h3>
                <p>When you access our services, we may automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Sending course updates, certificates, and important notifications</li>
                <li>Personalizing your learning experience</li>
                <li>Improving our platform and developing new features</li>
                <li>Communicating with you about promotions and new courses (with your consent)</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Ensuring security and preventing fraud</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform (payment processors, hosting services)</li>
                <li><strong>Business Partners:</strong> Partner organizations for collaborative training programs (with your consent)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
              <p className="mt-4">
                We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security assessments and updates</li>
                <li>Row-level security policies for database access</li>
                <li>Secure payment processing through PCI-compliant providers</li>
              </ul>
              <p className="mt-4">
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and login status</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Personalize content and advertisements</li>
                <li>Track course progress</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Disabling cookies may affect some functionality of our services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Account data is retained while your account is active. After account deletion, we may retain certain information for legal, accounting, or legitimate business purposes for up to 7 years.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites and embedded content (including YouTube videos). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>For questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
              <ul className="list-none space-y-2">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@newtechhub.com" className="text-primary hover:underline">
                    privacy@newtechhub.com
                  </a>
                </li>
                <li>
                  <strong>General Inquiries:</strong>{" "}
                  <a href="mailto:info@newtechhub.com" className="text-primary hover:underline">
                    info@newtechhub.com
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default PrivacyPolicy;
