import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Church } from '../types';
import { findChurchesByQuery } from '../services/geminiService';

declare const L: any; // Using Leaflet from a global script tag

interface MapScreenProps {
    onClose: () => void;
}

// --- Helper Functions ---
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// --- Sub-Components ---
const MapView: React.FC<{ onMapReady: (map: any) => void; }> = ({ onMapReady }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
            center: [20, 0], // Generic starting point
            zoom: 2,
            zoomControl: false,
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }).addTo(map);

        onMapReady(map);

        return () => {
            map.remove();
        };
    }, [onMapReady]);

    return <div ref={mapRef} className="w-full h-full" />;
};

const RouteOverviewPanel: React.FC<{ distance: number; onStart: () => void; onCancel: () => void; }> = ({ distance, onStart, onCancel }) => (
    <div className="absolute bottom-0 left-0 right-0 z-[1001] bg-white dark:bg-slate-800 p-4 rounded-t-lg shadow-2xl animate-slide-in-up">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Route to Destination</h3>
        <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold">{distance.toFixed(1)} km</span>
            <span className="text-slate-400 dark:text-slate-500"> &middot; Approx. {(distance * 1.5).toFixed(0)} min drive</span>
        </p>
        <div className="flex space-x-2 mt-4">
            <button onClick={onStart} className="flex-1 bg-brand-blue text-white font-bold py-3 rounded-lg">Start</button>
            <button onClick={onCancel} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-lg">Cancel</button>
        </div>
    </div>
);

const NavigationUI: React.FC<{ instruction: any; onEnd: () => void; }> = ({ instruction, onEnd }) => (
     <div className="absolute top-0 left-0 right-0 z-[1001] p-4 space-y-2 animate-fade-in">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-2xl">
            <div className="flex items-center space-x-4">
                <div className="text-4xl">{instruction.icon}</div>
                <div>
                    <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-200">{instruction.distance}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">{instruction.text}</p>
                </div>
            </div>
        </div>
        <button onClick={onEnd} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">End</button>
    </div>
);

// --- Main Component ---

const MapScreen: React.FC<MapScreenProps> = ({ onClose }) => {
    const [locationStatus, setLocationStatus] = useState<'prompt' | 'loading' | 'granted' | 'denied'>('prompt');
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [churches, setChurches] = useState<Church[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Navigation state
    const [navigationMode, setNavigationMode] = useState<'off' | 'route-overview' | 'navigating'>('off');
    const [navigationTarget, setNavigationTarget] = useState<Church | null>(null);
    const [mockInstructions, setMockInstructions] = useState<any[]>([]);
    const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

    const mapInstanceRef = useRef<any>(null);
    const markerLayerRef = useRef<any>(null); // For church/user markers
    const routeLayerRef = useRef<any>(null);  // For the route line and nav markers
    const userNavMarkerRef = useRef<any>(null); // For the user's marker during navigation
    const locationWatchIdRef = useRef<number | null>(null);

    const displayedChurches = useMemo(() => churches, [churches]);

    const handleRequestLocation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permissionStatus.state === 'denied') {
                setError("Location access was denied. Please enable it in your browser settings to use this feature.");
                setLocationStatus('denied');
                setIsLoading(false);
                return;
            }

            setLocationStatus('loading');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserCoords({ lat: latitude, lng: longitude });
                    setLocationStatus('granted');
                },
                (err) => {
                    setError(`Error getting location: ${err.message}.`);
                    setLocationStatus('denied');
                    setIsLoading(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } catch (e) {
            setError("Could not request location permission.");
            setLocationStatus('denied');
            setIsLoading(false);
        }
    }, []);

    // Fetch churches based on search or location
    useEffect(() => {
        const fetchChurches = (query: string) => {
            setIsLoading(true);
            setError(null);
            findChurchesByQuery(query).then(results => {
                setChurches(results);
                if (results.length === 0) setError("No churches found for your search.");
            }).catch(() => setError("An error occurred while searching."))
              .finally(() => setIsLoading(false));
        };
        
        if (searchQuery.trim()) {
            const handler = setTimeout(() => fetchChurches(`churches related to ${searchQuery}`), 500);
            return () => clearTimeout(handler);
        } else if (locationStatus === 'granted' && userCoords) {
            fetchChurches(`churches near latitude ${userCoords.lat} longitude ${userCoords.lng}`);
        }
    }, [searchQuery, locationStatus, userCoords]);
    
    // Function to start planning a route
    const handleStartRoutePlanning = useCallback((church: Church) => {
        if (!userCoords) {
            setError("Your current location is not available to plan a route.");
            return;
        }
        setNavigationTarget(church);
        setNavigationMode('route-overview');
        setSearchQuery(''); // Clear search when planning a route
    }, [userCoords]);

    // Handle map setup and popup listeners
    const handleMapReady = useCallback((map: any) => {
        mapInstanceRef.current = map;
        if (!markerLayerRef.current) markerLayerRef.current = L.layerGroup().addTo(map);
        if (!routeLayerRef.current) routeLayerRef.current = L.layerGroup().addTo(map);
        
        map.on('popupopen', (e: any) => {
            const content = e.popup.getContent();
            const btn = e.popup._container.querySelector('.directions-btn');
            if (btn) {
                btn.onclick = () => {
                    const churchId = btn.getAttribute('data-church-id');
                    const targetChurch = displayedChurches.find(c => String(c.id) === churchId);
                    if (targetChurch) handleStartRoutePlanning(targetChurch);
                };
            }
        });

    }, [displayedChurches, handleStartRoutePlanning]);
    
    // Effect to manage navigation state changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !userCoords) return;
        
        // Cleanup function for stopping navigation processes
        const stopNavigationProcesses = () => {
            if (locationWatchIdRef.current) {
                navigator.geolocation.clearWatch(locationWatchIdRef.current);
                locationWatchIdRef.current = null;
            }
            routeLayerRef.current?.clearLayers();
            userNavMarkerRef.current = null;
        };

        if (navigationMode === 'route-overview' && navigationTarget) {
            stopNavigationProcesses(); // Ensure previous state is cleared
            routeLayerRef.current.clearLayers();
            
            const routeLine = L.polyline([[userCoords.lat, userCoords.lng], [navigationTarget.lat, navigationTarget.lng]], { color: '#5F85B0', weight: 5 });
            routeLayerRef.current.addLayer(routeLine);
            map.fitBounds(routeLine.getBounds(), { padding: [100, 100] });

            // Mock instructions
            setMockInstructions([
                { text: `Head towards ${navigationTarget.name}`, distance: '200 m', icon: '⬆️' },
                { text: 'In 500m, turn left onto Main St', distance: '500 m', icon: '⬅️' },
                { text: 'Continue for 1.2 km', distance: '1.2 km', icon: '⬆️' },
                { text: 'Your destination will be on the right', distance: '100 m', icon: '➡️' },
                { text: 'You have arrived', distance: '0 m', icon: '🏁' },
            ]);
            setCurrentInstructionIndex(0);
        } else if (navigationMode === 'navigating') {
            map.setZoom(17);
            
            // Start watching location
            locationWatchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newCoords: [number, number] = [latitude, longitude];
                    
                    if (userNavMarkerRef.current) {
                        userNavMarkerRef.current.setLatLng(newCoords);
                    } else {
                        userNavMarkerRef.current = L.marker(newCoords, { icon: L.divIcon({ className: 'user-location-marker', html: '<div class="user-location-pulse"></div><div class="user-location-dot"></div>' }) }).addTo(routeLayerRef.current);
                    }
                    map.panTo(newCoords);
                },
                () => setError("Lost location signal."),
                { enableHighAccuracy: true }
            );

            // Simulate instruction progress
            const instructionInterval = setInterval(() => {
                setCurrentInstructionIndex(prev => {
                    if (prev < mockInstructions.length - 1) return prev + 1;
                    clearInterval(instructionInterval);
                    return prev;
                });
            }, 7000);
            return () => clearInterval(instructionInterval);

        } else if (navigationMode === 'off') {
            stopNavigationProcesses();
            setNavigationTarget(null);
        }
        
        return stopNavigationProcesses; // Cleanup on unmount or mode change
    }, [navigationMode, navigationTarget, userCoords, mockInstructions.length]);
    
    // Update map markers when data changes (only in 'off' mode)
    useEffect(() => {
        const map = mapInstanceRef.current;
        const markerLayer = markerLayerRef.current;
        if (!map || !markerLayer || navigationMode !== 'off') return;

        markerLayer.clearLayers();
        const markersForBounds: any[] = [];
        // FIX: The original icon definition might fail due to shadow image issues.
        // This simpler definition is more robust and ensures the red pins are visible.
        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });


        displayedChurches.forEach(church => {
            const marker = L.marker([church.lat, church.lng], { icon: redIcon })
                .bindPopup(`<b>${church.name}</b><br/><button class="directions-btn" data-church-id="${church.id}">Directions</button>`);
            markerLayer.addLayer(marker);
            markersForBounds.push(marker);
        });
        
        if (markersForBounds.length > 0) {
            map.fitBounds(L.featureGroup(markersForBounds).getBounds(), { padding: [50, 50], maxZoom: 15 });
        } else if (userCoords) {
            map.setView([userCoords.lat, userCoords.lng], 13);
        }

    }, [displayedChurches, userCoords, navigationMode]);

    const handleRecenter = () => {
        if (mapInstanceRef.current && userCoords) mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 15);
    };

    const renderMapContent = () => (
        <div className="w-full h-full relative">
            <MapView onMapReady={handleMapReady} />
            {navigationMode === 'off' && (
                <header className="absolute top-0 left-0 right-0 z-[1000] p-4">
                    <div className="relative">
                        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, city, country..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:text-slate-200" />
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                    </div>
                </header>
            )}
            <button onClick={handleRecenter} className="absolute bottom-24 right-4 z-[1000] bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg" aria-label="Recenter map">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            {navigationMode === 'route-overview' && navigationTarget && userCoords && (
                <RouteOverviewPanel 
                    distance={getDistance(userCoords.lat, userCoords.lng, navigationTarget.lat, navigationTarget.lng)}
                    onStart={() => setNavigationMode('navigating')}
                    onCancel={() => setNavigationMode('off')}
                />
            )}
            {navigationMode === 'navigating' && (
                <NavigationUI 
                    instruction={mockInstructions[currentInstructionIndex]}
                    onEnd={() => setNavigationMode('off')}
                />
            )}
        </div>
    );
    
    const renderPermissionView = (title: string, message: string, buttonText: string, onButtonClick: () => void) => (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900">
            <span className="text-6xl mb-4" role="img" aria-label="map pin">📍</span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">{message}</p>
            <button onClick={onButtonClick} className="mt-6 bg-brand-blue text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-opacity-90">
                {buttonText}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm z-10">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="w-10"></div> {/* Spacer for centering title */}
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200 text-center">Churches Near You</h1>
                    <button onClick={onClose} className="p-2 w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" aria-label="Close map">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </header>
            <main className="flex-grow overflow-hidden relative">
                {isLoading && navigationMode === 'off' && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[2000] flex items-center justify-center">
                         <div className="flex items-center space-x-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-blue"></div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Searching...</span>
                        </div>
                    </div>
                )}
                 {error && <p className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg shadow-md z-[2000]">{error}</p>}
                 {locationStatus === 'prompt' && renderPermissionView("Find churches near you", "To see nearby churches, please allow Faith Connect to access your device's location.", "Allow Access", handleRequestLocation)}
                 {locationStatus === 'loading' && <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div></div>}
                 {locationStatus === 'denied' && renderPermissionView("Location Access Denied", "You've denied location access. To find nearby churches, please enable location permissions for this site in your browser settings.", "Try Again", handleRequestLocation)}
                 {locationStatus === 'granted' && renderMapContent()}
            </main>
        </div>
    );
};

export default MapScreen;