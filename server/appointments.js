const mongoose = require('mongoose');

function generateTimeIntervals() {
    const time_intervals={};
    for(let i=8;i<=20;i+=0.5) {
        time_intervals[i]=null;
    }
    return time_intervals;
}

const appointmentsSchema = new mongoose.Schema({
    date: {
        type: String,
        unique: true
    },
    time_intervals: {
        type: mongoose.Schema.Types.Mixed,
        default: generateTimeIntervals
    }
})
const Appointments = mongoose.model('Appointments', appointmentsSchema);
module.exports = Appointments;