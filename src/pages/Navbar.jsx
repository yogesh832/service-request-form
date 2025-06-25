import { Link, NavLink } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../assets/logo.png"; // Adjust the path as necessary
const Navbar = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <nav
      className="bg-black text-white px-6 py-3 flex justify-between items-center"
      data-aos="fade-down"
    >
      <div >
        <a href="https://salkatech.com" target="_blank" className="flex items-center" rel="noopener noreferrer" >
        <img src={logo} className="h-10" alt="" />
        <span className="text-2xl font-bold text-green-500">SALKA</span>
        <span className="text-2xl font-bold text-white">TECH</span>
      </a>
      </div>
      <ul className="flex space-x-6">
        {[
          { name: "Home", path: "/" },
          { name: "Services", path: "https://salkatech.com/#oem-auth" },
          { name: "Projects", path: "https://salkatech.com/#portfolio" },
          { name: "Products", path: "https://salkatech.com/#products" },
          { name: "Our Approach", path: "https://salkatech.com/#work" },
          { name: "Testing Service", path: "https://salkatech.com/#approch" },
          { name: "Our Values", path: "https://salkatech.com/#call-to-action" },
          { name: "About", path: "https://salkatech.com/#about" },
          { name: "Contact", path: "https://salkatech.com/#contact" },
        ].map((item) => (
          <li key={item.name} data-aos="fade-down">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `hover:text-green-400 ${isActive ? "text-green-400" : ""}`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
