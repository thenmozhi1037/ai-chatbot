import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});
const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Schema */
const Chat = mongoose.model("Chat", chatSchema);
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema); 

/* Chat API */
app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;

    try {

        const completion =
await client.chat.completions.create({

    model: "llama-3.3-70b-versatile",

    messages: [
        {
            role: "user",
            content: userMessage
        }
    ]
});
app.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: "User already exists"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.json({
            message: "Signup Successful"
        });

    } catch (err) {

        res.json({
            message: "Signup Error"
        });
    }
});
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.json({
                message: "User not found"
            });
        }

        const isMatch =
        await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.json({
                message: "Wrong Password"
            });
        }

        res.json({
            message: "Login Successful"
        });

    } catch (err) {

        res.json({
            message: "Login Error"
        });
    }
});

const botReply =
completion.choices[0].message.content;


res.json({
    reply: botReply
});

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.json({
            reply: "AI Error"
        });
    }
});

/* Run Server */
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.get("/history", async (req, res) => {
    try {
        const chats = await Chat.find().sort({ _id: -1 }).limit(20);
        res.json(chats);
    } catch (err) {
        res.json([]);
    }

});
