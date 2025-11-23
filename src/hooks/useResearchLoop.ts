import { useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import { searchTavily } from '../services/tavily';
import { generateCompletion } from '../services/zenmux';
import type { ChatMessage } from '../types';

export const useResearchLoop = () => {
    const {
        researchTopic,
        isResearching,
        setResearching,
        addMessage,
        setPaper,
        updateTokens,
    } = useResearch();

    useEffect(() => {
        if (!researchTopic || !isResearching) return;

        const conductResearch = async () => {
            try {
                // 1. Search Phase
                addMessage({ role: 'assistant', content: `Searching for resources on: "${researchTopic}"...` });

                const searchResponse = await searchTavily(researchTopic);
                const results = searchResponse.results;

                if (!results || results.length === 0) {
                    addMessage({ role: 'assistant', content: 'I could not find sufficient information on this topic. Please try a different query.' });
                    setResearching(false);
                    return;
                }

                addMessage({ role: 'assistant', content: `Found ${results.length} relevant sources. Analyzing and synthesizing paper...` });

                // 2. Context Preparation
                const context = results.map((r, i) => `[${i + 1}] ${r.title}: ${r.content} (URL: ${r.url})`).join('\n\n');

                const systemPrompt = `You are an expert academic researcher. Your task is to write a complete, high-quality academic research paper based strictly on the provided context.
        
        Requirements:
        1.  **Format**: The output MUST be a valid Markdown document.
        2.  **Structure**: Title, Abstract, Introduction, Literature Review, Methodology (if applicable, otherwise Analysis), Results/Findings, Discussion, Conclusion, References.
        3.  **Tone**: Dull, objective, formal, and purely academic. Avoid conversational language. Use passive voice where appropriate for academic distance.
        4.  **Citations**: You MUST use in-text citations in APA 7th edition format (e.g., (Author, Year) or (Title, n.d.)).
        5.  **References**: Include a "Academic Paper References" section at the end. Format each reference strictly according to APA 7th edition style. **CRITICAL: You MUST include the URL for every single reference if available.**
        6.  **Completeness**: Do not summarize. Write the FULL paper. It should be lengthy and detailed.
        7.  **No Hallucinations**: Only use information from the provided context. If information is missing, state it as a limitation.
        
        Context Data:
        ${context}`;

                const messages: ChatMessage[] = [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Write a research paper on: ${researchTopic}` }
                ];

                // 3. Generation Phase
                const paperContent = await generateCompletion(messages);

                // Estimate tokens (very rough)
                const estimatedTokens = (systemPrompt.length + paperContent.length) / 4;
                updateTokens(Math.floor(estimatedTokens));

                // 4. Parsing and State Update
                // Extract title (first line usually # Title)
                const titleMatch = paperContent.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : researchTopic;

                // Extract references (rough extraction for the list, though the markdown has it too)
                // We'll rely on the markdown for display, but we can parse them if needed for the state
                // For now, we just pass the full content.

                setPaper({
                    title,
                    content: paperContent,
                    references: results.map(r => r.url), // Just storing URLs as backup references
                });

                addMessage({ role: 'assistant', content: 'Research complete. The paper has been generated and is available for review.' });

            } catch (error) {
                console.error('Research Error:', error);
                addMessage({ role: 'assistant', content: 'An error occurred during the research process. Please check the API keys and try again.' });
            } finally {
                setResearching(false);
            }
        };

        conductResearch();
    }, [researchTopic]); // Depend on researchTopic changes (which are set when user submits)
};
