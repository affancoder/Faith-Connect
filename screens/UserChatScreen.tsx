import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChatUser } from '../types';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}

const mockMessages: Message[] = [
    { id: '1', text: 'Hey! How are you doing?', sender: 'other', timestamp: '10:38 AM' },
    { id: '2', text: 'I\'m doing great, thanks for asking! Just getting ready for the service this weekend.', sender: 'me', timestamp: '10:39 AM' },
    { id: '3', text: 'Awesome! I was wondering if you had a moment to pray about something?', sender: 'other', timestamp: '10:40 AM' },
];

interface UserChatScreenProps {
    user: ChatUser;
    onClose: () => void;
}

const TypingIndicator = () => (
    <div className="flex items-end space-x-2">
         <img src="https://i.pravatar.cc/100?u=david" alt="typing user" className="h-7 w-7 rounded-full" />
        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none">
            <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);

const AttachmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsMounted(true), 10);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const modalClasses = `bg-white dark:bg-slate-800 w-full rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;

    const attachmentOptions = [
        { label: 'Document', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: 'text-purple-500' },
        { label: 'Location', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'text-green-500' },
        { label: 'Audio', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>, color: 'text-orange-500' },
        { label: 'Contact', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, color: 'text-blue-500' },
        { label: 'Event', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'text-red-500' },
    ];

    const modalContent = (
         <div className="fixed inset-0 bg-black/60 z-[100] flex items-end" onClick={handleClose}>
            <div ref={modalRef} className={modalClasses} onClick={e => e.stopPropagation()}>
                <header className="p-4 text-center relative">
                    <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto mb-3"></div>
                </header>
                <main className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {attachmentOptions.map(opt => (
                            <button key={opt.label} className="flex flex-col items-center space-y-2 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 ${opt.color}`}>
                                    {opt.icon}
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};


const UserChatScreen: React.FC<UserChatScreenProps> = ({ user, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUserAvatarUrl = 'https://i.pravatar.cc/100?u=currentuser';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(mockMessages);
        setIsTyping(true);
        setTimeout(() => {
            const initialReply: Message = {
                id: '4', 
                text: 'Of course! What\'s on your mind?', 
                sender: 'other', 
                timestamp: '10:41 AM'
            };
            setIsTyping(false);
            setMessages(prev => [...prev, initialReply]);
        }, 1500);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || isTyping) return;
        
        const newMsg: Message = {
            id: String(Date.now()),
            text: newMessage.trim(),
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        setIsTyping(true);

        setTimeout(() => {
            const replyMsg: Message = {
                id: String(Date.now() + 1),
                text: "Thank you for sharing. I'll be praying for you! 🙏",
                sender: 'other',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setIsTyping(false);
            setMessages(prev => [...prev, replyMsg]);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 border-b dark:border-slate-800">
                <div className="container mx-auto px-2 h-14 flex items-center justify-between">
                    <div className="flex items-center">
                        <button onClick={onClose} className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-2">
                            <img src={user.avatarUrl} alt={user.name} className="h-9 w-9 rounded-full" />
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-base">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{isTyping ? 'typing...' : 'Active now'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => alert(`Starting voice call with ${user.name}...`)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </button>
                        <button onClick={() => alert(`Starting video call with ${user.name}...`)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 space-y-2 scrollbar-hide">
                {messages.map((msg, index) => {
                    const nextMessage = messages[index + 1];
                    const isLastInGroup = !nextMessage || nextMessage.sender !== msg.sender;
                    
                    const messageBubble = (
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-brand-blue text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'} text-right`}>{msg.timestamp}</p>
                        </div>
                    );

                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'other' && (
                                <img 
                                    src={user.avatarUrl} 
                                    alt={user.name} 
                                    className={`h-7 w-7 rounded-full transition-opacity ${isLastInGroup ? 'opacity-100' : 'opacity-0'}`}
                                />
                            )}
                            {messageBubble}
                            {msg.sender === 'me' && (
                                <img 
                                    src={currentUserAvatarUrl} 
                                    alt="My avatar" 
                                    className={`h-7 w-7 rounded-full transition-opacity ${isLastInGroup ? 'opacity-100' : 'opacity-0'}`}
                                />
                            )}
                        </div>
                    );
                })}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </main>
            <footer className="flex-shrink-0 p-2 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
                <div className="flex items-center space-x-2">
                     <button onClick={() => setIsAttachmentModalOpen(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Attach file">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                     </button>
                     <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Message..."
                        className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 focus:outline-none dark:text-slate-200 dark:placeholder-slate-400"
                    />
                    {newMessage.trim() ? (
                         <button onClick={handleSendMessage} className="text-brand-blue font-semibold px-3" aria-label="Send message">
                            Send
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                             <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Attach image">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </button>
                             <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Send a heart">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </footer>
            {isAttachmentModalOpen && <AttachmentModal onClose={() => setIsAttachmentModalOpen(false)} />}
        </div>
    );
};

export default UserChatScreen;