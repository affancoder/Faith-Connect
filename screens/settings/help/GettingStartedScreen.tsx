import React from 'react';
import { TextContentScreen } from '../components';

interface GettingStartedScreenProps {
    onBack: () => void;
}

const GettingStartedScreen: React.FC<GettingStartedScreenProps> = ({ onBack }) => (
    <TextContentScreen title="Getting Started" onBack={onBack}>
        <h3>Welcome to Faith Connect!</h3>
        <p>We're so glad you're here. Faith Connect is a digital sanctuary where you can share prayer requests, support others, and find encouragement in a global Christian community.</p>

        <h4>Navigating the App</h4>
        <p>The app is organized into five main tabs at the bottom of your screen:</p>
        <ul>
            <li><strong>Home:</strong> Your main feed, where you'll see prayer requests from people you follow. You can also view and create Stories here.</li>
            <li><strong>Discover:</strong> Explore popular content, search for friends, events, and groups.</li>
            <li><strong>Global Prayer Wall:</strong> A place to share and read prayer requests from the entire Faith Connect community.</li>
            <li><strong>Reels:</strong> Watch and share short, inspiring video testimonies and messages.</li>
            <li><strong>Events:</strong> Find and join Christian events happening online or near you.</li>
        </ul>

        <h4>Your First Prayer Request</h4>
        <p>Ready to share what's on your heart? On the <strong>Home</strong> screen, tap the "What's on your heart?" box to open the post creator. You can write your prayer, add a photo or video, and share it with the community.</p>

        <h4>Exploring More</h4>
        <p>Tap the menu icon (☰) on the top left of the Home screen to open the sidebar. From there, you can find friends, read the Bible, join groups, and watch live streams.</p>

        <p>We're praying for you as you begin your journey with us!</p>
    </TextContentScreen>
);

export default GettingStartedScreen;