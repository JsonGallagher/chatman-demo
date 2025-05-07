import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = 'ENTER YOUR OPENAI API KEY HERE';

app.post('/api/gpt4o', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    // 🔍 Log the full response for debugging
    const data = await response.json();
    console.log('🔍 OpenAI API Response:\n', JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('🚀 Backend running at http://localhost:3001'));
