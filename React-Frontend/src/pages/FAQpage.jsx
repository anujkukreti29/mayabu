import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiPlus, FiMinus, FiSearch, FiMessageCircle, FiZap, FiShield, FiDollarSign, FiHelpCircle, FiChevronRight, FiMail, FiPhone } from "react-icons/fi";

// --- FAQ Data ---
const faqData = [
  {
    id: 1,
    category: "Getting Started",
    question: "How does Mayabu save me money on purchases?",
    answer: "Mayabu tracks real-time prices across 50+ retailers including Amazon, Flipkart, Reliance Digital, and Croma. We instantly show you the cheapest option, price history, and availability across all platforms. On average, our users save 15-20% on electronics purchases.",
    icon: FiDollarSign,
  },
  {
    id: 2,
    category: "Getting Started",
    question: "Is Mayabu completely free to use?",
    answer: "Yes! Mayabu is 100% free for shoppers. No subscription fees, no hidden charges, no commission from you. We sustain our business through affiliate partnerships with retailers. Your savings are completely yours.",
    icon: FiZap,
  },
  {
    id: 3,
    category: "Getting Started",
    question: "Do I need an account to compare prices?",
    answer: "No account required! You can start comparing prices immediately without signing up. Creating an account is optional and only needed if you want premium features like price alerts, wishlist saving, or purchase history tracking.",
    icon: FiHelpCircle,
  },
  {
    id: 4,
    category: "Technical",
    question: "How accurate and up-to-date is your price data?",
    answer: "Our proprietary scraping engine updates prices every 15 minutes for trending items and hourly for others. We use advanced error detection to ensure 99.9% data accuracy. If a price changes on any retailer, you'll see it on Mayabu within minutes.",
    icon: FiZap,
  },
  {
    id: 5,
    category: "Technical",
    question: "How does Mayabu match the same product across different retailers?",
    answer: "We use a combination of AI-powered fuzzy matching, computer vision algorithms, and machine learning models. This ensures 'iPhone 15 Pro' on Amazon matches perfectly with 'Apple iPhone 15 Pro' on Flipkart, despite naming differences.",
    icon: FiZap,
  },
  {
    id: 6,
    category: "Technical",
    question: "Does Mayabu have an API for developers?",
    answer: "Yes! We offer a comprehensive REST API for developers to integrate Mayabu's price data into their applications. Full documentation, SDKs for JavaScript and Python, and dedicated support are included. Contact our team for API access.",
    icon: FiMessageCircle,
  },
  {
    id: 7,
    category: "Privacy & Security",
    question: "Do you sell my search data or browsing history?",
    answer: "Never. Your privacy is our highest priority. We don't sell your personal data to anyone. We only use anonymized, aggregated search trends to improve our algorithm. All data is encrypted end-to-end and complies with India's digital privacy standards.",
    icon: FiShield,
  },
  {
    id: 8,
    category: "Privacy & Security",
    question: "How do you protect my payment information?",
    answer: "We don't handle payments directly. When you click a buy button, you're taken to the retailer's secure checkout. We never store credit card information or any sensitive payment data on our servers.",
    icon: FiShield,
  },
  {
    id: 9,
    category: "Privacy & Security",
    question: "Is my wishlist and saved data private?",
    answer: "Yes, completely. Your wishlist, price alerts, and saved searches are encrypted and only accessible to you. We use industry-standard security protocols (SSL/TLS encryption, secure databases, regular security audits) to protect your data.",
    icon: FiShield,
  },
  {
    id: 10,
    category: "Features",
    question: "How do price alerts work?",
    answer: "Set an alert for any product with your target price. When that product's price drops to your desired amount or below, we'll notify you instantly via email or in-app notification. You can manage alerts anytime from your dashboard.",
    icon: FiMessageCircle,
  },
  {
    id: 11,
    category: "Features",
    question: "Can I track price history for a product?",
    answer: "Yes! Every product on Mayabu includes a detailed price history graph showing how the price has changed over the last 90 days across all retailers. This helps you identify the best time to buy.",
    icon: FiHelpCircle,
  },
  {
    id: 12,
    category: "Features",
    question: "Which retailers does Mayabu cover?",
    answer: "We currently track 50+ retailers including Amazon, Flipkart, Croma, Reliance Digital, OnePlus, Realme, Samsung, Apple, Lenovo official stores, and more. We're constantly adding new retailers based on user demand.",
    icon: FiZap,
  },
];

const categories = ["All", "Getting Started", "Technical", "Privacy & Security", "Features"];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Filter Logic
  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setOpenAccordion(null);
  };

  return (
    <div ref={containerRef} className="dark:bg-slate-800 bg-slate-100 min-h-screen overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative min-h-[60vh] flex items-center justify-center px-6 lg:px-12 pt-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr rounded-full blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >

            <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-indigo-500 via-blue-600 to-orange-700 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Find answers to common questions about Mayabu, our features, pricing, and how we help you save money.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Search & Filter Section */}
      <motion.section
        className="relative px-6 lg:px-12 py-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Search Bar */}
        <motion.div className="mb-12">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <motion.input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenAccordion(null);
              }}
              className="w-full pl-12 pr-6 py-4 text-gray-700 border-gray-400 bg-white dark:bg-slate-800/60 border dark:border-slate-700/50 hover:border-slate-600/80 dark:focus:border-cyan-400/80 rounded-2xl dark:text-white dark:placeholder-slate-500 font-medium transition-all duration-300 focus:outline-none focus:ring-2 dark:focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileFocus={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.2)" }}
            />
          </div>
          {searchQuery && (
            <motion.p
              className="text-sm text-slate-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""}
            </motion.p>
          )}
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {categories.map((category, idx) => (
            <motion.button
              key={category}
              onClick={() => {
                handleCategoryClick(category);
                setSearchQuery("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 border backdrop-blur-sm ${
                activeCategory === category
                  ? "bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 text-white bg-blue-500 border-gray-200 dark:border-cyan-400/50 shadow-lg shadow-gray-500/30"
                  : "dark:bg-slate-800/40 bg-gray-200 text-slate-800 dark:text-white border-slate-300 hover:border-slate-800  dark:hover:border-slate-600/80 dark:hover:bg-slate-800/60"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.05, duration: 0.6 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </motion.section>

      {/* FAQ Accordion Section */}
      <motion.section
        className="relative px-6 lg:px-12 py-12 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {filteredFAQs.length > 0 ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={activeCategory + searchQuery}
            >
              {filteredFAQs.map((faq, idx) => {
                const Icon = faq.icon;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.6 }}
                  >
                    <motion.button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <motion.div
                        className={`w-full p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 text-left flex items-start gap-4 ${
                          openAccordion === faq.id
                            ? "dark:bg-slate-800/80 bg-blue-200 border-cyan-400/50 shadow-xl shadow-cyan-500/20"
                            : "dark:bg-slate-800/40 bg-white border-slate-700/50 group-hover:border-slate-600/80 group-hover:bg-blue-100 dark:group-hover:bg-slate-800/60"
                        }`}
                      >
                        <motion.div
                          className={`mt-1 p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                            openAccordion === faq.id
                              ? "bg-gradient-to-r dark:from-cyan-500/30 bg-blue-100 text-blue-800 dark:to-blue-500/30"
                              : "dark:bg-slate-700/50 bg-slate-100 dark:group-hover:bg-slate-600/50"
                          }`}
                          animate={openAccordion === faq.id ? { scale: 1.1 } : { scale: 1 }}
                        >
                          <Icon
                            className={`w-5 h-5 transition-colors duration-300 ${
                              openAccordion === faq.id ? "dark:text-cyan-400" : "dark:text-slate-400"
                            }`}
                          />
                        </motion.div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-700 group-hover:text-slate-900 dark:text-white dark:group-hover:text-cyan-300 transition-colors duration-300 text-left">
                            {faq.question}
                          </h3>
                        </div>

                        <motion.div
                          className="flex-shrink-0 dark:text-slate-400 dark:group-hover:text-cyan-400 transition-colors duration-300"
                          animate={{ rotate: openAccordion === faq.id ? 45 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <FiPlus className="w-6 h-6" />
                        </motion.div>
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {openAccordion === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="p-6 dark:bg-slate-800/20 bg-blue-50  border-l-4 dark:border-cyan-400/50 dark:text-slate-300 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                          >
                            {faq.answer}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <FiHelpCircle className="w-16 h-16 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-600 dark:text-white mb-2">No results found</h3>
              <p className="dark:text-slate-400 text-blue-800 mb-6">
                Try adjusting your search terms or browse by category
              </p>
              <motion.button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-6 py-3 bg-gradient-to-r bg-indigo-400 text-white hover:bg-indigo-600 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-400 dark:text-white font-semibold rounded-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="relative py-20 px-6 lg:px-12 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="relative overflow-hidden rounded-3xl p-12 lg:p-16 bg-gradient-to-r bg-white dark:bg-slate-800 border-gray-500 dark:from-cyan-600/20 dark:to-blue-600/20 border dark:border-cyan-400/30 backdrop-blur-sm"
          whileHover={{ borderColor: "rgba(34, 211, 238, 0.5)" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-cyan-500/30 dark:to-blue-500/30 rounded-full blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black dark:text-white mb-4 text-center">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-500 dark:text-slate-300 mb-8 text-center">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.a
                href="mailto:support@mayabu.com"
                className="p-6 bg-white hover:bg-indigo-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border dark:border-slate-700/50 dark:hover:border-cyan-400/50 rounded-2xl transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br dark:from-cyan-500/30 dark:to-blue-500/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiMail className="w-6 h-6 dark:text-cyan-400" />
                  </motion.div>
                  <div>
                    <h3 className="dark:text-white font-bold dark:group-hover:text-cyan-300 transition-colors">Email Us</h3>
                    <p className="dark:text-slate-400 text-sm">support@mayabu.com</p>
                  </div>
                </div>
              </motion.a>

              <motion.a
                href="https://twitter.com/mayabu"
                className="p-6 bg-white hover:bg-indigo-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border dark:border-slate-700/50 dark:hover:border-cyan-400/50 rounded-2xl transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br dark:from-cyan-500/30 dark:to-blue-500/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiMessageCircle className="w-6 h-6 dark:text-cyan-400" />
                  </motion.div>
                  <div>
                    <h3 className="dark:text-white font-bold dark:group-hover:text-cyan-300 transition-colors">Follow Us</h3>
                    <p className="dark:text-slate-400 text-sm">@mayabu on Twitter</p>
                  </div>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default FAQPage;