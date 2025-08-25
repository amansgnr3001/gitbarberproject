import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, LogOut, TrendingUp, Scissors } from 'lucide-react';

const BarberDashboard = () => {
  const navigate = useNavigate();

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("barberToken");
    localStorage.removeItem("barberId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Barber Dashboard</h1>
            <div className="flex items-center space-x-6">
              {/* ✅ New Services Link */}
              <button
                onClick={() => navigate("/barber/services")}
                className="flex items-center text-gray-300 hover:text-white"
              >
                <Scissors className="h-5 w-5 mr-1" /> Services
              </button>

              <span className="text-gray-300">Welcome, Mike!</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Existing dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Today's Appointments", value: '8', icon: Calendar, color: 'bg-blue-500' },
            { title: "This Week's Revenue", value: '$1,250', icon: DollarSign, color: 'bg-green-500' },
            { title: 'Active Clients', value: '127', icon: Users, color: 'bg-purple-500' },
            { title: 'Average Rating', value: '4.9', icon: TrendingUp, color: 'bg-amber-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* (Keep the rest of your dashboard unchanged) */}
      </div>
    </div>
  );
};

export default BarberDashboard;
