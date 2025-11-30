 import { NavLink } from 'react-router-dom';
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter
} from "react-icons/fa";
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import Logo from '../Common/Logo';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: 'https://facebook.com', label: 'Facebook' },
    { icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FaLinkedinIn, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaYoutube, url: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <Logo size="text-4xl" className="text-blue-400" />
                </div>
                <Headings type="h3" className="font-bold text-white text-2xl group-hover:text-blue-400 transition-colors">
                  Zarrin
                </Headings>
              </div>
              <Paragraph className="text-gray-400 text-sm leading-relaxed">
                Empowering writers and readers with inspiring stories and valuable insights.
              </Paragraph>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Heart size={16} className="text-red-500" />
                <span>Made with passion by Zarrin Team</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <Headings type="h5" className="text-white font-bold mb-4 flex items-center space-x-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                <span>Quick Links</span>
              </Headings>
              <nav className="space-y-3">
                {footerLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"></span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <Headings type="h5" className="text-white font-bold mb-4 flex items-center space-x-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                <span>Contact</span>
              </Headings>
              <div className="space-y-3">
                <a href="mailto:contact@zarrin.com" className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 group">
                  <Mail size={16} className="group-hover:scale-125 transition-transform" />
                  <span className="text-sm">contact@zarrin.com</span>
                </a>
                <a href="tel:+1234567890" className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 group">
                  <Phone size={16} className="group-hover:scale-125 transition-transform" />
                  <span className="text-sm">+1 (234) 567-890</span>
                </a>
                <div className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center space-x-2">
                  <MapPin size={16} />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <Headings type="h5" className="text-white font-bold mb-4 flex items-center space-x-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                <span>Newsletter</span>
              </Headings>
              <p className="text-gray-400 text-sm mb-4">Subscribe to get latest updates and posts.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-r-lg hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© {currentYear} <span className="text-blue-400 font-semibold">Zarrin Blogs</span>. All rights reserved.</p>
              <p className="mt-1">Crafted with <Heart size={12} className="inline text-red-500" /> by the Zarrin Team</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110 group"
                  >
                    <Icon size={16} className="group-hover:rotate-12 transition-transform" />
                  </a>
                );
              })}
            </div>

            {/* Bottom Links */}
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>
    </footer>
  );
};

export default Footer;
