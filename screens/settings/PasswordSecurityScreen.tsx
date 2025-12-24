import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, SettingsItem, ToggleItem } from './components';
import ChangePasswordScreen from './ChangePasswordScreen';

interface PasswordSecurityScreenProps {
    onBack: () => void;
}

const PasswordSecurityScreen: React.FC<PasswordSecurityScreenProps> = ({ onBack }) => {
    const [twoFactor, setTwoFactor] = useState(false);
    const [saveLogin, setSaveLogin] = useState(true);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    if (isChangePasswordOpen) {
        return <ChangePasswordScreen onBack={() => setIsChangePasswordOpen(false)} />;
    }

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Password and Security" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Login">
                        <SettingsItem title="Change Password" onClick={() => setIsChangePasswordOpen(true)} />
                        <ToggleItem 
                            title="Save Login Info"
                            subtitle="Your login info will be saved on this device."
                            enabled={saveLogin}
                            onToggle={() => setSaveLogin(!saveLogin)}
                        />
                    </SettingsSection>
                    <SettingsSection 
                        title="Two-Factor Authentication"
                        description="Help protect your account by requiring a code when you log in on a new device."
                    >
                        <ToggleItem 
                            title="Two-Factor Authentication"
                            enabled={twoFactor}
                            onToggle={() => setTwoFactor(!twoFactor)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default PasswordSecurityScreen;