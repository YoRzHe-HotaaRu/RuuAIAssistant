import React, { useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import { Clock, Database, Download } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const StatusBar: React.FC = () => {
    const { tokensUsed, timeElapsed, updateTime, isResearching, paper } = useResearch();

    useEffect(() => {
        let interval: any;
        if (isResearching) {
            interval = setInterval(() => {
                updateTime(timeElapsed + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResearching, timeElapsed, updateTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDownload = () => {
        if (!paper) return;
        const element = document.getElementById('paper-content');
        if (!element) return;
        const opt = {
            margin: [1, 0.5, 1, 0.5],
            filename: `${paper.title.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt as any).from(element).save();
    };

    return (
        <div className="status-bar">
            <div className="status-group">
                <div className="status-item">
                    <Clock size={14} className={isResearching ? "text-blue-400 animate-pulse" : ""} />
                    <span className="font-mono">{formatTime(timeElapsed)}</span>
                </div>
                <div className="status-item">
                    <Database size={14} />
                    <span className="font-mono">{tokensUsed} Tokens</span>
                </div>
                <div className="status-item">
                    <div className={`status-dot ${isResearching ? 'processing' : 'ready'}`} />
                    <span>{isResearching ? 'Processing' : 'Ready'}</span>
                </div>
            </div>

            <button
                onClick={handleDownload}
                disabled={!paper}
                className="download-btn"
            >
                <Download size={14} />
                <span>Download PDF</span>
            </button>
        </div>
    );
};

export default StatusBar;
