import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    id: 1,
    title: "The Future of AI Image Generation: Trends and Predictions for 2025",
    excerpt: "Explore the latest developments in AI image generation technology and what they mean for creators, businesses, and the future of visual content.",
    author: "Sarah Johnson",
    date: "March 15, 2025",
    readTime: "8 min read",
    image: "https://images.pexels.com/photos/8566481/pexels-photo-8566481.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "AI Technology",
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "10 Pro Tips for Creating Stunning AI-Generated Thumbnails",
      excerpt: "Learn how to craft compelling prompts and use advanced techniques to create thumbnails that boost your content's click-through rates.",
      author: "Mike Chen",
      date: "March 12, 2025",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/1006231/pexels-photo-1006231.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Tutorials"
    },
    {
      id: 3,
      title: "How Small Businesses Are Using AI Art to Transform Their Marketing",
      excerpt: "Case studies and success stories from businesses that have integrated AI-generated visuals into their marketing strategies.",
      author: "Emily Rodriguez",
      date: "March 10, 2025",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Business"
    },
    {
      id: 4,
      title: "Understanding Style Prompts: A Complete Guide",
      excerpt: "Master the art of style prompting to achieve consistent, professional results across all your AI-generated images.",
      author: "David Kim",
      date: "March 8, 2025",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/1286739/pexels-photo-1286739.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Tutorials"
    },
    {
      id: 5,
      title: "The Ethics of AI-Generated Art: What Creators Need to Know",
      excerpt: "Navigate the ethical considerations of AI art creation, including copyright, attribution, and fair use guidelines.",
      author: "Dr. Lisa Park",
      date: "March 5, 2025",
      readTime: "9 min read",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Ethics"
    },
    {
      id: 6,
      title: "Building a Brand with AI-Generated Logos: Success Stories",
      excerpt: "How startups and established businesses are using AI logo generation to create memorable brand identities.",
      author: "Alex Thompson",
      date: "March 3, 2025",
      readTime: "4 min read",
      image: "https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Branding"
    },
    {
      id: 7,
      title: "AI vs. Traditional Design: Finding the Perfect Balance",
      excerpt: "Explore how AI tools complement rather than replace traditional design processes in modern creative workflows.",
      author: "Jennifer Lee",
      date: "February 28, 2025",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Design"
    }
  ];

  const categories = [
    "All Posts",
    "AI Technology", 
    "Tutorials",
    "Business",
    "Ethics",
    "Branding",
    "Design"
  ];

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Orincore's AI Studio
            <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tutorials, and inspiration for AI-powered creativity. Stay updated with the latest 
            trends, tips, and success stories from the world of AI image generation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{featuredPost.date}</span>
                  </div>
                  <span className="text-sm text-gray-600">{featuredPost.readTime}</span>
                </div>
                <button className="bg-purple-gradient text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 w-fit">
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <button className="text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-1 group">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Load More */}
        <section className="text-center mt-12">
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
            Load More Articles
          </button>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-purple-gradient rounded-2xl p-8 mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Stay Updated with AI Creativity
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Get the latest insights, tutorials, and tips delivered to your inbox. 
            Join thousands of creators who rely on our newsletter for AI inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;