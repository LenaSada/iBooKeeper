const mongoose = require('mongoose');

const complaintresponseSchema = new mongoose.Schema({
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    response: String,
    file_path: String,
    date: { type: Date, default: Date.now },
})
const ComplaintResponse = mongoose.model('ComplaintResponse', complaintresponseSchema);
module.exports = ComplaintResponse;