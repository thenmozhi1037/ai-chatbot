import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* OpenAI / Groq */
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Chat Schema */
const chatSchema = new mongoose.Schema({
    userId: String,
    userMessage: String,
    botReply: String
});

const Chat = mongoose.model("Chat", chatSchema);

/* User Schema */
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

/* Chat API */
app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;
const userId = req.body.userId;
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

        const botReply =
        completion.choices[0].message.content;

       await Chat.create({
    userId,
    userMessage,
    botReply
});

        res.json({
            reply: botReply
        });

    } catch (err) {

        console.log("CHAT ERROR:", err);

        res.json({
            reply: "AI Error"
        });
    }
});

/* Signup API */
app.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUser =
        await User.findOne({ email });

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

/* Login API */
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
        await User.findOne({ email });

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
    message: "Login Successful",
    userId: user._id,
    username: user.username
});

    } catch (err) {

        res.json({
            message: "Login Error"
        });
    }
});

/* History API */
app.get("/history", async (req, res) => {

    try {

        const userId = req.query.userId;

        const chats =
        await Chat.find({ userId })
        .sort({ _id: -1 });

        res.json(chats);

    } catch (err) {

        res.json([]);
    }
});

app.listen(3000, () => {

    console.log("Server running on port 3000");
});
/* Delete History API */
app.delete("/history", async (req, res) => {

    try {

        const userId = req.body.userId;

        await Chat.deleteMany({
            userId
        });

        res.json({
            message: "History Deleted"
        });

    } catch (err) {

        res.json({
            message: "Delete Failed"
        });
    }
});

app.listen(3000, () => {

    console.log("Server running on port 3000");
});
   