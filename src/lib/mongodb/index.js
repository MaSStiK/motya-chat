import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

if (!URI) throw new Error("MONGODB_URI is not defined in .env");

// Используем глобальный кэш (важно для Next.js / serverless)
// чтобы не создавать новое подключение при каждом запросе
let cached = global.mongoose;

// Инициализация кэша, если его ещё нет
if (!cached) {
    cached = global.mongoose = {
        connection: null, // готовое подключение
        promise: null,    // promise подключения (чтобы избежать race condition)
    };
}

export default async function MongoConnect() {
    // Если уже есть готовое подключение — просто возвращаем его
    if (cached.connection) return cached.connection;

    // Если подключения ещё нет, но уже есть promise — ждём его
    if (!cached.promise) {
        // Создаём новое подключение
        cached.promise = mongoose.connect(URI, {
            bufferCommands: false, // отключает буферизацию операций до подключения
        });
    }

    // Ждём завершения подключения
    cached.connection = await cached.promise;

    return cached.connection;
}