import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, Star, Users, MapPin, Phone } from 'lucide-react';


const LandingPage = () => {
   React.useEffect(() => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("barberToken");
  }, []);
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Elite Cuts</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-amber-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-amber-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
              <div className="flex space-x-2">
                <Link
                  to="/customer/auth"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Customer Login
                </Link>
                <Link
                  to="/barber/auth"
                  className="border border-amber-600 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  Barber Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Premium Grooming
                <span className="block text-amber-600">Experience</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the art of exceptional grooming with our expert barbers. 
                Book your appointment today and experience the difference.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/customer/auth"
                  className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
                >
                  Book Appointment
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:border-amber-600 hover:text-amber-600 transition-colors">
                  View Services
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional barber at work"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-gray-600">rating</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">500+ happy clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Professional grooming services tailored to your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Haircuts",
                description: "Precision cuts by expert stylists using the latest techniques",
                price: "$35",
                image: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                title: "Beard Styling",
                description: "Professional beard trimming and styling for the perfect look",
                price: "$25",
                image: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                title: "Hot Towel Shave",
                description: "Traditional wet shave with hot towel treatment and premium products",
                price: "$45",
                image: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-amber-600">{service.price}</span>
                  <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "Quick Booking", description: "Easy online appointment scheduling" },
              { icon: Users, title: "Expert Barbers", description: "Certified professionals with years of experience" },
              { icon: Star, title: "Top Rated", description: "Highest customer satisfaction in the city" },
              { icon: MapPin, title: "Prime Location", description: "Convenient downtown location with parking" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Visit Our Shop</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-amber-600" />
                  <span className="text-gray-700">123 Main Street, Downtown City, ST 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-amber-600" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <span className="text-gray-700">Mon-Sat: 9AM-7PM, Sun: 10AM-5PM</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">Join thousands of satisfied customers and book your appointment today.</p>
              <Link
                to="/customer/auth"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors inline-block"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Scissors className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-2xl font-bold">Elite Cuts</span>
            </div>
            <p className="text-gray-400 mb-4">Premium grooming experience since 2020</p>
            <div className="flex justify-center space-x-6">
              <Link to="/customer/auth" className="text-amber-600 hover:text-amber-500">Customer Portal</Link>
              <Link to="/barber/auth" className="text-amber-600 hover:text-amber-500">Barber Portal</Link>
            </div>
            <p className="text-gray-500 mt-8">&copy; 2025 Elite Cuts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;