import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface PrayerRemindersScreenProps {
    onBack: () => void;
}

const PrayerRemindersScreen: React.FC<PrayerRemindersScreenProps> = ({ onBack }) => {
    const [remindersEnabled, setRemindersEnabled] = useState(true);
    const [reminderTime, setReminderTime] = useState("08:00");

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Prayer Reminders" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Daily Reminders">
                        <ToggleItem 
                            title="Enable Prayer Reminders"
                            enabled={remindersEnabled}
                            onToggle={() => setRemindersEnabled(!remindersEnabled)}
                        />
                        {remindersEnabled && (
                            <div className="p-3.5 flex items-center justify-between">
                                <label htmlFor="reminderTime" className="font-medium text-slate-800 dark:text-slate-200 text-base">Reminder Time</label>
                                <input 
                                    type="time"
                                    id="reminderTime"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    className="bg-slate-100 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                                />
                            </div>
                        )}
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default PrayerRemindersScreen;