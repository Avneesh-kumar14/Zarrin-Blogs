

const { Schema, model, default: mongoose } = require('mongoose')
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // ✅ OTP verification fields
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    // ✅ Password reset fields
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    blog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    }],
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
}, {
    timestamps: true
})

// ✅ Database Indexes for optimal query performance
// Note: email index is already created by unique: true
UserSchema.index({ createdAt: -1 }); // Sort by creation date
UserSchema.index({ role: 1 }); // Filter by role

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        logger.info('Password hashed successfully');
        next();
    } catch (error) {
        logger.error('Error hashing password:', { error: error.message });
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        logger.debug('Comparing passwords', {
            candidateLength: candidatePassword.length,
            storedHashLength: this.password.length,
        });
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        logger.debug('Password comparison result', { isMatch });
        return isMatch;
    } catch (error) {
        logger.error('Error comparing passwords:', { error: error.message });
        throw error;
    }
}

const UserModel = model("user", UserSchema)
module.exports = UserModel