import React from 'react';
import { TextContentScreen } from '../components';

interface GiveFeedbackScreenProps {
    onBack: () => void;
}

const GiveFeedbackScreen: React.FC<GiveFeedbackScreenProps> = ({ onBack }) => (
    <TextContentScreen title="Give Feedback" onBack={onBack}>
        <h3>We Value Your Feedback</h3>
        <p>Thank you for helping us make Faith Connect a better place for everyone. Your thoughts and ideas are crucial for our growth and improvement.</p>
        
        <h4>What kind of feedback is helpful?</h4>
        <ul>
            <li><strong>Feature Requests:</strong> Is there something you wish the app could do? Let us know!</li>
            <li><strong>Bug Reports:</strong> Did something not work as expected? Please be as detailed as possible (what you were doing, what happened, what device you're using).</li>
            <li><strong>Usability Comments:</strong> Was something confusing or difficult to use? We want to make the app as intuitive as possible.</li>
            <li><strong>General Ideas:</strong> Any other thoughts on how we can better serve the community.</li>
        </ul>
        
        <h4>How to Send Feedback</h4>
        <p>Please send an email with your feedback to our team. We read every message and appreciate you taking the time to write to us.</p>
        <p className="mt-4">
            <a href="mailto:feedback@faithconnect.app" className="text-brand-blue font-semibold hover:underline">
                Email: feedback@faithconnect.app
            </a>
        </p>
    </TextContentScreen>
);

export default GiveFeedbackScreen;