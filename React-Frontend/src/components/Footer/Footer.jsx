import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMail, HiOutlineArrowUp } from "react-icons/hi";
import logo_dark from "../../assets/images/logo_dark.png"

const footerVariants = {
  hidden: { opacity: 0, y: 60 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } 
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    }
  }
};

const iconHover = {
  hover: { 
    scale: 1.25, 
    y: -8,
    transition: { type: "spring", stiffness: 400, damping: 15 } 
  }
};

const linkHover = {
  hover: { 
    x: 8,
    scale: 1.02,
    transition: { type: "spring", stiffness: 350 } 
  }
};

export default function Footer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { label: "About Mayabu", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare Devices", href: "/compare" },
    { label: "Support", href: "/support" },
    { label: "Blog", href: "/blog" },
  ];

  const socialLinks = [
    { Icon: FaTwitter, href: "https://twitter.com", color: "#1DA1F2" },
    { Icon: FaLinkedin, href: "https://linkedin.com", color: "#0077B5" },
    { Icon: FaInstagram, href: "https://instagram.com", color: "#E4405F" },
    { Icon: FaGithub, href: "https://github.com", color: "#333" },
  ];

  return (
    <>
      <motion.footer
        className="bg-slate-900 border-t border-slate-800/50 px-6 lg:px-12 py-14 lg:py-16 relative overflow-hidden"
        variants={footerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Subtle floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-3 h-3 bg-blue-400/20 rounded-full blur-2xl animation-delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-slate-400/20 rounded-full blur-lg animate-ping" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16"
            variants={containerVariants}
          >
            
            {/* Brand */}
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.div 
                className="flex items-center gap-4 group cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="relative"
                  transition={{ 
                    duration: 4,
                    ease: "easeInOut" 
                  }}
                >
                  <img 
                    src={logo_dark} 
                    alt="Mayabu Logo" 
                    className="w-13 h-10 lg:w-20 lg:h-20 rounded-2xl shadow-2xl transition-all duration-300 object-contain" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
                <motion.div 
                  className="font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-3xl lg:text-4xl xl:text-5xl tracking-tight leading-tight"
                  animate={{ 
                    scale: [1, 1.02, 1],
                    y: [0, -2, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    ease: "easeInOut" 
                  }}
                >
                  Mayabu
                </motion.div>
              </motion.div>
              <motion.p 
                className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                India's #1 platform to compare, buy, and sell devices with complete transparency and confidence.
              </motion.p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <h3 className="text-white font-bold text-xl lg:text-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Explore Mayabu
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {quickLinks.map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="group relative text-slate-400 hover:text-cyan-300 text-sm lg:text-base font-medium py-3 px-4 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 hover:border-cyan-400/40 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20 transition-all duration-400 overflow-hidden"
                    variants={linkHover}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <span className="relative z-10">{label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm" />
                    <div className="absolute left-0 top-0 w-0 h-full bg-gradient-to-r from-cyan-400/30 to-transparent group-hover:w-full transition-all duration-700" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Action Row */}
          <motion.div 
            className="mt-14 pt-10 border-t border-slate-800/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Social Icons */}
              <motion.div 
                className="flex items-center gap-3 lg:gap-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                {socialLinks.map(({ Icon, href, color }, i) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    className="p-3.5 lg:p-4 rounded-2xl bg-slate-800/60 hover:bg-cyan-500/20 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-cyan-500/30 hover:border-cyan-400/50 group relative overflow-hidden"
                    style={{ color }}
                    variants={iconHover}
                    whileHover="hover"
                    whileTap={{ scale: 0.92 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-sm" />
                  </motion.a>
                ))}
              </motion.div>
              
              {/* Feedback Button */}
              <AnimatePresence mode="wait">
                {!isFormOpen ? (
                  <motion.button
                    key="button"
                    className="group relative bg-sky-500 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-1xl hover:shadow-cyan-500/40 border border-cyan-300 backdrop-blur-sm transition-all duration-500 overflow-hidden"
                    onClick={() => setIsFormOpen(true)}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px rgba(34, 211, 238, 0.4)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HiOutlineMail className="w-5 h-5 group-hover:scale-110 mr-2 relative z-10" />
                    <span>Improve Mayabu</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="bg-slate-800/95 backdrop-blur-2xl p-6 lg:p-8 rounded-2xl border border-slate-700/60 shadow-2xl w-full lg:w-96"
                  >
                    <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! 🎉"); setIsFormOpen(false); }} className="space-y-4">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full p-4 bg-slate-700/70 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-400 font-medium"
                        required
                      />
                      <textarea
                        rows="2"
                        placeholder="Your feedback..."
                        className="w-full p-4 bg-slate-700/70 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-400"
                        required
                      />
                      <div className="flex gap-3 pt-2">
                        <motion.button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className="flex-1 p-4 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium transition-all duration-300 border border-slate-600/50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="flex-1 p-4 bg-gradient-to-r from-emerald-500/95 to-teal-500/95 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/40 transition-all duration-400"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Send ✨
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.div 
              className="mt-10 pt-8 border-t border-slate-800/30 text-xs lg:text-sm text-slate-500 text-center lg:text-left font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              © 2025 Mayabu. All rights reserved. Made with ❤️ in India
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Enhanced Scroll Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-3xl shadow-2xl border border-cyan-400/50 backdrop-blur-sm hover:shadow-cyan-500/50 z-50 flex items-center justify-center transition-all duration-400"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -4, 0]  // Continuous bounce
            }}
            exit={{ opacity: 0, scale: 0.6, y: 30 }}
            whileHover={{ 
              scale: 1.2, 
              rotate: 360,  // ✅ This will now animate
              boxShadow: "0 25px 50px rgba(34, 211, 238, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              y: {  // ✅ Bounce config
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {  // ✅ Rotation config - THIS WAS MISSING!
                duration: 0.5,
                ease: "easeInOut"
              }
            }}
          >
            <HiOutlineArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

    </>
  );
}
