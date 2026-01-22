import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    session: {
        // In a real app, you might link this to a 'Session' or 'Timetable' model
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'absent',
    },
    confidence: {
        type: Number, // Face match confidence score
    }
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
