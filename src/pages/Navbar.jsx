import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "Services",
      path: "https://salkatech.com/#oem-auth",
    },
    {
      name: "Projects",
      path: "https://salkatech.com/#portfolio",
    },
    {
      name: "Products",
      path: "https://salkatech.com/#products",
    },
    {
      name: "Our Approach",
      path: "https://salkatech.com/#work",
    },
    {
      name: "Testing Service",
      path: "https://salkatech.com/#approch",
    },
    {
      name: "Our Values",
      path: "https://salkatech.com/#call-to-action",
    },
    { name: "About", path: "https://salkatech.com/#about", external: true },
    { name: "Contact", path: "https://salkatech.com/#contact", external: true },
  ];

  const renderLink = (item) =>
    item.external ? (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:text-green-400"
      >
        {item.name}
      </a>
    ) : (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `block hover:text-green-400 ${isActive ? "text-green-400" : ""}`
        }
        onClick={() => setIsOpen(false)}
      >
        {item.name}
      </NavLink>
    );

  return (
    <nav
      className="bg-transparent text-white px-6 py-4 shadow-md sticky top-0 z-50"
      data-aos="fade-down"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a
          href="https://salkatech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center "
        >
          <img src={logo} className="h-10" alt="Logo" />
          <span className="text-2xl font-bold text-green-500">SALKA</span>
          <span className="text-2xl font-bold text-white">TECH</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-lg">
          {navItems.map((item) => (
            <li key={item.name} data-aos="fade-down">
              {renderLink(item)}
            </li>
          ))}
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
        <div
          className="lg:hidden mt-4 px-4 py-4 bg-black border-t border-gray-700 space-y-4 text-lg animate-slide-down"
          data-aos="fade-down"
        >
          {navItems.map((item) => (
            <div key={item.name}>{renderLink(item)}</div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
