

import React from 'react'
import Image from '../Common/Image'
import Paragraph from '../Common/Paragraph'
import Headings from '../Common/Heading'
import Button from '../Common/Button'
import { ArrowRight, Sparkles } from 'lucide-react'

const Banner = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute -top-8 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image Section */}
          <div className="relative group order-2 md:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
              <Image 
                src={'./Assets/man.png'} 
                className="h-auto w-full rounded-xl object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
            {/* Decorative corner */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
          </div>

          {/* Content Section */}
          <div className="order-1 md:order-2 space-y-6 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-widest">
                Featured Article
              </span>
            </div>

            {/* Category and Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg text-xs">
                  DEVELOPMENT
                </span>
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <span>📅</span> 1 August 2025
                </span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <Headings 
                type="h2" 
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent"
              >
                How to make a Game look more attractive with New VR & AI Technology
              </Headings>
            </div>

            {/* Description */}
            <Paragraph 
              variant="base" 
              className="text-gray-600 text-lg leading-relaxed max-w-lg opacity-90 line-clamp-3"
            >
              Google has been investing in AI for many years and bringing its benefits to individuals, businesses and communities. Explore how cutting-edge VR and AI technologies can revolutionize game design and user experience.
            </Paragraph>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                text="Read More" 
                variant="primary" 
                size="lg"
                icon={ArrowRight}
                className="hover:scale-105 transition-transform duration-300"
              />
              <Button 
                text="Explore All" 
                variant="outline" 
                size="lg"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Stats or Highlight */}
            <div className="pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 opacity-75">
              <div>
                <p className="text-2xl font-bold text-blue-600">10M+</p>
                <p className="text-sm text-gray-600">Readers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">500+</p>
                <p className="text-sm text-gray-600">Articles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">50K+</p>
                <p className="text-sm text-gray-600">Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;