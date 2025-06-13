import React from 'react';
import { 
  Image, 
  Youtube, 
  FileImage, 
  Award, 
  User, 
  Eye, 
  Heart, 
  Film, 
  Star, 
  ShoppingBag, 
  Shirt,
  Sparkles,
  Zap,
  Palette,
  Layers,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: <Image className="h-12 w-12" />,
      title: "Text-to-Image Generation",
      description: "Transform your imagination into stunning visuals with our advanced Stability AI SDXL technology. Simply describe what you want to see, and watch as your words become beautiful, high-resolution images.",
      features: ["Multiple style presets", "Custom aspect ratios", "Batch generation", "High-resolution output"]
    },
    {
      icon: <Youtube className="h-12 w-12" />,
      title: "AI Thumbnail Creator",
      description: "Create eye-catching YouTube thumbnails that boost your click-through rates. Upload your image, add compelling text, and let our AI generate professional thumbnails optimized for engagement.",
      features: ["YouTube-optimized sizes", "Text overlay options", "Brand consistency", "A/B testing support"]
    },
    {
      icon: <FileImage className="h-12 w-12" />,
      title: "AI Poster Creator", 
      description: "Design professional posters for events, marketing campaigns, or announcements. Upload your assets, specify your requirements, and generate stunning poster designs in minutes.",
      features: ["Event poster templates", "Marketing materials", "Custom branding", "Print-ready formats"]
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: "AI Logo Generator",
      description: "Create unique, professional logos for your business or personal brand. Input your business name and preferred style, and our AI will generate multiple logo concepts for you to choose from.",
      features: ["Multiple style options", "Vector formats", "Brand guideline generation", "Unlimited revisions"]
    },
    {
      icon: <User className="h-12 w-12" />,
      title: "AI Profile Picture Creator",
      description: "Generate professional headshots and avatars perfect for social media, LinkedIn, or business use. Transform your selfies into polished, professional-looking profile pictures.",
      features: ["Professional headshots", "Social media ready", "Multiple variations", "Background removal"]
    },
    {
      icon: <Eye className="h-12 w-12" />,
      title: "Dream Visualizer",
      description: "Bring your wildest dreams and surreal visions to life. Describe your dream scenarios, no matter how abstract or fantastical, and watch them materialize as stunning visual art.",
      features: ["Surreal imagery", "Abstract concepts", "Dream interpretation", "Artistic styles"]
    }
  ];

  const additionalFeatures = [
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Mood-Based Art Generator",
      description: "Create artwork that captures specific emotions and moods. Select from happy, nostalgic, melancholic, energetic, and more to generate art that resonates with your feelings."
    },
    {
      icon: <Film className="h-12 w-12" />,
      title: "Selfie-to-Movie Poster",
      description: "Transform your photos into epic movie posters. Upload your selfie and choose from various movie genres to create personalized, blockbuster-style posters."
    },
    {
      icon: <Star className="h-12 w-12" />,
      title: "Zodiac Personality Illustration",
      description: "Generate beautiful, personalized illustrations based on your zodiac sign and personality traits. Perfect for social media or personal artwork."
    },
    {
      icon: <ShoppingBag className="h-12 w-12" />,
      title: "Product Mockup Generator",
      description: "Create professional product mockups for your e-commerce business. Showcase your products in realistic settings to boost sales and engagement."
    },
    {
      icon: <Shirt className="h-12 w-12" />,
      title: "T-shirt & Merch Design",
      description: "Design unique graphics for t-shirts, mugs, and other merchandise. Perfect for print-on-demand businesses or personal projects."
    }
  ];

  const comingSoon = [
    "Inpainting & Outpainting",
    "Batch Generation (50+ images)",
    "AI Upscaling (HD Enhancement)",
    "Private Model Training",
    "API Access for Developers",
    "Advanced Style Transfer",
    "Video Generation",
    "3D Asset Creation"
  ];

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-purple-100 rounded-full p-4">
              <Sparkles className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful AI Tools for
            <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Every Creative Need
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            From simple text-to-image generation to complex design workflows, Orincore's AI Studio provides 
            a comprehensive suite of AI-powered tools to transform your creative process.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our flagship tools designed to handle the most common creative challenges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg border border-purple-100">
                <div className="text-purple-600 mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-gray-700">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Specialized Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unique AI tools designed for specific use cases and creative expressions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-24 bg-purple-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto">
              We're constantly innovating and adding new features to enhance your creative workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoon.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 text-white" />
                  <span className="text-white font-semibold">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technical Excellence</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built on cutting-edge technology for professional-grade results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Layers className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced AI Models</h3>
              <p className="text-gray-600">
                Powered by Stability AI SDXL, ControlNet, and ESRGAN for superior image quality and control
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate high-quality images in seconds with our optimized infrastructure and GPU acceleration
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Palette className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Style Variety</h3>
              <p className="text-gray-600">
                Support for multiple art styles including realistic, anime, cartoon, logo design, and fine art
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore All Features?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Start creating with our comprehensive suite of AI tools. Get free credits to test 
            all features and see which ones work best for your creative workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/signup"
              className="bg-purple-gradient text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/generate"
              className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Try Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;