import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: 60,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student',
    },
    // Specific to students
    studentId: {
        type: String,
        unique: true,
        sparse: true, // Only enforces uniqueness for documents that have this field
    },
    department: {
        type: String,
    },
    year: {
        type: Number,
    },
    faceEncoding: {
        type: [Number], // Array of floats representing the face encoding
        default: null
    },
    isFaceRegistered: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
