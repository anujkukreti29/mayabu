import { memo } from "react";
import { motion } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { FiBell, FiHeart, FiUser } from "react-icons/fi";


const Navlinks = memo(() => {
  return (
    <div className="hidden sm:flex items-center gap-2">
      {/* Updates/Notifications */}
      <Tippy content="Updates" animation="scale" placement="bottom">
        <motion.a
          href="/updates"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:text-blue-800 hover:bg-blue-100 bg-white dark:text-gray-200 transition-all duration-200 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-300 group relative dark:bg-slate-800/50"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div whileHover={{ scale: 1.15}} transition={{ type: "spring", stiffness: 200 }}>
            <FiBell className="text-lg" />
          </motion.div>
          <span className="hidden lg:inline font-medium text-sm">Updates</span>
        </motion.a>
      </Tippy>

      {/* Wishlist */}
      <Tippy content="Wishlist" animation="scale" placement="bottom">
        <motion.a
          href="/wishlist"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:text-blue-800 hover:bg-blue-100 bg-white dark:text-gray-200 transition-all duration-200 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-300 group dark:bg-slate-800/50"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div whileHover={{ scale: 1.15}} transition={{ type: "spring", stiffness: 200 }}>
            <FiHeart className="text-lg" />
          </motion.div>
          <span className="hidden lg:inline font-medium text-sm">Wishlist</span>
        </motion.a>
      </Tippy>

      <span className="division text-gray-200 text-2xl text-center">|</span>

      {/* Profile */}
      <Tippy content="Profile" animation="scale" placement="bottom">
        <motion.a
          href="/profile"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm dark:text-gray-200 transition-all duration-200 bg-white text-gray-800 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-300 group hover:text-blue-800 hover:bg-blue-100 dark:bg-slate-800/50"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div whileHover={{ scale: 1.15}} transition={{ type: "spring", stiffness: 200 }}>
            <FiUser className="text-lg" />
          </motion.div>
          <span className="hidden lg:inline font-medium text-sm">Profile</span>
        </motion.a>
      </Tippy>
    </div>
  );
});

Navlinks.displayName = "Navlinks";
export default Navlinks;