const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    complaint: String,
    file_path: String,
    date: { type: Date, default: Date.now },
    addressed: {
        type: Boolean,
        default: false
    }
})
const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;