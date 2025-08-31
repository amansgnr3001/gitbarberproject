import mongoose from "mongoose";

const { Schema } = mongoose;

const TimeSlotSchema = new Schema({
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
});

const ServiceTimingSchema = new Schema({
  morning: { type: TimeSlotSchema, required: true },
  evening: { type: TimeSlotSchema, required: true },
  lastResetDate: { type: String, default: "" }

});

const ServiceTiming = mongoose.model("ServicesTimings", ServiceTimingSchema);

export default ServiceTiming;
