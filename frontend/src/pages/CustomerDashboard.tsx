import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Star, LogOut, Plus } from 'lucide-react';

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

      {/* Rest of dashboard stays same */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="bg-amber-600 text-white p-6 rounded-xl hover:bg-amber-700 transition-colors">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <span className="block font-semibold">Book Appointment</span>
            </button>
            <button className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <span className="block font-semibold text-gray-900">View Schedule</span>
            </button>
            <button className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <span className="block font-semibold text-gray-900">Profile Settings</span>
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Premium Haircut</h3>
                    <p className="text-gray-600">with Mike Johnson</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Tomorrow</p>
                  <p className="text-gray-600">2:30 PM</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Reschedule
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h2>
          <div className="space-y-4">
            {[
              { service: 'Premium Haircut', barber: 'Mike Johnson', date: '2 days ago', rating: 5 },
              { service: 'Beard Styling', barber: 'Sarah Williams', date: '1 week ago', rating: 5 },
              { service: 'Hot Towel Shave', barber: 'David Brown', date: '2 weeks ago', rating: 4 }
            ].map((appointment, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.service}</h3>
                    <p className="text-gray-600">with {appointment.barber}</p>
                    <p className="text-sm text-gray-500">{appointment.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: appointment.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
