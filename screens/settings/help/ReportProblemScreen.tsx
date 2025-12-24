import React from 'react';
import { TextContentScreen } from '../components';

interface ReportProblemScreenProps {
    onBack: () => void;
}

const ReportProblemScreen: React.FC<ReportProblemScreenProps> = ({ onBack }) => (
    <TextContentScreen title="Report a Problem" onBack={onBack}>
        <h3>How to Report Content or Users</h3>
        <p>If you encounter content or a user that violates our Community Guidelines, you can report it directly within the app. Your reports are anonymous and help us keep the community safe.</p>
        <ol>
            <li>Navigate to the post, comment, or user profile you wish to report.</li>
            <li>Tap the three-dots menu icon (•••).</li>
            <li>Select the "Report" option.</li>
            <li>Follow the on-screen instructions to categorize the issue. Providing as much detail as possible helps our team review the case efficiently.</li>
        </ol>

        <h3>Reporting a Technical Issue (Bug)</h3>
        <p>If something in the app is not working correctly, we want to know about it. Please send us an email with the following information:</p>
        <ul>
            <li>A clear description of the problem.</li>
            <li>Steps to reproduce the issue.</li>
            <li>What you expected to happen vs. what actually happened.</li>
            <li>Your device type (e.g., iPhone 13, Samsung Galaxy S22) and operating system version.</li>
            <li>A screenshot or screen recording, if possible.</li>
        </ul>
        <p className="mt-4">
            <a href="mailto:bugs@faithconnect.app" className="text-brand-blue font-semibold hover:underline">
                Email: bugs@faithconnect.app
            </a>
        </p>
    </TextContentScreen>
);

export default ReportProblemScreen;
