import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface NotificationsMessagesScreenProps {
    onBack: () => void;
}

const NotificationsMessagesScreen: React.FC<NotificationsMessagesScreenProps> = ({ onBack }) => {
    const [messageRequests, setMessageRequests] = useState(true);
    const [messages, setMessages] = useState(true);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Direct Messages" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Push Notifications">
                        <ToggleItem 
                            title="Message Requests"
                            subtitle="Get notified when you receive a new message request."
                            enabled={messageRequests}
                            onToggle={() => setMessageRequests(!messageRequests)}
                        />
                        <ToggleItem 
                            title="Messages"
                            subtitle="Get notified when you receive a new message from a connection."
                            enabled={messages}
                            onToggle={() => setMessages(!messages)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default NotificationsMessagesScreen;