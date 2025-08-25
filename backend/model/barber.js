import mongoose from 'mongoose';


// Define the barbers schema
const barbersSchema = new mongoose.Schema({
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
  },role: {
    type: String,
    required: true,
    enum: ['barber'],
    default: 'barber'
  }
}, {
  // Schema options
  timestamps: true, // This automatically creates createdAt and updatedAt fields
  versionKey: false // Removes the __v field
});

// Create indexes for performance (equivalent to SQL indexes)
barbersSchema.index({ email: 1 }, { unique: true });
barbersSchema.index({ phone: 1 });

// Optional: Add compound indexes if needed
// barbersSchema.index({ first_name: 1, last_name: 1 });

// Optional: Add virtual for full name
barbersSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

// Optional: Transform JSON output (remove sensitive data)
barbersSchema.methods.toJSON = function() {
  const barberObject = this.toObject();
  delete barberObject.password_hash; // Don't send password in responses
  return barberObject;
};

// Optional: Instance method to check if barber is active
barbersSchema.methods.isActiveBarber = function() {
  return this.is_active;
};

// Optional: Static method to find active barbers
barbersSchema.statics.findActive = function() {
  return this.find({ is_active: true });
};

// Create and export the model
const Barber = mongoose.model('Barber', barbersSchema);

export default Barber;