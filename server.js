const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let codes = Array.from({ length: 200 }, () => ({
    code: generateCode(),
    used: false
}));

function generateCode() {
    return Math.random().toString(36).substring(2, 18).toUpperCase();
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/host', (req, res) => {
    if (req.body.password === 'Admin123') {
        res.json(codes.slice(0, 100));
    } else {
        res.status(403).send('كلمة مرور خاطئة');
    }
});

app.post('/add-code', (req, res) => {
    const newCode = { code: generateCode(), used: false };
    codes.push(newCode);
    res.json(newCode);
});

app.post('/verify-code', (req, res) => {
    const codeToVerify = req.body.code;
    const codeEntry = codes.find(c => c.code === codeToVerify && !c.used);
    
    if (codeEntry) {
        codeEntry.used = true;
        res.send('تم التسجيل بنجاح');
    } else {
        res.status(400).send('الرمز غير صالح أو انتهت صلاحيته');
    }
});

app.listen(PORT, () => console.log('Server running on http://localhost:${PORT}'));