import React from 'react';
import { TextContentScreen } from './components';

interface CommunityGuidelinesScreenProps {
    onBack: () => void;
}

const CommunityGuidelinesScreen: React.FC<CommunityGuidelinesScreenProps> = ({ onBack }) => (
    <TextContentScreen title="Community Guidelines" onBack={onBack}>
        <h3>Our Mission</h3>
        <p>To provide a safe, encouraging, and uplifting digital sanctuary for Christians worldwide to share, pray, and connect.</p>
        
        <h3>1. Be Respectful and Christ-like</h3>
        <p>Interact with others in a way that reflects the love and grace of Christ. Disagreements are natural, but they must be handled with respect, humility, and kindness. Personal attacks, harassment, bullying, and hate speech will not be tolerated.</p>

        <h3>2. Keep Content Focused on Faith</h3>
        <p>This is a space for prayer requests, thanksgiving, testimonies, and spiritual encouragement. While personal life updates are welcome, please ensure they align with the app's purpose. Content that is primarily commercial, political, or secular may be removed.</p>

        <h3>3. No Inappropriate Content</h3>
        <p>Any content that is violent, graphic, pornographic, profane, or otherwise contrary to Christian values is strictly prohibited.</p>

        <h3>4. Respect Privacy</h3>
        <p>Do not share personal information of others without their explicit consent. Be mindful of the sensitivity of prayer requests you share.</p>

        <h3>5. No Spam or Scams</h3>
        <p>Do not use Faith Connect to solicit funds (unless through an approved church or ministry feature), promote businesses, or engage in fraudulent activity. Impersonating others is also forbidden.</p>
        
        <p className="mt-6 font-semibold">Violation of these guidelines may result in content removal, account suspension, or a permanent ban.</p>
    </TextContentScreen>
);

export default CommunityGuidelinesScreen;