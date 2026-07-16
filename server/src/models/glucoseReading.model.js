const mongoose = require('mongoose');
const glucoseReadingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reading: {
        type: Number,
        required: true
    },
    context: {
        type: String,
        enum: ['Fasting', 'Before Meal', 'After Meal', 'Random', 'Other'],
        required: true
    },
    note: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

glucoseReadingSchema.index({ user: 1, date: -1 });

const GlucoseReadingModel = mongoose.model('GlucoseReading', glucoseReadingSchema);

module.exports = GlucoseReadingModel;