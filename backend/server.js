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
const chatSchema = new mongoose.Schema({
    userMessage: String,
    botReply: String
});

const Chat = mongoose.model("Chat", chatSchema);

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

const botReply =
completion.choices[0].message.content;

// await Chat.create({
//     userMessage,
//     botReply
// });

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