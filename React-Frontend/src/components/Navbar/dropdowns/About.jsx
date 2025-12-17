import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom"; // Import Link

const aboutMenuItems = [
  { label: "About Mayabu", description: "Learn our mission & vision" },
  { label: "Why Choose Us", description: "Real-time, accurate, trusted" },
  { label: "Our Platforms", description: "Amazon • Flipkart • Croma • Reliance Digital" },
  { label: "Contact & Support", description: "Get help anytime" },
];


const About = memo(({ isOpen }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -12, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
    exit: { opacity: 0, y: -12, scale: 0.95, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="absolute top-full right-0 mt-3 w-80 bg-gradient-to-blue bg-white border-blue-700 dark:bg-slate-800 rounded-xl border dark:border-cyan-400 shadow-2xl z-40 p-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-4 pb-4 border-b border-blue-500 dark:border-cyan-400">
            <h3 className="text-sm font-bold text-blue-700 dark:text-cyan-400 flex items-center gap-2">
              <FiInfo className="w-4 h-4" />
              About Mayabu
            </h3>
          </motion.div>

          {/* Menu Items - All Redirect to /about */}
          <div className="space-y-2">
            {aboutMenuItems.map((item, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link
                  to="/about"
                  className="block p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-cyan-500/20 transition-all group"
                >
                  <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-cyan-300 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="h-px bg-gradient-to-red from-transparent bg-blue-500 dark:bg-cyan-400 to-transparent my-4" />

          {/* Social/Contact CTA */}
          <motion.div variants={itemVariants}>
            <Link
              to="/about" // Redirects to About page as requested
              className="block px-3 py-2 rounded-lg bg-blue-200 border-slate-500 text-gray-800 hover:text-white hover:bg-blue-400 dark:bg-cyan-500/30 border dark:border-cyan-400 text-center text-xs font-semibold dark:text-cyan-300 dark:hover:bg-cyan-500/50 transition-all"
            >
              Know us Better
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence> 
  );
});

About.displayName = "About";
export default About;
