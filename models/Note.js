var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var noteSchema = new Schema ({
    noteText: {
        type: String
    }
})

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;