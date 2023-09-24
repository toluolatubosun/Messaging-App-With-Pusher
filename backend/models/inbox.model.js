const mongoose = require("mongoose");

const inboxSchema = new mongoose.Schema(
    {
        users: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user"
                }
            ],
            required: true
        }
    },
    {
        timestamps: true
    }
);

inboxSchema.pre(/^find|^save/, function (next) {
    this.populate({ path: "users", select: "-password -__v" });
    next();
});

module.exports = mongoose.model("inbox", inboxSchema);
