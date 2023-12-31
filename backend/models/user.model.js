const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "admin"]
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("user", UserSchema);
