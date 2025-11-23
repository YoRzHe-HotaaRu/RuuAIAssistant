import axios from 'axios';
import type { ChatMessage } from '../types';

const ZENMUX_API_KEY = import.meta.env.VITE_ZENMUX_API_KEY;
const BASE_URL = import.meta.env.VITE_ZENMUX_BASE_URL;
const MODEL = 'moonshotai/kimi-k2-thinking';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${ZENMUX_API_KEY}`,
        'Content-Type': 'application/json',
    },
});

export const generateCompletion = async (messages: ChatMessage[]): Promise<string> => {
    if (!ZENMUX_API_KEY) {
        throw new Error('ZenMux API Key is missing');
    }

    try {
        const response = await client.post('/chat/completions', {
            model: MODEL,
            messages,
            stream: false, // We can implement streaming later if needed
            temperature: 0.7,
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('ZenMux API Error:', error);
        throw error;
    }
};
