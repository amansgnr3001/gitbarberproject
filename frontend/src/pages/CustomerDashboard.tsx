import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, Calendar } from 'lucide-react';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear only customer-related data
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerData");

    // Redirect to homepage/login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, John!</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            className="bg-amber-600 text-white p-6 rounded-xl hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-8 w-8 mx-auto mb-2" />
            <span className="block font-semibold">Book Appointment</span>
          </button>

          <button
            onClick={() => navigate("/customer/services")}
            className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow"
          >
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <span className="block font-semibold text-gray-900">View Services</span>
          </button>

          <button className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow">
            <User className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <span className="block font-semibold text-gray-900">Profile Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
