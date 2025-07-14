import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import salkaName from "../assets/salkatech_Name.png"
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "#contact" }, // Internal anchor
  ];

  const renderLink = (item) => {
    if (item.path.startsWith("#")) {
      // Anchor link scroll
      return (
        <a
          href={item.path}
          onClick={() => setIsOpen(false)}
          className="block hover:text-green-400"
        >
          {item.name}
        </a>
      );
    } else {
      // Regular routing
      return (
        <Link
          to={item.path}
          className="block hover:text-green-400"
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </Link>
      );
    }
  };

  return (
    <nav
      className="bg-transparent text-white px-6 py-4 shadow-md sticky top-0 z-50"
      data-aos="fade-down"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a
          href="https://salkatech.com"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img src={logo} className="h-10" alt="Logo" />
          <img src={salkaName} className="h-6" alt="Logo" />
          
         
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-lg">
          {navItems.map((item) => (
            <li key={item.name}>{renderLink(item)}</li>
          ))}
          <li>
            <Link
              to="/login"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg text-base font-semibold shadow-md hover:bg-gray-200"
            >
              Sign In
            </Link>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-2xl text-white">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 px-4 py-4 bg-black border-t border-gray-700 space-y-4 text-lg">
          {navItems.map((item) => (
            <div key={item.name}>{renderLink(item)}</div>
          ))}
          <div>
            <Link
              to="/login"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg text-base font-semibold shadow-md hover:bg-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
