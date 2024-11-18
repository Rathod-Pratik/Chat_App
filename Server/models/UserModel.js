import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String, // Changed field name to lowercase for consistency
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
    },
    color: {
        type: Number,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

// Hash password before saving the user document
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) { // Only hash if password is modified
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    }
    next();
});

const User = mongoose.model("User", userSchema); // Changed collection name to singular

export default User;
