require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// تشغيل الملفات الثابتة (index.html)
app.use(express.static(path.join(__dirname, './')));

// الرابط الخاص بالذكاء الاصطناعي
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;
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
        res.status(200).json(data);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "خطأ في الاتصال بالذكاء الاصطناعي" });
    }
});

// توجيه أي طلب آخر لفتح صفحة index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// تصدير التطبيق لـ Vercel (مهم جداً!)
module.exports = app;