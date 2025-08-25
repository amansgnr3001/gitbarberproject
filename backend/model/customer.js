import mongoose from 'mongoose';



// Define the customers schema
const customersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },gender: {
    type: String,
    enum: ["Male", "Female", "Other"], // only these values allowed
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true
  },
  password_hash: {
    type: String,
    required: true,
    maxlength: 255
  },
  is_active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    
    enum: ['customer'],
    default: 'customer'
  }

}, {
  // Schema options
  timestamps: true, // This automatically creates createdAt and updatedAt fields
  versionKey: false // Removes the __v field
});

// Create indexes for performance
customersSchema.index({ email: 1 }, { unique: true });
customersSchema.index({ phone: 1 });

// Optional: Add compound indexes if needed
// customersSchema.index({ first_name: 1, last_name: 1 });

// Virtual for full name
customersSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

// Transform JSON output (remove sensitive data)
customersSchema.methods.toJSON = function() {
  const customerObject = this.toObject();
  delete customerObject.password_hash; // Don't send password in responses
  return customerObject;
};

// Instance method to check if customer is active
customersSchema.methods.isActiveCustomer = function() {
  return this.is_active;
};

// Static method to find active customers
customersSchema.statics.findActive = function() {
  return this.find({ is_active: true });
};

// Create and export the model
const Customer = mongoose.model('Customer', customersSchema);

export default Customer;
