import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface NotificationsEventsScreenProps {
    onBack: () => void;
}

const NotificationsEventsScreen: React.FC<NotificationsEventsScreenProps> = ({ onBack }) => {
    const [eventReminders, setEventReminders] = useState(true);
    const [eventUpdates, setEventUpdates] = useState(true);
    const [newEventInvitations, setNewEventInvitations] = useState(true);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Event Notifications" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="From Faith Connect">
                        <ToggleItem 
                            title="Event Reminders"
                            subtitle="Get notified before an event you're going to starts."
                            enabled={eventReminders}
                            onToggle={() => setEventReminders(!eventReminders)}
                        />
                        <ToggleItem 
                            title="Event Updates"
                            subtitle="Get notified when an organizer updates an event you're going to."
                            enabled={eventUpdates}
                            onToggle={() => setEventUpdates(!eventUpdates)}
                        />
                        <ToggleItem 
                            title="New Event Invitations"
                            subtitle="Get notified when someone invites you to an event."
                            enabled={newEventInvitations}
                            onToggle={() => setNewEventInvitations(!newEventInvitations)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default NotificationsEventsScreen;