

import { NavLink } from "react-router-dom";
import {
  Mail,
  MapPin,
  Heart,
  Sparkles,
  ArrowUpRight,
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

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-300">
      {/* Top Divider Glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Brand / Story */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Logo size="text-4xl" />
              <Headings type="h3" className="text-white font-bold tracking-wide">
                Zarrin
              </Headings>
            </div>

            <Paragraph className="text-sm leading-relaxed text-zinc-400">
              Zarrin began as a quiet idea — a place for thoughtful writing,
              honest perspectives, and stories that don’t chase trends but
              meaning.
            </Paragraph>

            <NavLink
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-emerald-400 transition"
            >
              <Sparkles size={14} />
              Our Story
              <ArrowUpRight size={14} />
            </NavLink>
          </div>

          {/* Explore */}
          <div>
            <Headings
              type="h5"
              className="text-white font-semibold mb-5 tracking-wide"
            >
              Explore
            </Headings>

            <ul className="space-y-3 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
                { name: "Categories", path: "/categories" },
                { name: "Bookmarks", path: "/bookmarks" },
              ].map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="hover:text-white transition"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <Headings
              type="h5"
              className="text-white font-semibold mb-5 tracking-wide"
            >
              Resources
            </Headings>

            <ul className="space-y-3 text-sm">
              {[
                "Writing Guidelines",
                "Privacy Policy",
                "Terms of Service",
                "Support",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-white transition cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <Headings
              type="h5"
              className="text-white font-semibold tracking-wide"
            >
              Stay Connected
            </Headings>

            <div className="space-y-3 text-sm">
              <a
                href="mailto:hello@zarrin.blog"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Mail size={16} />
                hello@zarrin.blog
              </a>

              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin size={16} />
                Remote · Worldwide
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 pt-3">
              {[
                { icon: FaXTwitter, link: "#" },
                { icon: FaInstagram, link: "#" },
                { icon: FaLinkedinIn, link: "#" },
                { icon: FaGithub, link: "#" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-indigo-600 text-white flex items-center justify-center transition"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-zinc-500">
          <p>
            © {year} <span className="text-white">Zarrin</span>. Crafted with{" "}
            <Heart size={12} className="inline text-pink-500" /> for readers who
            value depth.
          </p>

          <p className="italic text-zinc-600">
            Write less noise. Share more meaning.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
