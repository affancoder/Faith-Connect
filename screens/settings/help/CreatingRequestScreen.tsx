import React from 'react';
import { TextContentScreen } from '../components';

interface CreatingRequestScreenProps {
    onBack: () => void;
}

const CreatingRequestScreen: React.FC<CreatingRequestScreenProps> = ({ onBack }) => (
    <TextContentScreen title="Creating a Prayer Request" onBack={onBack}>
        <p>Sharing a prayer request is at the heart of Faith Connect. You can do it from two main places:</p>

        <h4>1. From Your Home Feed</h4>
        <p>This is for sharing with friends and followers.</p>
        <ol>
            <li>Go to the <strong>Home</strong> tab.</li>
            <li>Tap on the box that says "What's on your heart?".</li>
            <li>This will open the post creator, where you can write your prayer.</li>
        </ol>

        <h4>2. From the Global Prayer Wall</h4>
        <p>This is for sharing with the entire Faith Connect community worldwide.</p>
        <ol>
            <li>Go to the <strong>Global Prayer Wall</strong> tab (the praying hands icon).</li>
            <li>Tap on the box that says "Share a prayer with the world...".</li>
        </ol>

        <h4>Writing Your Post</h4>
        <p>In the post creator, you can:</p>
        <ul>
            <li><strong>Write your prayer:</strong> Share as much or as little detail as you feel comfortable with.</li>
            <li><strong>Add a photo or video:</strong> Tap the photo icon to add media from your device.</li>
            <li><strong>Post Anonymously:</strong> If you prefer not to share your name, you can leave the "Your Name" field blank.</li>
            <li><strong>Choose a Category:</strong> Select a category like Healing, Guidance, or Thanksgiving to help others find and pray for your request.</li>
        </ul>
        
        <h4>Community Safety</h4>
        <p>To ensure our community remains a safe and encouraging space, all posts are reviewed by our automated moderation system to check that they are genuine prayer requests and do not violate our Community Guidelines. If your post is flagged, you will be notified with a reason.</p>
    </TextContentScreen>
);

export default CreatingRequestScreen;