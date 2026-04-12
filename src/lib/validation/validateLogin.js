import { z } from "zod"
import messages from "./messages"
import USER_LIMITS from "./userLimits"

export function validateLogin(data, lang = "en") {
    const msg = messages[lang] || messages.en

    const schema = z.object({
        email: z.string({ error: msg.required_email })
            .trim()
            .toLowerCase()
            .email({ error: msg.email_invalid }),

        password: z.string({ error: msg.required_password })
            .trim()
            .min(USER_LIMITS.password.min, { error: msg.password_min })
            .max(USER_LIMITS.password.max, { error: msg.password_max }),
    })

    const result = schema.safeParse(data)

    if (!result.success) {
        return {
            success: false,
            message: msg.validation_error,
            errors: result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
        }
    }

    return {
        success: true,
        data: result.data,
    }
}