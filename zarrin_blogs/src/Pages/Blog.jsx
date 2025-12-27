import React, { useState } from 'react'
import OurBlogs from '../Component/Main Component/OurBlogs'
import Heading from '../Component/Common/Heading'
import Paragraph from '../Component/Common/Paragraph'
import { BookOpen, Sparkles, ArrowRight, Flame, Star, Clock } from 'lucide-react'

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState('featured')

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-sm font-semibold">Discover Amazing Stories</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Discover Stories
              </span>
              <br />
              <span>That Inspire You</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore thoughtfully crafted articles, expert insights, and inspiring stories from our diverse community of writers and thought leaders. Find your next great read today.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">10K+</div>
                <div className="text-gray-400 text-sm">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">100K+</div>
                <div className="text-gray-400 text-sm">Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">500+</div>
                <div className="text-gray-400 text-sm">Authors</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 pt-12">
              <button
                onClick={() => setActiveFilter('featured')}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
                  activeFilter === 'featured'
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Star size={16} />
                Featured
              </button>
              <button
                onClick={() => setActiveFilter('trending')}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
                  activeFilter === 'trending'
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Flame size={16} />
                Trending
              </button>
              <button
                onClick={() => setActiveFilter('new')}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
                  activeFilter === 'new'
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Clock size={16} />
                Latest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <OurBlogs />

      {/* Trending Topics Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Topic
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Dive deeper into topics that interest you most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Topic 1 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Tech & Innovation
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Latest trends in technology and innovation
              </p>
              <a href="/blog" className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:gap-2 inline-flex items-center gap-1">
                Explore <ArrowRight size={16} />
              </a>
            </div>

            {/* Topic 2 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Lifestyle & Growth
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Personal development and lifestyle tips
              </p>
              <a href="/blog" className="text-purple-600 dark:text-purple-400 font-semibold text-sm hover:gap-2 inline-flex items-center gap-1">
                Explore <ArrowRight size={16} />
              </a>
            </div>

            {/* Topic 3 */}
            <div className="group relative bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-8 border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-600 rounded-lg mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Business & Careers
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Career advice and entrepreneurship stories
              </p>
              <a href="/blog" className="text-pink-600 dark:text-pink-400 font-semibold text-sm hover:gap-2 inline-flex items-center gap-1">
                Explore <ArrowRight size={16} />
              </a>
            </div>

            {/* Topic 4 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Health & Wellness
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Mental and physical wellness insights
              </p>
              <a href="/blog" className="text-green-600 dark:text-green-400 font-semibold text-sm hover:gap-2 inline-flex items-center gap-1">
                Explore <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Blog