import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseConn {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}
const globalWithMongoose = globalThis as typeof globalThis & { mongoose?: MongooseConn };
const cached: MongooseConn = globalWithMongoose.mongoose ?? { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = cached;
}

export const connect = async () => {
    if (cached.conn) return cached.conn;

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URI, {
            dbName: "clerkauthv5",
            bufferCommands: false,
            connectTimeoutMS: 30000,
        });

    cached.conn = await cached.promise;

    return cached.conn;
};