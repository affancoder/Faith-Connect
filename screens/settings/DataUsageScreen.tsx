import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem, RadioItem } from './components';

interface DataUsageScreenProps {
    onBack: () => void;
}

type AutoplaySetting = 'on_all' | 'on_wifi' | 'never';

const DataUsageScreen: React.FC<DataUsageScreenProps> = ({ onBack }) => {
    const [useLessData, setUseLessData] = useState(false);
    const [autoplay, setAutoplay] = useState<AutoplaySetting>('on_wifi');

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Data Usage" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection 
                        title="Data Saver"
                        description="When turned on, videos won't load in advance to help you use less data."
                    >
                        <ToggleItem 
                            title="Use Less Mobile Data"
                            enabled={useLessData}
                            onToggle={() => setUseLessData(!useLessData)}
                        />
                    </SettingsSection>
                    <SettingsSection title="Video Autoplay">
                        <RadioItem label="On Mobile Data and Wi-Fi" isSelected={autoplay === 'on_all'} onSelect={() => setAutoplay('on_all')} />
                        <RadioItem label="On Wi-Fi Only" isSelected={autoplay === 'on_wifi'} onSelect={() => setAutoplay('on_wifi')} />
                        <RadioItem label="Never Autoplay Videos" isSelected={autoplay === 'never'} onSelect={() => setAutoplay('never')} />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default DataUsageScreen;