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
      color: "primary",
    },
    {
      title: "Design",
      description: "UI/UX, graphic design, and creative inspiration",
      icon: "🎨",
      color: "secondary",
    },
    {
      title: "Business",
      description: "Entrepreneurship, startups, and business insights",
      icon: "📈",
      color: "warning",
    },
    {
      title: "Lifestyle",
      description: "Health, wellness, travel, and personal growth",
      icon: "✨",
      color: "accent",
    }
  ]

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-surface-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-on-primary py-20 sm:py-32">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all">
              <Sparkles size={16} className="text-warning" />
              <span className="text-sm font-semibold text-white">Discover Amazing Stories</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white">
                Explore Stories That{' '}
                <span className="block mt-2 text-on-primary">
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
                    ? 'bg-surface-primary text-text-primary shadow-lg shadow-primary/25'
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
                    ? 'bg-surface-primary text-text-primary shadow-lg shadow-primary/25'
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
                    ? 'bg-surface-primary text-text-primary shadow-lg shadow-primary/25'
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
      <section className="py-20 bg-surface-primary dark:bg-surface-dark border-t border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/30 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold">Popular Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Explore by Topic
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Dive deeper into topics that interest you most and discover curated content from expert writers.
            </p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <a
                key={index}
                href="/blog"
                className="group relative h-full bg-surface-primary dark:bg-surface-dark rounded-2xl p-8 border border-border-default hover:border-primary/30 dark:hover:border-primary/40 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Top Solid Border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-${topic.color}`}></div>

                {/* Solid Color Accent Background */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${topic.color} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-${topic.color} rounded-2xl text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {topic.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold text-${topic.color} group-hover:scale-105 transition-transform duration-300`}>
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {topic.description}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-2 text-${topic.color} font-semibold text-sm pt-4 group-hover:gap-3 transition-all`}>
                    Explore
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-text-secondary dark:text-text-secondary group-hover:text-transparent" />
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