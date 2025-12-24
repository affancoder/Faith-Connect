import React, { useState, useRef, useMemo } from 'react';
import { User } from '../types';

interface EditProfileScreenProps {
    user: User;
    onClose: () => void;
    onSave: (updatedData: Partial<User>) => void;
}

const DEFAULT_AVATAR = 'https://i.pravatar.cc/100?u=default';

// --- Photo Change Modal Component ---
interface ChangePhotoModalProps {
    onClose: () => void;
    onUpload: () => void;
    onRemove: () => void;
}
const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ onClose, onUpload, onRemove }) => {
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsMounted(false);
        setTimeout(onClose, 300);
    };

    const modalContainerClasses = `fixed inset-0 bg-black/60 z-[60] flex items-end transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`;
    const modalContentClasses = `bg-white dark:bg-slate-800 w-full rounded-t-2xl transform transition-transform duration-300 ease-out ${isMounted ? 'translate-y-0' : 'translate-y-full'}`;
    
    return (
        <div className={modalContainerClasses} onClick={handleClose}>
            <div className={modalContentClasses} onClick={e => e.stopPropagation()}>
                <div className="p-2 space-y-2">
                    <button onClick={onUpload} className="w-full text-center p-3 text-blue-500 text-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        Upload Photo
                    </button>
                    <button onClick={onRemove} className="w-full text-center p-3 text-red-500 text-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        Remove Current Photo
                    </button>
                </div>
                <div className="p-2">
                    <button onClick={handleClose} className="w-full text-center p-3 text-blue-500 text-lg font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onClose, onSave }) => {
    // Initialize state from the user prop
    const [name, setName] = useState(user.name || '');
    const [username, setUsername] = useState(user.username || '');
    const [pronouns, setPronouns] = useState(user.pronouns || '');
    const [websiteLink, setWebsiteLink] = useState(user.websiteLink || '');
    const [bio, setBio] = useState(user.bio || '');
    const [church, setChurch] = useState(user.church || '');
    const [location, setLocation] = useState(user.location || '');
    const [denomination, setDenomination] = useState(user.denomination || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasChanges = useMemo(() => {
        return (
            name !== (user.name || '') ||
            username !== (user.username || '') ||
            pronouns !== (user.pronouns || '') ||
            websiteLink !== (user.websiteLink || '') ||
            bio !== (user.bio || '') ||
            church !== (user.church || '') ||
            location !== (user.location || '') ||
            denomination !== (user.denomination || '') ||
            avatarUrl !== user.avatarUrl
        );
    }, [name, username, pronouns, websiteLink, bio, church, location, denomination, avatarUrl, user]);

    const isSaveDisabled = !name.trim() || !username.trim() || !church.trim() || !location.trim() || !hasChanges;

    const handleSave = () => {
        if (isSaveDisabled) return;
        
        onSave({ 
            name, 
            username, 
            pronouns, 
            bio, 
            church, 
            location, 
            denomination, 
            websiteLink,
            avatarUrl
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
                setIsPhotoModalOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemovePhoto = () => {
        setAvatarUrl(DEFAULT_AVATAR);
        setIsPhotoModalOpen(false);
    };

    const RequiredLabel: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
        <label htmlFor={htmlFor} className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
            {children} <span className="text-red-500">*</span>
        </label>
    );

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="text-brand-blue font-medium text-base">Cancel</button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Edit Profile</h1>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaveDisabled}
                        className={`font-bold text-base ${isSaveDisabled ? 'text-slate-400 dark:text-slate-600' : 'text-brand-blue'}`}
                    >
                        Done
                    </button>
                </div>
            </header>

            {/* Form Content */}
            <main className="flex-grow overflow-y-auto bg-gray-50 dark:bg-black scrollbar-hide">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="container mx-auto max-w-2xl">
                    {/* Profile & Cover Photo */}
                    <div className="py-6 flex flex-col items-center space-y-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                            <img 
                                src={avatarUrl} 
                                alt="Profile" 
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        </div>
                        <button onClick={() => setIsPhotoModalOpen(true)} className="text-brand-blue font-semibold text-sm hover:text-opacity-80">Change profile photo</button>
                    </div>

                    {/* Form Fields */}
                    <div className="px-4">
                        <div className="space-y-4 py-4">
                           <div className="flex items-center">
                                <RequiredLabel htmlFor="name">Name</RequiredLabel>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200"
                                />
                            </div>
                             <div className="flex items-center">
                                <RequiredLabel htmlFor="username">Username</RequiredLabel>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200"
                                />
                            </div>
                             <div className="flex items-center">
                                <label htmlFor="pronouns" className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">Pronouns</label>
                                <input
                                    type="text"
                                    id="pronouns"
                                    value={pronouns}
                                    onChange={(e) => setPronouns(e.target.value)}
                                    placeholder="Optional"
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200 dark:placeholder-slate-500"
                                />
                            </div>
                            <div className="flex items-start">
                                <label htmlFor="bio" className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0 pt-1">Bio</label>
                                <div className="w-full">
                                    <textarea
                                        id="bio"
                                        rows={3}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue scrollbar-hide dark:text-slate-200"
                                    ></textarea>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-right">{bio.length} / 150</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <RequiredLabel htmlFor="church">Church</RequiredLabel>
                                <input
                                    type="text"
                                    id="church"
                                    value={church}
                                    onChange={(e) => setChurch(e.target.value)}
                                    placeholder="e.g., Hillsong Church"
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200 dark:placeholder-slate-500"
                                />
                            </div>
                             <div className="flex items-center">
                                <RequiredLabel htmlFor="location">Location</RequiredLabel>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., New York, USA"
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200 dark:placeholder-slate-500"
                                />
                            </div>
                             <div className="flex items-center">
                                <label htmlFor="denomination" className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">Denomination</label>
                                <input
                                    type="text"
                                    id="denomination"
                                    value={denomination}
                                    onChange={(e) => setDenomination(e.target.value)}
                                    placeholder="e.g., Non-denominational"
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200 dark:placeholder-slate-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="link" className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">Link</label>
                                <input
                                    type="text"
                                    id="link"
                                    value={websiteLink}
                                    onChange={(e) => setWebsiteLink(e.target.value)}
                                    placeholder="Add website"
                                    className="w-full bg-transparent p-1 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-brand-blue dark:text-slate-200 dark:placeholder-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {isPhotoModalOpen && (
                <ChangePhotoModal 
                    onClose={() => setIsPhotoModalOpen(false)}
                    onUpload={() => fileInputRef.current?.click()}
                    onRemove={handleRemovePhoto}
                />
            )}
        </div>
    );
};

export default EditProfileScreen;