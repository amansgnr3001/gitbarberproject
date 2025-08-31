import React, { useState, useEffect } from "react";
import {
  getServiceTimings,
  getServicesByGender,
  bookAppointment,
  bookAppointment2,
} from "../HandleApi";

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
  _id: string;
}

interface Timing {
  morning: TimePeriod;
  evening: TimePeriod;
  lastResetDate: string;
}

const BookingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [chosenServices, setChosenServices] = useState<Service[]>([]);

  const [timings, setTimings] = useState<Timing | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"morning" | "evening" | null>(null);

  // fetch services
  const fetchServices = async () => {
    try {
      const res = await getServicesByGender();
      setServices(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
    }
  };

  // fetch timings
  const fetchTimings = async () => {
    try {
      const res = await getServiceTimings();
      console.log("📅 Timings response:", res.data);
      setTimings(res.data); // ✅ fix (not res.data[0])
    } catch (err) {
      console.error("❌ Error fetching timings:", err);
    }
  };

  // add service
  const handleAddService = () => {
    if (!selectedService) return;
    if (chosenServices.find((s) => s._id === selectedService._id)) {
      alert("Service already added.");
      return;
    }
    setChosenServices([...chosenServices, selectedService]);
  };

  // remove service
  const handleRemoveService = (id: string) => {
    setChosenServices(chosenServices.filter((s) => s._id !== id));
  };

  // book appointment
 const handleBookAppointment = async () => {
  try {
    if (!chosenServices.length) {
      alert("Please select at least one service");
      return;
    }
    if (!selectedPeriod) {
      alert("Please select a time period (morning/evening)");
      return;
    }

    // ✅ Calculate total duration & cost
    const totalDuration = chosenServices.reduce((sum, s) => sum + s.duration, 0);
    const totalCost = chosenServices.reduce((sum, s) => sum + s.cost, 0);

    // ✅ Step 1: Reserve the time slot
    const slotUpdate = await bookAppointment({
      slot: selectedPeriod, // "morning" or "evening"
      duration: totalDuration,
    });

    if (!slotUpdate.success) {
      alert(slotUpdate.message || "Failed to book slot");
      return;
    }

    // ✅ Use the exact booked slot returned by backend
    const timeSlot = slotUpdate.data; // { startTime, endTime }

    // ✅ Step 2: Save booking details
    const bookingResponse = await bookAppointment2({
      selectedServices: chosenServices, // <-- fix
      totalDuration,
      totalCost,
      timeSlot,
      slotPeriod: selectedPeriod, // <-- fix
    });

    if (bookingResponse.success) {
      alert("✅ Appointment booked successfully!");
      setChosenServices([]); // clear selection
      setSelectedPeriod(null);
    } else {
      alert(bookingResponse.message || "Booking failed");
    }
  } catch (err) {
    console.error("❌ Error booking appointment:", err);
    alert("Something went wrong, please try again.");
  }
};

  useEffect(() => {
    fetchServices();
    fetchTimings();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

      {/* Services */}
      <label className="block mb-2 font-medium">Select Service</label>
      <select
        className="w-full p-2 border rounded mb-2"
        value={selectedService?._id || ""}
        onChange={(e) =>
          setSelectedService(services.find((s) => s._id === e.target.value) || null)
        }
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
        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600"
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
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Morning/Evening */}
      {timings && (
        <>
          <label className="block mb-2 font-medium">Select Period</label>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedPeriod("morning")}
              className={`px-4 py-2 rounded-lg border ${
                selectedPeriod === "morning" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Morning ({formatTime(timings.morning.startTime)} -{" "}
              {formatTime(timings.morning.endTime)})
            </button>
            <button
              onClick={() => setSelectedPeriod("evening")}
              className={`px-4 py-2 rounded-lg border ${
                selectedPeriod === "evening" ? "bg-blue-500 text-white" : ""
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
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default BookingPage;
