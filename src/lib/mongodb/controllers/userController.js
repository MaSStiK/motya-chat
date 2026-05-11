import User from "@/lib/mongodb/models/User"

export async function findUserByEmail(email) {
    return User.findOne({ email })
}

export async function findUserByUsername(username) {
    return User.findOne({ username })
}

export async function createUser(data) {
    return User.create(data)
}