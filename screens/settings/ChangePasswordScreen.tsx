import React, { useState } from 'react';

interface ChangePasswordScreenProps {
    onBack: () => void;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ onBack }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const passwordsMatch = newPassword && newPassword === confirmPassword;
    const isSaveDisabled = !currentPassword || !newPassword || !confirmPassword || !passwordsMatch;

    const handleSave = () => {
        if (isSaveDisabled) return;
        
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }
        
        setError('');
        // In a real app, you would call an API here to verify the current password and save the new one.
        console.log('Password change initiated.');
        alert('Password changed successfully!');
        onBack();
    };

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[60] flex flex-col animate-fade-in">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onBack} className="text-brand-blue font-medium text-base">Cancel</button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Change Password</h1>
                    <button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className={`font-bold text-base ${isSaveDisabled ? 'text-slate-400 dark:text-slate-600' : 'text-brand-blue'}`}
                    >
                        Save
                    </button>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4 px-4 space-y-4">
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <label htmlFor="current-password"
                                   className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                            <input type="password" id="current-password" value={currentPassword}
                                   onChange={e => setCurrentPassword(e.target.value)}
                                   className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"/>
                        </div>
                        <div>
                            <label htmlFor="new-password"
                                   className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                            <input type="password" id="new-password" value={newPassword}
                                   onChange={e => setNewPassword(e.target.value)}
                                   className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"/>
                        </div>
                        <div>
                            <label htmlFor="confirm-password"
                                   className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New
                                Password</label>
                            <input type="password" id="confirm-password" value={confirmPassword}
                                   onChange={e => setConfirmPassword(e.target.value)}
                                   className={`w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue ${newPassword && confirmPassword && !passwordsMatch ? 'border-red-500 ring-red-500' : ''}`}/>
                            {newPassword && confirmPassword && !passwordsMatch && (
                                <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                            )}
                        </div>
                    </div>
                     <div className="text-center">
                        <button className="text-sm font-medium text-brand-blue hover:underline">Forgot your password?</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChangePasswordScreen;