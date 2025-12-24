// Fix: Removed incorrect import of 'Group'. The 'Group' interface is defined in this file, and the import was causing a circular dependency.

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    username?: string;
    pronouns?: string;
    bio?: string;
    websiteLink?: string;
    church?: string;
    location?: string;
    denomination?: string;
    email?: string;
    phone?: string;
    birthday?: string;
    followerCount?: number;
    followingCount?: number;
    isProfessional?: boolean;
    professionalCategory?: string;
    displayCategory?: boolean;
    displayContact?: boolean;
}

export type ChatUser = User;

export enum PrayerCategory {
    HEALING = 'Healing',
    GUIDANCE = 'Guidance',
    FAMILY = 'Family',
    THANKSGIVING = 'Thanksgiving',
    OTHER = 'Other',
}

export interface Post {
    id: string;
    userId: string;
    name: string;
    avatarUrl: string;
    followerCount?: number;
    request: string;
    category: PrayerCategory;
    prayerCount: number;
    commentsCount: number;
    sharesCount: number;
    timestamp: Date;
    type: 'text' | 'image' | 'video';
    imageUrl?: string;
    videoUrl?: string;
}

export interface Reel {
    id: string;
    videoUrl: string;
    user: User;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
}

export interface Church {
    id: number | string;
    name: string;
    city: string;
    country: string;
    pincode: string;
    lat: number;
    lng: number;
}

export type EventType = 'online' | 'offline';

export interface Event {
    id: string;
    title: string;
    date: string;
    startTime: Date;
    endTime: Date;
    location: string;
    description: string;
    type: EventType;
    imageUrl: string;
    privacy?: 'public' | 'private';
}

export interface StoryItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    duration: number; // in seconds
}

export interface Story {
    id: string;
    user: User;
    items: StoryItem[];
    timestamp: Date;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    privacy?: 'public' | 'private';
    memberCount: number;
    avatarUrl: string;
    isJoined?: boolean;
}

export interface LiveStream {
    id: string;
    title: string;
    streamer: string;
    streamerAvatar: string;
    viewerCount: number;
    thumbnailUrl: string;
    videoUrl: string;
}