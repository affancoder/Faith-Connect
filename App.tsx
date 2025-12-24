
import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ReelsScreen from './screens/ReelsScreen';
import GlobalPrayerWallScreen from './screens/GlobalPrayerWallScreen';
import EventsScreen from './screens/EventsScreen';
import BottomNavBar from './components/BottomNavBar';
import Sidebar from './components/Sidebar';
import NotificationScreen from './screens/NotificationScreen';
import ChatListScreen from './screens/ChatListScreen';
import UserChatScreen from './screens/UserChatScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import CreateStoryScreen from './screens/CreateStoryScreen';
import ViewStoryScreen from './screens/ViewStoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import FollowersScreen from './screens/FollowersScreen';
import FollowingScreen from './screens/FollowingScreen';
import MapScreen from './screens/MapScreen';
import FriendsScreen from './screens/FriendsScreen';
import BibleScreen from './screens/BibleScreen';
import GroupsScreen from './screens/GroupsScreen';
import GroupMainScreen from './screens/GroupMainScreen';
import LiveStreamsScreen from './screens/LiveStreamsScreen';
import UserEventsScreen from './screens/UserEventsScreen';
import GoLiveScreen from './screens/GoLiveScreen';
import ViewLiveStreamScreen from './screens/ViewLiveStreamScreen';
import WebViewScreen from './screens/WebViewScreen';
import ViewPostModal from './components/ViewPostModal';
import InsightsScreen from './screens/InsightsScreen'; // New import
import { User, ChatUser, Story, Group, Event, LiveStream, Post } from './types';

// Settings Screens
import AccountDetailsScreen from './screens/settings/AccountDetailsScreen';
import PasswordSecurityScreen from './screens/settings/PasswordSecurityScreen';
import PrayerRemindersScreen from './screens/settings/PrayerRemindersScreen';
import LanguageScreen from './screens/settings/LanguageScreen';
import MentionsScreen from './screens/settings/MentionsScreen';
import BlockedAccountsScreen from './screens/settings/BlockedAccountsScreen';
import ActivityStatusScreen from './screens/settings/ActivityStatusScreen';
import NotificationsPostsScreen from './screens/settings/NotificationsPostsScreen';
import NotificationsFollowScreen from './screens/settings/NotificationsFollowScreen';
import NotificationsMessagesScreen from './screens/settings/NotificationsMessagesScreen';
import NotificationsLiveReelsScreen from './screens/settings/NotificationsLiveReelsScreen';
import NotificationsEventsScreen from './screens/settings/NotificationsEventsScreen';
import ThemeScreen from './screens/settings/ThemeScreen';
import AccessibilityScreen from './screens/settings/AccessibilityScreen';
import DefaultBibleVersionScreen from './screens/settings/DefaultBibleVersionScreen';
import MutedAccountsScreen from './screens/settings/MutedAccountsScreen';
import DataUsageScreen from './screens/settings/DataUsageScreen';
import HelpCenterScreen from './screens/settings/HelpCenterScreen';
import CommunityGuidelinesScreen from './screens/settings/CommunityGuidelinesScreen';
import AboutScreen from './screens/settings/AboutScreen';

// Help Center Content Screens
import HelpGettingStartedScreen from './screens/settings/help/GettingStartedScreen';
import HelpManagingAccountScreen from './screens/settings/help/ManagingAccountScreen';
import HelpCreatingRequestScreen from './screens/settings/help/CreatingRequestScreen';
import HelpPrivacySafetyScreen from './screens/settings/help/PrivacySafetyScreen';
import HelpReportProblemScreen from './screens/settings/help/ReportProblemScreen';
import HelpGiveFeedbackScreen from './screens/settings/help/GiveFeedbackScreen';


type Tab = 'home' | 'discover' | 'reels' | 'global' | 'events' | 'profile';
type Modal = 'profile' | 'editProfile' | 'settings' | 'followers' | 'following' | 'notifications' | 'chatList' | 'chat' | 'createPost' | 'createStory' | 'viewStory' | 'map' | 'groupMain' | 'userEvents' | 'eventDetail' | 'goLive' | 'viewLiveStream' | 'webView' | 'viewPost' | 'insights';
type SidebarScreen = 'friends' | 'bible' | 'groups' | 'live';
type SettingsScreenType = 'accountDetails' | 'passwordAndSecurity' | 'prayerReminders' | 'language' | 'mentions' | 'blockedAccounts' | 'activityStatus' | 'notificationsPosts' | 'notificationsFollow' | 'notificationsMessages' | 'notificationsLiveReels' | 'notificationsEvents' | 'theme' | 'accessibility' | 'defaultBibleVersion' | 'mutedAccounts' | 'dataUsage' | 'helpCenter' | 'communityGuidelines' | 'about'
    | 'helpGettingStarted' | 'helpManagingAccount' | 'helpCreatingRequest' | 'helpPrivacySafety' | 'helpReportProblem' | 'helpGiveFeedback';
export type Theme = 'light' | 'dark' | 'system';


const initialUser: User = {
    id: 'currentuser',
    name: 'Jane Doe',
    avatarUrl: 'https://i.pravatar.cc/100?u=currentuser',
    username: 'jane_doe',
    pronouns: 'She/Her',
    bio: 'Lover of faith, family, and fellowship. Seeking to spread positivity and prayer one day at a time.',
    websiteLink: 'https://www.faithconnect.app',
    church: 'Hillsong Church',
    location: 'New York, USA',
    denomination: 'Non-denominational',
    email: 'jane.doe@example.com',
    phone: '+1-5551234567',
    birthday: '1990-01-01',
    followerCount: 15300,
    followingCount: 210,
    // Add professional account properties for demonstration
    isProfessional: true,
    professionalCategory: 'Christian Artist',
    displayCategory: true,
    displayContact: true,
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>(initialUser);


    // Modal States
    const [openModals, setOpenModals] = useState<Set<Modal>>(new Set());
    const [openSidebarScreen, setOpenSidebarScreen] = useState<SidebarScreen | null>(null);
    const [openSettingsScreen, setOpenSettingsScreen] = useState<SettingsScreenType | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
    const [viewingLiveStream, setViewingLiveStream] = useState<LiveStream | null>(null);
    const [viewingPost, setViewingPost] = useState<Post | null>(null);
    const [activeChatUser, setActiveChatUser] = useState<ChatUser | null>(null);
    const [storyPlaylist, setStoryPlaylist] = useState<{ stories: Story[], currentIndex: number } | null>(null);
    const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
    const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
    
    // Follow state management
    const [following, setFollowing] = useState<Set<string>>(new Set(['kenji', 'pastor', 'anya', 'grace', 'samuel', 'hope']));

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        // Apply theme on initial run and on `theme` change
        updateTheme();

        // Save preference to local storage
        localStorage.setItem('theme', theme);

        // Listen for OS theme changes
        mediaQuery.addEventListener('change', updateTheme);

        return () => {
            mediaQuery.removeEventListener('change', updateTheme);
        };
    }, [theme]);


    const handleFollow = useCallback((userId: string) => {
        setFollowing(prev => {
            const newFollowing = new Set(prev);
            if (newFollowing.has(userId)) {
                newFollowing.delete(userId);
            } else {
                newFollowing.add(userId);
            }
            return newFollowing;
        });
    }, []);

    const openModal = useCallback((modal: Modal) => {
        setOpenModals(prev => new Set(prev).add(modal));
    }, []);

    const closeModal = useCallback((modal: Modal) => {
        setOpenModals(prev => {
            const newModals = new Set(prev);
            newModals.delete(modal);
            return newModals;
        });
        if (modal === 'viewStory') setStoryPlaylist(null);
        if (modal === 'groupMain') setViewingGroup(null);
        if (modal === 'eventDetail') setViewingEvent(null);
        if (modal === 'viewLiveStream') setViewingLiveStream(null);
        if (modal === 'webView') setWebViewUrl(null);
        if (modal === 'viewPost') setViewingPost(null);
    }, []);

    const handleUpdateUser = useCallback((updatedData: Partial<User>) => {
        setCurrentUser(prevUser => ({ ...prevUser, ...updatedData }));
    }, []);

    const handleSaveProfile = useCallback((updatedData: Partial<User>) => {
        handleUpdateUser(updatedData);
        closeModal('editProfile');
    }, [handleUpdateUser, closeModal]);
    
    const handleOpenSidebarScreen = (screen: SidebarScreen) => {
        setOpenSidebarScreen(screen);
        setIsSidebarOpen(false);
    };

    const handleCloseSidebarScreen = () => {
        setOpenSidebarScreen(null);
        setIsSidebarOpen(true);
    };

    const handleOpenSettingsScreen = useCallback((screen: SettingsScreenType) => {
        setOpenSettingsScreen(screen);
    }, []);

    const handleCloseSettingsScreen = useCallback(() => {
        setOpenSettingsScreen(null);
    }, []);

    const handleOpenUserEvents = () => {
        openModal('userEvents');
        setIsSidebarOpen(false);
    };

    const handleOpenUserProfile = useCallback((user: User) => {
        if (user.id === currentUser.id) {
            setActiveTab('profile');
        } else {
            setViewingUser(user);
            openModal('profile');
        }
    }, [openModal, currentUser.id]);

    const handleOpenGroup = useCallback((group: Group) => {
        setViewingGroup(group);
        openModal('groupMain');
    }, [openModal]);

    const handleOpenEventDetail = useCallback((event: Event) => {
        setViewingEvent(event);
        openModal('eventDetail');
    }, [openModal]);
    
    const handleOpenGoLive = useCallback(() => {
        openModal('goLive');
        handleCloseSidebarScreen();
    }, [openModal]);

    const handleOpenViewLiveStream = useCallback((stream: LiveStream) => {
        setViewingLiveStream(stream);
        openModal('viewLiveStream');
        handleCloseSidebarScreen();
    }, [openModal]);
    
    const handleOpenWebView = useCallback((url: string) => {
        setWebViewUrl(url);
        openModal('webView');
    }, [openModal]);

    const handleOpenPost = useCallback((post: Post) => {
        setViewingPost(post);
        openModal('viewPost');
    }, [openModal]);
    
    const handleOpenInsights = useCallback(() => {
        openModal('insights');
    }, [openModal]);

    const handleOpenHelpCenter = useCallback(() => {
        setIsSidebarOpen(false);
        openModal('settings');
        handleOpenSettingsScreen('helpCenter');
    }, [openModal, handleOpenSettingsScreen]);

    const handleOpenAbout = useCallback(() => {
        setIsSidebarOpen(false);
        openModal('settings');
        handleOpenSettingsScreen('about');
    }, [openModal, handleOpenSettingsScreen]);

    const handleOpenChat = useCallback((user: ChatUser) => {
        setActiveChatUser(user);
        openModal('chat');
    }, [openModal]);

    const handleViewStory = useCallback((story: Story, allStories: Story[]) => {
        const startIndex = allStories.findIndex(s => s.id === story.id);
        if (startIndex !== -1) {
            setStoryPlaylist({ stories: allStories, currentIndex: startIndex });
            openModal('viewStory');
            setViewedStories(prev => new Set(prev).add(story.id));
        }
    }, [openModal]);

    const handleNextUserStory = useCallback(() => {
        setStoryPlaylist(prev => {
            if (!prev) return null;
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= prev.stories.length) {
                closeModal('viewStory');
                return null;
            }
            const nextStory = prev.stories[nextIndex];
            setViewedStories(p => new Set(p).add(nextStory.id));
            return { ...prev, currentIndex: nextIndex };
        });
    }, [closeModal]);

    const handlePrevUserStory = useCallback(() => {
        setStoryPlaylist(prev => {
            if (!prev) return null;
            const prevIndex = prev.currentIndex - 1;
            if (prevIndex < 0) {
                return prev; 
            }
            return { ...prev, currentIndex: prevIndex };
        });
    }, []);

    const renderScreen = () => {
        switch (activeTab) {
            case 'home':
                return <HomeScreen 
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                    onOpenNotifications={() => openModal('notifications')}
                    onOpenChatList={() => openModal('chatList')}
                    onOpenCreatePost={() => openModal('createPost')}
                    onOpenCreateStory={() => openModal('createStory')}
                    onViewStory={handleViewStory}
                    onOpenMap={() => openModal('map')}
                    following={following}
                    onFollow={handleFollow}
                    viewedStories={viewedStories}
                />;
            case 'discover':
                return <DiscoverScreen />;
            case 'reels':
                return <ReelsScreen onOpenUserProfile={handleOpenUserProfile} following={following} onFollow={handleFollow} />;
            case 'global':
                return <GlobalPrayerWallScreen 
                    following={following} 
                    onFollow={handleFollow} 
                    currentUser={currentUser}
                    onOpenUserProfile={handleOpenUserProfile}
                />;
            case 'events':
                return <EventsScreen onViewEvent={handleOpenEventDetail} />;
            case 'profile':
                return <ProfileScreen 
                    user={currentUser}
                    isCurrentUser={true}
                    onEditProfile={() => openModal('editProfile')}
                    onOpenSettings={() => openModal('settings')}
                    onOpenFollowers={() => openModal('followers')}
                    onOpenFollowing={() => openModal('following')}
                    following={following}
                    onFollow={handleFollow}
                    onOpenInsights={handleOpenInsights}
                />;
            default:
                return <HomeScreen 
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                    onOpenNotifications={() => openModal('notifications')}
                    onOpenChatList={() => openModal('chatList')}
                    onOpenCreatePost={() => openModal('createPost')}
                    onOpenCreateStory={() => openModal('createStory')}
                    onViewStory={handleViewStory}
                    onOpenMap={() => openModal('map')}
                    following={following}
                    onFollow={handleFollow}
                    viewedStories={viewedStories}
                />;
        }
    };
    
    const renderSidebarScreen = () => {
        switch (openSidebarScreen) {
            case 'friends': return <FriendsScreen onClose={handleCloseSidebarScreen} />;
            case 'bible': return <BibleScreen onClose={handleCloseSidebarScreen} />;
            case 'groups': return <GroupsScreen onClose={handleCloseSidebarScreen} onViewGroup={handleOpenGroup} />;
            case 'live': return <LiveStreamsScreen onClose={handleCloseSidebarScreen} onGoLive={handleOpenGoLive} onViewStream={handleOpenViewLiveStream} />;
            default: return null;
        }
    }

    const renderSettingsScreen = () => {
        if (!openSettingsScreen) return null;
        const handleBackToHelpCenter = () => handleOpenSettingsScreen('helpCenter');

        switch(openSettingsScreen) {
            case 'accountDetails': return <AccountDetailsScreen onBack={handleCloseSettingsScreen} user={currentUser} onSave={handleUpdateUser} />;
            case 'passwordAndSecurity': return <PasswordSecurityScreen onBack={handleCloseSettingsScreen} />;
            case 'prayerReminders': return <PrayerRemindersScreen onBack={handleCloseSettingsScreen} />;
            case 'language': return <LanguageScreen onBack={handleCloseSettingsScreen} />;
            case 'mentions': return <MentionsScreen onBack={handleCloseSettingsScreen} />;
            case 'blockedAccounts': return <BlockedAccountsScreen onBack={handleCloseSettingsScreen} />;
            case 'activityStatus': return <ActivityStatusScreen onBack={handleCloseSettingsScreen} />;
            case 'notificationsPosts': return <NotificationsPostsScreen onBack={handleCloseSettingsScreen} />;
            case 'notificationsFollow': return <NotificationsFollowScreen onBack={handleCloseSettingsScreen} />;
            case 'notificationsMessages': return <NotificationsMessagesScreen onBack={handleCloseSettingsScreen} />;
            case 'notificationsLiveReels': return <NotificationsLiveReelsScreen onBack={handleCloseSettingsScreen} />;
            case 'notificationsEvents': return <NotificationsEventsScreen onBack={handleCloseSettingsScreen} />;
            case 'theme': return <ThemeScreen onBack={handleCloseSettingsScreen} currentTheme={theme} onThemeChange={setTheme} />;
            case 'accessibility': return <AccessibilityScreen onBack={handleCloseSettingsScreen} />;
            case 'defaultBibleVersion': return <DefaultBibleVersionScreen onBack={handleCloseSettingsScreen} />;
            case 'mutedAccounts': return <MutedAccountsScreen onBack={handleCloseSettingsScreen} />;
            case 'dataUsage': return <DataUsageScreen onBack={handleCloseSettingsScreen} />;
            case 'helpCenter': return <HelpCenterScreen onBack={handleCloseSettingsScreen} onNavigate={handleOpenSettingsScreen} />;
            case 'communityGuidelines': return <CommunityGuidelinesScreen onBack={handleCloseSettingsScreen} />;
            case 'about': return <AboutScreen onBack={handleCloseSettingsScreen} onOpenWebView={handleOpenWebView} />;
            
            // Help Screens
            case 'helpGettingStarted': return <HelpGettingStartedScreen onBack={handleBackToHelpCenter} />;
            case 'helpManagingAccount': return <HelpManagingAccountScreen onBack={handleBackToHelpCenter} />;
            case 'helpCreatingRequest': return <HelpCreatingRequestScreen onBack={handleBackToHelpCenter} />;
            case 'helpPrivacySafety': return <HelpPrivacySafetyScreen onBack={handleBackToHelpCenter} onNavigate={handleOpenSettingsScreen} />;
            case 'helpReportProblem': return <HelpReportProblemScreen onBack={handleBackToHelpCenter} />;
            case 'helpGiveFeedback': return <HelpGiveFeedbackScreen onBack={handleBackToHelpCenter} />;

            default: return null;
        }
    };

    return (
        <div className="h-full w-full max-w-md mx-auto bg-slate-50 dark:bg-slate-900 shadow-lg flex flex-col">
            <div className="flex-grow flex flex-col min-h-0">
                {renderScreen()}
            </div>
            <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Sidebar */}
            {isSidebarOpen && <Sidebar 
                onClose={() => setIsSidebarOpen(false)} 
                onNavigateToProfile={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
                onOpenSettings={() => { openModal('settings'); setIsSidebarOpen(false); }}
                onOpenFriends={() => handleOpenSidebarScreen('friends')}
                onOpenMap={() => { openModal('map'); setIsSidebarOpen(false); }}
                onOpenBible={() => handleOpenSidebarScreen('bible')}
                onOpenGroups={() => handleOpenSidebarScreen('groups')}
                onOpenUserEvents={handleOpenUserEvents}
                onOpenLiveStreams={() => handleOpenSidebarScreen('live')}
                onOpenHelpCenter={handleOpenHelpCenter}
                onOpenAbout={handleOpenAbout}
                onOpenWebView={(url) => { handleOpenWebView(url); setIsSidebarOpen(false); }}
             />}
            {renderSidebarScreen()}

            {/* Modals */}
            {openModals.has('notifications') && <NotificationScreen onClose={() => closeModal('notifications')} onOpenUserProfile={handleOpenUserProfile} onOpenPost={handleOpenPost} />}
            {openModals.has('chatList') && <ChatListScreen onClose={() => closeModal('chatList')} onOpenChat={handleOpenChat} />}
            {openModals.has('chat') && activeChatUser && <UserChatScreen user={activeChatUser} onClose={() => closeModal('chat')} />}
            {openModals.has('createPost') && <CreatePostScreen onClose={() => closeModal('createPost')} />}
            {openModals.has('createStory') && <CreateStoryScreen onClose={() => closeModal('createStory')} />}
            {openModals.has('viewStory') && storyPlaylist && <ViewStoryScreen story={storyPlaylist.stories[storyPlaylist.currentIndex]} onClose={() => closeModal('viewStory')} onNextStory={handleNextUserStory} onPrevStory={handlePrevUserStory} onOpenUserProfile={handleOpenUserProfile}/>}
            {openModals.has('profile') && viewingUser && <ProfileScreen user={viewingUser} isCurrentUser={false} onBack={() => closeModal('profile')} onEditProfile={()=>{}} onOpenSettings={()=>{}} onOpenFollowers={() => {}} onOpenFollowing={() => {}} following={following} onFollow={handleFollow}/>}
            {openModals.has('editProfile') && <EditProfileScreen user={currentUser} onClose={() => closeModal('editProfile')} onSave={handleSaveProfile} />}
            {openModals.has('settings') && <SettingsScreen onClose={() => closeModal('settings')} onNavigate={handleOpenSettingsScreen} />}
            {openModals.has('followers') && <FollowersScreen onClose={() => closeModal('followers')} />}
            {openModals.has('following') && <FollowingScreen onClose={() => closeModal('following')} />}
            {openModals.has('map') && <MapScreen onClose={() => closeModal('map')} />}
            {openModals.has('groupMain') && viewingGroup && <GroupMainScreen group={viewingGroup} onClose={() => closeModal('groupMain')} />}
            {openModals.has('userEvents') && <UserEventsScreen onClose={() => closeModal('userEvents')} onViewEvent={handleOpenEventDetail} />}
            {openModals.has('goLive') && <GoLiveScreen onClose={() => closeModal('goLive')} />}
            {openModals.has('viewLiveStream') && viewingLiveStream && <ViewLiveStreamScreen stream={viewingLiveStream} onClose={() => closeModal('viewLiveStream')} />}
            {openModals.has('webView') && webViewUrl && <WebViewScreen url={webViewUrl} onClose={() => closeModal('webView')} />}
            {openModals.has('viewPost') && viewingPost && <ViewPostModal post={viewingPost} onClose={() => closeModal('viewPost')} following={following} onFollow={handleFollow} onOpenUserProfile={handleOpenUserProfile} />}
            {openModals.has('insights') && <InsightsScreen onClose={() => closeModal('insights')} />}


            {renderSettingsScreen()}

        </div>
    );
};

export default App;