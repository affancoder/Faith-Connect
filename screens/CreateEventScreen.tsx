import React, { useState, useRef } from 'react';
import { Event, EventType } from '../types';

interface CreateEventScreenProps {
    onClose: () => void;
    onAddEvent: (event: Event) => void;
}

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ onClose, onAddEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState<EventType>('offline');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDateString = (date: Date): string => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === today.getTime()) return 'Today';
        if (checkDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
        
        return date.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    const handleSubmit = () => {
        if (!title || !description || !startTime || !endTime || !location || !imagePreview) {
            setError('Please fill out all fields and add a cover image.');
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        
        if(start >= end) {
            setError('The event end time must be after the start time.');
            return;
        }

        setError('');

        const newEvent: Event = {
            id: `evt-${Date.now()}`,
            title,
            description,
            startTime: start,
            endTime: end,
            location,
            type,
            imageUrl: imagePreview,
            date: formatDateString(start)
        };

        onAddEvent(newEvent);
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="text-brand-blue font-medium text-base">Cancel</button>
                    <h1 className="text-lg font-bold text-slate-800">Create Event</h1>
                    <button onClick={handleSubmit} className="text-brand-blue font-bold text-base">Create</button>
                </div>
            </header>

            {/* Form Content */}
            <main className="flex-grow overflow-y-auto bg-slate-50 p-4 scrollbar-hide">
                <div className="container mx-auto max-w-2xl space-y-4 pb-4">
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Community Worship Night" className="w-full bg-slate-50 border-slate-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue" />
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Tell people more about the event..." className="w-full bg-slate-50 border-slate-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue scrollbar-hide"></textarea>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                <input type="datetime-local" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-slate-50 border-slate-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue" />
                            </div>
                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                <input type="datetime-local" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-slate-50 border-slate-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center"><input type="radio" name="eventType" value="offline" checked={type === 'offline'} onChange={() => setType('offline')} className="h-4 w-4 text-brand-blue focus:ring-brand-blue" /> <span className="ml-2 text-sm text-slate-700">Offline</span></label>
                            <label className="flex items-center"><input type="radio" name="eventType" value="online" checked={type === 'online'} onChange={() => setType('online')} className="h-4 w-4 text-brand-blue focus:ring-brand-blue" /> <span className="ml-2 text-sm text-slate-700">Online</span></label>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">{type === 'offline' ? 'Location (City, State/Country)' : 'Online Link / Platform'}</label>
                        <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-50 border-slate-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue" placeholder={type === 'offline' ? 'e.g., Central Park, NYC' : 'e.g., Zoom, YouTube Live'}/>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                        {imagePreview ? (
                            <div className="relative">
                                <img src={imagePreview} alt="Event preview" className="w-full h-40 object-cover rounded-md" />
                                <button onClick={() => {setImagePreview(null); setImageFile(null); if(fileInputRef.current) fileInputRef.current.value = '';}} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        ) : (
                            <button onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="mt-2 text-sm font-semibold">Upload Image</span>
                            </button>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateEventScreen;