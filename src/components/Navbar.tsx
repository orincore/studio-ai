import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, User, LogOut, CreditCard, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import OCLogo from '../media/OClogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Wrap useAuth in a try-catch to handle the case when it's not within AuthProvider
  let user = null;
  let logout = async () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
  } catch (error) {
    console.error('Auth context not available:', error);
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Generate', href: '/generate' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'; // Return a default initial if name is undefined
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Helper function to safely get the first name
  const getFirstName = (fullName: string | undefined) => {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    return nameParts.length > 0 ? nameParts[0] : '';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={OCLogo} alt="Orincore's AI Studio" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Orincore's AI Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.credit_balance || 0} Credits</span>
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-gradient flex items-center justify-center text-white text-xs font-medium">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name || 'User'}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        getInitials(user.full_name)
                      )}
                    </div>
                    <span className="text-sm font-medium">{getFirstName(user.full_name)}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
                      </div>
                      <div className="px-4 py-3 bg-purple-50 flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-xs text-purple-600 font-medium">Credits</p>
                            <p className="text-sm font-bold text-gray-900">{user.credit_balance || 0}</p>
                          </div>
                        </div>
                        <Link
                          to="/pricing"
                          onClick={() => setShowDropdown(false)}
                          className="text-xs bg-purple-gradient text-white px-2 py-1 rounded font-medium hover:shadow-sm"
                        >
                          Buy More
                        </Link>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-purple-gradient flex items-center justify-center text-white text-sm font-medium">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name || 'User'}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        getInitials(user.full_name)
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-800">{user.full_name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user.email || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center px-3 py-2 mt-2 text-gray-700 bg-purple-50 rounded-md justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium">{user.credit_balance || 0} Credits</span>
                    </div>
                    <Link
                      to="/pricing"
                      onClick={() => setIsOpen(false)}
                      className="text-xs bg-purple-gradient text-white px-2 py-1 rounded font-medium"
                    >
                      Buy More
                    </Link>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 flex items-center"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 flex items-center"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block mx-3 mt-2 bg-purple-gradient text-white px-4 py-2 rounded-lg text-base font-medium text-center hover:shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;