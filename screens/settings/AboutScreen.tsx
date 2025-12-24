import React from 'react';
import { TextContentScreen } from './components';

interface AboutScreenProps {
    onBack: () => void;
    onOpenWebView: (url: string) => void;
}

const privacyPolicyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1, h2 { color: #111; }
        h1 { font-size: 1.5em; }
        h2 { font-size: 1.2em; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 2em; }
        ul { padding-left: 20px; }
    </style>
</head>
<body>
    <h1>Privacy Policy for Faith Connect</h1>
    <p><em>Last Updated: ${new Date().toLocaleDateString()}</em></p>
    
    <p>Welcome to Faith Connect. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

    <h2>Information We Collect</h2>
    <p>We may collect information about you in a variety of ways. The information we may collect on the App includes:</p>
    <ul>
        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information (like your church or denomination), that you voluntarily give to us when you register with the App.</li>
        <li><strong>Prayer Requests:</strong> Any information, including sensitive personal data, you voluntarily share in your prayer requests, posts, and comments.</li>
        <li><strong>Geolocation Information:</strong> We may request access or permission to and track location-based information from your mobile device to provide location-based services like finding nearby churches.</li>
        <li><strong>Device Data:</strong> Information such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the App from a mobile device.</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:</p>
    <ul>
        <li>Create and manage your account.</li>
        <li>Display your prayer requests and content to other users as per your privacy settings.</li>
        <li>Monitor and analyze usage and trends to improve your experience with the App.</li>
        <li>Notify you of updates to the App.</li>
        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
    </ul>

    <h2>Sharing Your Information</h2>
    <p>We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with:</p>
    <ul>
        <li><strong>Other Users:</strong> Your public profile information and posts will be visible to other users of the app according to your settings.</li>
        <li><strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services for us or on our behalf (e.g., cloud hosting).</li>
        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law.</li>
    </ul>

    <h2>Contact Us</h2>
    <p>If you have questions or comments about this Privacy Policy, please contact us at: privacy@faithconnect.app</p>
</body>
</html>
`;

const termsOfServiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1, h2 { color: #111; }
        h1 { font-size: 1.5em; }
        h2 { font-size: 1.2em; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 2em; }
    </style>
</head>
<body>
    <h1>Terms of Service for Faith Connect</h1>
    <p><em>Last Updated: ${new Date().toLocaleDateString()}</em></p>
    
    <p>Please read these Terms of Service ("Terms") carefully before using the Faith Connect mobile application (the "Service") operated by us.</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

    <h2>2. User Conduct</h2>
    <p>You agree not to use the Service to post content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. You are solely responsible for the content you post. We expect all users to abide by our Community Guidelines, which are incorporated by reference into these Terms.</p>

    <h2>3. Content Ownership</h2>
    <p>You retain ownership of any intellectual property rights that you hold in the content you submit. When you upload or otherwise submit content to our Service, you give Faith Connect a worldwide license to use, host, store, reproduce, and modify such content for the purpose of operating, promoting, and improving our Service.</p>

    <h2>4. Termination</h2>
    <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

    <h2>5. Disclaimers</h2>
    <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the service will be uninterrupted, secure, or error-free.</p>

    <h2>Contact Us</h2>
    <p>If you have any questions about these Terms, please contact us at: legal@faithconnect.app</p>
</body>
</html>
`;

const openSourceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open Source Licenses</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 1.5em; color: #111; }
        .license { margin-bottom: 2em; border-left: 3px solid #ccc; padding-left: 15px; }
        code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
        a { color: #007aff; }
    </style>
</head>
<body>
    <h1>Open Source Licenses</h1>
    <p>Faith Connect is built using wonderful open source software. We are grateful to the developers and communities who create and maintain these projects.</p>
    
    <div class="license">
        <h2>React</h2>
        <p>A JavaScript library for building user interfaces.</p>
        <p>Licensed under the MIT License.</p>
        <p><a href="https://github.com/facebook/react" target="_blank" rel="noopener noreferrer">https://github.com/facebook/react</a></p>
    </div>

    <div class="license">
        <h2>Tailwind CSS</h2>
        <p>A utility-first CSS framework for rapid UI development.</p>
        <p>Licensed under the MIT License.</p>
        <p><a href="https://github.com/tailwindlabs/tailwindcss" target="_blank" rel="noopener noreferrer">https://github.com/tailwindlabs/tailwindcss</a></p>
    </div>

    <div class="license">
        <h2>LeafletJS</h2>
        <p>An open-source JavaScript library for mobile-friendly interactive maps.</p>
        <p>Licensed under the BSD 2-Clause "Simplified" License.</p>
        <p><a href="https://github.com/Leaflet/Leaflet" target="_blank" rel="noopener noreferrer">https://github.com/Leaflet/Leaflet</a></p>
    </div>

    <p>This is not an exhaustive list. Other open-source libraries may be used. The respective licenses of these components apply.</p>
</body>
</html>
`;

// Helper to create data URLs
const createDataUrl = (html: string) => `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;

const privacyPolicyUrl = createDataUrl(privacyPolicyHtml);
const termsOfServiceUrl = createDataUrl(termsOfServiceHtml);
const openSourceUrl = createDataUrl(openSourceHtml);


const AboutScreen: React.FC<AboutScreenProps> = ({ onBack, onOpenWebView }) => (
    <TextContentScreen title="About" onBack={onBack}>
        <div className="text-center">
            <h2 className="text-2xl font-bold">Faith Connect</h2>
            <p className="text-slate-500 dark:text-slate-400">Version 1.0.0</p>
        </div>
        <ul className="mt-8">
            <li><button onClick={() => onOpenWebView(privacyPolicyUrl)} className="text-brand-blue hover:underline">Privacy Policy</button></li>
            <li><button onClick={() => onOpenWebView(termsOfServiceUrl)} className="text-brand-blue hover:underline">Terms of Service</button></li>
            <li><button onClick={() => onOpenWebView(openSourceUrl)} className="text-brand-blue hover:underline">Open Source Licenses</button></li>
        </ul>
        <p className="mt-8 text-center text-slate-400">&copy; {new Date().getFullYear()} Faith Connect. All rights reserved.</p>
    </TextContentScreen>
);

export default AboutScreen;