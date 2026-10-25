import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { GoogleMapExplorer } from './components/GoogleMapExplorer';
import { VehicleGarage } from './components/VehicleGarage';
import { ModelDatabase } from './components/ModelDatabase';
import { RestorationWiki } from './components/RestorationWiki';
import { CommunityForum } from './components/CommunityForum';
import { GeminiExpertChat } from './components/GeminiExpertChat';
import { CalendarPreorder } from './components/CalendarPreorder';
import {
  FireEvent,
  FireMuseum,
  VehicleProfile,
  RestorationGuide,
  ForumThread,
  ModerationReport,
  EventPhoto,
} from './types';
import {
  INITIAL_EVENTS,
  INITIAL_MUSEUMS,
  INITIAL_VEHICLE_PROFILES,
  MODEL_DATABASE,
  RESTORATION_GUIDES,
  INITIAL_FORUM_THREADS,
  INITIAL_MODERATION_REPORTS,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'map' | 'google_map' | 'garage' | 'models' | 'restoration' | 'forum' | 'gemini_chat' | 'calendar'
  >('map');
  const [isModMode, setIsModMode] = useState(false);
  const [isOpenAddVehicleModal, setIsOpenAddVehicleModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>('evt-1');
  const [hasQuotaExceeded, setHasQuotaExceeded] = useState(false);
  const [language, setLanguage] = useState<'de' | 'en' | 'fr'>('de');
  const [oledMode, setOledMode] = useState(false);
  const [showCalendarBanner, setShowCalendarBanner] = useState(true);

  // Listener for Google Maps Quota
  useEffect(() => {
    const handleQuota = () => setHasQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Persistent state with localStorage
  const [events, setEvents] = useState<FireEvent[]>(() => {
    try {
      const saved = localStorage.getItem('florian_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EVENTS;
  });

  const [museums] = useState<FireMuseum[]>(INITIAL_MUSEUMS);

  const [vehicles, setVehicles] = useState<VehicleProfile[]>(() => {
    try {
      const saved = localStorage.getItem('florian_vehicles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VEHICLE_PROFILES;
  });

  const [guides, setGuides] = useState<RestorationGuide[]>(() => {
    try {
      const saved = localStorage.getItem('florian_guides');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return RESTORATION_GUIDES;
  });

  const [threads, setThreads] = useState<ForumThread[]>(() => {
    try {
      const saved = localStorage.getItem('florian_threads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FORUM_THREADS;
  });

  const [reports, setReports] = useState<ModerationReport[]>(() => {
    try {
      const saved = localStorage.getItem('florian_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MODERATION_REPORTS;
  });

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('florian_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('florian_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('florian_guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem('florian_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('florian_reports', JSON.stringify(reports));
  }, [reports]);

  // Event Handlers
  const handleAddEvent = (newEventData: Omit<FireEvent, 'id' | 'photos'>) => {
    const newEvent: FireEvent = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      photos: [],
    };
    setEvents((prev) => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);
  };

  const handleAddPhotoToEvent = (
    eventId: string,
    photoData: Omit<EventPhoto, 'id' | 'uploadedAt'>
  ) => {
    const newPhoto: EventPhoto = {
      ...photoData,
      id: `p-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            photos: [newPhoto, ...ev.photos],
          };
        }
        return ev;
      })
    );
  };

  // Vehicle Garage Handlers
  const handleAddVehicle = (newVeh: Omit<VehicleProfile, 'id'>) => {
    const created: VehicleProfile = {
      ...newVeh,
      id: `veh-${Date.now()}`,
    };
    setVehicles((prev) => [created, ...prev]);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Guide Handlers
  const handleToggleLikeGuide = (id: string) => {
    setGuides((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const isLiked = !g.userLiked;
          return {
            ...g,
            userLiked: isLiked,
            likes: isLiked ? g.likes + 1 : g.likes - 1,
          };
        }
        return g;
      })
    );
  };

  // Forum Handlers
  const handleVotePost = (threadId: string, postId: string, type: 'up' | 'down') => {
    setThreads((prev) =>
      prev.map((th) => {
        if (th.id !== threadId) return th;
        return {
          ...th,
          posts: th.posts.map((p) => {
            if (p.id !== postId) return p;

            let newUpvotes = p.upvotes;
            let newDownvotes = p.downvotes;
            let newVote: 'up' | 'down' | undefined = type;

            if (p.userVote === type) {
              newVote = undefined;
              if (type === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
              if (type === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
            } else {
              if (p.userVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
              if (p.userVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);

              if (type === 'up') newUpvotes += 1;
              if (type === 'down') newDownvotes += 1;
            }

            return {
              ...p,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: newVote,
            };
          }),
        };
      })
    );
  };

  const handleReportPost = (
    threadId: string,
    postId: string,
    reason: string,
    reporter: string
  ) => {
    const thread = threads.find((t) => t.id === threadId);
    const post = thread?.posts.find((p) => p.id === postId);

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id !== threadId) return th;
        return {
          ...th,
          posts: th.posts.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              isReported: true,
              reportReason: reason,
            };
          }),
        };
      })
    );

    const newReport: ModerationReport = {
      id: `rep-${Date.now()}`,
      postId,
      threadId,
      threadTitle: thread?.title || 'Unbekanntes Thema',
      reportedAuthor: post?.author || 'Unbekannt',
      reportedBy: reporter,
      reason,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'offen',
    };

    setReports((prev) => [newReport, ...prev]);
  };

  const handleModeratePost = (
    postId: string,
    action: 'hide' | 'unhide' | 'dismiss_report'
  ) => {
    setThreads((prev) =>
      prev.map((th) => ({
        ...th,
        posts: th.posts.map((p) => {
          if (p.id !== postId) return p;
          if (action === 'hide') {
            return { ...p, isHidden: true };
          }
          if (action === 'unhide') {
            return { ...p, isHidden: false };
          }
          if (action === 'dismiss_report') {
            return { ...p, isReported: false };
          }
          return p;
        }),
      }))
    );

    setReports((prev) =>
      prev.map((r) => {
        if (r.postId === postId) {
          return {
            ...r,
            status:
              action === 'hide'
                ? 'gelöscht'
                : action === 'dismiss_report'
                ? 'geprüft'
                : r.status,
          };
        }
        return r;
      })
    );
  };

  const handleBanUser = (authorName: string, shouldBan: boolean) => {
    setThreads((prev) =>
      prev.map((th) => ({
        ...th,
        posts: th.posts.map((p) => {
          if (p.author === authorName) {
            return {
              ...p,
              isAuthorBanned: shouldBan,
              isHidden: shouldBan ? true : p.isHidden,
            };
          }
          return p;
        }),
      }))
    );

    setReports((prev) =>
      prev.map((r) => {
        if (r.reportedAuthor === authorName) {
          return {
            ...r,
            status: shouldBan ? 'nutzer_gesperrt' : 'geprüft',
          };
        }
        return r;
      })
    );
  };

  const handleAddThread = (
    category: ForumThread['category'],
    title: string,
    content: string,
    author: string
  ) => {
    const newThreadId = `th-${Date.now()}`;
    const newThread: ForumThread = {
      id: newThreadId,
      category,
      title,
      author,
      createdAt: new Date().toISOString().split('T')[0],
      posts: [
        {
          id: `p-${Date.now()}`,
          threadId: newThreadId,
          author,
          authorRole: 'Enthusiast',
          avatarSeed: author.toLowerCase(),
          content,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          upvotes: 1,
          downvotes: 0,
          userVote: 'up',
          isReported: false,
          isHidden: false,
          isAuthorBanned: false,
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
  };

  const handleAddReply = (threadId: string, content: string, author: string) => {
    const newPost: ForumThread['posts'][0] = {
      id: `p-${Date.now()}`,
      threadId,
      author,
      authorRole: 'Restaurator',
      avatarSeed: author.toLowerCase(),
      content,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      upvotes: 0,
      downvotes: 0,
      isReported: false,
      isHidden: false,
      isAuthorBanned: false,
    };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          return {
            ...th,
            posts: [...th.posts, newPost],
          };
        }
        return th;
      })
    );
  };

  const openReportsCount = reports.filter((r) => r.status === 'offen').length;

  return (
    <div className={`min-h-screen ${oledMode ? 'bg-[#000000]' : 'bg-[#090d16]'} text-slate-100 flex flex-col font-sans`}>
      {/* Quota Banner if Google Maps demo key quota exceeded */}
      {hasQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddVehicle={() => setIsOpenAddVehicleModal(true)}
        isModMode={isModMode}
        setIsModMode={setIsModMode}
        reportedCount={openReportsCount}
        language={language}
        setLanguage={setLanguage}
        oledMode={oledMode}
        setOledMode={setOledMode}
      />

      {/* Calendar Pre-order Announcement Ribbon */}
      {showCalendarBanner && activeTab !== 'calendar' && (
        <div className="bg-gradient-to-r from-rose-950 via-red-950 to-amber-950 border-b border-rose-500/40 px-4 py-2.5 text-xs text-white flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide shrink-0 shadow">
              Sonderaktion 2027
            </span>
            <span className="truncate text-slate-200">
              Exklusiver <strong className="text-white">Oldtimer Feuerwehr Erotikkalender 2027 der Vorstandsfrauen</strong> – jetzt zum Frühbucher-Sonderpreis (<strong>19,90 €</strong> statt 24,90 €) sichern! 100% Reinerlös für den Restaurationsfonds.
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('calendar')}
              className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md cursor-pointer"
            >
              Jetzt vorbestellen (-20%)
            </button>
            <button
              onClick={() => setShowCalendarBanner(false)}
              className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10"
              title="Banner schließen"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <InteractiveMap
            events={events}
            onAddEvent={handleAddEvent}
            onAddPhotoToEvent={handleAddPhotoToEvent}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
          />
        )}

        {activeTab === 'google_map' && (
          <GoogleMapExplorer
            events={events}
            museums={museums}
            onSelectEvent={(id) => {
              setSelectedEventId(id);
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'gemini_chat' && <GeminiExpertChat />}

        {activeTab === 'garage' && (
          <VehicleGarage
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            isOpenAddModal={isOpenAddVehicleModal}
            setIsOpenAddModal={setIsOpenAddVehicleModal}
          />
        )}

        {activeTab === 'models' && <ModelDatabase models={MODEL_DATABASE} />}

        {activeTab === 'restoration' && (
          <RestorationWiki
            guides={guides}
            onToggleLikeGuide={handleToggleLikeGuide}
          />
        )}

        {activeTab === 'forum' && (
          <CommunityForum
            threads={threads}
            reports={reports}
            isModMode={isModMode}
            setIsModMode={setIsModMode}
            onVotePost={handleVotePost}
            onReportPost={handleReportPost}
            onAddThread={handleAddThread}
            onAddReply={handleAddReply}
            onModeratePost={handleModeratePost}
            onBanUser={handleBanUser}
          />
        )}

        {activeTab === 'calendar' && <CalendarPreorder />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Blaulicht Nostalgie</span>
            <span aria-hidden="true">·</span>
            <span>Gemeinschaft zur Erhaltung historischer Feuerwehrfahrzeuge & Technikgeschichte</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Deutschland · Österreich · Schweiz · Europa</span>
            <span aria-hidden="true">·</span>
            <span>DIN 14502 / DIN 14530 Traditionsarchiv</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
