import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface NotificationsFollowScreenProps {
    onBack: () => void;
}

const NotificationsFollowScreen: React.FC<NotificationsFollowScreenProps> = ({ onBack }) => {
    const [newFollowers, setNewFollowers] = useState(true);
    const [acceptedRequests, setAcceptedRequests] = useState(true);
    const [accountSuggestions, setAccountSuggestions] = useState(true);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Followers and Following" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Manage Notifications">
                        <ToggleItem 
                            title="New Followers"
                            subtitle="When someone starts following you."
                            enabled={newFollowers}
                            onToggle={() => setNewFollowers(!newFollowers)}
                        />
                        <ToggleItem 
                            title="Accepted Follow Requests"
                            subtitle="When someone accepts your follow request."
                            enabled={acceptedRequests}
                            onToggle={() => setAcceptedRequests(!acceptedRequests)}
                        />
                        <ToggleItem 
                            title="Account Suggestions"
                            subtitle="Get notified about people you may know."
                            enabled={accountSuggestions}
                            onToggle={() => setAccountSuggestions(!accountSuggestions)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default NotificationsFollowScreen;