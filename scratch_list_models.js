const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config({ path: './.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Since @google/generative-ai SDK doesn't natively expose listModels well in some older versions,
        // we can fetch it via REST.
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        console.log(data.models.map(m => m.name).join('\\n'));
    } catch (e) {
        console.error(e);
    }
}
listModels();
