import React, { useState, useRef, ReactNode, useCallback } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<any>;
  children: ReactNode;
}

const PULL_THRESHOLD = 85; // pixels needed to pull to trigger refresh

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing) {
      touchStartY.current = e.targetTouches[0].clientY;
    } else {
      touchStartY.current = 0; // Reset if not at top or already refreshing
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current > 0) {
      const currentY = e.targetTouches[0].clientY;
      const distance = currentY - touchStartY.current;
      if (distance > 0) {
        // Prevent browser's default overscroll behavior
        e.preventDefault();
        setPullDistance(distance);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (touchStartY.current === 0) return;

    if (pullDistance > PULL_THRESHOLD) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    touchStartY.current = 0;
  }, [pullDistance, onRefresh]);

  const pullRotation = Math.min(pullDistance, PULL_THRESHOLD) / PULL_THRESHOLD * 360;
  const contentTransform = isRefreshing ? `translateY(60px)` : `translateY(${Math.min(pullDistance, PULL_THRESHOLD * 1.5)}px)`;
  const transitionStyle = { transition: 'transform 0.3s ease' };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-y-auto scrollbar-hide"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center pt-3 z-0"
        style={{ 
          transform: `translateY(${isRefreshing ? 0 : pullDistance - PULL_THRESHOLD}px)`,
          opacity: isRefreshing || pullDistance > 0 ? 1 : 0,
          ...(pullDistance === 0 && !isRefreshing ? {} : transitionStyle)
        }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg">
          <svg 
            className={`h-7 w-7 text-slate-600 dark:text-slate-300 ${isRefreshing ? 'animate-spin' : ''}`} 
            style={{ transform: `rotate(${isRefreshing ? 0 : pullRotation}deg)` }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <div
        style={{ 
          transform: contentTransform,
          ...(pullDistance === 0 || isRefreshing ? transitionStyle : {})
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;