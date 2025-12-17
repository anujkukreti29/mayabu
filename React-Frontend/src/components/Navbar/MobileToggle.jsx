// components/Navbar/NavbarMobileToggle.jsx

import { memo } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const NavbarMobileToggle = memo(({ menuOpen, setMenuOpen }) => {
  return (
    <motion.button
      aria-label="Toggle menu"
      onClick={() => setMenuOpen((p) => !p)}
      className="flex sm:hidden rounded-lg p-2 text-gray-200 hover:bg-cyan-500/30 hover:text-cyan-300 transition-all duration-200 ml-2 bg-slate-800/50"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
    >
      <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
        {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
      </motion.div>
    </motion.button>
  );
});

NavbarMobileToggle.displayName = "NavbarMobileToggle";
export default NavbarMobileToggle;
