import React from 'react';
import { SettingsHeader, SettingsSection, SettingsItem } from './components';

interface HelpCenterScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ onBack, onNavigate }) => (
    <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
        <SettingsHeader title="Help Center" onBack={onBack} />
        <main className="flex-grow overflow-y-auto scrollbar-hide">
            <div className="container mx-auto max-w-3xl py-4">
                <SettingsSection title="Popular Topics">
                    <SettingsItem title="Getting Started with Faith Connect" onClick={() => onNavigate('helpGettingStarted')} />
                    <SettingsItem title="Managing Your Account Settings" onClick={() => onNavigate('helpManagingAccount')} />
                    <SettingsItem title="How to Create a Prayer Request" onClick={() => onNavigate('helpCreatingRequest')} />
                    <SettingsItem title="Privacy and Safety" onClick={() => onNavigate('helpPrivacySafety')} />
                </SettingsSection>
                <SettingsSection title="Contact Us">
                    <SettingsItem title="Report a Problem" onClick={() => onNavigate('helpReportProblem')} />
                    <SettingsItem title="Give Feedback" onClick={() => onNavigate('helpGiveFeedback')} />
                </SettingsSection>
            </div>
        </main>
    </div>
);

export default HelpCenterScreen;