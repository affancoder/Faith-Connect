import React, { useState, useRef } from 'react';
import { PrayerCategory, Post } from '../types';

interface PostFormProps {
    onAddPost: (newPost: Omit<Post, 'id' | 'prayerCount' | 'timestamp' | 'avatarUrl' | 'userId'>) => void;
    isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, isSubmitting = false }) => {
    const [name, setName] = useState('');
    const [request, setRequest] = useState(''); // This is now the caption
    const [category, setCategory] = useState<PrayerCategory>(PrayerCategory.HEALING);
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };

    const removeFile = () => {
        setFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!request.trim() && !file) {
            setError('Your post cannot be empty.');
            return;
        }
        setError('');

        const postType = file ? (file.type.startsWith('video/') ? 'video' : 'image') : 'text';
        
        onAddPost({
            name: name.trim() || 'Anonymous',
            request,
            category,
            commentsCount: 0,
            sharesCount: 0,
            type: postType,
            imageUrl: postType === 'image' && filePreview ? filePreview : undefined,
            videoUrl: postType === 'video' && filePreview ? filePreview : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={5}
                placeholder="Share what's on your heart..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 text-lg scrollbar-hide dark:text-slate-200 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
             />
             {error && <p className="text-red-500 text-sm">{error}</p>}
             
             {filePreview && (
                <div className="relative rounded-lg overflow-hidden border">
                    {file?.type.startsWith('image/') ? (
                         <img src={filePreview} alt="Preview" className="w-full h-auto object-contain max-h-80" />
                    ) : (
                         <video src={filePreview} controls className="w-full h-auto max-h-80" />
                    )}
                    <button type="button" onClick={removeFile} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5" aria-label="Remove media">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
             )}

            <div className="border dark:border-slate-700 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm font-medium dark:text-slate-300">Add to your post</span>
                <div className="flex space-x-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full p-2" aria-label="Add photo or video">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                </div>
                <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                />
                 <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PrayerCategory)}
                    className="block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                >
                    {Object.values(PrayerCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                     <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Checking...</span>
                    </div>
                ) : (
                    'Post'
                )}
            </button>
        </form>
    );
};

export default PostForm;