import React, { useState, useRef, useEffect, useMemo } from 'react';

interface CreateStoryScreenProps {
    onClose: () => void;
}

// --- MOCK DATA ---
interface MediaItem {
    id: number;
    url: string;
    type: 'image' | 'video';
}

const mockVideos: MediaItem[] = [
    { id: 101, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', type: 'video' },
    { id: 102, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', type: 'video' },
    { id: 103, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', type: 'video' },
    { id: 104, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', type: 'video' },
];

const mockCameraImages: MediaItem[] = Array.from({ length: 12 }, (_, i) => ({
    id: 201 + i,
    url: `https://picsum.photos/seed/${i + 10}/400/600`,
    type: 'image'
}));

const mockScreenshots: MediaItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: 301 + i,
    url: `https://picsum.photos/seed/${i + 30}/400/600`,
    type: 'image'
}));

const mockRecents: MediaItem[] = [
    ...mockCameraImages.slice(0, 5),
    mockVideos[0],
    ...mockScreenshots.slice(0, 2),
    mockVideos[1],
    ...mockCameraImages.slice(5, 10),
].sort((a, b) => b.id - a.id); // Simulate recent order

const mockAlbums = ['Recents', 'Camera', 'Screenshots', 'Videos', 'Downloads'];
// --- END MOCK DATA ---


type View = 'gallery' | 'camera' | 'preview';
type StoryMode = 'POST' | 'STORY' | 'REEL';

const filters = [
    { name: 'Normal', style: {} },
    { name: 'Vintage', style: { filter: 'sepia(0.6) brightness(1.1) contrast(0.9)' } },
    { name: 'Grayscale', style: { filter: 'grayscale(1)' } },
    { name: 'Noir', style: { filter: 'grayscale(1) contrast(1.3)' } },
    { name: 'Warm', style: { filter: 'sepia(0.3) saturate(1.5)' } },
    { name: 'Cool', style: { filter: 'contrast(1.1) brightness(1.05) saturate(0.9)' } },
];

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// --- CAMERA SUB-COMPONENTS ---

interface CameraViewProps {
    onMediaCaptured: (media: MediaItem) => void;
    onSwitchToGallery: () => void;
}

const PostCameraView: React.FC<CameraViewProps> = ({ onMediaCaptured, onSwitchToGallery }) => {
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const holdTimerRef = useRef<number | null>(null);
    const recordingIntervalRef = useRef<number | null>(null);
    const initialPinchDistanceRef = useRef<number | null>(null);
    const pinchStartZoomRef = useRef<number>(1);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const setupMediaRecorder = (stream: MediaStream) => {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) recordedChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                onMediaCaptured({ id: Date.now(), url, type: 'video' });
                recordedChunksRef.current = [];
            };
        };

        const enableStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
                if (videoRef.current) videoRef.current.srcObject = stream;
                setupMediaRecorder(stream);
            } catch (err) {
                console.error("Error accessing camera: ", err);
                onSwitchToGallery();
            }
        };
        enableStream();
        return () => stream?.getTracks().forEach(track => track.stop());
    }, [facingMode, onMediaCaptured, onSwitchToGallery]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.readyState >= video.HAVE_METADATA) {
            const context = canvas.getContext('2d');
            if (context) {
                const targetAspectRatio = 4 / 5;
                canvas.width = 1080;
                canvas.height = 1350;

                const { videoWidth, videoHeight } = video;
                const videoAspectRatio = videoWidth / videoHeight;
                let sWidth = videoWidth, sHeight = videoHeight, sx = 0, sy = 0;

                if (videoAspectRatio > targetAspectRatio) {
                    sWidth = videoHeight * targetAspectRatio;
                    sx = (videoWidth - sWidth) / 2;
                } else {
                    sHeight = videoWidth / targetAspectRatio;
                    sy = (videoHeight - sHeight) / 2;
                }

                const zoomed_sWidth = sWidth / zoom, zoomed_sHeight = sHeight / zoom;
                sx += (sWidth - zoomed_sWidth) / 2;
                sy += (sHeight - zoomed_sHeight) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.filter = activeFilter.style.filter || 'none';
                if (facingMode === 'user') {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }
                context.drawImage(video, sx, sy, zoomed_sWidth, zoomed_sHeight, 0, 0, canvas.width, canvas.height);
                context.setTransform(1, 0, 0, 1, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onMediaCaptured({ id: Date.now(), url: dataUrl, type: 'image' });
            }
        }
    };

    const startRecording = () => {
        if (mediaRecorderRef.current?.state === 'inactive') {
            recordedChunksRef.current = [];
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingDuration(0);
            recordingIntervalRef.current = window.setInterval(() => setRecordingDuration(p => p + 1), 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if(recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        }
    };
    
    const handleShutterPress = () => {
        holdTimerRef.current = window.setTimeout(startRecording, 200);
    };

    const handleShutterRelease = () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        if (isRecording) stopRecording(); else handleCapture();
    };
    
    const handleFlipCamera = () => {
        setFacingMode(p => p === 'user' ? 'environment' : 'user');
        setZoom(1);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialPinchDistanceRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            pinchStartZoomRef.current = zoom;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && initialPinchDistanceRef.current !== null) {
            e.preventDefault();
            const currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            const scale = currentDistance / initialPinchDistanceRef.current;
            setZoom(Math.max(1, Math.min(pinchStartZoomRef.current * scale, 4)));
        }
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) initialPinchDistanceRef.current = null;
    };

    return (
        <div 
            className="w-full h-full bg-black flex flex-col items-center justify-center touch-none overflow-hidden"
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-full aspect-[4/5] overflow-hidden">
                <video 
                    ref={videoRef} autoPlay playsInline muted 
                    className="w-full h-full object-cover"
                    style={{
                        ...activeFilter.style,
                        transform: `scale(${zoom}) ${facingMode === 'user' ? 'scaleX(-1)' : ''}`,
                        transition: 'transform 0.1s linear, filter 0.3s ease'
                    }}
                />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 pointer-events-none z-10"></div>
            
            {isRecording && (
                <div className="absolute top-6 z-20 bg-black/50 px-3 py-1 rounded-full flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="font-mono text-sm">{formatDuration(recordingDuration)}</p>
                </div>
            )}
            
            <aside className="absolute left-4 top-1/2 -translate-y-1/2 z-20 space-y-4">
                 <button className="bg-black/40 rounded-full p-3" aria-label="Add text"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                 <button className="bg-black/40 rounded-full p-3" aria-label="Add sticker"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            </aside>

            <div className="absolute bottom-20 left-0 right-0 p-6 flex flex-col items-center z-20">
                {!isRecording && (
                    <div className="w-full overflow-x-auto scrollbar-hide mb-4">
                        <div className="flex space-x-4 justify-center">
                            {filters.map(filter => (
                                <button key={filter.name} onClick={() => setActiveFilter(filter)} className="flex flex-col items-center space-y-1 text-center">
                                    <div className={`w-12 h-12 rounded-md bg-gray-500 bg-cover bg-center border-2 ${activeFilter.name === filter.name ? 'border-white' : 'border-transparent'}`} style={{ backgroundImage: 'url(https://picsum.photos/seed/filter/100/100)', ...filter.style }}></div>
                                    <span className="text-xs font-medium">{filter.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between w-full">
                     <button onClick={onSwitchToGallery} className="w-10 h-10 rounded-md overflow-hidden border-2 border-white" disabled={isRecording}>
                        <img src={mockRecents[0].url} alt="gallery preview" className="w-full h-full object-cover" />
                     </button>
                     <button 
                        onMouseUp={handleShutterRelease} onMouseDown={handleShutterPress}
                        onTouchEnd={handleShutterRelease} onTouchStart={handleShutterPress}
                        className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ring-4 ring-black/30 transition-transform ${isRecording ? 'scale-90' : 'scale-100'}`} 
                        aria-label="Take picture or record video"
                    >
                        <div className={`w-16 h-16 bg-white/90 transition-all duration-200 ${isRecording ? 'rounded-2xl w-10 h-10' : 'rounded-full'}`}></div>
                    </button>
                     <button onClick={handleFlipCamera} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center" aria-label="Flip camera" disabled={isRecording}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const StoryReelCameraView: React.FC<CameraViewProps & { mode: 'STORY' | 'REEL' }> = ({ onMediaCaptured, onSwitchToGallery, mode }) => {
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const holdTimerRef = useRef<number | null>(null);
    const recordingIntervalRef = useRef<number | null>(null);
    const initialPinchDistanceRef = useRef<number | null>(null);
    const pinchStartZoomRef = useRef<number>(1);
    
    const STORY_VIDEO_LIMIT_SECONDS = 30;

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const setupMediaRecorder = (stream: MediaStream) => {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) recordedChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                onMediaCaptured({ id: Date.now(), url, type: 'video' });
                recordedChunksRef.current = [];
            };
        };

        const enableStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
                if (videoRef.current) videoRef.current.srcObject = stream;
                setupMediaRecorder(stream);
            } catch (err) {
                console.error("Error accessing camera: ", err);
                onSwitchToGallery();
            }
        };
        enableStream();
        return () => stream?.getTracks().forEach(track => track.stop());
    }, [facingMode, onMediaCaptured, onSwitchToGallery]);

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        }
    };
    
    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.readyState >= video.HAVE_METADATA) {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = 1080;
                canvas.height = 1920;
                const { videoWidth, videoHeight } = video;
                
                // Crop to 9:16
                const targetAspectRatio = 9 / 16;
                let sWidth = videoWidth, sHeight = videoHeight, sx = 0, sy = 0;
                if (videoWidth / videoHeight > targetAspectRatio) {
                    sWidth = videoHeight * targetAspectRatio;
                    sx = (videoWidth - sWidth) / 2;
                } else {
                    sHeight = videoWidth / targetAspectRatio;
                    sy = (videoHeight - sHeight) / 2;
                }

                const zoomed_sWidth = sWidth / zoom, zoomed_sHeight = sHeight / zoom;
                sx += (sWidth - zoomed_sWidth) / 2;
                sy += (sHeight - zoomed_sHeight) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.filter = activeFilter.style.filter || 'none';
                if (facingMode === 'user') {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }
                context.drawImage(video, sx, sy, zoomed_sWidth, zoomed_sHeight, 0, 0, canvas.width, canvas.height);
                context.setTransform(1, 0, 0, 1, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onMediaCaptured({ id: Date.now(), url: dataUrl, type: 'image' });
            }
        }
    };

    const startRecording = () => {
        if (mediaRecorderRef.current?.state === 'inactive') {
            recordedChunksRef.current = [];
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingDuration(0);
            recordingIntervalRef.current = window.setInterval(() => {
                setRecordingDuration(prev => {
                    const newDuration = prev + 1;
                    if (mode === 'STORY' && newDuration >= STORY_VIDEO_LIMIT_SECONDS) {
                        stopRecording();
                    }
                    return newDuration;
                });
            }, 1000);
        }
    };

    const handleShutterPress = () => {
        holdTimerRef.current = window.setTimeout(startRecording, 200);
    };

    const handleShutterRelease = () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        if (isRecording) stopRecording(); else handleCapture();
    };

    const handleFlipCamera = () => {
        setFacingMode(p => p === 'user' ? 'environment' : 'user');
        setZoom(1);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialPinchDistanceRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            pinchStartZoomRef.current = zoom;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && initialPinchDistanceRef.current !== null) {
            e.preventDefault();
            const currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            const scale = currentDistance / initialPinchDistanceRef.current;
            setZoom(Math.max(1, Math.min(pinchStartZoomRef.current * scale, 4)));
        }
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) initialPinchDistanceRef.current = null;
    };

    return (
        <div 
            className="absolute inset-0 bg-black touch-none overflow-hidden"
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        >
            <video 
                ref={videoRef} autoPlay playsInline muted 
                className="w-full h-full object-cover"
                style={{
                    ...activeFilter.style,
                    transform: `scale(${zoom}) ${facingMode === 'user' ? 'scaleX(-1)' : ''}`,
                    transition: 'transform 0.1s linear, filter 0.3s ease'
                }}
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 pointer-events-none z-10"></div>
            
             {isRecording && (
                <div className="absolute top-6 z-20 bg-black/50 px-3 py-1 rounded-full flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="font-mono text-sm">{formatDuration(recordingDuration)}</p>
                </div>
            )}
            
            <aside className="absolute left-4 top-1/2 -translate-y-1/2 z-20 space-y-4">
                 <button className="bg-black/40 rounded-full p-3" aria-label="Add text"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                 <button className="bg-black/40 rounded-full p-3" aria-label="Add sticker"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            </aside>
            
            <footer className="absolute bottom-20 left-0 right-0 p-6 flex flex-col items-center z-20">
                {!isRecording && (
                    <div className="w-full overflow-x-auto scrollbar-hide mb-4">
                        <div className="flex space-x-4 justify-center">
                             {filters.map(filter => (
                                <button key={filter.name} onClick={() => setActiveFilter(filter)} className="flex flex-col items-center space-y-1 text-center">
                                    <div className={`w-12 h-12 rounded-md bg-gray-500 bg-cover bg-center border-2 ${activeFilter.name === filter.name ? 'border-white' : 'border-transparent'}`} style={{ backgroundImage: 'url(https://picsum.photos/seed/filter/100/100)', ...filter.style }}></div>
                                    <span className="text-xs font-medium">{filter.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                 <div className="flex items-center justify-between w-full">
                     <button onClick={onSwitchToGallery} className="w-10 h-10 rounded-md overflow-hidden border-2 border-white" disabled={isRecording}>
                        <img src={mockRecents[0].url} alt="gallery preview" className="w-full h-full object-cover" />
                     </button>
                     <button 
                        onMouseUp={handleShutterRelease} onMouseDown={handleShutterPress}
                        onTouchEnd={handleShutterRelease} onTouchStart={handleShutterPress}
                        className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ring-4 ring-black/30 transition-transform ${isRecording ? 'scale-90' : 'scale-100'}`} 
                        aria-label="Take picture or record video"
                    >
                        <div className={`w-16 h-16 bg-white/90 transition-all duration-200 ${isRecording ? 'rounded-2xl w-10 h-10' : 'rounded-full'}`}></div>
                    </button>
                     <button onClick={handleFlipCamera} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center" aria-label="Flip camera" disabled={isRecording}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
}

// --- MAIN COMPONENT ---
const CreateStoryScreen: React.FC<CreateStoryScreenProps> = ({ onClose }) => {
    const [view, setView] = useState<View>('gallery');
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [textOverlay, setTextOverlay] = useState<{ content: string; isEditing: boolean } | null>(null);
    const [activeMode, setActiveMode] = useState<StoryMode>('STORY');
    const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState('Recents');
    const [activeFilter, setActiveFilter] = useState(filters[0]); // This state is for preview only now

    const albumDropdownRef = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (albumDropdownRef.current && !albumDropdownRef.current.contains(event.target as Node)) {
                setIsAlbumDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (textOverlay?.isEditing && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [textOverlay]);

    const handleMediaCaptured = (media: MediaItem) => {
        setSelectedMedia(media);
        setView('preview');
    };

    const handleBackToCamera = () => {
        setSelectedMedia(null);
        setTextOverlay(null);
        setView('camera');
    };
    
    const handleSwitchToGallery = () => setView('gallery');

    const handlePostStory = () => {
        console.log('Posting story:', { media: selectedMedia, text: textOverlay?.content, mode: activeMode, filter: activeFilter.name });
        onClose();
    };

    const displayedMedia = useMemo(() => {
        switch (selectedAlbum) {
            case 'Recents': return mockRecents;
            case 'Camera': return mockCameraImages;
            case 'Screenshots': return mockScreenshots;
            case 'Videos': return mockVideos;
            default: return [];
        }
    }, [selectedAlbum]);

    const handlePreviewTap = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.text-editor')) return;
        if (!textOverlay) {
            setTextOverlay({ content: '', isEditing: true });
        } else if (textOverlay.content === '' && textOverlay.isEditing) {
             setTextOverlay(null);
        } else {
            setTextOverlay(prev => prev ? { ...prev, isEditing: false } : null);
        }
    };

    const GalleryView = () => (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <header className="flex-shrink-0 p-4 flex items-center justify-between">
                <button onClick={onClose} className="p-2" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add to story</h1>
                <div className="w-9 h-9"></div>
            </header>

            <div className="px-4 py-2 flex items-center justify-between">
                <div className="relative" ref={albumDropdownRef}>
                    <button onClick={() => setIsAlbumDropdownOpen(p => !p)} className="flex items-center space-x-1 p-1">
                        <span className="text-lg font-semibold">{selectedAlbum}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isAlbumDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    {isAlbumDropdownOpen && (
                        <div className="absolute top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-30 border border-slate-200 dark:border-slate-700">
                           {mockAlbums.map(album => (
                                <button key={album} onClick={() => { setSelectedAlbum(album); setIsAlbumDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-between items-center">
                                    <span>{album}</span>
                                    {selectedAlbum === album && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                 <button className="p-2 border-2 border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400 rounded-lg" aria-label="Select multiple"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg></button>
            </div>
            <main className="flex-grow overflow-y-auto pt-2 scrollbar-hide">
                <div className="grid grid-cols-3 gap-0.5">
                    <button onClick={() => setView('camera')} className="aspect-square bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center space-y-2 focus:outline-none focus:ring-2 ring-brand-blue ring-offset-2 ring-offset-white dark:ring-offset-slate-900 text-slate-700 dark:text-slate-300">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="font-semibold text-sm">Camera</span>
                    </button>
                    {displayedMedia.map((item) => (
                        <button key={item.id} onClick={() => handleMediaCaptured(item)} className="relative aspect-square bg-slate-200 dark:bg-slate-800 focus:outline-none focus:ring-2 ring-brand-blue ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                            <img src={item.type === 'image' ? item.url : `https://picsum.photos/seed/${item.id}/400/600`} alt={`gallery item ${item.id}`} className="w-full h-full object-cover" />
                            {item.type === 'video' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute bottom-1 right-1 text-white drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );

    const PreviewView = () => (
        <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-black" onClick={handlePreviewTap}>
            <div className={`relative w-full h-full flex items-center justify-center`}>
                <div className={`overflow-hidden ${activeMode === 'POST' ? 'aspect-[4/5] w-full max-w-full' : 'aspect-[9/16] h-full max-h-full'}`}>
                    {selectedMedia?.type === 'image' && <img src={selectedMedia.url} alt="Story preview" className="w-full h-full object-cover" style={activeFilter.style} />}
                    {selectedMedia?.type === 'video' && <video src={selectedMedia.url} autoPlay loop muted className="w-full h-full object-cover" style={activeFilter.style} />}
                </div>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none text-white">
                {textOverlay && !textOverlay.isEditing && textOverlay.content && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold text-center p-2 whitespace-pre-wrap pointer-events-auto text-editor" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }} onClick={(e) => { e.stopPropagation(); setTextOverlay(p => p ? { ...p, isEditing: true } : null); }}>
                        {textOverlay.content}
                    </div>
                )}
                {textOverlay && textOverlay.isEditing && (
                    <textarea ref={textInputRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 text-white text-3xl font-bold text-center p-2 bg-black/40 rounded-lg outline-none border-none resize-none pointer-events-auto text-editor" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }} value={textOverlay.content} onChange={(e) => setTextOverlay(p => p ? { ...p, content: e.target.value } : null)} onBlur={() => setTextOverlay(p => p?.content ? { ...p, isEditing: false } : null)} placeholder="Start typing..."/>
                )}
            </div>

             <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
                <button onClick={handleBackToCamera} className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors" aria-label="Back to camera"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
            </header>
            <footer className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <button onClick={handlePostStory} className="w-full bg-white dark:bg-slate-200 text-black font-bold py-3 px-6 rounded-lg text-base flex items-center justify-center space-x-2 shadow-lg hover:bg-gray-200 dark:hover:bg-slate-300 transition-colors">
                     <span>Share to Your Story</span>
                </button>
            </footer>
        </div>
    );
    
    const renderCamera = () => {
        switch(activeMode) {
            case 'POST':
                return <PostCameraView onMediaCaptured={handleMediaCaptured} onSwitchToGallery={handleSwitchToGallery} />;
            case 'STORY':
                return <StoryReelCameraView mode="STORY" onMediaCaptured={handleMediaCaptured} onSwitchToGallery={handleSwitchToGallery} />;
            case 'REEL':
                return <StoryReelCameraView mode="REEL" onMediaCaptured={handleMediaCaptured} onSwitchToGallery={handleSwitchToGallery} />;
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col text-slate-800 dark:text-slate-200">
            {view === 'gallery' && <GalleryView />}
            {view === 'preview' && <PreviewView />}
            {view === 'camera' && (
                <div className="relative w-full h-full text-white">
                    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 pointer-events-none">
                        <button onClick={() => setView('gallery')} className="pointer-events-auto" aria-label="Close camera">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                    
                    {renderCamera()}
                    
                    {/* Shared Mode Selector Footer */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-6 z-20">
                         <div className="flex space-x-6 text-sm font-semibold">
                            <button onClick={() => setActiveMode('POST')} className={activeMode === 'POST' ? 'text-white' : 'text-gray-400'}>POST</button>
                            <button onClick={() => setActiveMode('STORY')} className={activeMode === 'STORY' ? 'text-white' : 'text-gray-400'}>STORY</button>
                            <button onClick={() => setActiveMode('REEL')} className={activeMode === 'REEL' ? 'text-white' : 'text-gray-400'}>REEL</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateStoryScreen;