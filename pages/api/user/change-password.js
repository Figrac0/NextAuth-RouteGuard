import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { verifyPassword, hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Используем getServerSession вместо getSession
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: "Not authenticated!" });
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    // Валидация
    if (
        !oldPassword ||
        !newPassword ||
        oldPassword.trim().length < 6 ||
        newPassword.trim().length < 6
    ) {
        return res.status(422).json({
            message:
                "Invalid input - password should also be at least 6 characters long.",
        });
    }

    if (oldPassword === newPassword) {
        return res.status(422).json({
            message: "New password must be different from old password.",
        });
    }

    let client;

    try {
        client = await connectToDatabase();
        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const currentPassword = user.password;
        const passwordsAreEqual = await verifyPassword(
            oldPassword,
            currentPassword,
        );

        if (!passwordsAreEqual) {
            return res
                .status(403)
                .json({ message: "Old password is incorrect." });
        }

        const hashedPassword = await hashPassword(newPassword);

        const result = await usersCollection.updateOne(
            { email: userEmail },
            { $set: { password: hashedPassword } },
        );

        console.log(`Password changed for user: ${userEmail}`);

        res.status(200).json({
            message: "Password updated successfully!",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Password change error:", error);
        return res.status(500).json({
            message: "Server error. Please try again later.",
        });
    } finally {
        if (client) {
            client.close();
        }
    }
}

export default handler;
