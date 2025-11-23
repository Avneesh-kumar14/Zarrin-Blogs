const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB Atlas');

    // Define User Schema with pre-save middleware
    const userSchema = new mongoose.Schema({
      name: String,
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
      password: String,
      role: String,
      blog: [mongoose.Schema.Types.ObjectId]
    });

    // Add pre-save hook to hash password
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) {
        return next();
      }
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed in pre-save middleware');
        next();
      } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
      }
    });

    const User = mongoose.model('user', userSchema);

    // Delete existing admin if found
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Found existing admin, deleting...');
      await User.deleteOne({ email: 'admin@gmail.com' });
      console.log('Existing admin deleted');
    }

    // Create new admin user - email will be auto-lowercased by schema
    const admin = new User({
      name: 'Rajneesh Kumar',
      email: 'admin@gmail.com',  // Use lowercase directly
      password: 'Raj@1234',
      role: 'admin',
      blog: []
    });

    // Save will trigger pre-save middleware to hash password
    await admin.save();
    console.log('\n✅ Admin account recreated successfully in MongoDB Atlas!\n');
    console.log('Admin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Password: Raj@1234');
    console.log('Role:', admin.role);
    console.log('ID:', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('Connection closed. Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

resetAdmin();
