import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavbarActions from "./NavbarActions.jsx";
import Navlinks from "./Navlinks";
import MobileMenu from "./MobileMenu";
import logo_light from "../../assets/images/logo.png"
import logo_dark from "../../assets/images/logo_dark.png"
import MobileToggle from "./MobileToggle.jsx"


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const howItWorksRef = useRef(null);
  const aboutRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (howItWorksRef.current && !howItWorksRef.current.contains(event.target)) {
        setHowItWorksOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setAboutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 shadow-2xl backdrop-blur-2xl bg-white text-gray-800 border-b border-gray-300 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-gray-100 dark:border-cyan-400`}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <motion.div
            className="flex flex-shrink-0 items-center"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <a href="/" className="flex items-center group relative">
              <img
                src={logo_light}
                alt="Mayabu"
                className="h-12 block dark:hidden transition-opacity duration-300 w-auto sm:h-10 md:h-12 transition-all duration-300 group-hover:drop-shadow-gray-300"
              />
              <img
                src={logo_dark}
                alt="Mayabu"
                className="h-12 hidden dark:block transition-opacity duration-300 w-auto sm:h-10 md:h-12 transition-all duration-300 group-hover:drop-shadow-cyan-300"
              />
            </a>
          </motion.div>

          {/* Mid: Desktop Menu */}
          <NavbarActions
            howItWorksRef={howItWorksRef}
            aboutRef={aboutRef}
            howItWorksOpen={howItWorksOpen}
            setHowItWorksOpen={setHowItWorksOpen}
            aboutOpen={aboutOpen}
            setAboutOpen={setAboutOpen}
          />
          
          {/* Right: User Icons */}
          <Navlinks />

          {/* Mobile Menu Button */}
          <MobileToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-5" />
    </>
  );
};

export default Navbar;
