import React from 'react';
import { TextContentScreen } from '../components';

interface ManagingAccountScreenProps {
    onBack: () => void;
}

const ManagingAccountScreen: React.FC<ManagingAccountScreenProps> = ({ onBack }) => (
    <TextContentScreen title="Managing Your Account" onBack={onBack}>
        <p>You have full control over your profile and account settings. You can access most settings from your <strong>Profile</strong> page or the main <strong>Sidebar</strong>.</p>

        <h4>Editing Your Public Profile</h4>
        <ol>
            <li>Navigate to your <strong>Profile</strong> tab.</li>
            <li>Tap the "Edit Profile" button.</li>
            <li>Here you can change your name, username, bio, church, location, and add a website link.</li>
        </ol>

        <h4>Accessing Settings</h4>
        <p>Tap the menu icon (☰) on the Home screen to open the sidebar, then select "Settings & Privacy". Here you can manage:</p>
        <ul>
            <li><strong>Account Details:</strong> Update your private information like email, phone number, and birthday.</li>
            <li><strong>Password and Security:</strong> Change your password and manage login settings. We highly recommend enabling Two-Factor Authentication for added security.</li>
            <li><strong>Privacy:</strong> Make your account private, control who can mention you, and manage blocked accounts.</li>
            <li><strong>Notifications:</strong> Customize which push notifications you receive for prayers, comments, new followers, and more.</li>
        </ul>
        
        <h4>Your Data and Privacy</h4>
        <p>We are committed to protecting your data. You can learn more about how we handle your information in our Privacy Policy.</p>
    </TextContentScreen>
);

export default ManagingAccountScreen;