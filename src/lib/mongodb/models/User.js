import mongoose from "mongoose"
import USER_LIMITS from "@/lib/validation/userLimits"

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials"
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: USER_LIMITS.name.min,
        maxlength: USER_LIMITS.name.max
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: USER_LIMITS.username.min,
        maxlength: USER_LIMITS.username.max
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: USER_LIMITS.email.max,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password: {
        type: String,
        default: null,
        minlength: USER_LIMITS.password.min,
        maxlength: USER_LIMITS.password.max
    },

    avatar: {
        type: String,
        maxlength: USER_LIMITS.avatar.max,
        default: null
    },

    role: {
        type: String,
        enum: ["user", "admin"], // Защита от произвольных ролей
        default: "user"
    }
},
{
    timestamps: true
})

export default mongoose.models.User || mongoose.model("User", UserSchema)