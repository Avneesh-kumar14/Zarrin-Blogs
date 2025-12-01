import React from 'react'
import Main from '../Component/Main Component/Main'
import Banner from '../Component/Main Component/Banner'
import RecentPost from '../Component/Main Component/RecentPost' 
import Layout from '../Component/Main Component/Layout1'
import TrendingBlogs from '../Component/Main Component/TrendingBlogs'

const Home = () => {
  return (
    <div>
      <Main/>
      <Banner/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <TrendingBlogs />
      </div>
      <RecentPost/>
      <Layout/>

    </div>
  )
}

export default Home
