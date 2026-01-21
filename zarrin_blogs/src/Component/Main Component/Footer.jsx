
import { NavLink } from "react-router-dom";
import {
  Mail,
  MapPin,
  Heart,
  Sparkles,
  ArrowUp,
  TrendingUp,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";

import Logo from "../Common/Logo";
import Headings from "../Common/Heading";
import Paragraph from "../Common/Paragraph";

const stats = [
  { icon: BookOpen, label: "Articles", value: "50K+" },
  { icon: Users, label: "Writers", value: "10K+" },
  { icon: TrendingUp, label: "Readers", value: "1M+" },
  { icon: Award, label: "Awards", value: "25+" },
];

const topics = [
  "React",
  "JavaScript",
  "UI/UX",
  "Web Dev",
  "Node.js",
  "AI/ML",
  "DevOps",
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Newsletter */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24">
        <div className="bg-gradient-to-r from-[#6366F1] via-[#EC4899] to-[#8B5CF6] hover:shadow-2xl transition-all rounded-2xl p-10 grid md:grid-cols-2 gap-8 items-center shadow-xl">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                Weekly Digest
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Get the best stories every week
            </h2>
            <p className="text-white/90">
              Thoughtful writing, curated insights, zero noise.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
  <input
    type="email"
    placeholder="Enter your email"
    className="
      w-full
      h-12
      rounded-md
      px-4
      bg-white
      text-slate-900
      outline-none
      focus:ring-2
      focus:ring-purple-400
      placeholder-slate-400
    "
  />

  <button
    className="
      h-12
      w-full
      sm:w-auto
      px-6
      rounded-md
      bg-white
      text-purple-700
      hover:bg-purple-50
      transition
      font-semibold
      whitespace-nowrap
    "
  >
    Subscribe
  </button>
</div>

            <p className="text-xs text-white/70 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            const gradients = [
              "from-[#6366F1] to-[#8B5CF6]",
              "from-[#EC4899] to-[#F472B6]",
              "from-[#06B6D4] to-[#6366F1]",
              "from-[#FB923C] to-[#FBBF24]"
            ];
            return (
              <div key={s.label}>
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${gradients[idx]} flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Logo size="text-4xl" />
              <Headings type="h3" className="text-white font-bold">
                Zarrin
              </Headings>
            </div>

            <Paragraph className="text-sm text-zinc-400">
              A calm corner of the internet for meaningful writing and deep
              thinking.
            </Paragraph>

            <div className="flex gap-3">
              {[FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-cyan-600 flex items-center justify-center transition"
                  >
                    <Icon size={14} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Explore */}
          <div>
            <Headings type="h5" className="text-white mb-4">
              Explore
            </Headings>
            <ul className="space-y-3 text-sm">
              {["Home", "Blog", "Categories", "Bookmarks"].map((l) => (
                <li key={l}>
                  <NavLink to="/" className="hover:text-white transition">
                    {l}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <Headings type="h5" className="text-white mb-4">
              Resources
            </Headings>
            <ul className="space-y-3 text-sm">
              {["Guidelines", "Privacy", "Terms", "Support"].map((l) => (
                <li key={l} className="hover:text-white transition cursor-pointer">
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <Headings type="h5" className="text-white">
              Contact
            </Headings>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} /> hello@zarrin.blog
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <MapPin size={16} /> Remote · Worldwide
            </div>
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="relative px-6 pb-16">
        <h3 className="text-center text-white font-semibold mb-4">
          Popular Topics
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {topics.map((t) => (
            <span
              key={t}
              className="px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-sm text-white hover:scale-105 transition cursor-pointer"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        © {year} <span className="text-white">Zarrin</span>. Made with{" "}
        <Heart size={12} className="inline text-cyan-500" /> for thoughtful readers.
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition z-50"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;
