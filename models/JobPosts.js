var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var jobPostings = new Schema ({
    title: {
        type: String,
        require: true,
        unique: true
    },
    link: {
        type: String,
        unique: true
    },
    location: {
        type: String,
        require: true,
    },
    salary: {
        type: String
    },
    summary: {
        type: String,
        require: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

var Job = mongoose.model("JobPosting", jobPostings);

module.exports = Job;