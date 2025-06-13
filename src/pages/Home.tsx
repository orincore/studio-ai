import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Image, 
  Palette, 
  Zap, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  Users,
  Award,
  Layers
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Image className="h-8 w-8" />,
      title: "Text-to-Image Generation",
      description: "Transform your ideas into stunning visuals with advanced AI models"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Style Presets",
      description: "Choose from realistic, anime, cartoon, logo, and artistic styles"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Generate high-quality images in seconds, not hours"
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Multiple Tools", 
      description: "Thumbnails, logos, posters, and more in one platform"
    }
  ];

  const stats = [
    { number: "1M+", label: "Images Generated" },
    { number: "50K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      content: "Orincore's AI Studio has revolutionized my content creation workflow. I can generate stunning thumbnails and visuals in minutes!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      content: "The quality and speed of image generation is incredible. Our marketing campaigns have never looked better.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Graphic Designer",
      content: "As a designer, I love how this tool enhances my creativity rather than replacing it. The style options are amazing!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-purple-50 pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-purple-100 rounded-full p-4">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Create Stunning AI Images
              <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                In Seconds
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Transform your creative vision into reality with Orincore's AI Studio. Generate professional images, 
              thumbnails, logos, and artwork using cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link
                to="/signup"
                className="bg-purple-gradient text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200">
                <Play className="h-5 w-5" />
                <span className="font-semibold">Watch Demo</span>
              </button>
            </div>
            <div className="mt-12 flex justify-center">
              <div className="bg-white rounded-xl shadow-2xl p-4 max-w-4xl w-full">
                <img 
                  src="https://images.pexels.com/photos/8566481/pexels-photo-8566481.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="AI Generated Art Example"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful AI Tools for
              <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Every Creator
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From content creators to businesses, our comprehensive suite of AI tools 
              empowers you to create professional-quality visuals effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-100"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/features"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold text-lg transition-colors duration-200"
            >
              <span>Explore All Features</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of
              <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Creative Professionals
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-purple-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-purple-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Creative Process?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join thousands of creators who are already using Orincore's AI Studio to bring their visions to life.
            Start with free credits and experience the future of AI-powered creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-purple-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free credits included</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;