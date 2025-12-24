import React, { useState, useCallback } from 'react';
import PullToRefresh from '../components/PullToRefresh';
import { User, Post, PrayerCategory } from '../types';

interface NotificationScreenProps {
    onClose: () => void;
    onOpenUserProfile: (user: User) => void;
    onOpenPost: (post: Post) => void;
}

type NotificationType = 'follow' | 'pray' | 'comment';

interface Notification {
    id: string;
    type: NotificationType;
    user: {
        name: string;
        avatarUrl: string;
    };
    timestamp: Date;
    post?: Post;
    commentPreview?: string;
    isFollowing?: boolean;
}

// Mock user data for profile navigation
const mockUsersForProfile: { [key: string]: User } = {
    chrisj: { id: 'chris', name: 'Chris J.', avatarUrl: 'https://i.pravatar.cc/100?u=chris', username: 'chrisj' },
    sarahl: { id: 'sarah', name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/100?u=sarah', username: 'sarahl' },
    davidr: { id: 'david', name: 'David R.', avatarUrl: 'https://i.pravatar.cc/100?u=david', username: 'davidr' },
    emilyc: { id: 'emily', name: 'Emily C.', avatarUrl: 'https://i.pravatar.cc/100?u=emily', username: 'emilyc' },
    michaelb: { id: 'michael', name: 'Michael B.', avatarUrl: 'https://i.pravatar.cc/100?u=michael', username: 'michaelb' },
    jessicam: { id: 'jessica', name: 'Jessica M.', avatarUrl: 'https://i.pravatar.cc/100?u=jessica', username: 'jessicam' },
};

const postForNotifications: Post = {
    id: '1',
    userId: 'currentuser',
    name: 'Jane Doe',
    avatarUrl: 'https://i.pravatar.cc/100?u=currentuser',
    request: 'Praying for my friend who is going through a tough time with her health. May she feel God\'s healing hands and peace.',
    category: PrayerCategory.HEALING,
    prayerCount: 15,
    commentsCount: 2,
    sharesCount: 1,
    timestamp: new Date(Date.now() - 3600000),
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=800&auto=format&fit=crop',
};


const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'follow',
        user: { name: 'chrisj', avatarUrl: 'https://i.pravatar.cc/100?u=chris' },
        timestamp: new Date(Date.now() - 3600000 * 1), // 1 hour ago
        isFollowing: false,
    },
    {
        id: '2',
        type: 'pray',
        user: { name: 'sarahl', avatarUrl: 'https://i.pravatar.cc/100?u=sarah' },
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        post: postForNotifications,
    },
    {
        id: '3',
        type: 'comment',
        user: { name: 'davidr', avatarUrl: 'https://i.pravatar.cc/100?u=david' },
        timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
        post: postForNotifications,
        commentPreview: 'This is so inspiring! Thank you for sharing.',
    },
    {
        id: '4',
        type: 'follow',
        user: { name: 'emilyc', avatarUrl: 'https://i.pravatar.cc/100?u=emily' },
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        isFollowing: true,
    },
    {
        id: '5',
        type: 'pray',
        user: { name: 'michaelb', avatarUrl: 'https://i.pravatar.cc/100?u=michael' },
        timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
        post: postForNotifications,
    },
    {
        id: '6',
        type: 'pray',
        user: { name: 'jessicam', avatarUrl: 'https://i.pravatar.cc/100?u=jessica' },
        timestamp: new Date(Date.now() - 86400000 * 10), // 10 days ago
        post: { ...postForNotifications, type: 'video', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    },
];

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
};

const groupNotifications = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {
        'Today': [],
        'This Week': [],
        'Earlier': [],
    };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    notifications.forEach(notif => {
        if (notif.timestamp >= today) {
            groups['Today'].push(notif);
        } else if (notif.timestamp >= oneWeekAgo) {
            groups['This Week'].push(notif);
        } else {
            groups['Earlier'].push(notif);
        }
    });

    return groups;
};

const NotificationItem: React.FC<{ notification: Notification; onOpenUserProfile: (user: User) => void; onOpenPost: (post: Post) => void; }> = ({ notification, onOpenUserProfile, onOpenPost }) => {
    const [isFollowing, setIsFollowing] = useState(notification.isFollowing);

    const handleFollowToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowing(prev => !prev);
    }

    const renderText = () => {
        const userForProfile = mockUsersForProfile[notification.user.name];

        const handleUserClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (userForProfile) {
                onOpenUserProfile(userForProfile);
            } else {
                alert(`Profile for ${notification.user.name} not found.`);
            }
        };
        
        return (
            <p className="text-sm text-slate-700 dark:text-slate-300">
                <button onClick={handleUserClick} className="font-bold text-slate-800 dark:text-slate-100 text-left hover:underline z-10 relative">
                    {notification.user.name}
                </button>
                {notification.type === 'follow' && ' started following you.'}
                {notification.type === 'pray' && ' prayed for your post.'}
                {notification.type === 'comment' && <> commented: <span className="text-slate-900 dark:text-slate-100">"{notification.commentPreview}"</span></>}
                <span className="text-slate-500 dark:text-slate-400 ml-1.5">{timeSince(notification.timestamp)}</span>
            </p>
        );
    };

    const renderAction = () => {
        if (notification.type === 'follow') {
            return (
                <button onClick={handleFollowToggle} className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors z-10 relative ${isFollowing ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600' : 'bg-brand-blue text-white hover:bg-opacity-90'}`}>
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            );
        }
        if (notification.post) {
            const previewUrl = notification.post.type === 'image' 
                ? notification.post.imageUrl 
                : 'https://placehold.co/44x44/cccccc/ffffff?text=Vid';
            return (
                <img src={previewUrl} alt="post preview" className="h-11 w-11 object-cover rounded" />
            );
        }
        return null;
    }
    
    const handleNotificationClick = () => {
        if ((notification.type === 'pray' || notification.type === 'comment') && notification.post) {
            onOpenPost(notification.post);
        }
    };

    return (
        <button onClick={handleNotificationClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-left">
            <div className="flex items-center space-x-3 flex-1">
                <img src={notification.user.avatarUrl} alt={notification.user.name} className="h-11 w-11 rounded-full"/>
                <div className="flex-1 pr-2">
                    {renderText()}
                </div>
            </div>
            <div className="flex-shrink-0">
                {renderAction()}
            </div>
        </button>
    );
};


const NotificationScreen: React.FC<NotificationScreenProps> = ({ onClose, onOpenUserProfile, onOpenPost }) => {
    const [notifications, setNotifications] = useState(mockNotifications);

    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        setNotifications(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    const groupedNotifications = groupNotifications(notifications);

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Notifications</h1>
                    <div className="w-10" />
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <PullToRefresh onRefresh={handleRefresh}>
                    {Object.entries(groupedNotifications).map(([groupName, groupNotifications]) => (
                        groupNotifications.length > 0 && (
                            <div key={groupName}>
                                <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 p-4 pb-2">{groupName}</h2>
                                <div>
                                    {groupNotifications.map(notif => <NotificationItem key={notif.id} notification={notif} onOpenUserProfile={onOpenUserProfile} onOpenPost={onOpenPost} />)}
                                </div>
                            </div>
                        )
                    ))}
                </PullToRefresh>
            </main>
        </div>
    );
};

export default NotificationScreen;