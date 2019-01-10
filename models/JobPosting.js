var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var jobPostings = new Schema ({
    title: {
        type: String,
        require: true,
        unique: true
    },
    location: {
        type: String,
        require: true,
    },
    date: {
        type: String
    },
    saved: {
        type: Boolean,
        default: false
    }
})

var Job = mongoose.model("JobPosting", jobPostings);

module.exports = Job;