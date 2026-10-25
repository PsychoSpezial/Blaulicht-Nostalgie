import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Calendar,
  Building2,
  Clock,
  ExternalLink,
  Users,
  Search,
  Filter,
  X,
  ChevronRight,
  Info,
  Flame,
} from 'lucide-react';
import { FireEvent, FireMuseum } from '../types';

interface GoogleMapExplorerProps {
  events: FireEvent[];
  museums: FireMuseum[];
  onSelectEvent?: (id: string) => void;
}

export const GoogleMapExplorer: React.FC<GoogleMapExplorerProps> = ({
  events,
  museums,
  onSelectEvent,
}) => {
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyBichEZmPkBjCACZxaH2ydQAedHWjy71Fg';

  const [filterType, setFilterType] = useState<'all' | 'events' | 'museums'>('all');
  const [search, setSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>('evt-1');
  const [selectedItemType, setSelectedItemType] = useState<'event' | 'museum'>('event');

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (filterType === 'museums') return [];
    return events.filter((e) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.locationCity.toLowerCase().includes(q) ||
        e.locationState.toLowerCase().includes(q) ||
        e.expectedModels.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [events, filterType, search]);

  // Filtered Museums
  const filteredMuseums = useMemo(() => {
    if (filterType === 'events') return [];
    return museums.filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.locationCity.toLowerCase().includes(q) ||
        m.locationState.toLowerCase().includes(q) ||
        m.highlightExhibits.some((ex) => ex.toLowerCase().includes(q))
      );
    });
  }, [museums, filterType, search]);

  const activeEvent = events.find((e) => e.id === selectedItemId && selectedItemType === 'event');
  const activeMuseum = museums.find((m) => m.id === selectedItemId && selectedItemType === 'museum');

  // Default Center (Fulda / Germany center)
  const defaultCenter = { lat: 50.5512, lng: 9.6834 };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Top Filter Bar */}
      <div className="bg-[#0f172a] border-b border-slate-800 p-4 shrink-0 shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Google Maps – Treffen & Museen</span>
              <span className="text-xs font-normal text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-400">
                {filteredEvents.length + filteredMuseums.length} Standorte
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Interaktive Übersicht über europäische Oldtimertreffen und permanente Feuerwehrmuseen
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Type selector */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterType === 'all'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Alle Standorte ({events.length + museums.length})
              </button>
              <button
                onClick={() => setFilterType('events')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                  filterType === 'events'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🚒 Treffen</span>
                <span className="font-mono tabular-nums">({events.length})</span>
              </button>
              <button
                onClick={() => setFilterType('museums')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                  filterType === 'museums'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🏛️ Museen</span>
                <span className="font-mono tabular-nums">({museums.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Stadt, Museum oder Treffen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container: Map + Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Google Map View */}
        <div className="flex-1 relative min-h-[360px] lg:min-h-full">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={6}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              {/* Event Markers (Red Pins) */}
              {filteredEvents.map((ev) => {
                const isSelected = selectedItemId === ev.id && selectedItemType === 'event';
                return (
                  <React.Fragment key={`ev-${ev.id}`}>
                    <AdvancedMarker
                      position={{ lat: ev.coordinates[0], lng: ev.coordinates[1] }}
                      onClick={() => {
                        setSelectedItemId(ev.id);
                        setSelectedItemType('event');
                      }}
                      title={ev.title}
                    >
                      <Pin
                        background={isSelected ? '#ef4444' : '#b91c1c'}
                        borderColor="#f87171"
                        glyphColor="#ffffff"
                        glyph="🚒"
                      />
                    </AdvancedMarker>

                    {isSelected && (
                      <InfoWindow
                        position={{ lat: ev.coordinates[0], lng: ev.coordinates[1] }}
                        onCloseClick={() => setSelectedItemId(null)}
                      >
                        <div className="p-2 max-w-xs text-slate-900 text-xs">
                          <div className="text-[10px] font-bold text-red-600 uppercase">
                            Oldtimer-Treffen · {ev.locationState}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">{ev.title}</h4>
                          <p className="text-slate-600 mt-1 font-mono">{ev.dateStart}</p>
                          <p className="text-slate-700 mt-1 line-clamp-2">{ev.description}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Museum Markers (Gold Pins) */}
              {filteredMuseums.map((mus) => {
                const isSelected = selectedItemId === mus.id && selectedItemType === 'museum';
                return (
                  <React.Fragment key={`mus-${mus.id}`}>
                    <AdvancedMarker
                      position={{ lat: mus.coordinates[0], lng: mus.coordinates[1] }}
                      onClick={() => {
                        setSelectedItemId(mus.id);
                        setSelectedItemType('museum');
                      }}
                      title={mus.name}
                    >
                      <Pin
                        background={isSelected ? '#f59e0b' : '#d97706'}
                        borderColor="#fde047"
                        glyphColor="#ffffff"
                        glyph="🏛️"
                      />
                    </AdvancedMarker>

                    {isSelected && (
                      <InfoWindow
                        position={{ lat: mus.coordinates[0], lng: mus.coordinates[1] }}
                        onCloseClick={() => setSelectedItemId(null)}
                      >
                        <div className="p-2 max-w-xs text-slate-900 text-xs">
                          <div className="text-[10px] font-bold text-amber-600 uppercase">
                            Feuerwehrmuseum · {mus.locationCity}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">{mus.name}</h4>
                          <p className="text-slate-600 mt-1">{mus.openingHours}</p>
                          <p className="text-slate-700 mt-1 line-clamp-2">{mus.description}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </React.Fragment>
                );
              })}
            </Map>
          </APIProvider>

          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 shadow-xl pointer-events-none hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-red-300"></span>
              <span>Oldtimer-Treffen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span>
              <span>Feuerwehrmuseen</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Details or Location List */}
        <div className="w-full lg:w-[420px] bg-[#0c1017] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-72 lg:h-full z-10 overflow-y-auto">
          {activeEvent ? (
            /* Active Event Detail */
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Oldtimer-Treffen
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{activeEvent.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeEvent.locationCity} ({activeEvent.locationState}, {activeEvent.country})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItemId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{activeEvent.dateStart} bis {activeEvent.dateEnd}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{activeEvent.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-400 shrink-0" />
                  <span>ca. {activeEvent.attendeeVehiclesCount} gemeldete Fahrzeuge</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
                {activeEvent.description}
              </p>

              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Erwartete Modelle
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeEvent.expectedModels.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {activeEvent.websiteUrl && (
                <a
                  href={activeEvent.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  <span>Webseite besuchen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : activeMuseum ? (
            /* Active Museum Detail */
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Feuerwehrmuseum
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{activeMuseum.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeMuseum.locationCity} ({activeMuseum.locationState}, {activeMuseum.country})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItemId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeMuseum.imageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src={activeMuseum.imageUrl}
                    alt={activeMuseum.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{activeMuseum.openingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{activeMuseum.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Eintritt: {activeMuseum.admissionFee}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
                {activeMuseum.description}
              </p>

              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Besondere Exponate & Highlights
                </h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {activeMuseum.highlightExhibits.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>

              {activeMuseum.websiteUrl && (
                <a
                  href={activeMuseum.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium pt-2"
                >
                  <span>Museums-Webseite besuchen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            /* Explorer List */
            <div className="divide-y divide-slate-800/80">
              <div className="p-3 bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Standorte ({filteredEvents.length + filteredMuseums.length})
              </div>

              {/* Events in list */}
              {filteredEvents.map((ev) => (
                <div
                  key={`list-ev-${ev.id}`}
                  onClick={() => {
                    setSelectedItemId(ev.id);
                    setSelectedItemType('event');
                  }}
                  className="p-3.5 hover:bg-slate-900/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="text-red-400 font-bold uppercase">🚒 Treffen</span>
                    <span>{ev.locationCity}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ev.description}</p>
                </div>
              ))}

              {/* Museums in list */}
              {filteredMuseums.map((mus) => (
                <div
                  key={`list-mus-${mus.id}`}
                  onClick={() => {
                    setSelectedItemId(mus.id);
                    setSelectedItemType('museum');
                  }}
                  className="p-3.5 hover:bg-slate-900/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="text-amber-400 font-bold uppercase">🏛️ Museum</span>
                    <span>{mus.locationCity}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    {mus.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{mus.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
