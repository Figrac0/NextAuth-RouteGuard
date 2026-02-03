import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    if (
        !email ||
        !email.includes("@") ||
        !password ||
        password.trim().length < 6
    ) {
        return res.status(422).json({ message: "Invalid input" });
    }

    let client;

    try {
        client = await connectToDatabase();
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Could not connect to database" });
    }

    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
        client.close();
        return res.status(422).json({ message: "User exists already!" });
    }

    const hashedPassword = await hashPassword(password);

    try {
        await db.collection("users").insertOne({
            email: email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        client.close();
        return res.status(201).json({ message: "Created user!" });
    } catch (error) {
        client.close();
        return res.status(500).json({ message: "Could not create user" });
    }
}

export default handler;
