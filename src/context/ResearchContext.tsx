import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, ChatMessage, ResearchPaper } from '../types';

interface ResearchContextType extends AppState {
    addMessage: (message: ChatMessage) => void;
    setResearching: (isResearching: boolean) => void;
    setTopic: (topic: string) => void;
    setPaper: (paper: ResearchPaper | null) => void;
    updateTokens: (tokens: number) => void;
    updateTime: (time: number) => void;
    resetState: () => void;
}

const initialState: AppState = {
    messages: [],
    isResearching: false,
    researchTopic: '',
    paper: null,
    tokensUsed: 0,
    timeElapsed: 0,
};

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(initialState);

    const addMessage = (message: ChatMessage) => {
        setState((prev: AppState) => ({ ...prev, messages: [...prev.messages, message] }));
    };

    const setResearching = (isResearching: boolean) => {
        setState((prev: AppState) => ({ ...prev, isResearching }));
    };

    const setTopic = (topic: string) => {
        setState((prev: AppState) => ({ ...prev, researchTopic: topic }));
    };

    const setPaper = (paper: ResearchPaper | null) => {
        setState((prev: AppState) => ({ ...prev, paper }));
    };

    const updateTokens = (tokens: number) => {
        setState((prev: AppState) => ({ ...prev, tokensUsed: prev.tokensUsed + tokens }));
    };

    const updateTime = (time: number) => {
        setState((prev: AppState) => ({ ...prev, timeElapsed: time }));
    };

    const resetState = () => {
        setState(initialState);
    };

    return (
        <ResearchContext.Provider
            value={{
                ...state,
                addMessage,
                setResearching,
                setTopic,
                setPaper,
                updateTokens,
                updateTime,
                resetState,
            }}
        >
            {children}
        </ResearchContext.Provider>
    );
};

export const useResearch = () => {
    const context = useContext(ResearchContext);
    if (context === undefined) {
        throw new Error('useResearch must be used within a ResearchProvider');
    }
    return context;
};
