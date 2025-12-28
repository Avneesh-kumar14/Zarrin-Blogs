import React from 'react'
import { Sparkles, Users, Zap, TrendingUp, Award, Heart } from 'lucide-react'

const AboutUS = () => {
  const StepsSectionData = [
    {
      number: '01',
      title: 'Brainstorming',
      description:
        'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated',
      highlighted: true,
    },
    {
      number: '02',
      title: 'Analysing',
      description:
        'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line solely on the bottom line.',
      highlighted: false,
    },
    {
      number: '03',
      title: 'News Publishing',
      description:
        'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
      highlighted: false,
    },
  ]

  const stats = [
    { icon: Users, label: 'Active Users', value: '50K+', color: 'from-indigo-500 to-purple-500' },
    { icon: TrendingUp, label: 'Published Blogs', value: '10K+', color: 'from-pink-500 to-rose-500' },
    { icon: Award, label: 'Featured Authors', value: '500+', color: 'from-amber-500 to-orange-500' },
    { icon: Heart, label: 'Community Loves', value: '100K+', color: 'from-emerald-500 to-teal-500' },
  ]

  const values = [
    { icon: Sparkles, title: 'Innovation', description: 'Constantly pushing boundaries and embracing new ideas' },
    { icon: Users, title: 'Community', description: 'Building a vibrant community of creators and readers' },
    { icon: Zap, title: 'Empowerment', description: 'Giving voice to stories and ideas that matter' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-semibold">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Empowering <span className="bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">Creative Voices</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              We believe everyone has a story worth telling. Zarrin Blogs is a platform dedicated to bringing writers, thinkers, and creators together to share ideas that inspire and transform.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-slate-700"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-white" />
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r via-transparent bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247), rgb(236, 72, 153))`}}>
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-semibold mt-2">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Our Mission</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Making <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Great Ideas</span> Accessible
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              In a world filled with endless content, we're committed to creating a space where quality writing thrives. We empower creators with the tools, audience, and support they need to share their unique perspectives and build their legacy.
            </p>
            <div className="space-y-4">
              {values.map((value, idx) => {
                const Icon = value.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-600">
                        <Icon size={20} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-pink-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
            <img
              src="/Assets/group.png"
              alt="Our Team"
              className="relative w-full rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* How We Work Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200 dark:border-slate-800">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 rounded-full border border-pink-200 dark:border-pink-800 mb-4">
            <Sparkles size={14} className="text-pink-600 dark:text-pink-400" />
            <span className="text-xs font-bold text-pink-700 dark:text-pink-300">Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How We <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Our proven process ensures every blog gets the platform it deserves
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {StepsSectionData.map((step, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
                step.highlighted
                  ? 'bg-gradient-to-br from-indigo-600 to-pink-600 text-white shadow-2xl ring-2 ring-indigo-400 dark:ring-indigo-300'
                  : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-lg hover:shadow-2xl border border-gray-100 dark:border-slate-700'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className={`inline-block w-12 h-12 rounded-xl ${
                  step.highlighted
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-blue-600 to-purple-600'
                } flex items-center justify-center mb-4`}>
                  <span className={`text-xl font-bold ${
                    step.highlighted ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  }`}>
                    {step.number}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  step.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {step.title}
                </h3>
                <p className={`${
                  step.highlighted ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                } leading-relaxed`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-12 md:p-20 text-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-6">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold">Founder's Vision</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              "The platform that thinks with you"
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              We built Zarrin because blogging shouldn't be complicated. Writers should focus on writing, not wrestling with platforms. Our mission is to remove friction, amplify authentic voices, and help creators build communities around their ideas.
            </p>
            <p className="text-sm text-gray-400">
              — Founder & CEO, Zarrin Blogs
            </p>
          </div>
        </div>

        {/* Community Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-200 dark:border-purple-800 mb-4">
              <Users size={14} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Community</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Connect With Fellow <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Writers</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Zarrin is more than a platform—it's a community. Share ideas, get feedback, collaborate on projects, and grow together with thousands of writers who are passionate about their craft.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl">
              <Sparkles size={20} />
              Join Our Community
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
            <img
              src="/Assets/group.png"
              alt="Community"
              className="relative w-full rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

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
  );
};

export default AboutUS;