import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, User, ArrowLeft, Phone } from 'lucide-react';
import { loginBarber, registerBarber } from '../HandleApi';

const BarberAuth = () => {
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let response;

      if (isLogin) {
        // --- LOGIN ---
        response = await loginBarber({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }

        // --- REGISTER ---
        response = await registerBarber({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }

      // ✅ Save token + barber data
      localStorage.setItem("barberToken", response.token);
      localStorage.setItem("barberId", JSON.stringify(response.barber.id));

      // ✅ Redirect to dashboard
      navigate("/barber/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Scissors className="h-8 w-8 text-amber-400" />
              <span className="ml-2 text-2xl font-bold text-white">Elite Cuts</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Barber Portal</h2>
            <p className="text-amber-400 text-sm mt-1">Professional Dashboard</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-center font-semibold rounded-l-lg transition-colors ${
                  isLogin 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-center font-semibold rounded-r-lg transition-colors ${
                  !isLogin 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Join Team
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform hover:scale-105 transition-all duration-300"
              >
                {isLogin ? 'Access Dashboard' : 'Join Our Team'}
              </button>
            </form>

            {isLogin && (
              <div className="mt-4 text-center">
                <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">
                  Forgot your password?
                </a>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Looking for an appointment?{' '}
                <Link to="/customer/auth" className="text-amber-600 hover:text-amber-700 font-semibold">
                  Customer Portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberAuth;
