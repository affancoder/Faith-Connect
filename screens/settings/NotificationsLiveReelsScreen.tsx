import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface NotificationsLiveReelsScreenProps {
    onBack: () => void;
}

const NotificationsLiveReelsScreen: React.FC<NotificationsLiveReelsScreenProps> = ({ onBack }) => {
    const [liveVideos, setLiveVideos] = useState(true);
    const [newReels, setNewReels] = useState(true);
    const [reelsSuggestions, setReelsSuggestions] = useState(true);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Live and Reels" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="From People You Follow">
                        <ToggleItem 
                            title="Live Videos"
                            subtitle="Get notified when an account you follow starts a live video."
                            enabled={liveVideos}
                            onToggle={() => setLiveVideos(!liveVideos)}
                        />
                        <ToggleItem 
                            title="New Reels"
                            subtitle="Get notified when an account you follow posts a new reel."
                            enabled={newReels}
                            onToggle={() => setNewReels(!newReels)}
                        />
                    </SettingsSection>
                     <SettingsSection title="From Faith Connect">
                        <ToggleItem 
                            title="Suggested Reels"
                            subtitle="Get notified about reels you might like."
                            enabled={reelsSuggestions}
                            onToggle={() => setReelsSuggestions(!reelsSuggestions)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default NotificationsLiveReelsScreen;