const mongoose = require('mongoose');
const mealSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nutrients: {
        caloriesKcal: {
            type: Number,
            required: true
        },
        totalCarbsGrams: {
            type: Number,
            required: true
        },
        proteinGrams: {
            type: Number,
            required: true
        },
        fatGrams: {
            type: Number,
            required: true
        },
        fiberGrams: {
            type: Number,
            required: true
        },
        sugarGrams: {
            type: Number,
            required: true
        }   

    },
    glycemicLoad: {
        type: String,
    },
    assumptions: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const MealModel = mongoose.model('Meal', mealSchema);

module.exports = MealModel;
