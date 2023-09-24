const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        inbox: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "inbox",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        text: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

messageSchema.pre(/^find|save/, function (next) {
    this.populate({ path: "sender", select: "-password -__v" });
    this.populate({ path: "inbox", select: "-__v" });
    next();
});

module.exports = mongoose.model("message", messageSchema);
