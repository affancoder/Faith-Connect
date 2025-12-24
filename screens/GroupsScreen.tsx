import React, { useState, useMemo, useRef } from 'react';
import { Group } from '../types';

interface GroupsScreenProps {
    onClose: () => void;
    onViewGroup: (group: Group) => void;
}

const initialMyGroups: Group[] = [
    { id: 'g1', name: 'Youth Fellowship', memberCount: 150, avatarUrl: 'https://placehold.co/100x100/34d399/ffffff?text=YF', isJoined: true, privacy: 'public', description: 'A community for young believers to connect, grow, and serve together. Join us for weekly studies and monthly events!' },
    { id: 'g2', name: 'Bible Study Group', memberCount: 45, avatarUrl: 'https://placehold.co/100x100/fb923c/ffffff?text=BS', isJoined: true, privacy: 'private', description: 'A private group for in-depth Bible study and discussion.' },
];

const discoverGroups: Group[] = [
    { id: 'g3', name: 'Mission Trip Volunteers', memberCount: 88, avatarUrl: 'https://placehold.co/100x100/60a5fa/ffffff?text=MV', privacy: 'public' },
    { id: 'g4', name: 'Christian Creatives Network', memberCount: 1200, avatarUrl: 'https://placehold.co/100x100/ec4899/ffffff?text=CN', privacy: 'public' },
    { id: 'g5', name: 'Worship Leaders Connect', memberCount: 750, avatarUrl: 'https://placehold.co/100x100/8b5cf6/ffffff?text=WL', privacy: 'private' },
];

// --- Create Group Modal ---
interface CreateGroupScreenProps {
    onClose: () => void;
    onCreateGroup: (newGroup: Omit<Group, 'id' | 'memberCount'>) => void;
}

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({ onClose, onCreateGroup }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isCreateDisabled = !name.trim();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = () => {
        if (isCreateDisabled) return;

        onCreateGroup({
            name,
            description,
            // In a real app, avatarUrl would come from an upload service
            avatarUrl: imagePreview || `https://placehold.co/100x100/60a5fa/ffffff?text=${name.substring(0, 2).toUpperCase()}`,
            isJoined: true, // The creator automatically joins
            privacy,
        });
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="text-brand-blue font-medium text-base">Cancel</button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Create Group</h1>
                    <button onClick={handleCreate} disabled={isCreateDisabled} className={`font-bold text-base ${isCreateDisabled ? 'text-slate-400' : 'text-brand-blue'}`}>Create</button>
                </div>
            </header>
            
            {/* Form */}
            <main className="flex-grow overflow-y-auto bg-slate-50 dark:bg-black p-4 scrollbar-hide">
                <div className="container mx-auto max-w-2xl space-y-4 pb-4">
                    {/* Cover Photo */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cover Photo</label>
                        {imagePreview ? (
                             <div className="relative">
                                <img src={imagePreview} alt="Group preview" className="w-full h-40 object-cover rounded-md" />
                                <button onClick={() => {setImagePreview(null); setImageFile(null); if(fileInputRef.current) fileInputRef.current.value = '';}} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        ) : (
                             <button onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="mt-2 text-sm font-semibold">Upload Image</span>
                            </button>
                        )}
                         <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>
                    {/* Group Name */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Morning Prayer Warriors" className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue" />
                    </div>
                    {/* Description */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe your group's purpose..." className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue scrollbar-hide"></textarea>
                    </div>
                    {/* Privacy */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Privacy</label>
                        <div className="space-y-2">
                             <div onClick={() => setPrivacy('public')} className="flex items-center cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${privacy === 'public' ? 'border-brand-blue bg-brand-blue' : 'border-slate-400 dark:border-slate-500'}`}>
                                    {privacy === 'public' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium text-slate-800 dark:text-slate-200">Public</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Anyone can find and join this group.</p>
                                </div>
                            </div>
                            <div onClick={() => setPrivacy('private')} className="flex items-center cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${privacy === 'private' ? 'border-brand-blue bg-brand-blue' : 'border-slate-400 dark:border-slate-500'}`}>
                                    {privacy === 'private' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium text-slate-800 dark:text-slate-200">Private</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Only members can see who's in the group and what they post.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const GroupsScreen: React.FC<GroupsScreenProps> = ({ onClose, onViewGroup }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [userGroups, setUserGroups] = useState(initialMyGroups);

    const allGroups = useMemo(() => [...userGroups, ...discoverGroups], [userGroups]);

    const filteredGroups = useMemo(() => {
        if (!searchTerm) {
            return [];
        }
        return allGroups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, allGroups]);
    
    const handleCreateGroup = (newGroupData: Omit<Group, 'id' | 'memberCount'>) => {
        const newGroup: Group = {
            ...newGroupData,
            id: `g-${Date.now()}`,
            memberCount: 1, // Creator is the first member
        };
        setUserGroups(prev => [newGroup, ...prev]);
        setIsCreateGroupOpen(false);
    };
    
    const GroupItem: React.FC<{ group: Group; onSelect: () => void; }> = ({ group, onSelect }) => (
        <button onClick={onSelect} className="w-full text-left flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center space-x-3">
                <img src={group.avatarUrl} alt={group.name} className="h-12 w-12 rounded-lg" />
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{group.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{group.memberCount.toLocaleString()} members</p>
                </div>
            </div>
            <button className={`text-sm font-semibold px-4 py-1.5 rounded-lg pointer-events-none ${group.isJoined ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200' : 'bg-brand-blue text-white'}`}>
                {group.isJoined ? 'Joined' : 'Join'}
            </button>
        </button>
    );

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-black z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                     <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Groups</h1>
                     <button onClick={() => setIsCreateGroupOpen(true)} className="p-2 -mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-2xl">
                     <div className="p-2 sticky top-0 bg-slate-50 dark:bg-black z-5">
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                           </span>
                           <input 
                               type="search" 
                               placeholder="Search groups" 
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:text-slate-200"
                           />
                        </div>
                    </div>
                    
                    <div className="p-4">
                        {searchTerm ? (
                            <>
                                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">Search Results</h2>
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredGroups.length > 0 ? filteredGroups.map(group => <GroupItem key={group.id} group={group} onSelect={() => onViewGroup(group)} />) : <p className="p-4 text-center text-slate-500 dark:text-slate-400">No groups found.</p>}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">Your Groups</h2>
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                                    {userGroups.map(group => <GroupItem key={group.id} group={group} onSelect={() => onViewGroup(group)} />)}
                                </div>

                                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Discover Groups</h2>
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                                    {discoverGroups.map(group => <GroupItem key={group.id} group={group} onSelect={() => onViewGroup(group)} />)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {isCreateGroupOpen && (
                <CreateGroupScreen 
                    onClose={() => setIsCreateGroupOpen(false)}
                    onCreateGroup={handleCreateGroup}
                />
            )}
        </div>
    );
};

export default GroupsScreen;