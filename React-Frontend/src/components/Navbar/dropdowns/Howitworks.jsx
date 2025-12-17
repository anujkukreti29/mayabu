import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiGrid, FiDollarSign, FiHeart } from "react-icons/fi";

// How It Works Data
const howItWorksSteps = [
  { icon: "FiSearch", title: "Search Products", description: "Enter product name to compare" },
  { icon: "FiGrid", title: "Compare Prices", description: "View prices from all platforms" },
  { icon: "FiDollarSign", title: "Track Updates", description: "Get price drop notifications" },
  { icon: "FiHeart", title: "Save Money", description: "Find best deals instantly" },
];

// FAQ Data
export const faqItems = [
  {
    question: "How does Mayabu work?",
    answer: "We scrape real-time prices from Amazon, Flipkart, Croma & Reliance Digital to show you the best deals."
  },
  {
    question: "Is Mayabu free?",
    answer: "Yes! Mayabu is completely free. We help you save money without charging anything."
  },
  {
    question: "Which platforms are supported?",
    answer: "Currently: Amazon, Flipkart, Croma, Reliance Digital. More coming soon!"
  },
];

const HowItWorksDropdown = memo(({ isOpen }) => {
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

  const iconMap = {
    FiSearch,
    FiGrid,
    FiDollarSign,
    FiHeart,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="absolute top-full left-0 mt-3 w-96 bg-gradient-to-blue bg-white border-blue-700 dark:bg-slate-800 rounded-xl border dark:border-cyan-400 shadow-2xl z-40 p-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-4 pb-4 border-b border-blue-500 dark:border-cyan-400">
            <h3 className="text-sm font-bold dark:text-cyan-400 text-blue-700 flex items-center gap-2">
              <FiSearch className="w-4 h-4" />
              How Mayabu Works
            </h3>
          </motion.div>

          {/* Steps */}
          <div className="space-y-3 mb-4">
            {howItWorksSteps.map((step, idx) => {
              const IconComponent = iconMap[step.icon];
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex gap-3 p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-cyan-500/20 transition-all group"
                >
                  <motion.div
                    className="flex shrink-0 w-8 h-8 rounded-lg bg-gray-200 border-gray-800 text-slate-800 dark:bg-cyan-500/30 border dark:border-cyan-400 items-center justify-center dark:text-cyan-400"
                    whileHover={{ scale: 1.1}}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{step.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="h-px bg-gradient-to-red from-transparent bg-blue-500 dark:bg-cyan-400 to-transparent my-4" />

          {/* FAQ Preview */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <p className="text-xs font-semibold text-indigo-800 dark:text-gray-300 mb-2">Quick FAQ</p>
            {faqItems.slice(0, 2).map((faq, idx) => (
              <div key={idx} className="text-xs">
                <p className="dark:text-cyan-300 text-blue-700 font-medium">{faq.question}</p>
                <p className="dark:text-gray-400 text-gray-600 text-xs mt-0.5">{faq.answer}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a
            variants={itemVariants}
            href="/faq"
            className="block mt-4 px-3 py-2 rounded-lg bg-blue-200 border-slate-500 text-gray-800 hover:text-white hover:bg-blue-400 dark:bg-cyan-500/30 border dark:border-cyan-400 text-center text-xs font-semibold dark:text-cyan-300 dark:hover:bg-cyan-500/50 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All FAQs →
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

HowItWorksDropdown.displayName = "HowItWorksDropdown";
export default HowItWorksDropdown;
