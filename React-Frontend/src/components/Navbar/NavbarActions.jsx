import { memo } from "react";
import { motion } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { FiHelpCircle, FiInfo, FiChevronDown } from "react-icons/fi";
import HowItWorksDropdown from "./dropdowns/Howitworks";
import AboutDropdown from "./dropdowns/About";
import ThemeToggle from "./ThemeToggle.jsx";

const NavbarActions = memo(({ 
  howItWorksRef, 
  aboutRef, 
  howItWorksOpen, 
  setHowItWorksOpen, 
  aboutOpen, 
  setAboutOpen 
}) => {
  return (
    <div className="hidden md:flex items-center gap-5 mx-auto">
      {/* How It Works */}
      <div ref={howItWorksRef} className="relative">
        <Tippy content="How It Works" animation="scale" placement="bottom">
          <motion.button
            onClick={() => setHowItWorksOpen(!howItWorksOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:text-blue-800 hover:bg-blue-100 bg-white dark:text-gray-200 transition-all duration-200 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-300 group dark:bg-slate-800/50"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.3 }}>
              <FiHelpCircle className="text-lg" />
            </motion.div>
            <span className="font-medium text-sm">How It Works</span>
            <motion.div animate={{ rotate: howItWorksOpen ? -180 : 0 }} transition={{ duration: 0.3 }}>
              <FiChevronDown className="text-sm" />
            </motion.div>
          </motion.button>
        </Tippy>
        <HowItWorksDropdown isOpen={howItWorksOpen} />
      </div>

      {/* About */}
      <div ref={aboutRef} className="relative">
        <Tippy content="About" animation="scale" placement="bottom">
          <motion.button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white hover:text-blue-800 hover:bg-blue-100 dark:text-gray-200 transition-all duration-200 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-300 group dark:bg-slate-800/50"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.3 }}>
              <FiInfo className="text-lg" />
            </motion.div>
            <span className="font-medium text-sm">About</span>
            <motion.div animate={{ rotate: aboutOpen ? -180 : 0 }} transition={{ duration: 0.3 }}>
              <FiChevronDown className="text-sm" />
            </motion.div>
          </motion.button>
        </Tippy>
        <AboutDropdown isOpen={aboutOpen} />
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
  );
});

NavbarActions.displayName = "NavbarActions";
export default NavbarActions;
