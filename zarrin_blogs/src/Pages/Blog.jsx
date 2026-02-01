import React, { useState } from 'react'
import OurBlogs from '../Component/Main Component/OurBlogs'
import { Sparkles, Flame, Star, Clock, TrendingUp, ArrowRight } from 'lucide-react'

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState('featured')

  // Topic categories with vibrant gradient colors
  const topics = [
    {
      title: "Technology",
      description: "Latest trends in tech, software, and innovation",
      icon: "💻",
      gradient: "from-[#6366F1] to-[#8B5CF6]",
    },
    {
      title: "Design",
      description: "UI/UX, graphic design, and creative inspiration",
      icon: "🎨",
      gradient: "from-[#EC4899] to-[#F472B6]",
    },
    {
      title: "Business",
      description: "Entrepreneurship, startups, and business insights",
      icon: "📈",
      gradient: "from-[#FB923C] to-[#FBBF24]",
    },
    {
      title: "Lifestyle",
      description: "Health, wellness, travel, and personal growth",
      icon: "✨",
      gradient: "from-[#06B6D4] to-[#10B981]",
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-white py-20 sm:py-32">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#6366F1]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#EC4899]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform">10K+</div>
                <div className="text-white/80 text-sm mt-1">Articles</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform">100K+</div>
                <div className="text-white/80 text-sm mt-1">Readers</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform">500+</div>
                <div className="text-white/80 text-sm mt-1">Authors</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform">4.9★</div>
                <div className="text-white/80 text-sm mt-1">Rating</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-12">
              <button
                onClick={() => setActiveFilter('featured')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  activeFilter === 'featured'
                    ? 'bg-white text-purple-700 shadow-lg shadow-white/25'
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
                    ? 'bg-white text-purple-700 shadow-lg shadow-white/25'
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
                    ? 'bg-white text-purple-700 shadow-lg shadow-white/25'
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
                className="group relative h-full bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Top Gradient Border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topic.gradient}`}></div>

                {/* Gradient Accent Background */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${topic.gradient} rounded-2xl text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {topic.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${topic.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {topic.description}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${topic.gradient} bg-clip-text text-transparent font-semibold text-sm pt-4 group-hover:gap-3 transition-all`}>
                    Explore
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-gray-600 dark:text-gray-400 group-hover:text-transparent" />
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