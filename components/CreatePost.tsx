import React from 'react';

interface CreatePostProps {
    onOpenForm: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onOpenForm }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
                <img src="https://i.pravatar.cc/100?u=currentuser" alt="Your avatar" className="h-10 w-10 rounded-full" />
                <button 
                    onClick={onOpenForm}
                    className="flex-grow text-left bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    What's on your heart?
                </button>
            </div>
        </div>
    );
};

export default CreatePost;