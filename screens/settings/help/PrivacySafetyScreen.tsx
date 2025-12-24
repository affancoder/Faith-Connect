import React from 'react';
import { TextContentScreen } from '../components';

interface PrivacySafetyScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

const PrivacySafetyScreen: React.FC<PrivacySafetyScreenProps> = ({ onBack, onNavigate }) => (
    <TextContentScreen title="Privacy and Safety" onBack={onBack}>
        <p>Creating a safe and trusted environment is our top priority. Here are the tools you can use to control your experience on Faith Connect.</p>
        
        <h4>Community Guidelines</h4>
        <p>All members of our community are expected to follow our <button onClick={() => onNavigate('communityGuidelines')} className="text-brand-blue hover:underline">Community Guidelines</button>, which are designed to keep Faith Connect a positive and respectful space.</p>
        
        <h4>Private vs. Public Account</h4>
        <p>By default, your account is public. You can switch to a <strong>Private Account</strong> in <em>Settings → Privacy</em>. With a private account, you must approve new followers, and only your followers can see your posts.</p>

        <h4>Blocking and Muting</h4>
        <ul>
            <li><strong>Blocking:</strong> To stop someone from interacting with you, viewing your profile, or finding you in search, you can block them. Go to their profile, tap the '...' menu, and select "Block".</li>
            <li><strong>Muting:</strong> If you don't want to see someone's posts but don't want to unfollow or block them, you can mute their account. Their content won't appear in your feed.</li>
        </ul>

        <h4>Reporting Content</h4>
        <p>If you see a post, comment, or profile that violates our guidelines, please report it. Tap the '...' menu on any post or profile and select "Report". Our team will review it and take appropriate action.</p>

        <h4>Activity Status</h4>
        <p>You can control whether others can see when you are active on the app. Manage this in <em>Settings → Privacy → Activity Status</em>.</p>

    </TextContentScreen>
);

export default PrivacySafetyScreen;