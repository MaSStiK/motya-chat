import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import MongoConnect from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";

export default async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    const payload = verifySession(token);
    if (!payload?.userId) return null;

    await MongoConnect();

    const user = await User.findById(payload.userId).lean();
    return user || null;
}