

import React from 'react'
import { Sparkles, Users, Zap, TrendingUp, Award, Heart } from 'lucide-react'

const AboutUS = () => {
  const steps = [
    {
      number: '01',
      title: 'Ideation',
      description: 'We brainstorm innovative ideas and select the most impactful stories to bring to life.',
      highlighted: true,
    },
    {
      number: '02',
      title: 'Curate & Analyze',
      description: 'Our team evaluates content quality to ensure relevance and value for our readers.',
      highlighted: false,
    },
    {
      number: '03',
      title: 'Publish & Share',
      description: 'Content is seamlessly published, reaching the right audience at the right time.',
      highlighted: false,
    },
  ]

  const stats = [
    { icon: Users, label: 'Active Creators', value: '50K+', color: 'from-indigo-400 to-purple-400' },
    { icon: TrendingUp, label: 'Published Blogs', value: '12K+', color: 'from-pink-400 to-rose-400' },
    { icon: Award, label: 'Featured Authors', value: '800+', color: 'from-amber-400 to-orange-400' },
    { icon: Heart, label: 'Community Loves', value: '120K+', color: 'from-emerald-400 to-teal-400' },
  ]

  const values = [
    { icon: Sparkles, title: 'Innovation', description: 'We constantly explore new ways to inspire creativity.' },
    { icon: Users, title: 'Community', description: 'Fostering connections among writers and readers worldwide.' },
    { icon: Zap, title: 'Empowerment', description: 'Providing tools and opportunities to amplify your voice.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-20 sm:py-32">
        {/* Decorative blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-pink-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-emerald-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/40 backdrop-blur-md rounded-full mb-6">
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Empowering <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Creative Voices</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Zarrin Blogs is a home for writers and readers. We amplify unique stories, inspire creativity, and foster a thriving community where ideas come to life.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 font-medium mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Mission & Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full border border-indigo-200 mb-4">
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700">Our Mission</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Making <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Ideas Matter</span>
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            We provide a platform for creators to share their authentic voices, reach audiences, and grow communities around ideas that inspire and transform.
          </p>
          <div className="space-y-4">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-pink-300 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
          <img
            src="/Assets/group.png"
            alt="Our Team"
            className="relative w-full rounded-2xl shadow-2xl border border-gray-200 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* How We Work Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className={`rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:scale-105 ${step.highlighted ? 'bg-gradient-to-br from-indigo-500 to-pink-500 text-white ring-2 ring-indigo-400' : 'bg-white text-gray-900'}`}>
            <div className="mb-4">
              <span className={`text-xl font-bold ${step.highlighted ? 'text-white' : 'text-indigo-500'}`}>{step.number}</span>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${step.highlighted ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
            <p className={`${step.highlighted ? 'text-white/90' : 'text-gray-600'}`}>{step.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 blur-3xl animate-blob"></div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Join Our Vibrant Community</h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Connect with writers, share ideas, and grow together in a platform designed to make your voice heard.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:scale-105 transition shadow-lg">
            <Sparkles size={20} /> Join Now
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%,100%{transform:translate(0,0) scale(1);}
          33%{transform:translate(30px,-40px) scale(1.1);}
          66%{transform:translate(-20px,20px) scale(0.9);}
        }
        .animate-blob {
          animation: blob 8s infinite;
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

export default AboutUS
