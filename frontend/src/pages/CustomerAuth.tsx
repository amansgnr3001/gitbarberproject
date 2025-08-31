import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scissors, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { signupCustomer, loginCustomer } from "../HandleApi"; // <-- make sure login API exists

// ✅ define a proper type for formData
type Gender = "Male" | "Female" | "Unisex" ; // allow empty for select
interface CustomerFormData {
  first_name: string;
  last_name: string;
  gender: Gender;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const CustomerAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

 const [formData, setFormData] = useState<CustomerFormData>({
  first_name: "",
  last_name: "",
  gender: "" as "Male" | "Female" | "Unisex", // ✅ single string, not array
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});


  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    let response;

    if (isLogin) {
      response = await loginCustomer({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      response = await signupCustomer({
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender as "Male" | "Female" | "Unisex",
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
    }

    // ✅ Save token & customer data in localStorage
    localStorage.setItem("customerToken", response.token);

    // ✅ Save entire customer object (all details)
    localStorage.setItem("customerData", JSON.stringify(response.customer));

    // ✅ Redirect to dashboard
    navigate("/customer/dashboard");
  } catch (err: any) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value as any, // cast needed for gender select
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-amber-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Scissors className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold text-white">
                Elite Cuts
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white">Customer Portal</h2>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-center font-semibold rounded-l-lg transition-colors ${
                  isLogin
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-center font-semibold rounded-r-lg transition-colors ${
                  !isLogin
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Extra signup fields */}
              {!isLogin && (
                <>
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
              >
                {isLogin ? "Login to Your Account" : "Create Account"}
              </button>
            </form>

            {isLogin && (
              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="text-amber-600 hover:text-amber-700 text-sm"
                >
                  Forgot your password?
                </a>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Are you a barber?{" "}
                <Link
                  to="/barber/auth"
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Join our team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
