

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
    { icon: Users, label: 'Active Creators', value: '50K+', bgClass: 'bg-primary', textClass: 'text-primary' },
    { icon: TrendingUp, label: 'Published Blogs', value: '12K+', bgClass: 'bg-secondary', textClass: 'text-secondary' },
    { icon: Award, label: 'Featured Authors', value: '800+', bgClass: 'bg-accent', textClass: 'text-accent' },
    { icon: Heart, label: 'Community Loves', value: '120K+', bgClass: 'bg-success', textClass: 'text-success' },
  ]

  const values = [
    { icon: Sparkles, title: 'Innovation', description: 'We constantly explore new ways to inspire creativity.' },
    { icon: Users, title: 'Community', description: 'Fostering connections among writers and readers worldwide.' },
    { icon: Zap, title: 'Empowerment', description: 'Providing tools and opportunities to amplify your voice.' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-surface-secondary dark:bg-surface-hover py-20 sm:py-32">
        {/* Decorative blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-primary/40 dark:bg-surface-dark/40 backdrop-blur-md rounded-full mb-6">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary dark:text-text-inverse mb-6 leading-tight">
            Empowering <span className="text-secondary font-semibold">Creative Voices</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-primary dark:text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Zarrin Blogs is a home for writers and readers. We amplify unique stories, inspire creativity, and foster a thriving community where ideas come to life.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-surface-primary dark:bg-surface-dark rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:scale-105 border border-border-light dark:border-border-dark">
              <div className={`w-14 h-14 rounded-lg ${stat.bgClass} flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-on-primary" />
              </div>
              <p className="text-3xl font-bold text-text-primary dark:text-text-inverse">{stat.value}</p>
              <p className="text-text-secondary dark:text-text-secondary font-medium mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Mission & Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-primary/5 rounded-full border border-primary/20 dark:border-primary/30 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-bold text-primary">Our Mission</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-text-inverse mb-6">
            Making <span className="text-secondary font-semibold">Ideas Matter</span>
          </h2>
          <p className="text-text-secondary dark:text-text-secondary text-lg mb-6 leading-relaxed">
            We provide a platform for creators to share their authentic voices, reach audiences, and grow communities around ideas that inspire and transform.
          </p>
          <div className="space-y-4">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary">
                    <Icon size={20} className="text-on-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-text-inverse">{value.title}</h3>
                    <p className="text-text-secondary dark:text-text-secondary">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
          <img
            src="/Assets/group.png"
            alt="Our Team"
            className="relative w-full rounded-2xl shadow-2xl border border-border-default dark:border-border-dark hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* How We Work Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className={`rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:scale-105 ${step.highlighted ? 'bg-primary text-on-primary ring-2 ring-primary' : 'bg-surface-primary dark:bg-surface-dark text-text-primary dark:text-text-inverse border border-border-light dark:border-border-dark'}`}>
            <div className="mb-4">
              <span className={`text-xl font-bold ${step.highlighted ? 'text-on-primary' : 'text-primary'}`}>{step.number}</span>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${step.highlighted ? 'text-on-primary' : 'text-text-primary dark:text-text-inverse'}`}>{step.title}</h3>
            <p className={`${step.highlighted ? 'text-on-primary/90' : 'text-text-secondary dark:text-text-secondary'}`}>{step.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block bg-primary rounded-3xl p-12 shadow-2xl text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-on-primary/10 blur-3xl animate-blob"></div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Join Our Vibrant Community</h2>
          <p className="text-lg text-on-primary/90 mb-8 leading-relaxed">
            Connect with writers, share ideas, and grow together in a platform designed to make your voice heard.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-surface-primary text-primary font-bold rounded-xl hover:scale-105 transition shadow-lg hover:bg-surface-secondary">
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
