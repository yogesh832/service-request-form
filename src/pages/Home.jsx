import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import heroimg1 from "../assets/heroimg1.png";
import heroimg2 from "../assets/heroimg2.png";
import Navbar from "./Navbar";
import { FaArrowRight, FaShieldAlt, FaChartLine, FaHeadset } from 'react-icons/fa';

const slides = [heroimg1, heroimg2];

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow text-white">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={true}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="h-screen"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-screen flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-70"></div>

              {/* Content */}
              <div className="relative z-10 max-w-2xl text-center px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Modern Support Ticketing System
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                  Streamline your customer support with our intuitive ticketing platform. <br />
                  Resolve issues faster and keep your customers happy.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link
                    to="/get-started"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-200"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage customer support efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaHeadset size={40} />}
              title="Ticket Management"
              description="Organize, prioritize, and track support tickets from a single dashboard."
            />
            <FeatureCard
              icon={<FaChartLine size={40} />}
              title="Analytics & Reporting"
              description="Gain insights with detailed reports on ticket volumes, resolution times, and more."
            />
            <FeatureCard
              icon={<FaShieldAlt size={40} />}
              title="Role-Based Access"
              description="Control permissions with customizable roles for admins, agents, and clients."
            />
            <FeatureCard
              icon={<FaHeadset size={40} />}
              title="Multi-Channel Support"
              description="Manage requests from email, chat, and social media in one place."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied customers who use our platform daily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-900 p-8 rounded-xl shadow-md border border-gray-700 text-white">
                <div className="text-yellow-400 mb-4 flex">
                  {'★'.repeat(5)}
                </div>
                <p className="text-gray-300 mb-6">
                  "This platform has transformed how we handle customer support. 
                  Our resolution times have improved by 40% since implementation."
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    U
                  </div>
                  <div>
                    <p className="font-medium text-white">Sarah Johnson</p>
                    <p className="text-gray-400">Support Manager, TechCorp</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Support Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of companies that trust our platform for their customer support needs.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all"
          >
            Start Now <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
