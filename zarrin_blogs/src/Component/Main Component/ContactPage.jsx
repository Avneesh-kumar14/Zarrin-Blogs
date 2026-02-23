

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ChevronDown, MessageCircle } from 'lucide-react';
import Paragraph from '../Common/Paragraph';
import Heading from '../Common/Heading';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import { getApiUrl } from '../../utils/apiConfig';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        const errorMessage = data.message || data.error || "Failed to send message. Please try again.";
        setAlert({ type: 'error', message: errorMessage });
        console.error("Form submission error:", errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      setAlert({ type: 'error', message: 'Network error: Failed to connect to server' });
    } finally {
      setLoading(false);
    }
  };

  const info = [
    {
      icon: MapPin,
      title: 'Office Location',
      detail: 'GomtiNagar, Lucknow, India',
      description: 'Visit our office for meetups and collaborations',
      bgClass: 'bg-primary'
    },
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'rajneeshavneesh@gmail.com',
      description: 'We respond within 24 hours',
      bgClass: 'bg-secondary'
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+91 6388860757',
      description: 'Available Monday to Friday, 9 AM - 6 PM IST',
      bgClass: 'bg-accent'
    },
  ];

  const faqs = [
    {
      question: "How do I publish my first blog?",
      answer: "Navigate to the create section, write your article using our rich editor, add tags and categories, then click publish. Your article will appear immediately on your profile and in the community feed."
    },
    {
      question: "Can I schedule posts in advance?",
      answer: "Yes! You can save drafts and schedule them to publish at a specific date and time. This helps you maintain a consistent publishing schedule."
    },
    {
      question: "How do I grow my audience on Zarrin?",
      answer: "Focus on quality content, engage with other writers' posts, use relevant tags, interact in the community, and share your articles on social media. Our algorithms also help surface great content."
    },
    {
      question: "Is there an API for Zarrin?",
      answer: "We're currently working on API access for developers. Contact us at rajneeshavneesh@gmail.com to learn more about our developer program."
    },
    {
      question: "How is my data protected?",
      answer: "We use industry-standard encryption and follow data protection best practices. Your articles and personal information are securely stored and never shared without your consent."
    },
    {
      question: "What are the response times for support?",
      answer: "Our team typically responds to support inquiries within 24 hours. For urgent issues, reach out via our Discord community for real-time help from both team members and the community."
    }
  ];

  return (
    <section className="relative min-h-screen bg-surface-primary dark:bg-surface-dark py-16 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-amber-300 dark:bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <Heading type="h2" className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            We'd Love to Hear From You
          </Heading>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            Have questions? Feedback? Ideas? Let's talk! Our team reads every message and responds within 24 hours.
          </Paragraph>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <CheckCircle size={16} className="text-emerald-500" />
              Fast response times
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle size={16} className="text-emerald-500" />
              We value your feedback
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle size={16} className="text-emerald-500" />
              Multiple contact options
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {info.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
              >
                <div className="absolute inset-0 bg-primary/10 dark:bg-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className={`relative w-14 h-14 mx-auto mb-6 ${item.bgClass} rounded-xl flex items-center justify-center text-on-primary shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={24} />
                </div>
                
                <Heading type="h4" className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {item.title}
                </Heading>
                <Paragraph className="text-sm text-gray-600 dark:text-gray-400 text-center font-semibold mb-2">
                  {item.detail}
                </Paragraph>
                <Paragraph className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  {item.description}
                </Paragraph>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            {/* Border Effect */}
            <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group/input">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="group/input">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone and Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group/input">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-pink-600 dark:focus:border-pink-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="+91 1234567890"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="group/input">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-amber-600 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Message</label>
                  <textarea
                    name="message"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Alert Messages */}
                {alert && (
                  <Alert 
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                    duration={5000}
                  />
                )}

                {/* Submit Button */}
                <Button
                  text={loading ? "Sending..." : "Send Message"}
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                  icon={!loading ? Send : null}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20 border-t border-gray-200 dark:border-gray-700 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Can't find what you're looking for? Reach out to us directly!
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-500 transition-all"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-emerald-600 dark:text-emerald-400 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedFAQ === index && (
                  <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <MessageCircle size={24} className="mx-auto mb-3 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Still have questions? Join our Discord community to chat with the team and other writers in real-time!
            </p>
            <button
              onClick={() => window.open('https://discord.gg/', '_blank')}
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Join Discord Community
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20 relative rounded-2xl overflow-hidden shadow-2xl h-96 md:h-[500px]">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1380000000003!2d80.98700000000001!3d26.850000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2d5e12a3f%3A0x0!2sGomti%20Nagar%2C%20Lucknow%2C%20India!5e0!3m2!1sen!2sin!4v1691563123456!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactPage;