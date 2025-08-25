import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";

import { getservices } from "../HandleApi";

interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getservices(); // ✅ already returns data

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

    fetchServices();
  }, []);

  if (loading) return <p className="p-6">Loading services...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button
          onClick={() => alert("Open Add Service Modal")}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {service.name}
                </h2>
                <p className="text-gray-600 mt-1">₹{service.price}</p>
                <p className="text-gray-500 text-sm">
                  Duration: {service.duration} mins
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => alert(`Edit ${service.name}`)}
                  className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => alert(`Delete ${service.name}`)}
                  className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-gray-500">No services available.</p>
        )}
      </div>
    </div>
  );
};

export default Services;
