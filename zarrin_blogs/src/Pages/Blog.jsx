import React, { useState } from 'react'
import OurBlogs from '../Component/Main Component/OurBlogs'
import Heading from '../Component/Common/Heading'
import Paragraph from '../Component/Common/Paragraph'
import { BookOpen, Sparkles, ArrowRight, Flame, Star, Clock, TrendingUp, Search, Filter } from 'lucide-react'

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState('featured')

  // Topic categories with updated colors
  const topics = [
    {
      title: "Technology",
      description: "Latest trends in tech, software, and innovation",
      icon: "💻",
      gradient: "from-[#6366F1] to-[#8B5CF6]",
      bgGradient: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10",
      borderColor: "border-indigo-300 dark:border-indigo-600",
      textColor: "text-indigo-600 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-500"
    },
    {
      title: "Design",
      description: "UI/UX, graphic design, and creative inspiration",
      icon: "🎨",
      gradient: "from-[#EC4899] to-[#F472B6]",
      bgGradient: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10",
      borderColor: "border-pink-300 dark:border-pink-600",
      textColor: "text-pink-600 dark:text-pink-400",
      hoverBorder: "hover:border-pink-500"
    },
    {
      title: "Business",
      description: "Entrepreneurship, startups, and business insights",
      icon: "📈",
      gradient: "from-[#06B6D4] to-[#6366F1]",
      bgGradient: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10",
      borderColor: "border-cyan-300 dark:border-cyan-600",
      textColor: "text-cyan-600 dark:text-cyan-400",
      hoverBorder: "hover:border-cyan-500"
    },
    {
      title: "Lifestyle",
      description: "Health, wellness, travel, and personal growth",
      icon: "✨",
      gradient: "from-[#FB923C] to-[#F472B6]",
      bgGradient: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10",
      borderColor: "border-amber-300 dark:border-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
      hoverBorder: "hover:border-amber-500"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-white py-20 sm:py-32">
        {/* Animated Aurora Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#6366F1]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#EC4899]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all">
              <Sparkles size={16} className="text-amber-300" />
              <span className="text-sm font-semibold text-white">Discover Amazing Stories</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white">
                Explore Stories That{' '}
                <span className="block mt-2 bg-gradient-to-r from-white via-pink-200 to-amber-200 bg-clip-text text-transparent">
                  Inspire & Educate
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Discover thoughtfully crafted articles, expert insights, and inspiring stories from our diverse community of writers and thought leaders. Find your next great read today.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-200">10K+</div>
                <div className="text-white/80 text-sm mt-1">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-200">100K+</div>
                <div className="text-white/80 text-sm mt-1">Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-200">500+</div>
                <div className="text-white/80 text-sm mt-1">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-200">4.9★</div>
                <div className="text-white/80 text-sm mt-1">Rating</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-12">
              <button
                onClick={() => setActiveFilter('featured')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  activeFilter === 'featured'
                    ? 'bg-white text-indigo-700 shadow-lg shadow-white/25'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <Star size={16} />
                Featured
              </button>
              <button
                onClick={() => setActiveFilter('trending')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  activeFilter === 'trending'
                    ? 'bg-white text-indigo-700 shadow-lg shadow-white/25'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <Flame size={16} />
                Trending
              </button>
              <button
                onClick={() => setActiveFilter('new')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  activeFilter === 'new'
                    ? 'bg-white text-indigo-700 shadow-lg shadow-white/25'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <Clock size={16} />
                Latest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <OurBlogs />

      {/* Trending Topics Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6366F1]/10 rounded-full border border-[#6366F1]/20 mb-4">
              <TrendingUp className="w-4 h-4 text-[#6366F1]" />
              <span className="text-sm text-[#6366F1] font-semibold">Popular Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Topic
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dive deeper into topics that interest you most and discover curated content from expert writers.
            </p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <a
                key={index}
                href="/blog"
                className={`group relative bg-gradient-to-br ${topic.bgGradient} rounded-2xl p-8 border ${topic.borderColor} ${topic.hoverBorder} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}
              >
                {/* Gradient Accent */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${topic.gradient} rounded-2xl text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {topic.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {topic.description}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-2 ${topic.textColor} font-semibold text-sm pt-4 group-hover:gap-3 transition-all`}>
                    Explore
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
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