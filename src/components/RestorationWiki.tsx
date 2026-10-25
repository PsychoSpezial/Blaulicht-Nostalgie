import React, { useState } from 'react';
import {
  Wrench,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { RestorationGuide } from '../types';

interface RestorationWikiProps {
  guides: RestorationGuide[];
  onToggleLikeGuide: (id: string) => void;
}

export const RestorationWiki: React.FC<RestorationWikiProps> = ({ guides, onToggleLikeGuide }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeGuideId, setActiveGuideId] = useState<string>(guides[0]?.id || '');

  const categories = [
    'all',
    'Pumpe & Löschtechnik',
    'Motor & Antrieb',
    'H-Kennzeichen & Recht',
    'Karosserie & Lack',
    'Elektrik & Sondersignal',
  ];

  const filteredGuides = guides.filter((g) => {
    if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const activeGuide = guides.find((g) => g.id === activeGuideId) || filteredGuides[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
            <span>Werkstatt-Wissen</span>
            <span aria-hidden="true">·</span>
            <span>Restauration & H-Gutachten</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Restaurationsleitfäden & Praxisberichte
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Praxisgeprüfte Anleitungen von Feuerwehrhistorikern und Meistern: Von der
            Kreiselpumpenüberholung bis zu rechtssicheren Blaulicht- und H-Kennzeichen-Vorgaben nach
            § 23 StVZO.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Thema suchen (z. B. Pumpe, Blaulicht, Deutz, H-Kennzeichen)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Alle Themen' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout: Sidebar of guides + Detailed Guide Reading Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Guide Selector Column */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Leitfäden ({filteredGuides.length})
            </h2>

            {filteredGuides.map((guide) => {
              const isActive = activeGuide?.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setActiveGuideId(guide.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f172a] border-red-500/60 shadow-lg shadow-red-950/20'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="text-red-400 font-semibold">{guide.category}</span>
                    <span className="font-mono tabular-nums">{guide.durationEst}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{guide.summary}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Von {guide.author}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-mono tabular-nums">
                      <ThumbsUp className="w-3 h-3" />
                      {guide.likes}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Guide View */}
          {activeGuide ? (
            <div className="lg:col-span-8 bg-[#0f172a] rounded-xl border border-slate-800 p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-red-950/80 text-red-300 border border-red-800/60 px-2.5 py-0.5 rounded font-semibold">
                      {activeGuide.category}
                    </span>
                    <span className="text-slate-400 font-medium">Schwierigkeit: {activeGuide.difficulty}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {activeGuide.durationEst}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleLikeGuide(activeGuide.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      activeGuide.userLiked
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Hilfreich ({activeGuide.likes})</span>
                  </button>
                </div>

                <h2 className="text-2xl font-extrabold text-white leading-tight">
                  {activeGuide.title}
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  Verfasst von: <strong className="text-slate-300">{activeGuide.author}</strong>
                </p>
              </div>

              {/* Summary lead */}
              <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 text-sm text-slate-300 leading-relaxed">
                {activeGuide.summary}
              </div>

              {/* Step by Step instructions */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-red-400" />
                  <span>Schritt-für-Schritt Arbeitsanleitung</span>
                </h3>

                <div className="space-y-4">
                  {activeGuide.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-2"
                    >
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 flex items-center justify-center text-xs font-mono font-bold border border-red-800/60">
                          {idx + 1}
                        </span>
                        <span>{step.title}</span>
                      </h4>

                      <p className="text-xs leading-relaxed text-slate-300 pl-7 whitespace-pre-line">
                        {step.content}
                      </p>

                      {step.tip && (
                        <div className="ml-7 mt-2 p-2.5 bg-emerald-950/30 rounded border border-emerald-900/50 text-emerald-300 text-xs flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Praxis-Tipp:</strong> {step.tip}
                          </span>
                        </div>
                      )}

                      {step.warning && (
                        <div className="ml-7 mt-2 p-2.5 bg-amber-950/40 rounded border border-amber-900/50 text-amber-300 text-xs flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Wichtiger Sicherheitshinweis:</strong> {step.warning}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parts & Suppliers Advice */}
              <div className="p-5 bg-slate-900 rounded-lg border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-400" />
                  <span>Ersatzteilbeschaffung & Fachbetriebe</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {activeGuide.partsTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p>Wählen Sie links einen Leitfaden aus oder passen Sie die Suchfilter an.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
