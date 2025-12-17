import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiHome, FiGrid, FiDollarSign, FiHeart, FiBell, FiInfo, FiUser, FiSettings } from "react-icons/fi";

const mobileMenuLinks = [
  { icon: "FiHome", label: "Home", href: "/" },
  { icon: "FiGrid", label: "Categories", href: "/categories" },
  { icon: "FiDollarSign", label: "Deals", href: "/deals" },
  { icon: "FiHeart", label: "Wishlist", href: "/wishlist" },
  { icon: "FiBell", label: "Updates", href: "/updates" },
  { icon: "FiInfo", label: "About", href: "/about" },
  { icon: "FiUser", label: "Profile", href: "/profile" },
  { icon: "FiSettings", label: "Settings", href: "/settings" },
];

const MobileMenu = memo(({ onClose }) => {
  // Icon mapping
  const iconMap = {
    FiHome,
    FiGrid,
    FiDollarSign,
    FiHeart,
    FiBell,
    FiInfo,
    FiUser,
    FiSettings,
  };

  return (
    <motion.aside
      key="menu"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="menu"
      aria-label="Mobile menu"
      className="fixed right-0 top-20 z-50 h-[calc(100vh-80px)] w-64 overflow-y-auto bg-gradient-to-blue bg-white border-blue-200 dark:from-slate-900 dark:to-slate-950 p-6 shadow-2xl sm:hidden border-l dark:border-cyan-400"
    >


      <motion.ul
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
        }}
      >
        {mobileMenuLinks.map((link) => {
          const IconComponent = iconMap[link.icon];
          return (
            <motion.li
              key={link.label}
              variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
            >
              <a
                href={link.href}
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-gray-800 bg-white hover:text-blue-200 dark:text-gray-100 transition-all duration-200 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-400 group"
              >
                <motion.div whileHover={{ scale: 1.15, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                  {IconComponent && <IconComponent size={20} />}
                </motion.div>
                <span className="font-medium text-sm flex-1">{link.label}</span>
              </a>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.aside>
  );
});

MobileMenu.displayName = "MobileMenu";
export default MobileMenu;
