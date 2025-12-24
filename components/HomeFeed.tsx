
import React from 'react';
import { Post } from '../types';
import PostWall from './PrayerWall';
import PullToRefresh from './PullToRefresh';

interface HomeFeedProps {
    posts: Post[];
    onPray: (id: string) => void;
    onRefresh: () => Promise<any>;
    following: Set<string>;
    onFollow: (userId: string) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ posts, onPray, onRefresh, following, onFollow }) => {
    return (
        <PullToRefresh onRefresh={onRefresh}>
            <div className="py-4">
                <PostWall 
                    posts={posts} 
                    onPray={onPray} 
                    cardType="main"
                    following={following}
                    onFollow={onFollow}
                />
            </div>
        </PullToRefresh>
    );
};

export default HomeFeed;
