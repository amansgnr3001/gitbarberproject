import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react"; 
import {
  getServiceTimings,
  getServicesByGender,
  bookAppointment,
  bookAppointment2,
} from "../HandleApi";
import { useNavigate } from "react-router-dom";

const formatTime = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

interface Service {
  _id: string;
  name: string;
  duration: number;
  cost: number; // UI field (maps to price in backend)
}

interface TimePeriod {
  startTime: number;
  endTime: number;
}

interface Timing {
  morning: TimePeriod;
  evening: TimePeriod;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [chosenServices, setChosenServices] = useState<Service[]>([]);
  
  const [timings, setTimings] = useState<Timing | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"morning" | "evening" | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimePeriod | null>(null);
  
  // ✅ Add loading state
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // fetch services
  const fetchServices = async () => {
    try {
      const res = await getServicesByGender();
      const mapped = (res.data || []).map((s: any) => ({
        _id: s._id,
        name: s.name,
        duration: s.duration,
        cost: s.price, // backend field is price
      }));
      setServices(mapped);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      window.alert("Failed to load services. Please refresh the page.");
    }
  };
  
  // fetch timings
  const fetchTimings = async () => {
    try {
      const res = await getServiceTimings();
      if (res.success) {
        setTimings(res.data);
      }
    } catch (err) {
      console.error("❌ Error fetching timings:", err);
      window.alert("Failed to load timings. Please refresh the page.");
    }
  };
  
  // ✅ Load initial data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchServices(), fetchTimings()]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // add service
  const handleAddService = () => {
    if (!selectedService) return;
    if (chosenServices.find((s) => s._id === selectedService._id)) {
      window.alert("Service already added.");
      return;
    }
    setChosenServices([...chosenServices, selectedService]);
    setSelectedService(null); // ✅ Clear selection after adding
  };
  
  // remove service
  const handleRemoveService = (id: string) => {
    setChosenServices(chosenServices.filter((s) => s._id !== id));
  };
  
  // ✅ Fixed book appointment function
 const handleBookAppointment = async () => {
  if (isBooking) return; // ✅ Prevent multiple clicks

  try {
    setIsBooking(true);

    // ✅ Step 1: Validate inputs
    if (chosenServices.length === 0) {
      window.alert("❌ Please select at least one service.");
      return;
    }

    if (!selectedPeriod || !timeSlot) {
      window.alert("❌ Please select a time slot.");
      return;
    }

    // ✅ Step 2: Get customer data
    const customerDataString = localStorage.getItem("customerData");
    if (!customerDataString) {
      window.alert("❌ No customer data found. Please log in again.");
      return;
    }

    const customerData = JSON.parse(customerDataString);
    if (!customerData || !customerData.id) {
      window.alert("❌ Invalid customer data. Please log in again.");
      return;
    }

    // ✅ Step 3: Calculate total cost
    const totalCost = chosenServices.reduce(
      (sum, svc) => sum + (svc.cost || 0),
      0
    );

    // ✅ Step 4: Update slot availability first
    const totalDuration = chosenServices.reduce(
      (sum, svc) => sum + (svc.duration || 0),
      0
    );

    console.log("📌 Updating slot availability...");
    const timeslotResponse = await bookAppointment({
      slot: selectedPeriod, // "morning" | "evening"
      duration: totalDuration,
    });

    if (!timeslotResponse.success) {
      window.alert(`❌ Slot update failed: ${timeslotResponse.message}`);
      return;
    }

    console.log("✅ Slot updated:", timeslotResponse.data);

    // ✅ Step 5: Build booking payload
    const bookingPayload = {
      name: `${customerData.first_name} ${customerData.last_name}`,
      phoneNumber: customerData.phone,
      email: customerData.email,
      gender: customerData.gender,
      services: chosenServices.map((s) => ({
        serviceId: s._id,
        name: s.name,
        price: s.cost,
        duration: s.duration,
      })),
      slotPeriod: selectedPeriod,
      timeSlot: {
        startTime: timeslotResponse.data.startTime,
        endTime: timeslotResponse.data.endTime,
      },
      totalCost,
    };

    console.log("📦 Sending booking payload:", bookingPayload);

    // ✅ Step 6: Call booking API
    const bookingResponse = await bookAppointment2(bookingPayload);

    if (bookingResponse.success && bookingResponse.status === 201) {
      window.alert("✅ Appointment booked successfully!");
      // Reset form
      setChosenServices([]);
      setSelectedPeriod(null);
      setTimeSlot(null);
      setSelectedService(null);
    } else {
      console.error("❌ Booking failed:", bookingResponse);
      window.alert(`❌ ${bookingResponse.message || "Booking failed"}`);
    }
  } catch (err) {
    console.error("❌ Error booking appointment:", err);
    window.alert("Something went wrong, please try again.");
  } finally {
    setIsBooking(false);
  }
};


  useEffect(() => {
    loadInitialData();
  }, []);

  // ✅ Show loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-2xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  return (
    
    
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-2xl">
      <button
      onClick={() => navigate("/customer/dashboard")}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
    >
      <ArrowLeft size={20} /> Back to Dashboard
    </button>
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

      {/* Services */}
      <label className="block mb-2 font-medium">Select Service</label>
      <select
        className="w-full p-2 border rounded mb-2"
        value={selectedService?._id || ""}
        onChange={(e) =>
          setSelectedService(services.find((s) => s._id === e.target.value) || null)
        }
        disabled={isBooking}
      >
        <option value="">-- Select Service --</option>
        {services.map((service) => (
          <option key={service._id} value={service._id}>
            {service.name} ({service.duration} min | ₹{service.cost})
          </option>
        ))}
      </select>

      <button
        onClick={handleAddService}
        disabled={!selectedService || isBooking}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600 disabled:bg-gray-400"
      >
        + Add Service
      </button>

      {/* Chosen Services */}
      {chosenServices.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Added Services:</h3>
          <ul className="space-y-2">
            {chosenServices.map((s) => (
              <li
                key={s._id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>
                  {s.name} ({s.duration} min | ₹{s.cost})
                </span>
                <button
                  onClick={() => handleRemoveService(s._id)}
                  disabled={isBooking}
                  className="text-red-500 hover:underline disabled:text-gray-400"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          
          {/* ✅ Show total cost */}
          <div className="mt-3 p-2 bg-gray-100 rounded">
            <strong>Total: ₹{chosenServices.reduce((sum, s) => sum + s.cost, 0)}</strong>
          </div>
        </div>
      )}

      {/* Morning/Evening */}
      {timings && (
        <>
          <label className="block mb-2 font-medium">Select Period</label>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setSelectedPeriod("morning");
                setTimeSlot(timings.morning);
              }}
              disabled={isBooking}
              className={`px-4 py-2 rounded-lg border disabled:bg-gray-300 ${
                selectedPeriod === "morning" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              Morning ({formatTime(timings.morning.startTime)} -{" "}
              {formatTime(timings.morning.endTime)})
            </button>
            <button
              onClick={() => {
                setSelectedPeriod("evening");
                setTimeSlot(timings.evening);
              }}
              disabled={isBooking}
              className={`px-4 py-2 rounded-lg border disabled:bg-gray-300 ${
                selectedPeriod === "evening" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              Evening ({formatTime(timings.evening.startTime)} -{" "}
              {formatTime(timings.evening.endTime)})
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleBookAppointment}
        disabled={isBooking || chosenServices.length === 0 || !selectedPeriod}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {isBooking ? "Booking..." : "Book Appointment"}
      </button>
      {timeSlot && (
  <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg text-green-800">
    <strong>Updated Timeslot:</strong>{" "}
    {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
  </div>
)}
    </div>
  );
};

export default BookingPage;