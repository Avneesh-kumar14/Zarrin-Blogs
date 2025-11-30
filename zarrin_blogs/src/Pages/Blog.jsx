import React from 'react'
import OurBlogs from '../Component/Main Component/OurBlogs'
import Heading from '../Component/Common/Heading'
import Paragraph from '../Component/Common/Paragraph'

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <Heading type="h1" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            📖 Read Our Latest Blogs
          </Heading>
          <Paragraph className="text-blue-100 text-lg max-w-2xl mx-auto">
            Discover insightful articles, expert insights, and fascinating stories from our community of writers
          </Paragraph>
        </div>
      </div>

      {/* Main Content */}
      <OurBlogs />
    </div>
  )
}

export default Blog