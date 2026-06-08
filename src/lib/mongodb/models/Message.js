import mongoose from "mongoose"
import MESSAGE_LIMITS from "@/lib/validation/messageLimits"

const MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: MESSAGE_LIMITS.message.max
    }
}, {
    timestamps: true
})

MessageSchema.index({ chat: 1, createdAt: -1 })

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)