require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// السماح لموقعك بالتواصل مع السيرفر
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// الرابط الآمن الذي سيستقبل الأسئلة
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        // السيرفر هو من يتواصل مع Groq ويستخدم المفتاح المخفي
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: model || "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.3
            })
        });

        const data = await response.json();
        
        // إرجاع الرد للمريض
        res.json(data);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 سيرفر DEAI يعمل بنجاح على الرابط: http://localhost:${PORT}`);
});