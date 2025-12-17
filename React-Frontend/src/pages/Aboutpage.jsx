import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { FiZap, FiCpu, FiHeart, FiCode, FiGlobe, FiTarget, FiArrowLeft, FiDatabase, FiLayout, FiServer } from "react-icons/fi";

const AboutPage = () => {
  return (
    <div className="dark:bg-slate-950 text-white dark:selection:bg-cyan-500/30 overflow-x-hidden relative bg-white text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Back to Home Button */}
      <Link to="/" className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 backdrop-blur-md transition-all group">
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <HeroSection />
      <MissionSection />
      <FeatureShowcase />
      <TechStackSection />
      <InteractiveRoadmap />
      <Footer />
    </div>
  );
};

// --- 1. Cinematic Hero Section ---
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden perspective-1000 bg-gradient-to-b from-white dark:from-slate-950 to-slate-100 dark:to-slate-900 transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)] z-0" />
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mb-6 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-100 dark:bg-cyan-500/5 backdrop-blur-md shadow-lg dark:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <span className="text-cyan-600 dark:text-cyan-300 font-medium tracking-widest text-xs uppercase">The Future of Shopping</span>
        </motion.div>

        <motion.h1 
          className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="block bg-gradient-to-b from-slate-900 dark:from-white via-slate-800 dark:via-white to-slate-500 dark:to-slate-400 bg-clip-text text-transparent">MAYABU</span>
          <span className="block text-3xl md:text-4xl font-light text-slate-600 dark:text-slate-400 mt-4 tracking-normal">
            Compare. Save. <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Dominate.</span>
          </span>
        </motion.h1>
      </motion.div>
      <ParticleBackground />
    </section>
  );
};

// --- 2. Elegant Mission Statement ---
const MissionSection = () => {
  return (
    <section className="py-32 relative bg-white dark:bg-slate-900/50 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-5xl font-light leading-relaxed text-slate-700 dark:text-slate-300"
        >
          "We built Mayabu because we believe price transparency isn't a luxury—it's a <span className="text-slate-900 dark:text-white font-semibold italic">right</span>. 
          In a world of dynamic pricing, we are your <span className="text-cyan-600 dark:text-cyan-400 font-semibold">unfair advantage</span>."
        </motion.p>
        <div className="h-24 w-px bg-gradient-to-b from-cyan-600/0 dark:from-cyan-500/0 via-cyan-600 dark:via-cyan-500/50 to-cyan-600/0 dark:to-cyan-500/0 mx-auto mt-16" />
      </div>
    </section>
  );
};

// --- 3. Interactive 3D Tilt Cards ---
const FeatureShowcase = () => {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle title="Why We Exist" />
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <TiltCard 
            title="Lightning Fast" 
            desc="Querying 50+ retailers in <200ms. Speed is our religion." 
            icon={<FiZap />} 
            color="from-yellow-400 to-orange-500" 
          />
          <TiltCard 
            title="AI Precision" 
            desc="Fuzzy matching algorithms that understand products like a human." 
            icon={<FiCpu />} 
            color="from-cyan-400 to-blue-500" 
          />
          <TiltCard 
            title="Zero Bias" 
            desc="We don't sell products. We sell the truth about prices." 
            icon={<FiHeart />} 
            color="from-pink-400 to-rose-500" 
          />
        </div>
      </div>
    </section>
  );
};

const TiltCard = ({ title, desc, icon, color }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  return (
    <motion.div 
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: useTransform(mouseY, [-300, 300], [10, -10]), rotateY: useTransform(mouseX, [-300, 300], [-10, 10]) }}
      className="relative h-96 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-8 flex flex-col justify-between group overflow-hidden hover:shadow-xl dark:hover:shadow-cyan-500/10 transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 dark:opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl text-white shadow-lg mb-8`}>
          {icon}
        </div>
        <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

// --- 4. Tech Stack Bento Grid ---
const TechStackSection = () => {
  return (
    <section className="py-32 bg-slate-100 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <SectionTitle title="Engineering Excellence" />
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 mt-16 h-auto md:h-[650px]">
          
          {/* FastAPI Card */}
          <TechTextCard 
            title="FastAPI Backend" 
            icon={<FiServer />}
            desc="Our engine runs on Python's fastest web framework. It handles asynchronous requests with ease, enabling us to scrape thousands of product pages concurrently without breaking a sweat."
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-200 dark:from-slate-800 to-slate-100 dark:to-slate-900/50 border border-orange-300 dark:border-orange-500/30"
            color="from-orange-500/20 to-yellow-500/20"
          />

          {/* React Card */}
          <TechTextCard 
            title="React 18"
            icon={<FiLayout />}
            desc="Built with the latest React features for a buttery smooth, client-side rendered experience."
            className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-cyan-100 dark:from-cyan-500/10 to-blue-100 dark:to-blue-500/10 border border-cyan-300 dark:border-cyan-400/30"
            color="from-cyan-500/20 to-blue-500/20"
          />

          {/* Redis Card */}
          <TechTextCard 
            title="Redis Caching"
            icon={<FiDatabase />}
            desc="In-memory data store that serves frequently accessed price data in microseconds."
            className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-red-100 dark:from-red-500/10 to-red-100 dark:to-red-600/10 border border-red-300 dark:border-red-500/30"
            color="from-red-500/20 to-red-600/20"
          />

          {/* Playwright Card */}
          <TechTextCard 
            title="Playwright"
            icon={<FiGlobe />}
            desc="Advanced headless browser automation that navigates complex dynamic websites to extract accurate pricing data where standard scrapers fail."
            className="md:col-span-2 bg-gradient-to-br from-purple-100 dark:from-purple-500/10 to-violet-100 dark:to-violet-500/10 border border-purple-300 dark:border-purple-500/30"
            color="from-purple-500/20 to-violet-500/20"
          />
        </div>
      </div>
    </section>
  );
};

const TechTextCard = ({ title, desc, icon, className, color }) => {
  return (
    <motion.div 
      whileHover={{ scale: 0.98, y: -4 }}
      className={`rounded-3xl p-8 border backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
      
      {/* Icon Header */}
      <div className="relative z-10 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-3xl text-slate-700 dark:text-white border border-slate-300 dark:border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 tracking-tight">
          {title}
        </h4>
      </div>

      {/* Descriptive Text */}
      <div className="relative z-10">
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium opacity-90 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
      </div>

      {/* Shine Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full opacity-0 group-hover:opacity-100"
        animate={{ translateX: ["-100%", "300%"] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

// --- 5. Interactive Roadmap ---
const InteractiveRoadmap = () => {
  const [activeCard, setActiveCard] = useState(0);
  const roadmapItems = [
    {
      title: "Price Prediction AI",
      date: "Q3 2025",
      desc: "ML models predict price drops before they happen",
      icon: "🧠",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Visual Search",
      date: "Q4 2025",
      desc: "Upload photo → Get price comparison instantly",
      icon: "📸",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "AI Shopping Assistant", 
      date: "Q1 2026",
      desc: "Chatbot understands: 'Best laptop under 50k'",
      icon: "💬",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Global Markets",
      date: "H1 2026",
      desc: "Amazon US, UK, AU + 100+ international stores",
      icon: "🌍",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Mayabu API",
      date: "H2 2026",
      desc: "Public API for developers & businesses",
      icon: "🔌",
      color: "from-indigo-500 to-violet-500"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 dark:from-slate-950/50 to-slate-100 dark:to-slate-900/50 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03)_0%,transparent_50%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle title="Roadmap" />
        <div className="max-w-6xl mx-auto mt-20">
          <div className="flex items-center justify-between mb-16 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-800 -z-10" />
            {roadmapItems.map((_, i) => (
              <motion.div
                key={i}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-500 relative ${
                  i === activeCard 
                    ? 'bg-cyan-500 scale-150 shadow-[0_0_20px_rgba(6,182,212,0.6)]' 
                    : 'bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-400 border-4 border-white dark:border-slate-900'
                }`}
                whileHover={{ scale: 1.8 }}
                onClick={() => setActiveCard(i)}
                onHoverStart={() => setActiveCard(i)}
              >
                 <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap transition-opacity duration-300 ${i === activeCard ? 'opacity-100 text-cyan-600 dark:text-cyan-400' : 'opacity-0'}`}>
                   {roadmapItems[i].date}
                 </div>
              </motion.div>
            ))}
          </div>
          <div className="relative min-h-[400px]">
             <div className="absolute inset-0 flex items-center justify-center">
                <RoadmapItem 
                   key={activeCard} 
                   item={roadmapItems[activeCard]} 
                   isActive={true}
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RoadmapItem = ({ item, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full max-w-2xl"
    >
      <div className={`p-8 md:p-12 rounded-3xl border-2 backdrop-blur-xl transition-all duration-700
          border-cyan-500/50 dark:border-cyan-500/50 bg-gradient-to-br from-slate-100 dark:from-slate-900/80 to-white dark:to-slate-800/80 shadow-lg dark:shadow-[0_0_50px_rgba(6,182,212,0.15)]
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-4xl shadow-lg`}>
            <span>{item.icon}</span>
          </div>
          <div className="px-5 py-2 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-bold tracking-widest text-sm">
            {item.date}
          </div>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 drop-shadow-lg">
          {item.title}
        </h3>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-light">
          {item.desc}
        </p>
        <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${item.color} opacity-10 blur-[80px] rounded-full -z-10`} />
      </div>
    </motion.div>
  );
};

// --- Utilities ---
const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="h-px bg-cyan-600 dark:bg-cyan-500 w-12" />
    <h2 className="text-4xl font-light tracking-wide uppercase text-slate-900 dark:text-white">{title}</h2>
  </div>
);

const ParticleBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-cyan-500/20 dark:bg-cyan-500/20 rounded-full blur-xl"
        style={{
          width: Math.random() * 300 + 50,
          height: Math.random() * 300 + 50,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, Math.random() * 100 - 50],
          x: [0, Math.random() * 100 - 50],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default AboutPage;
