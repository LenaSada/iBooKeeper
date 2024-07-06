const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['customer', 'accountant'],
        default: 'customer'
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointments'
    }],
    appointments_dates: [{
        type: String,
        unique: true
    }]
})
const User = mongoose.model('User', userSchema);
module.exports = User;