import React, { useState, useEffect } from 'react';

// Re-using the verse logic from GlobalPrayerWallScreen for consistency
const dailyVerses = [
    { text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
    { text: "The Lord is my shepherd, I lack nothing.", reference: "Psalm 23:1" },
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", reference: "John 3:16" },
];

const getVerseOfTheDay = () => {
    const now = new Date();
    const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    const verseIndex = daysSinceEpoch % dailyVerses.length;
    return dailyVerses[verseIndex];
};

// Legal Content - copied from AboutScreen.tsx
const privacyPolicyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1, h2 { color: #111; }
        h1 { font-size: 1.5em; }
        h2 { font-size: 1.2em; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 2em; }
        ul { padding-left: 20px; }
    </style>
</head>
<body>
    <h1>Privacy Policy for Faith Connect</h1>
    <p><em>Last Updated: ${new Date().toLocaleDateString()}</em></p>
    
    <p>Welcome to Faith Connect. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

    <h2>Information We Collect</h2>
    <p>We may collect information about you in a variety of ways. The information we may collect on the App includes:</p>
    <ul>
        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information (like your church or denomination), that you voluntarily give to us when you register with the App.</li>
        <li><strong>Prayer Requests:</strong> Any information, including sensitive personal data, you voluntarily share in your prayer requests, posts, and comments.</li>
        <li><strong>Geolocation Information:</strong> We may request access or permission to and track location-based information from your mobile device to provide location-based services like finding nearby churches.</li>
        <li><strong>Device Data:</strong> Information such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the App from a mobile device.</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:</p>
    <ul>
        <li>Create and manage your account.</li>
        <li>Display your prayer requests and content to other users as per your privacy settings.</li>
        <li>Monitor and analyze usage and trends to improve your experience with the App.</li>
        <li>Notify you of updates to the App.</li>
        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
    </ul>

    <h2>Sharing Your Information</h2>
    <p>We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with:</p>
    <ul>
        <li><strong>Other Users:</strong> Your public profile information and posts will be visible to other users of the app according to your settings.</li>
        <li><strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services for us or on our behalf (e.g., cloud hosting).</li>
        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law.</li>
    </ul>

    <h2>Contact Us</h2>
    <p>If you have questions or comments about this Privacy Policy, please contact us at: privacy@faithconnect.app</p>
</body>
</html>
`;

const termsOfServiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1, h2 { color: #111; }
        h1 { font-size: 1.5em; }
        h2 { font-size: 1.2em; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 2em; }
    </style>
</head>
<body>
    <h1>Terms of Service for Faith Connect</h1>
    <p><em>Last Updated: ${new Date().toLocaleDateString()}</em></p>
    
    <p>Please read these Terms of Service ("Terms") carefully before using the Faith Connect mobile application (the "Service") operated by us.</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

    <h2>2. User Conduct</h2>
    <p>You agree not to use the Service to post content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. You are solely responsible for the content you post. We expect all users to abide by our Community Guidelines, which are incorporated by reference into these Terms.</p>

    <h2>3. Content Ownership</h2>
    <p>You retain ownership of any intellectual property rights that you hold in the content you submit. When you upload or otherwise submit content to our Service, you give Faith Connect a worldwide license to use, host, store, reproduce, and modify such content for the purpose of operating, promoting, and improving our Service.</p>

    <h2>4. Termination</h2>
    <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

    <h2>5. Disclaimers</h2>
    <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the service will be uninterrupted, secure, or error-free.</p>

    <h2>Contact Us</h2>
    <p>If you have any questions about these Terms, please contact us at: legal@faithconnect.app</p>
</body>
</html>
`;
const createDataUrl = (html: string) => `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
const privacyPolicyUrl = createDataUrl(privacyPolicyHtml);
const termsOfServiceUrl = createDataUrl(termsOfServiceHtml);

interface SidebarProps {
    onClose: () => void;
    onNavigateToProfile: () => void;
    onOpenSettings: () => void;
    onOpenFriends: () => void;
    onOpenMap: () => void;
    onOpenBible: () => void;
    onOpenGroups: () => void;
    onOpenUserEvents: () => void;
    onOpenLiveStreams: () => void;
    onOpenHelpCenter: () => void;
    onOpenAbout: () => void;
    onOpenWebView: (url: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    onClose, 
    onNavigateToProfile, 
    onOpenSettings,
    onOpenFriends,
    onOpenMap,
    onOpenBible,
    onOpenGroups,
    onOpenUserEvents,
    onOpenLiveStreams,
    onOpenHelpCenter,
    onOpenAbout,
    onOpenWebView
}) => {
    const verse = getVerseOfTheDay();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Animate in on mount
        const timer = setTimeout(() => setIsMounted(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsMounted(false);
        setTimeout(onClose, 300); // Wait for animation to finish
    };
    
    const handleNavigation = (navFunc: () => void) => {
        // For modals that replace the sidebar, we don't need to call handleClose,
        // as the parent component will handle closing the sidebar.
        navFunc();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const transformClass = isMounted ? 'translate-x-0' : 'translate-x-full';
    const sidebarClasses = `fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${transformClass}`;
    const overlayClasses = `fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${isMounted ? 'bg-opacity-50' : 'opacity-0'}`;


    return (
        <>
            <div className={overlayClasses} onClick={handleClose} aria-hidden="true"></div>
            <aside className={sidebarClasses} role="dialog" aria-modal="true" aria-labelledby="sidebar-title">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 text-center">
                    <img src="https://i.pravatar.cc/100?u=currentuser" alt="Your avatar" className="h-20 w-20 rounded-full mx-auto mb-2" />
                    <button onClick={() => handleNavigation(onNavigateToProfile)} className="w-full text-center group">
                         <h2 id="sidebar-title" className="font-bold text-slate-800 dark:text-slate-200 text-lg group-hover:text-brand-blue transition-colors">Jane Doe</h2>
                         <p className="text-sm text-slate-500 dark:text-slate-400">View your profile</p>
                    </button>
                </div>
                
                {/* Main Content */}
                <div className="flex-grow p-4 space-y-2 overflow-y-auto scrollbar-hide">
                    {/* Navigation Buttons */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                        <button onClick={() => handleNavigation(onOpenFriends)} className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">Friends</p>
                                    <div className="flex items-center text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                                        4 online
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button onClick={() => handleNavigation(onOpenMap)} className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 10l-6 3" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Map</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button onClick={() => handleNavigation(onOpenBible)} className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Bible</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button onClick={() => handleNavigation(onOpenGroups)} className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.781-4.121M12 10.875a4 4 0 100-5.292M12 10.875a4 4 0 110 5.292m0 0a2 2 0 100 4m0-4a2 2 0 110 4m0 0l-3-1.5m3 1.5l3-1.5m-3-1.5l-3-1.5m3 1.5l3-1.5" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Groups</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button onClick={() => handleNavigation(onOpenUserEvents)} className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Events</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button onClick={() => handleNavigation(onOpenLiveStreams)} className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Live Streams</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button className="w-full flex items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => handleNavigation(onOpenSettings)}>
                            <div className="w-8 h-8 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Settings & Privacy</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="p-4 mt-auto">
                    {/* Verse of the day card */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Verse of the Day</h3>
                        <blockquote className="border-l-4 border-brand-gold pl-4">
                            <p className="text-sm italic text-slate-700 dark:text-slate-300">"{verse.text}"</p>
                            <footer className="mt-2 text-right">
                                <cite className="text-sm text-slate-500 dark:text-slate-400 not-italic">— {verse.reference}</cite>
                            </footer>
                        </blockquote>
                    </div>
                     {/* Footer links */}
                    <div className="text-center text-xs text-slate-400 dark:text-slate-500 space-x-2 mt-4">
                        <button onClick={() => handleNavigation(onOpenAbout)} className="hover:underline">About</button>
                        <span>&middot;</span>
                        <button onClick={() => handleNavigation(onOpenHelpCenter)} className="hover:underline">Help</button>
                        <span>&middot;</span>
                        <button onClick={() => handleNavigation(() => onOpenWebView(privacyPolicyUrl))} className="hover:underline">Privacy</button>
                        <span>&middot;</span>
                        <button onClick={() => handleNavigation(() => onOpenWebView(termsOfServiceUrl))} className="hover:underline">Terms</button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;