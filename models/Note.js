var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var noteSchema = new Schema ({
    _jobId : {
        type: Schema.Types.ObjectId,
        ref: "JobPosting"
    },
    noteText: {
        type: String
    }
})

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;