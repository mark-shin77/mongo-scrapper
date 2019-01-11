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
    summary: {
        type: String,
        require: true
    },
    saved: {
        type: Boolean,
        default: false
    }
})

var Job = mongoose.model("JobPosting", jobPostings);

module.exports = Job;