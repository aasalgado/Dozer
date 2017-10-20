//Author: Harold & Nate
const
    mongoose = require('mongoose'),
    tripSchema = new mongoose.Schema({
        start: {type: String, default: "Start Location", required: true},
        end: {type: String, default: "End Location", required: true},
        //settings
        //method: "call" or "text"
        method: {type: String, default: "Text", required: true, enum: ['Call', 'Text']},
        //timing: "distance" or "timeTo"
        timing: {type: String, default: "By Time", required: true, enum: ['By Time', 'By Distance']},
        alertSeconds: {type: Number, default: 5},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }, {timestamps: true})

module.exports = mongoose.model('Trip', tripSchema)