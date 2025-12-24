import React, { useState, useEffect } from 'react';

// --- Audience Selection Modal ---

type Audience = 'Public' | 'Friends' | 'Friends except...' | 'Specific friends' | 'Only me';

const audienceOptions: { id: Audience; title: string; subtitle: string; icon: React.ReactNode; }[] = [
    { 
        id: 'Public', 
        title: 'Public', 
        subtitle: 'Anyone on or off FaithConnect', 
        icon: <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 009 9" /></svg>
    },
    { 
        id: 'Friends', 
        title: 'Friends', 
        subtitle: 'Your friends on FaithConnect', 
        icon: <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    { 
        id: 'Friends except...', 
        title: 'Friends except...', 
        subtitle: "Don't show to some friends", 
        icon: <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 19h6" /></svg>
    },
    { 
        id: 'Specific friends', 
        title: 'Specific friends', 
        subtitle: 'Only show to some friends', 
        icon: <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12c-2.885 2.885-7.115 5-9 5s-6.115-2.115-9-5c2.885-2.885 7.115-5 9-5s6.115 2.115 9 5z" /></svg>
    },
    { 
        id: 'Only me', 
        title: 'Only me', 
        subtitle: 'Only me', 
        icon: <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    }
];

const AudienceOption: React.FC<{ data: typeof audienceOptions[0], isSelected: boolean, onSelect: () => void }> = ({ data, isSelected, onSelect }) => (
    <div onClick={onSelect} className="flex items-center space-x-4 py-2 cursor-pointer">
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">{data.icon}</div>
        <div className="flex-grow">
            <p className="font-semibold text-slate-800 dark:text-slate-200">{data.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{data.subtitle}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
    </div>
);

const AudienceSelectionScreen: React.FC<{ onClose: () => void, onSelect: (audience: Audience) => void, selectedAudience: Audience }> = ({ onClose, onSelect, selectedAudience }) => {
    const [tempAudience, setTempAudience] = useState<Audience>(selectedAudience);
    const [isDefault, setIsDefault] = useState(false);

    const handleDone = () => {
        onSelect(tempAudience);
        // Here you would also save the `isDefault` preference
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col animate-fade-in">
            <header className="flex-shrink-0 p-3">
                <button onClick={onClose} className="p-1" aria-label="Go back">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </header>
            <main className="flex-grow overflow-y-auto px-4 pb-4 scrollbar-hide">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Who can see your post?</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Your post will show up in Feed, on your profile and in search results.
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Your default audience is set to <span className="font-semibold">Public</span>, but you can change the audience of this specific post.
                </p>
                <div className="mt-6 space-y-4">
                    {audienceOptions.map(option => (
                        <AudienceOption 
                            key={option.id}
                            data={option}
                            isSelected={tempAudience === option.id}
                            onSelect={() => setTempAudience(option.id)}
                        />
                    ))}
                </div>
            </main>
            <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="default-audience" className="text-slate-700 dark:text-slate-300 font-medium">Set as default audience.</label>
                    <button onClick={() => setIsDefault(!isDefault)} className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isDefault ? 'bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-200' : 'bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-500'}`}>
                        {isDefault && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white dark:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                </div>
                <button onClick={handleDone} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors">
                    Done
                </button>
            </footer>
        </div>
    );
};

// A single option pill component
const OptionPill: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium text-sm px-3 py-1.5 rounded-lg">
        {icon}
        <span>{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    </button>
);

const mockGalleryImages = [
    {id: 1, url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=200&h=200&auto=format&fit=crop'},
    {id: 2, url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&h=200&auto=format&fit=crop'},
    {id: 3, url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=200&h=200&auto=format&fit=crop'},
    {id: 4, url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200&h=200&auto=format&fit=crop'},
    {id: 5, url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&h=200&auto=format&fit=crop'},
    {id: 6, url: 'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=200&h=200&auto=format&fit=crop'},
    {id: 7, url: 'https://images.unsplash.com/photo-1487058792275-0ad4624b14a8?q=80&w=200&h=200&auto=format&fit=crop'},
];

interface CreatePostScreenProps {
    onClose: () => void;
}

const DRAFT_KEY = 'faith-connect-post-draft';

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose }) => {
    const [postText, setPostText] = useState('');
    const [audience, setAudience] = useState<Audience>('Public');
    const [isAudienceSelectorOpen, setIsAudienceSelectorOpen] = useState(false);

    // Load draft from local storage on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            setPostText(savedDraft);
        }
    }, []);

    // Debounced saving of the draft to local storage
    useEffect(() => {
        const handler = setTimeout(() => {
            if (postText.trim()) {
                localStorage.setItem(DRAFT_KEY, postText);
            } else {
                localStorage.removeItem(DRAFT_KEY); // Clean up if text is cleared
            }
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [postText]);

    const handleNextClick = () => {
        if (isNextDisabled) return;
        console.log("Posting:", { text: postText, audience });
        localStorage.removeItem(DRAFT_KEY);
        onClose();
    };

    const handleCloseAttempt = () => {
        if (postText.trim()) {
            if (window.confirm("You have a draft in progress. Are you sure you want to discard it?")) {
                localStorage.removeItem(DRAFT_KEY);
                onClose();
            }
        } else {
            onClose();
        }
    };
    
    const getAudienceIcon = (audience: Audience) => {
        const option = audienceOptions.find(opt => opt.id === audience);
        return option ? option.icon : audienceOptions[0].icon;
    };

    const isNextDisabled = !postText.trim();

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                    <button onClick={handleCloseAttempt} className="p-1" aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create post</h1>
                </div>
                <button
                    onClick={handleNextClick}
                    disabled={isNextDisabled}
                    className={`px-5 py-2 rounded-lg font-semibold text-base transition-colors ${
                        isNextDisabled
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    NEXT
                </button>
            </header>

            {/* Main content */}
            <div className="flex-grow flex flex-col">
                <div className="p-4">
                    <div className="flex items-start space-x-3">
                        <img src="https://i.pravatar.cc/100?u=currentuser" alt="Your avatar" className="h-11 w-11 rounded-full" />
                        <div className="flex-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-base">Aenosh J. Ephraim</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <OptionPill 
                                    icon={getAudienceIcon(audience)} 
                                    label={audience}
                                    onClick={() => setIsAudienceSelectorOpen(true)} 
                                />
                                <OptionPill icon={<span className="font-bold text-lg leading-none">+</span>} label="Album" onClick={() => {}} />
                            </div>
                        </div>
                    </div>
                </div>
                <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="flex-grow w-full mt-2 p-4 text-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border-none focus:ring-0 resize-none bg-slate-50 dark:bg-slate-800 scrollbar-hide"
                />
            </div>

            {/* Footer */}
            <footer className="flex-shrink-0 bg-white dark:bg-slate-900">
                {/* Top scrollable part */}
                <div className="overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2 p-2">
                        <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Scroll left">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Select from gallery"></button>
                        {mockGalleryImages.slice(0, 6).map(img => (
                            <button key={img.id} className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden" aria-label={`Select image ${img.id}`}>
                                <img src={img.url} alt={`gallery item ${img.id}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                        <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Layouts">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                         <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Tag people">
                            <span className="text-xl font-bold text-slate-600 dark:text-slate-400">@</span>
                        </button>
                         <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Add hashtag">
                            <span className="text-xl font-bold text-slate-600 dark:text-slate-400">#</span>
                        </button>
                    </div>
                </div>
                {/* Bottom icon bar */}
                <div className="flex items-center justify-around p-2 border-t border-slate-200 dark:border-slate-800">
                    <button aria-label="Add from gallery"><svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M21,19V5C21,3.89 20.1,3 19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" /></svg></button>
                    <button aria-label="Tag friends"><svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A4,4 0 0,1 16,8C16,9.95 14.6,11.58 12.75,11.9A2.5,2.5 0 0,1 10,14A2.5,2.5 0 0,1 7.5,11.5C7.5,9.56 9.04,8 11,8A4,4 0 0,1 12,4M12,14.2C13.83,14.2 15.5,14.93 16.83,16.05C17.5,16.63 18.2,17.27 18.7,18.06C17.44,19.24 15.82,20 14,20H10C8.18,20 6.56,19.24 5.3,18.06C5.8,17.27 6.5,16.63 7.17,16.05C8.5,14.93 10.17,14.2 12,14.2Z" /></svg></button>
                    <button aria-label="Add feeling or activity"><svg className="w-7 h-7 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16,14 18,16 18,16.5V17H6V16.5C6,16 8,14 12,14Z" /></svg></button>
                    <button aria-label="Add location"><svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C15.86,2 19,5.13 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9C5,5.13 8.13,2 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6Z" /></svg></button>
                    <button aria-label="More options"><svg className="w-7 h-7 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg></button>
                </div>
            </footer>

            {isAudienceSelectorOpen && (
                <AudienceSelectionScreen 
                    onClose={() => setIsAudienceSelectorOpen(false)}
                    onSelect={(newAudience) => setAudience(newAudience)}
                    selectedAudience={audience}
                />
            )}
        </div>
    );
}

export default CreatePostScreen;