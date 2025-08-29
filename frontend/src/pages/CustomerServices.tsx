import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For navigation
import { getServicesByGender } from "../HandleApi";

interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
  gender: string;
}

const CustomerServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // ✅ Initialize navigate

  const fetchServices = async () => {
    try {
      const res = await getServicesByGender();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <p className="p-6">Loading services...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back Arrow */}
      <button
        onClick={() => navigate("/customer/dashboard")}
        className="flex items-center text-gray-700 mb-6 hover:text-gray-900"
      >
        <span className="mr-2 text-2xl">←</span> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <h2 className="text-lg font-bold text-gray-900">{service.name}</h2>
              <p className="text-gray-600 mt-1 font-medium">₹{service.price}</p>
              <p className="text-gray-500 text-sm">⏱ {service.duration} mins</p>
              <p className="text-gray-500 text-sm">👤 {service.gender}</p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-gray-500">No services available for your gender.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerServices;
