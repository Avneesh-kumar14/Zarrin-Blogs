const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB Atlas');

    // Define User Schema
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: 'user' },
      blog: [mongoose.Schema.Types.ObjectId]
    });

    const User = mongoose.model('user', userSchema);

    // Hash the password
    const hashedPassword = await bcrypt.hash('Raj@1234', 10);
    console.log('Password hashed successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'Admin@gmail.com' });
    if (existingAdmin) {
      console.log('❌ Admin account with this email already exists!');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Rajneesh Kumar',
      email: 'Admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      blog: []
    });

    console.log('\n✅ Admin account created successfully in MongoDB Atlas!\n');
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

createAdmin();
