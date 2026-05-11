import mongoose from "mongoose"

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
        maxlength: 4000
    },
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
})

MessageSchema.index({ chatId: 1, createdAt: -1 })

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)