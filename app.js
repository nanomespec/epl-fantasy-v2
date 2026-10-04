require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN'; 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Telegram WebApp initData validation
function validateTelegramData(initData) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    const dataCheckString = Array.from(urlParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('\n');
        
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    return calculatedHash === hash;
}

app.post('/api/auth', (req, res) => {
    const { initData } = req.body;
    if (!initData || !validateTelegramData(initData)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Telegram hash' });
    }
    res.json({ success: true, message: 'Manager authenticated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`);
});
