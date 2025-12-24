import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, RadioItem } from './components';

interface MentionsScreenProps {
    onBack: () => void;
}

type MentionSetting = 'everyone' | 'followed' | 'none';

const MentionsScreen: React.FC<MentionsScreenProps> = ({ onBack }) => {
    const [mentionSetting, setMentionSetting] = useState<MentionSetting>('everyone');

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Mentions" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection 
                        title="Allow @mentions from"
                        description="Choose who can link to your account in their stories, comments, and posts."
                    >
                        <RadioItem 
                            label="Everyone"
                            isSelected={mentionSetting === 'everyone'}
                            onSelect={() => setMentionSetting('everyone')}
                        />
                        <RadioItem 
                            label="People You Follow"
                            isSelected={mentionSetting === 'followed'}
                            onSelect={() => setMentionSetting('followed')}
                        />
                        <RadioItem 
                            label="No One"
                            isSelected={mentionSetting === 'none'}
                            onSelect={() => setMentionSetting('none')}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default MentionsScreen;