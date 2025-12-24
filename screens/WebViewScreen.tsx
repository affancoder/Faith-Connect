import React, { useRef, useState, useEffect, useMemo } from 'react';

interface WebViewScreenProps {
    url: string;
    onClose: () => void;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url, onClose }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [pageTitle, setPageTitle] = useState('Loading...');

    const domain = useMemo(() => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return 'Invalid URL';
        }
    }, [url]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => {
            try {
                // Accessing title might fail due to cross-origin policy
                const title = iframe.contentDocument?.title || domain;
                setPageTitle(title);
            } catch (error) {
                console.warn("Could not access iframe title due to cross-origin policy. Using domain as fallback.");
                setPageTitle(domain);
            }
        };

        iframe.addEventListener('load', handleLoad);
        return () => iframe.removeEventListener('load', handleLoad);
    }, [domain]);
    
    const refresh = () => {
        if (iframeRef.current) {
            // A simple way to trigger a reload of the iframe content
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col animate-slide-in-up">
            {/* Header */}
            <header className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-2 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="p-2 text-slate-600 dark:text-slate-300" aria-label="Close browser">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="text-center overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{pageTitle}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                            {domain}
                        </p>
                    </div>
                    <button onClick={refresh} className="p-2 text-slate-600 dark:text-slate-300" aria-label="Refresh page">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m16 0v5h-5m0-15l-4.5 4.5M20 4l-4.5 4.5" /></svg>
                    </button>
                </div>
            </header>
            <main className="flex-grow bg-slate-200 dark:bg-slate-900">
                <iframe
                    ref={iframeRef}
                    src={url}
                    className="w-full h-full border-0"
                    title="In-app Browser"
                    sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
                />
            </main>
        </div>
    );
};

export default WebViewScreen;