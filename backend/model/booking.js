import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true, // ✅ strictly required
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // ensures 10 digit mobile
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: Number, required: true }, // in minutes
      },
    ],
    slotPeriod: {
      type: String,
      enum: ["morning", "evening"],
      required: true,
    },
    timeSlot: {
      startTime: { type: Number, required: true }, // in minutes since midnight
      endTime: { type: Number, required: true },
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
