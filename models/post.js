var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
    title :String,
    description: String,
    time: { type: Date, default: Date.now },
    images:[String]
})

module.exports = mongoose.model("Post",PostSchema);