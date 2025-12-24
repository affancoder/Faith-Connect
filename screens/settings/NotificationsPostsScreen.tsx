import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface NotificationsPostsScreenProps {
    onBack: () => void;
}

const NotificationsPostsScreen: React.FC<NotificationsPostsScreenProps> = ({ onBack }) => {
    const [likes, setLikes] = useState(true);
    const [comments, setComments] = useState(true);
    const [newPosts, setNewPosts] = useState(true);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Posts, Stories, and Comments" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Your Posts and Stories">
                        <ToggleItem 
                            title="Prayers (Likes)"
                            subtitle="When someone prays for your post."
                            enabled={likes}
                            onToggle={() => setLikes(!likes)}
                        />
                        <ToggleItem 
                            title="Comments"
                            subtitle="When someone comments on your post."
                            enabled={comments}
                            onToggle={() => setComments(!comments)}
                        />
                    </SettingsSection>
                     <SettingsSection title="From People You Follow">
                        <ToggleItem 
                            title="New Posts"
                            subtitle="Get notified when an account you follow creates a new post."
                            enabled={newPosts}
                            onToggle={() => setNewPosts(!newPosts)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default NotificationsPostsScreen;