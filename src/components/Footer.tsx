import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import OCLogo from '../media/OClogo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={OCLogo} alt="Orincore's AI Studio" className="h-8 w-auto" />
              <span className="text-xl font-bold">Orincore's AI Studio</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Transform your creative vision into reality with our advanced AI-powered image generation platform. 
              From text-to-image to professional designs, we make AI creativity accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Pricing</Link></li>
              <li><Link to="/generate" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Dashboard</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">API Access</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Integrations</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Contact</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Careers</a></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Orincore's AI Studio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
              Privacy
            </Link>
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;