// service.js
import mongoose from "mongoose";

// Define the schema
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    duration: {
      type: Number, // duration in minutes/hours (decide your unit)
      required: true,
      min: 1
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt fields automatically
  }
);

// Create the model
const Service = mongoose.model("Service", serviceSchema);
console.log();

export default Service;
