const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    diabetesType: {
        type: String,
        enum: ['Type 1', 'Type 2', 'Gestational', 'Other'],
        // required: true
    },
    age: {
        type: Number,
    },
    targetBloodSugar: {
        low: {
            type: Number
        },
        high: {
            type: Number
        }
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;