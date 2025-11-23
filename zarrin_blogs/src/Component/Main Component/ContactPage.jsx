

import React, { useState } from 'react';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import Image from '../Common/Image';
import Paragraph from '../Common/Paragraph';
import Heading from '../Common/Heading';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("");
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
    setStatus("");

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
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        const errorMessage = data.message || data.error || "Failed to send message. Please try again.";
        setStatus(errorMessage);
        console.error("Form submission error:", errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("Network error: Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const info = [
    {
      icon: <MdLocationOn className="text-tertiary text-3xl" />,
      title: 'Office',
      detail: 'GomtiNagar,Lucknow , India',
    },
    {
      icon: <MdEmail className="text-tertiary text-3xl" />,
      title: 'Email',
      detail: 'hello@Avneesh.com',
    },
    {
      icon: <MdPhone className="text-tertiary text-3xl" />,
      title: 'Phone',
      detail: '7080921..',
    },
  ];

  return (
    <section className="bg-tertiary py-16">
      <div className="text-center mb-12">
        <Heading type="h4" className="font-bold text-dark">Get in Touch</Heading>
        <Paragraph className="text-seconday mt-2">
          Contact us to publish your content and show ads to our website and make a good reach.
        </Paragraph>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {info.map((item, index) => (
          <div
            key={index}
            className="bg-tertiary p-6 rounded-lg shadow-sm text-center border border-secondaryGray">
            <div className="w-14 h-14 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <Heading className="text-lg font-semibold text-seconday mb-1">{item.title}</Heading>
            <Paragraph className="text-sm text-secondary">{item.detail}</Paragraph>
          </div>
        ))}
      </div>

      <div className="relative">
        <div>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1380000000003!2d80.98700000000001!3d26.850000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2d5e12a3f%3A0x0!2sGomti%20Nagar%2C%20Lucknow%2C%20India!5e0!3m2!1sen!2sin!4v1691563123456!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-custom-md rounded-lg"
          />
        </div>

        <div className="relative z-20 -mt-24">
          <div className="max-w-2xl mx-auto bg-tertiary p-8 rounded-lg shadow-md border border-primary">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-secondary mb-1">Message</label>
                <textarea
                  name="message"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="5"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {status && (
                <div className={`text-center mb-4 ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {status}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-primary text-tertiary px-6 py-2 rounded-md ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary'
                  }`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;