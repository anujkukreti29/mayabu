import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Homepage';
import AboutPage from './pages/Aboutpage';
import FAQPage from './pages/FAQpage';
import ProductPage from './pages/Productpage';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-800 dark:bg-slate-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
