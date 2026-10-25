import React from 'react';
import { Flame, ShieldAlert, Plus, ShieldCheck, MapPin, Sparkles, Globe, Moon, Radio, Calendar, Heart } from 'lucide-react';
import { Language } from '../utils/i18n';

interface NavbarProps {
  activeTab: 'map' | 'google_map' | 'garage' | 'models' | 'restoration' | 'forum' | 'gemini_chat' | 'calendar';
  setActiveTab: (tab: 'map' | 'google_map' | 'garage' | 'models' | 'restoration' | 'forum' | 'gemini_chat' | 'calendar') => void;
  onOpenAddVehicle: () => void;
  isModMode: boolean;
  setIsModMode: (val: boolean) => void;
  reportedCount: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  oledMode: boolean;
  setOledMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddVehicle,
  isModMode,
  setIsModMode,
  reportedCount,
  language,
  setLanguage,
  oledMode,
  setOledMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-inherit backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Blaulicht<span className="text-red-500">Nostalgie</span>
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'map'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Treffen-Karte
            </button>
            <button
              onClick={() => setActiveTab('google_map')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'google_map'
                  ? 'text-white bg-slate-800/80 shadow-sm border border-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Google Maps & Museen</span>
            </button>
            <button
              onClick={() => setActiveTab('garage')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'garage'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Mein Oldtimer
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'models'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Modell-Lexikon
            </button>
            <button
              onClick={() => setActiveTab('restoration')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'restoration'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Restauration
            </button>
            <button
              onClick={() => setActiveTab('gemini_chat')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'gemini_chat'
                  ? 'text-white bg-red-600 shadow-md shadow-red-950/50'
                  : 'text-red-400 hover:text-red-300 hover:bg-slate-800/40'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Franz (Sprechfunk)</span>
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'forum'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span>Forum</span>
              {isModMode && reportedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title={`${reportedCount} Meldungen offen`} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'text-white bg-gradient-to-r from-rose-600 to-amber-600 shadow-md shadow-rose-950/50'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-slate-800/40'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span>Kalender 2027</span>
              <span className="text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                -20%
              </span>
            </button>
          </nav>

          {/* Zone 3: Primary actions, language select, OLED mode, Mod toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* OLED Mode Toggle Button */}
            <button
              onClick={() => setOledMode(!oledMode)}
              title={oledMode ? 'OLED True Black Modus aktiv (Klick für Standard)' : 'OLED True Black Modus aktivieren'}
              className={`p-2 rounded-lg border transition-colors ${
                oledMode
                  ? 'bg-black text-emerald-400 border-emerald-500/60 shadow-inner'
                  : 'bg-slate-900 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLanguage('de')}
                className={`px-2 py-1 rounded font-bold transition-colors ${
                  language === 'de' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-bold transition-colors ${
                  language === 'en' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded font-bold transition-colors ${
                  language === 'fr' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FR
              </button>
            </div>

            {/* Moderator toggle */}
            <button
              onClick={() => setIsModMode(!isModMode)}
              title={isModMode ? 'Moderator-Modus aktiv' : 'Moderator-Modus aktivieren'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                isModMode
                  ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 hover:bg-amber-900/50'
                  : 'bg-slate-900 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {isModMode ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mod</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mod</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddVehicle}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Fahrzeug</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-slate-800/80 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'map' ? 'bg-red-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Treffen
          </button>
          <button
            onClick={() => setActiveTab('google_map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'google_map' ? 'bg-red-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Maps & Museen
          </button>
          <button
            onClick={() => setActiveTab('gemini_chat')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'gemini_chat' ? 'bg-red-600 text-white' : 'text-red-400 bg-slate-900'
            }`}
          >
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Franz (Funk)</span>
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Mein Oldtimer
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'models' ? 'bg-red-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Modelle
          </button>
          <button
            onClick={() => setActiveTab('restoration')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'restoration' ? 'bg-red-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Restauration
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'forum' ? 'bg-red-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Forum
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'calendar' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white' : 'text-rose-400 bg-slate-900'
            }`}
          >
            <Heart className="w-3 h-3 fill-current text-rose-400" />
            <span>Kalender 2027 (-20%)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
