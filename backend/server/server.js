import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import Customer from "../model/customer.js";
import jwt from "jsonwebtoken";
import Barber from "../model/barber.js";
import connectDB from "./db.js";
import Service from "../model/service.js";
import ServiceTiming from "../model/slot.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
 connectDB();
 
 

// ------------------- AUTH MIDDLEWARES -------------------

// Authenticate Customer Middleware
const authenticateCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id).select("-password");
    if (!customer) {
      return res.status(401).json({ message: "Customer not found" });
    }

    req.customer = customer; // attach customer
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Authenticate Barber Middleware
const authenticateBarber = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Extract token correctly
    const barberToken = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(barberToken, process.env.JWT_SECRET);

    // ✅ Find barber in DB
    const barber = await Barber.findById(decoded.id).select("-password");
    if (!barber) {
      return res.status(401).json({ message: "Barber not found" });
    }

    req.barber = barber; // attach barber object to request
    next();
  } catch (error) {
    console.error("❌ Barber Auth Error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
// ------------------- ROUTES -------------------
// Register Customer
app.post("/api/customers/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, gender } = req.body;

    if (!first_name || !last_name || !email || !password || !phone || !gender) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender selected" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingCustomer = await Customer.findOne({ email: normalizedEmail });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = new Customer({
      first_name,
      last_name,
      email: normalizedEmail,
     password_hash: hashedPassword,
      phone,
      gender,
    });

    await customer.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      customer: {
        id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
      },
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Register Barber
app.post("/api/barbers/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password   // 👈 plain text from user, we’ll hash it
    } = req.body;

    // ✅ 1. Validate required fields
    if (!first_name || !last_name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // ✅ 2. Check if barber already exists
    const existingBarber = await Barber.findOne({ email });
    if (existingBarber) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ 4. Create barber
    const barber = new Barber({
      first_name,
      last_name,
      email,
      phone,
      password_hash: hashedPassword,  // store hashed password
      role: "barber"  // 👈 default as per your schema (but looks like it should be "barber"?)
    });

    await barber.save();

    // ✅ 5. Generate JWT
    const token = jwt.sign(
      { id: barber._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ 6. Respond
    res.status(201).json({
      message: "Barber registered successfully",
      token,
      barber: {
        id: barber._id,
        first_name: barber.first_name,
        last_name: barber.last_name,
        email: barber.email,
        phone: barber.phone,
        is_active: barber.is_active,
        role: barber.role,
        createdAt: barber.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Barber Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Login Barber
app.post("/api/barbers/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // ✅ 2. Check if barber exists
    const barber = await Barber.findOne({ email });
    if (!barber) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ 3. Compare password
    const isMatch = await bcrypt.compare(password, barber.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ 4. Generate JWT
    const token = jwt.sign(
      { id: barber._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ 5. Respond with token + barber details
    res.json({
      message: "Login successful",
      token,
      barber: {
        id: barber._id,
        first_name: barber.first_name,
        last_name: barber.last_name,
        email: barber.email,
        phone: barber.phone,
        is_active: barber.is_active,
        role: barber.role,
        createdAt: barber.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Barber Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


//login customer
app.post("/api/customers/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // ✅ 2. Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ 3. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ 4. Generate JWT token
    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ 5. Send response (never send password back)
    res.json({
      message: "Login successful",
      token,
      customer: {
        id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        gender:customer.gender,
        email: customer.email,
        phone: customer.phone,
        is_active: customer.is_active,
        role: customer.role,
        createdAt: customer.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Customer Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

 
 
 
app.get("/api/getservice", async (req, res) => {
  try {
    console.log("gandu");
    const services = await Service.find(); // fetch from MongoDB
    console.log(services);
    
    res.json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//add service
app.post("/api/addservice", authenticateBarber, async (req, res) => {
  try {
    const { name, price, duration, gender } = req.body;

    // Validate required fields
    if (!name || !price || !duration || !gender) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, price, duration, and gender",
      });
    }

    // Validate gender
    const allowedGenders = ["Male", "Female", "Unisex"];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Gender must be 'Male', 'Female', or 'Unisex'",
      });
    }

    const newService = new Service({ name, price, duration, gender });
    await newService.save();

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error adding service:", error.message);
    res.status(500).json({
      success: false,
      message: "Problem adding service",
      error: error.message,
    });
  }
});



app.put("/api/updateservice/:id", authenticateBarber, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, gender } = req.body;

    // Validate gender if provided
    const allowedGenders = ["Male", "Female", "Unisex"];
    if (gender && !allowedGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Gender must be 'Male', 'Female', or 'Unisex'",
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, price, duration, ...(gender && { gender }) },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).json({
      success: false,
      message: "Problem updating service",
      error: error.message,
    });
  }
});



// ✅ Delete a service (Barber only)
app.delete("/api/deleteservice/:id", authenticateBarber, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({
      success: false,
      message: "Problem deleting service",
      error: error.message,
    });
  }
});

// ✅ Get services based on customer's gender (Customer only)
app.get("/api/services/by-gender/:gender", authenticateCustomer, async (req, res) => {
  try {
    const customerGender = req.params.gender; // comes from authenticateCustomer

    if (!customerGender) {
      return res.status(400).json({
        success: false,
        message: "Customer gender not found",
      });
    }

    // ✅ Services that match customer's gender OR Unisex
    const services = await Service.find({
      $or: [{ gender: customerGender }, { gender: "Unisex" }],
    });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("❌ Error fetching services by gender:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});







// ------------------- SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
