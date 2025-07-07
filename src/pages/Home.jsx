import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import heroimg1 from "../assets/heroimg1.png";
// import heroimg2 from "../assets/heroimg2.png";
import Navbar from "./Navbar";
import {
  FaArrowRight,
  FaShieldAlt,
  FaChartLine,
  FaHeadset,
} from "react-icons/fa";
import logo from "../assets/logo.png";
// const heroimg1 = heroimg;

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
              className="flex items-center justify-center h-30  "
            >
              <img src={logo} className="h-20 " alt="Logo" />
              <span className="text-3xl font-bold text-green-500">SALKA</span>
              <span className="text-3xl font-bold text-white">TECH</span>
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Support Experience?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-10">
            Join thousands of companies that trust our platform for their
            customer support needs.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all"
          >
            Start Now <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
