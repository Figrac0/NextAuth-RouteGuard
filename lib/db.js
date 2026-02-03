import { MongoClient } from "mongodb";

export async function connectToDatabase() {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const client = await MongoClient.connect(connectionString);

    return client;
}
