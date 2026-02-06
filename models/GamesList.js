const mongoose = require("mongoose");

const highScoreSchema = new mongoose.Schema(
    {
        userId:{type:String},
        playername:{type: String, required: true, maxlength: 24},
        score:{type:Number, required: true, min:0},
        level:{type:Number, default:1, min:1}
    },
    {timestamps: true}
);

module.exports = mongoose.model("GamesList", highScoreSchema);