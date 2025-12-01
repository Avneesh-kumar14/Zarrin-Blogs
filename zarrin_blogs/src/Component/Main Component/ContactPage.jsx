

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Image from '../Common/Image';
import Paragraph from '../Common/Paragraph';
import Heading from '../Common/Heading';
import Button from '../Common/Button';
import Alert from '../Common/Alert';

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
      const response = await fetch('http://localhost:8200/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
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
      title: 'Office',
      detail: 'GomtiNagar, Lucknow, India',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'rajneeshavneesh@gmail.com',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      detail: '6388860757',
      gradient: 'from-orange-600 to-red-600'
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <Heading type="h2" className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Get in Touch
          </Heading>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Paragraph>
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
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className={`relative w-14 h-14 mx-auto mb-6 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={24} />
                </div>
                
                <Heading type="h4" className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {item.title}
                </Heading>
                <Paragraph className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {item.detail}
                </Paragraph>
              </div>
            );
          })}
        </div>

        {/* Map Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl h-screen md:h-[900px]">
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

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group/input">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
      </div>
    </section>
  );
};

export default ContactPage;