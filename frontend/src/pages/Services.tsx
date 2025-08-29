import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getservices, deleteService } from "../HandleApi";
import ServiceFormCard from "../form/AddService";
import EditServiceForm from "../form/EditService";
import { Service  } from "../HandleApi"; // ✅ shared type

 


const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await getservices();
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await deleteService(id);
      if (res.success) {
        alert("✅ Service deleted successfully");
        fetchServices();
      } else {
        alert(res.message || "Failed to delete service");
      }
    } catch (err) {
      console.error("❌ Error deleting service:", err);
      alert("Something went wrong while deleting. Please try again.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <p className="p-6">Loading services...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/barber/dashboard")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="grid md:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">{service.name}</h2>
                <p className="text-gray-600 mt-1">₹{service.price}</p>
                <p className="text-gray-500 text-sm">
                  Duration: {service.duration} mins
                </p>
                <p className="text-gray-500 text-sm">
                  Gender: {service.gender}
                </p>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setEditService(service)}
                  className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-gray-500">No services available.</p>
        )}
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <ServiceFormCard
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchServices}
          />
        </div>
      )}

      {/* Edit Service Modal */}
      {editService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <EditServiceForm
            service={editService}
            onClose={() => setEditService(null)}
            onSuccess={fetchServices}
          />
        </div>
      )}
    </div>
  );
};

export default Services;
