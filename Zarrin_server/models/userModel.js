

const { Schema, model, default: mongoose } = require('mongoose')
const bcrypt = require('bcryptjs');

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
    blog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    }]
}, {
    timestamps: true
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully');
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('Comparing passwords:');
        console.log('Candidate password length:', candidatePassword.length);
        console.log('Stored hash length:', this.password.length);
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

const UserModel = model("user", UserSchema)
module.exports = UserModel