import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Herosection from '../components/Herosection/HeroSection'
import Footer from '../components/Footer/Footer'

function Home() {
  const navigate = useNavigate()

  // Handle search from hero section
  const handleSearch = (data) => {
    console.log('🔍 Search initiated from hero:', data)
    
    if (data.query && data.query.trim()) {
      // Navigate to product page with search query
      navigate(`/products?q=${encodeURIComponent(data.query)}`)
    } else if (data.error) {
      console.error('❌ Search error:', data.error)
    }
  }

  return (
    <div className="app-container min-h-screen flex flex-col bg-gradient-to-blue bg-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* 1. Navbar */}
      <Navbar />
      
      {/* 2. Main Content */}
      <div className="app-content flex-1">
        
        {/* 3. Hero Section with Search */}
        <Herosection onSearch={handleSearch} />
        
      </div>

      {/* 4. Footer */}
      <Footer />
    </div>
  )
}

export default Home