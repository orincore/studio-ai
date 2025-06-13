import React from 'react';
import { FileText, Calendar, Shield, AlertCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <FileText className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using Orincore's AI Studio services.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Last updated: March 1, 2025</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Version 2.1</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700">
                By accessing or using Orincore's AI Studio services, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") govern your use of Orincore's AI Studio's website, services, and applications 
              (collectively, the "Service") operated by Orincore AI Inc. ("us", "we", or "our").
            </p>
            <p className="text-gray-700">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any 
              part of these terms, then you may not access the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Orincore's AI Studio provides AI-powered image generation services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Text-to-image generation using advanced AI models</li>
              <li>AI thumbnail creation for content creators</li>
              <li>AI logo generation for businesses</li>
              <li>AI poster and marketing material creation</li>
              <li>Profile picture and avatar generation</li>
              <li>Various specialized AI art tools</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 mb-4">
              You agree not to use the Service to generate, create, or distribute content that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Is illegal, harmful, threatening, abusive, or defamatory</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains nudity, sexual content, or adult material</li>
              <li>Promotes violence, hatred, or discrimination</li>
              <li>Violates privacy rights of individuals</li>
              <li>Contains malicious code or attempts to harm our systems</li>
              <li>Impersonates any person or entity</li>
              <li>Is used for spam or unsolicited communications</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Generated Content</h3>
            <p className="text-gray-700 mb-4">
              Subject to your compliance with these Terms and payment of applicable fees:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>You retain ownership of images generated using paid plans</li>
              <li>Free plan images are for personal use only and may include watermarks</li>
              <li>Commercial use requires a paid subscription or credit purchase</li>
              <li>You are responsible for ensuring your use complies with applicable laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Service Content</h3>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by Orincore AI 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Subscription Plans</h3>
            <p className="text-gray-700 mb-4">
              Paid subscriptions are billed in advance on a monthly or annual basis. You will be charged 
              the subscription fee at the beginning of each billing period.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Credit System</h3>
            <p className="text-gray-700 mb-4">
              Our service operates on a credit-based system where each image generation consumes credits. 
              Subscription credits reset monthly, while purchased credit packs never expire.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Refunds</h3>
            <p className="text-gray-700 mb-4">
              We offer a 30-day money-back guarantee for subscription plans. One-time credit purchases 
              are non-refundable but never expire.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your 
              use of the Service, to understand our practices.
            </p>
            <p className="text-gray-700">
              We may collect and use your data as described in our Privacy Policy, including for improving 
              our AI models and services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Service Availability</h3>
            <p className="text-gray-700 mb-4">
              We strive to maintain high service availability but cannot guarantee uninterrupted access. 
              The Service is provided "as is" without warranties of any kind.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 AI-Generated Content</h3>
            <p className="text-gray-700 mb-4">
              AI-generated content may not always be accurate, appropriate, or suitable for your intended use. 
              You are responsible for reviewing and validating all generated content before use.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior 
              notice, for conduct that we believe violates these Terms or is harmful to other users, us, 
              or third parties.
            </p>
            <p className="text-gray-700">
              You may terminate your account at any time by contacting us or through your account settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of significant 
              changes via email or through the Service. Continued use of the Service after changes constitutes 
              acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@orincore-ai-studio.com</p>
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

export default Terms;