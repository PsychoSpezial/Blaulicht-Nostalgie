import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  Plus,
  Send,
  CheckCircle,
  AlertOctagon,
  X,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Award,
  Pin,
} from 'lucide-react';
import { ForumThread, ForumPost, ModerationReport } from '../types';

interface CommunityForumProps {
  threads: ForumThread[];
  reports: ModerationReport[];
  isModMode: boolean;
  setIsModMode: (val: boolean) => void;
  onVotePost: (threadId: string, postId: string, type: 'up' | 'down') => void;
  onReportPost: (threadId: string, postId: string, reason: string, reporter: string) => void;
  onAddThread: (category: ForumThread['category'], title: string, content: string, author: string) => void;
  onAddReply: (threadId: string, content: string, author: string) => void;
  onModeratePost: (postId: string, action: 'hide' | 'unhide' | 'dismiss_report') => void;
  onBanUser: (authorName: string, shouldBan: boolean) => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  threads,
  reports,
  isModMode,
  setIsModMode,
  onVotePost,
  onReportPost,
  onAddThread,
  onAddReply,
  onModeratePost,
  onBanUser,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [forumView, setForumView] = useState<'discussions' | 'moderation_desk'>('discussions');

  // Modals
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [reportingPost, setReportingPost] = useState<{
    threadId: string;
    postId: string;
    author: string;
  } | null>(null);

  // Form states
  const [reportReason, setReportReason] = useState('Spam oder unerlaubte Werbung');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterName, setReporterName] = useState('Florian_Mitglied');

  const [newThreadCategory, setNewThreadCategory] =
    useState<ForumThread['category']>('Technik & Motoren');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadAuthor, setNewThreadAuthor] = useState('Martin_Feuerwehr63');

  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('Oldtimer_Schrauber');

  const categories: ('all' | ForumThread['category'])[] = [
    'all',
    'Technik & Motoren',
    'Restauration & Karosserie',
    'H-Kennzeichen & Zulassung',
    'Treffen & Sternfahrten',
    'Ersatzteilbörse',
  ];

  const filteredThreads = threads.filter((t) => {
    if (selectedCategoryId !== 'all' && t.category !== selectedCategoryId) return false;
    return true;
  });

  const activeThread = threads.find((t) => t.id === activeThreadId) || filteredThreads[0];

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    onAddThread(newThreadCategory, newThreadTitle.trim(), newThreadContent.trim(), newThreadAuthor.trim() || 'Feuerwehrfreund');

    setNewThreadTitle('');
    setNewThreadContent('');
    setShowNewThreadModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    onAddReply(activeThread.id, replyText.trim(), replyAuthor.trim() || 'Kamerad');
    setReplyText('');
  };

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost) return;

    const fullReason = reportDetails.trim()
      ? `${reportReason}: ${reportDetails.trim()}`
      : reportReason;

    onReportPost(reportingPost.threadId, reportingPost.postId, fullReason, reporterName.trim() || 'Anonymes Mitglied');

    setReportingPost(null);
    setReportDetails('');
  };

  const openReportsCount = reports.filter((r) => r.status === 'offen').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
              <span>Fachforum</span>
              <span aria-hidden="true">·</span>
              <span>Enthusiasten & Restauratoren</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Feuerwehr-Oldtimer Diskussionsforum
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Fachlicher Austausch, Schraubertipps und Problemlösungen. Hochwertige Antworten
              steigen durch Upvotes auf.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Moderation Desk view switcher if mod mode */}
            {isModMode && (
              <button
                onClick={() =>
                  setForumView(forumView === 'discussions' ? 'moderation_desk' : 'discussions')
                }
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  forumView === 'moderation_desk'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-amber-950/40 text-amber-300 border-amber-600/50 hover:bg-amber-900/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Mod-Pult ({openReportsCount} offen)</span>
              </button>
            )}

            <button
              onClick={() => setShowNewThreadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium text-xs rounded-lg shadow transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Neues Thema starten</span>
            </button>
          </div>
        </div>

        {/* View 1: Moderation Desk (Requested by User) */}
        {forumView === 'moderation_desk' && isModMode ? (
          <div className="bg-[#0f172a] rounded-xl border border-amber-700/50 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-950/80 rounded-lg border border-amber-600/40 text-amber-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Foren-Moderationspult & Gemeldete Beiträge
                  </h2>
                  <p className="text-xs text-slate-400">
                    Prüfen Sie gemeldete Beiträge, entfernen Sie Spam und sperren Sie auffällige Benutzer.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setForumView('discussions')}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-900 rounded border border-slate-700"
              >
                Zurück zum Forum
              </button>
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p>Keine gemeldeten Beiträge vorhanden. Das Forum ist sauber.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((rep) => {
                  // Find thread and post
                  const th = threads.find((t) => t.id === rep.threadId);
                  const post = th?.posts.find((p) => p.id === rep.postId);

                  return (
                    <div
                      key={rep.id}
                      className="p-5 bg-slate-900 rounded-lg border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${
                              rep.status === 'nutzer_gesperrt' || rep.status === 'gelöscht'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}
                          >
                            Status: {rep.status}
                          </span>
                          <span className="text-slate-400">Gemeldet am {rep.timestamp}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-400">
                            Durch: <strong className="text-slate-300">{rep.reportedBy}</strong>
                          </span>
                        </div>

                        <div className="text-slate-400">
                          Thema: <strong className="text-slate-300">{rep.threadTitle}</strong>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="p-3 bg-red-950/20 border border-red-900/40 rounded text-xs text-red-300">
                        <strong>Meldegrund:</strong> {rep.reason}
                      </div>

                      {/* Original post preview */}
                      {post && (
                        <div className="p-3.5 bg-black/40 rounded border border-slate-800 text-xs">
                          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px]">
                            <span>
                              Verfasser:{' '}
                              <strong className="text-white">{post.author}</strong> ({post.authorRole})
                            </span>
                            <span>
                              Bewertung: Netto {post.upvotes - post.downvotes} ({post.upvotes} Up / {post.downvotes} Down)
                            </span>
                          </div>
                          <p className="text-slate-300 italic">"{post.content}"</p>
                        </div>
                      )}

                      {/* Moderator Action Buttons (Explicit user requirement!) */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        {post?.isHidden ? (
                          <button
                            onClick={() => onModeratePost(rep.postId, 'unhide')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Beitrag wieder einblenden</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onModeratePost(rep.postId, 'hide')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded text-xs font-medium"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Beitrag ausblenden / sperren</span>
                          </button>
                        )}

                        <button
                          onClick={() => onModeratePost(rep.postId, 'dismiss_report')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Meldung abweisen (Geprüft)</span>
                        </button>

                        {/* Ban / Unban User Toggle */}
                        {post?.isAuthorBanned ? (
                          <button
                            onClick={() => onBanUser(post.author, false)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded text-xs font-medium"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Benutzer {post.author} entsperren</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onBanUser(post?.author || rep.reportedAuthor, true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium shadow"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Benutzer {post?.author || rep.reportedAuthor} sperren</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* View 2: Normal Discussion Forum */
          <div className="space-y-6">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryId(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategoryId === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'Alle Themenbereiche' : cat}
                </button>
              ))}
            </div>

            {/* Split layout: Threads list + Thread conversation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Threads List */}
              <div className="lg:col-span-4 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Themen ({filteredThreads.length})
                </div>

                {filteredThreads.map((th) => {
                  const isActive = activeThread?.id === th.id;
                  const totalNetScore = th.posts.reduce(
                    (acc, p) => acc + (p.upvotes - p.downvotes),
                    0
                  );

                  return (
                    <div
                      key={th.id}
                      onClick={() => setActiveThreadId(th.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0f172a] border-red-500/60 shadow-lg shadow-red-950/20'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="text-red-400 font-semibold">{th.category}</span>
                        {th.isPinned && (
                          <span className="flex items-center gap-1 text-amber-400 font-medium">
                            <Pin className="w-3 h-3" /> Angepinnt
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                        {th.title}
                      </h3>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          Von <strong className="text-slate-400">{th.author}</strong>
                        </span>
                        <div className="flex items-center gap-2 font-mono tabular-nums">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
                            {th.posts.length}
                          </span>
                          <span className="text-emerald-400">+{totalNetScore}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Thread Discussion */}
              {activeThread ? (
                <div className="lg:col-span-8 bg-[#0f172a] rounded-xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  {/* Thread Header */}
                  <div className="border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2 text-xs text-red-400 font-semibold uppercase">
                      <span>{activeThread.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono tabular-nums">
                        Erstellt am {activeThread.createdAt}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                      {activeThread.title}
                    </h2>
                  </div>

                  {/* Posts List */}
                  <div className="space-y-4">
                    {activeThread.posts.map((post) => {
                      const netScore = post.upvotes - post.downvotes;
                      const isHighQuality = netScore >= 15;

                      return (
                        <div
                          key={post.id}
                          className={`p-4 sm:p-5 rounded-lg border transition-all ${
                            post.isAuthorBanned || post.isHidden
                              ? 'bg-red-950/20 border-red-900/40 opacity-70'
                              : isHighQuality
                              ? 'bg-slate-900/90 border-amber-600/30'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          {/* Post Header with Author & Moderation State */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5">
                              {/* Avatar circle */}
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                                {post.author.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-bold text-white">{post.author}</span>
                                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                    {post.authorRole}
                                  </span>
                                  {isHighQuality && (
                                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium bg-amber-950/60 border border-amber-700/50 px-1.5 py-0.5 rounded">
                                      <Award className="w-3 h-3" />
                                      Top-Antwort
                                    </span>
                                  )}
                                  {post.isAuthorBanned && (
                                    <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded font-bold">
                                      Gesperrter Benutzer
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  {post.createdAt}
                                </div>
                              </div>
                            </div>

                            {/* Report Button (Explicit requirement!) */}
                            {!post.isAuthorBanned && !post.isHidden && (
                              <button
                                onClick={() =>
                                  setReportingPost({
                                    threadId: activeThread.id,
                                    postId: post.id,
                                    author: post.author,
                                  })
                                }
                                className={`flex items-center gap-1 text-[11px] transition-colors p-1 rounded ${
                                  post.isReported
                                    ? 'text-amber-400 bg-amber-950/50'
                                    : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                                }`}
                                title="Diesen Beitrag der Moderation melden"
                              >
                                <Flag className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">
                                  {post.isReported ? 'Gemeldet' : 'Melden'}
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Post Content */}
                          {post.isHidden ? (
                            <div className="p-3 bg-red-950/30 rounded border border-red-900/50 text-xs text-red-300 italic">
                              [Dieser Beitrag wurde von der Moderation wegen Verstoßes gegen die Richtlinien ausgeblendet]
                            </div>
                          ) : post.isAuthorBanned ? (
                            <div className="p-3 bg-slate-950 rounded border border-red-900/30 text-xs text-slate-400 italic">
                              <span className="text-red-400 block font-bold mb-1">
                                [Benutzer {post.author} wurde gesperrt]
                              </span>
                              <span className="line-through">{post.content}</span>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                              {post.content}
                            </p>
                          )}

                          {/* Voting Bar: Upvote & Downvote (Explicit requirement!) */}
                          {!post.isHidden && !post.isAuthorBanned && (
                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
                                {/* Upvote */}
                                <button
                                  onClick={() => onVotePost(activeThread.id, post.id, 'up')}
                                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                                    post.userVote === 'up'
                                      ? 'bg-emerald-600 text-white'
                                      : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                                  }`}
                                  title="Hilfreicher Fachbeitrag (Upvote)"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span className="font-mono tabular-nums">{post.upvotes}</span>
                                </button>

                                <span
                                  className={`font-mono text-xs font-bold px-1 tabular-nums ${
                                    netScore > 0
                                      ? 'text-emerald-400'
                                      : netScore < 0
                                      ? 'text-red-400'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  {netScore > 0 ? `+${netScore}` : netScore}
                                </span>

                                {/* Downvote */}
                                <button
                                  onClick={() => onVotePost(activeThread.id, post.id, 'down')}
                                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                                    post.userVote === 'down'
                                      ? 'bg-red-600 text-white'
                                      : 'text-slate-400 hover:text-red-400 hover:bg-slate-800'
                                  }`}
                                  title="Unpassend / Nicht hilfreich (Downvote)"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                  <span className="font-mono tabular-nums">{post.downvotes}</span>
                                </button>
                              </div>

                              {/* Mod quick action */}
                              {isModMode && (
                                <button
                                  onClick={() => onModeratePost(post.id, 'hide')}
                                  className="text-[11px] text-slate-500 hover:text-red-400"
                                >
                                  Als Mod ausblenden
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Form */}
                  <form
                    onSubmit={handleSendReply}
                    className="pt-4 border-t border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Antwort verfassen</span>
                      <div className="flex items-center gap-2">
                        <span>Ihr Name:</span>
                        <input
                          type="text"
                          value={replyAuthor}
                          onChange={(e) => setReplyAuthor(e.target.value)}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      required
                      placeholder="Teilen Sie Ihre Erfahrungen oder technischen Ratschläge..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Antwort veröffentlichen</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="lg:col-span-8 p-12 text-center text-slate-400">
                  <p>Wählen Sie links ein Thema aus oder erstellen Sie ein neues.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Report Post (User requirement) */}
        {reportingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-500" />
                  <span>Beitrag der Moderation melden</span>
                </h3>
                <button
                  onClick={() => setReportingPost(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Beitrag von <strong className="text-white">{reportingPost.author}</strong> melden.
                Unsere Moderatoren prüfen jeden Hinweis zeitnah.
              </p>

              <form onSubmit={submitReport} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Meldegrund *</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Spam oder unerlaubte Werbung">Spam oder unerlaubte Werbung</option>
                    <option value="Beleidigender oder herabwürdigender Inhalt">
                      Beleidigender oder herabwürdigender Inhalt
                    </option>
                    <option value="Falschinformation bezüglich Sicherheits- oder Löschtechnik">
                      Falschinformation bezüglich Sicherheits- oder Löschtechnik
                    </option>
                    <option value="Urheberrechtsverletzung bei Bild/Text">
                      Urheberrechtsverletzung bei Bild/Text
                    </option>
                    <option value="Off-Topic oder Störung der Diskussion">
                      Off-Topic oder Störung der Diskussion
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Zusätzliche Erläuterung (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Weitere Details für das Moderatorenteam..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ihr Benutzername</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setReportingPost(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                  >
                    Meldung einreichen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New Thread */}
        {showNewThreadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-500" />
                  <span>Neues Diskussionsthema erstellen</span>
                </h3>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Themenbereich *</label>
                  <select
                    value={newThreadCategory}
                    onChange={(e) =>
                      setNewThreadCategory(e.target.value as ForumThread['category'])
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Technik & Motoren">Technik & Motoren</option>
                    <option value="Restauration & Karosserie">Restauration & Karosserie</option>
                    <option value="H-Kennzeichen & Zulassung">H-Kennzeichen & Zulassung</option>
                    <option value="Treffen & Sternfahrten">Treffen & Sternfahrten</option>
                    <option value="Ersatzteilbörse">Ersatzteilbörse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Titel der Frage *</label>
                  <input
                    type="text"
                    required
                    placeholder="Präziser Titel (z. B. Bremsventil Mercedes Kurzhauber undicht)"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Detaillierte Beschreibung *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Schildern Sie das Problem, Fahrzeugtyp, Baujahr und was bereits probiert wurde..."
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ihr Benutzername</label>
                  <input
                    type="text"
                    value={newThreadAuthor}
                    onChange={(e) => setNewThreadAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                  >
                    Thema veröffentlichen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
