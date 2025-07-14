import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import heroimg1 from "../assets/heroimg1.png";
import Navbar from "./Navbar";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaArrowRight, FaShieldAlt, FaChartLine, FaHeadset } from "react-icons/fa";
import logo from "../assets/logo.png";
import salkaName from "../assets/salkatech_Name.png"

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition text-white">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300 text-sm md:text-base">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-[80vh] sm:h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroimg1})` }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 max-w-2xl text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            <a
              href="https://salkatech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-30"
            >
              <img src={logo} className="h-20" alt="Logo" />
          <img src={salkaName} className="h-6" alt="Logo" />
             
            </a>{" "}
            Support Ticketing System
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300">
            Streamline your customer support with our intuitive platform.{" "}
            <br className="hidden sm:block" />
            Resolve issues faster and keep your customers happy.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg text-base font-semibold shadow-md hover:bg-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Hide Swiper arrows on small screens */}
      <style>
        {`
          @media (max-width: 768px) {
            .swiper-button-next,
            .swiper-button-prev {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage customer support efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <FeatureCard
              icon={<FaHeadset size={32} />}
              title="Ticket Management"
              description="Organize, prioritize, and track support tickets from a single dashboard."
            />
            <FeatureCard
              icon={<FaChartLine size={32} />}
              title="Analytics & Reporting"
              description="Gain insights with detailed reports on ticket volumes, resolution times, and more."
            />
            <FeatureCard
              icon={<FaShieldAlt size={32} />}
              title="Role-Based Access"
              description="Control permissions with customizable roles for admins, agents, and clients."
            />
            <FeatureCard
              icon={<FaHeadset size={32} />}
              title="Multi-Channel Support"
              description="Manage requests from email, chat, and social media in one place."
            />
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="bg-white text-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
          <div className="h-1 w-20 mx-auto bg-green-500 mb-4 rounded"></div>
          <p className="text-gray-600 mb-12">Looking forward to talking with you!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Address */}
            <div className="flex flex-col items-center space-y-4">
              <FiMapPin className="w-8 h-8 text-green-500" aria-label="Address icon" />
              <h3 className="font-semibold">SALKA GLOBAL TECHNOLOGIES PVT. LTD.</h3>
              <p className="text-sm text-gray-600">
                UTC, Tower A, S1 Floor, Unit#119,<br />
                Sector – 132, Express Way,<br />
                Noida UP 201304
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center space-y-4">
              <FiPhone className="w-8 h-8 text-green-500" aria-label="Phone icon" />
              <h3 className="font-semibold">Phone Number</h3>
              <p className="text-sm text-gray-600">
                +91-9999364459<br />
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center space-y-4">
              <FiMail className="w-8 h-8 text-green-500" aria-label="Email icon" />
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-gray-600">info@salkatech.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
