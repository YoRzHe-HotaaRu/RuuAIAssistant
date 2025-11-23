import React from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import Layout from './components/Layout';
import { useResearchLoop } from './hooks/useResearchLoop';

const AppContent: React.FC = () => {
  useResearch();

  // We need to trigger the hook. The hook listens to researchTopic.
  // But we need to ensure it only runs when we *start* researching.
  // Actually, the hook listens to [researchTopic]. 
  // In ChatWindow, we setTopic(input). But we also need to setResearching(true).
  // Let's modify ChatWindow to setResearching(true) as well.

  // However, we can't conditionally call the hook. It must always be called.
  useResearchLoop();

  return <Layout />;
};

const App: React.FC = () => {
  return (
    <ResearchProvider>
      <AppContent />
    </ResearchProvider>
  );
};

export default App;
