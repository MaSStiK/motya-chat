import mongoose, { Schema } from "mongoose"

const ChatSchema = new Schema({
    type: {
        type: String,
        enum: ["private", "group"],
        default: "private",
        required: true
    },
    members: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        validate: {
            validator: members => members.length > 0,
            message: "В чате должен быть хотя бы один участник"
        }
    },
    title: {
        type: String,
        trim: true,
        maxlength: 128,
        default: null
    },
    lastMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    privateKey: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

// Быстро получаем чаты пользователя и сортируем их по последней активности
ChatSchema.index({ members: 1, updatedAt: -1 })

// Запрещаем создавать дубли private-чатов между одними и теми же пользователями
ChatSchema.index({ privateKey: 1 }, { unique: true, sparse: true })

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema)