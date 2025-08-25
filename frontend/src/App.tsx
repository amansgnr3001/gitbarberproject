import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CustomerAuth from './pages/CustomerAuth';
import BarberAuth from './pages/BarberAuth';
import CustomerDashboard from './pages/CustomerDashboard';
import BarberDashboard from './pages/BarberDashboard';
import Services from './pages/Services';   

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer/auth" element={<CustomerAuth />} />
          <Route path="/barber/auth" element={<BarberAuth />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/barber/dashboard" element={<BarberDashboard />} />
          <Route path="/barber/services" element={<Services />} /> {/* ✅ Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
