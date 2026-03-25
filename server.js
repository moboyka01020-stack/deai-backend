require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // أداة للتعامل مع مسارات الملفات

const app = express();

app.use(cors());
app.use(express.json());

// ✅ السطر السحري: بيخلي السيرفر يعرض ملفات الـ HTML والـ CSS اللي معاه في الفولدر
app.use(express.static(path.join(__dirname, './')));

const PORT = process.env.PORT || 3000;

// رابط المحادثة (الذكاء الاصطناعي)
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
        res.json(data);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
});

// ✅ تعديل: لو المريض فتح الرابط الرئيسي، ابعتله ملف index.html فوراً
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 DEAI Live on port ${PORT}`);
});