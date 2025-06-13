import React from 'react';
import { Shield, Calendar, Lock, Eye, Database, UserCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Last updated: March 1, 2025</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="h-4 w-4" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Encryption</h3>
            <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Selling</h3>
            <p className="text-sm text-gray-600">We never sell your personal data to third parties</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
            <p className="text-sm text-gray-600">You control your data and can delete it anytime</p>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Information You Provide</h3>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Profile information and preferences</li>
              <li>Text prompts and descriptions for image generation</li>
              <li>Communications with our support team</li>
              <li>Feedback and survey responses</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Information We Collect Automatically</h3>
            <p className="text-gray-700 mb-4">
              When you use our Service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Usage data (features used, time spent, generation history)</li>
              <li>Device information (browser type, operating system, IP address)</li>
              <li>Log data (access times, pages viewed, errors encountered)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide, maintain, and improve our AI image generation services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
              <li>Improve our AI models and algorithms (with anonymized data)</li>
              <li>Personalize your experience and provide relevant content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 We Do Not Sell Your Data</h3>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties for marketing purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 When We Share Information</h3>
            <p className="text-gray-700 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our service</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI Model Training and Generated Content</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Model Improvement</h3>
            <p className="text-gray-700 mb-4">
              We may use anonymized and aggregated data from image generations to improve our AI models. 
              This helps us provide better results for all users.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Generated Images</h3>
            <p className="text-gray-700 mb-4">
              Images you generate are stored securely and are only accessible to you. We do not use your 
              specific generated images for marketing or share them with other users without your consent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication measures</li>
              <li>Secure cloud infrastructure with leading providers</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Account Information</h3>
            <p className="text-gray-700 mb-4">
              You can update, correct, or delete your account information at any time through your account settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Data Rights (GDPR)</h3>
            <p className="text-gray-700 mb-4">
              If you're in the European Union, you have additional rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Marketing Communications</h3>
            <p className="text-gray-700 mb-4">
              You can opt out of marketing emails by clicking the unsubscribe link or contacting us directly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our service</li>
              <li>Provide personalized content and features</li>
              <li>Measure the effectiveness of our marketing</li>
            </ul>
            <p className="text-gray-700">
              You can control cookies through your browser settings, but some features may not work properly if disabled.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Account data: Until you delete your account</li>
              <li>Generated images: Until you delete them or your account</li>
              <li>Usage logs: Up to 2 years for security and analytics</li>
              <li>Payment records: As required by law (typically 7 years)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for international transfers, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Adequacy decisions for certain countries</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you become aware that a child has provided 
              us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Sending you an email notification</li>
              <li>Providing notice through our Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@orincore-ai-studio.com</p>
              <p className="text-gray-700 mb-2"><strong>Data Protection Officer:</strong> dpo@orincore-ai-studio.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Innovation Street, Suite 100, San Francisco, CA 94105</p>
              <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-purple-gradient text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;