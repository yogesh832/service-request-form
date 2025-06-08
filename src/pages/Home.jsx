import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaChartLine, FaHeadset } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Modern Support Ticketing System
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Streamline your customer support with our intuitive ticketing platform. 
            Resolve issues faster and keep your customers happy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white text-gray-800 font-medium rounded-xl shadow hover:shadow-md transition-all border border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who use our platform daily
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-yellow-400 mb-4 flex">
                  {'★'.repeat(5)}
                </div>
                <p className="text-gray-600 mb-6">
                  "This platform has transformed how we handle customer support. 
                  Our resolution times have improved by 40% since implementation."
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    U
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Sarah Johnson</p>
                    <p className="text-gray-500">Support Manager, TechCorp</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-purple-600">
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
            Start Free Trial <FaArrowRight className="ml-2" />
          </Link>
          <p className="mt-4 text-blue-100">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>
    </div>
  );
};