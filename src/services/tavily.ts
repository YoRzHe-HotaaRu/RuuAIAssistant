import axios from 'axios';
import type { SearchResponse } from '../types';

const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;
const BASE_URL = 'https://api.tavily.com/search';

export const searchTavily = async (query: string): Promise<SearchResponse> => {
    if (!TAVILY_API_KEY) {
        throw new Error('Tavily API Key is missing');
    }

    try {
        const response = await axios.post(BASE_URL, {
            api_key: TAVILY_API_KEY,
            query,
            search_depth: 'advanced',
            include_answer: true,
            include_images: false,
            max_results: 10,
        });

        return response.data;
    } catch (error) {
        console.error('Tavily Search Error:', error);
        throw error;
    }
};
