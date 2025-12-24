import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getBibleVersions, getBooks, getChapters, getChapterContent } from '../services/bibleService';

interface BibleScreenProps {
    onClose: () => void;
}

type BibleTab = 'versions' | 'study' | 'sermons';
type BibleViewMode = 'versionSelection' | 'bookSelection' | 'chapterSelection' | 'reading';

// Interfaces to match the bibleService response structures
interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: { name: string };
}

interface Book {
    id: string;
    name: string;
}

interface Chapter {
    id: string;
    number: string;
    bookId: string;
}

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-semibold">{text}</p>
    </div>
);

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 m-4 rounded">
        <p className="font-semibold text-red-700 dark:text-red-300">An Error Occurred</p>
        <p className="text-red-600 dark:text-red-400 mt-2">{message}</p>
        {onRetry && <button onClick={onRetry} className="mt-4 bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg">Try Again</button>}
    </div>
);


const BibleScreen: React.FC<BibleScreenProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<BibleTab>('versions');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [viewMode, setViewMode] = useState<BibleViewMode>('versionSelection');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data states
    const [versions, setVersions] = useState<BibleVersion[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [chapterContent, setChapterContent] = useState<string | null>(null);
    
    // Selection states
    const [selectedVersion, setSelectedVersion] = useState<BibleVersion | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [fontSize, setFontSize] = useState(16);

    // Initial fetch for versions
    useEffect(() => {
        const fetchVersions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedVersions = await getBibleVersions();
                 if (fetchedVersions.length === 0) {
                    setError("Could not load Bible versions. Please check your API key and network connection.");
                }
                setVersions(fetchedVersions);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVersions();
    }, []);

    const filteredVersions = useMemo(() => {
        if (!searchTerm.trim()) return versions;
        const term = searchTerm.toLowerCase();
        return versions.filter(v =>
            v.name.toLowerCase().includes(term) ||
            v.abbreviation.toLowerCase().includes(term) ||
            v.language.name.toLowerCase().includes(term)
        );
    }, [searchTerm, versions]);

    const handleSelectVersion = useCallback(async (version: BibleVersion) => {
        setSelectedVersion(version);
        setViewMode('bookSelection');
        setIsLoading(true);
        setError(null);
        try {
            const fetchedBooks = await getBooks(version.id);
            setBooks(fetchedBooks);
            if (fetchedBooks.length === 0) setError("Could not load books for this version.");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleSelectBook = useCallback(async (book: Book) => {
        if (!selectedVersion) return;
        setSelectedBook(book);
        setViewMode('chapterSelection');
        setIsLoading(true);
        setError(null);
        try {
            const fetchedChapters = await getChapters(selectedVersion.id, book.id);
            setChapters(fetchedChapters);
             if (fetchedChapters.length === 0) setError("Could not load chapters for this book.");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedVersion]);

    const handleSelectChapter = useCallback(async (chapter: Chapter) => {
        if (!selectedVersion) return;
        setSelectedChapter(chapter);
        setViewMode('reading');
        setIsLoading(true);
        setError(null);
        setChapterContent(null);
        try {
            const content = await getChapterContent(selectedVersion.id, chapter.id);
            if (content) {
                setChapterContent(content.content);
            } else {
                setError(`Could not load content for ${selectedBook?.name} ${chapter.number}.`);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedVersion, selectedBook]);

    const handleBack = () => {
        setError(null); // Clear errors on navigation
        switch (viewMode) {
            case 'reading': setViewMode('chapterSelection'); break;
            case 'chapterSelection': setViewMode('bookSelection'); break;
            case 'bookSelection': setViewMode('versionSelection'); break;
            case 'versionSelection': onClose(); break;
        }
    };

    const headerTitle = useMemo(() => {
        switch (viewMode) {
            case 'reading': return `${selectedBook?.name} ${selectedChapter?.number}`;
            case 'chapterSelection': return selectedBook?.name;
            case 'bookSelection': return selectedVersion?.abbreviation;
            default: return 'Bible';
        }
    }, [viewMode, selectedVersion, selectedBook, selectedChapter]);

    const renderTab = (tab: BibleTab, label: string) => (
        <button onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-semibold text-center focus:outline-none transition-colors duration-200 ${activeTab === tab ? 'border-b-2 border-brand-blue text-brand-blue' : 'border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {label}
        </button>
    );

    const renderVersionSelection = () => (
        <div className="p-4 space-y-4">
            <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span><input type="search" placeholder="Search version or language" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue dark:text-slate-200" /></div>
            {isLoading && <LoadingSpinner text="Fetching versions..." />}
            {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
            {!isLoading && !error && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredVersions.map(v => (<button key={v.id} onClick={() => handleSelectVersion(v)} className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><div className="flex items-center space-x-4"><div className="text-center w-12"><p className="font-bold text-brand-blue text-lg">{v.abbreviation}</p></div><div><p className="font-semibold text-slate-800 dark:text-slate-200 text-left">{v.name}</p><p className="text-sm text-slate-500 dark:text-slate-400 text-left">{v.language.name}</p></div></div><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>))}
                </div>
            )}
        </div>
    );

    const renderBookSelection = () => (
        <div className="p-4">
             {isLoading && <LoadingSpinner text="Fetching books..." />}
             {error && <ErrorMessage message={error} onRetry={() => selectedVersion && handleSelectVersion(selectedVersion)} />}
             {!isLoading && !error && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                    {books.map(book => <button key={book.id} onClick={() => handleSelectBook(book)} className="w-full text-left p-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">{book.name}</button>)}
                </div>
             )}
        </div>
    );

    const renderChapterSelection = () => (
        <div className="p-4">
            {isLoading && <LoadingSpinner text="Fetching chapters..." />}
            {error && <ErrorMessage message={error} onRetry={() => selectedBook && handleSelectBook(selectedBook)} />}
            {!isLoading && !error && (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {chapters.map(chapter => (
                        <button key={chapter.id} onClick={() => handleSelectChapter(chapter)} className="aspect-square flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-brand-blue">
                            {chapter.number}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const renderReadingView = () => (
        <div className="p-4">
            {isLoading && <LoadingSpinner text="Loading chapter..." />}
            {error && <ErrorMessage message={error} onRetry={() => selectedChapter && handleSelectChapter(selectedChapter)} />}
            {chapterContent && (
                <>
                    <div className="flex justify-end items-center mb-4"><span className="text-sm mr-2 text-slate-600 dark:text-slate-400">Aa</span><button onClick={() => setFontSize(s => Math.max(s - 1, 10))} className="p-1 border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 rounded-l-md">-</button><button onClick={() => setFontSize(s => Math.min(s + 1, 32))} className="p-1 border-t border-b border-r bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 rounded-r-md">+</button></div>
                    {/* 
                        SECURITY NOTE: We are using dangerouslySetInnerHTML here because the API returns formatted HTML.
                        This is generally safe as we are fetching from a trusted, well-known API (api.bible).
                        In a production app with user-generated content, this would be a major security risk (XSS).
                        For this specific, trusted source, it's an acceptable way to render the pre-formatted scripture.
                    */}
                    <div className="prose max-w-none bible-content dark:prose-invert" style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: chapterContent }} />
                </>
            )}
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'study') return <div className="p-4 text-center text-slate-500 dark:text-slate-400">Bible Study Coming Soon!</div>;
        if (activeTab === 'sermons') return <div className="p-4 text-center text-slate-500 dark:text-slate-400">Sermons Coming Soon!</div>;

        switch(viewMode) {
            case 'versionSelection': return renderVersionSelection();
            case 'bookSelection': return renderBookSelection();
            case 'chapterSelection': return renderChapterSelection();
            case 'reading': return renderReadingView();
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-black z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={handleBack} className="p-2 -ml-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">{headerTitle}</h1>
                    <div className="w-6"></div>
                </div>
            </header>
            
            {viewMode === 'versionSelection' && (<div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"><nav className="flex justify-around">{renderTab('versions', 'Versions/Languages')}{renderTab('study', 'Bible Study')}{renderTab('sermons', 'Sermons')}</nav></div>)}

            <main className="flex-grow overflow-y-auto scrollbar-hide">{renderContent()}</main>
        </div>
    );
};

export default BibleScreen;
