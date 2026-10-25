import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Camera,
  Upload,
  Plus,
  ExternalLink,
  X,
  Filter,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { FireEvent, EventPhoto } from '../types';

interface InteractiveMapProps {
  events: FireEvent[];
  onAddEvent: (newEvent: Omit<FireEvent, 'id' | 'photos'>) => void;
  onAddPhotoToEvent: (eventId: string, photo: Omit<EventPhoto, 'id' | 'uploadedAt'>) => void;
  selectedEventId?: string;
  setSelectedEventId: (id: string | undefined) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  events,
  onAddEvent,
  onAddPhotoToEvent,
  selectedEventId,
  setSelectedEventId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false);

  // Modals
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  const [activePhotoPreview, setActivePhotoPreview] = useState<string | null>(null);

  // Upload photo form state
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUploader, setPhotoUploader] = useState('');
  const [photoYear, setPhotoYear] = useState<number>(2025);

  // New Event form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDateStart, setNewEventDateStart] = useState('');
  const [newEventDateEnd, setNewEventDateEnd] = useState('');
  const [newEventCity, setNewEventCity] = useState('');
  const [newEventState, setNewEventState] = useState('Bayern');
  const [newEventCountry, setNewEventCountry] = useState('Deutschland');
  const [newEventAddress, setNewEventAddress] = useState('');
  const [newEventLat, setNewEventLat] = useState('50.1109');
  const [newEventLng, setNewEventLng] = useState('8.6821');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('');
  const [newEventModels, setNewEventModels] = useState<string[]>([
    'Magirus-Deutz Rundhauber',
    'Mercedes-Benz Kurzhauber LF 16',
  ]);

  // Available unique regions
  const allRegions = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.locationState));
    return Array.from(set).sort();
  }, [events]);

  // Available unique models across events
  const allExpectedModels = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.expectedModels.forEach((m) => set.add(m)));
    return Array.from(set).sort();
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          ev.title.toLowerCase().includes(q) ||
          ev.locationCity.toLowerCase().includes(q) ||
          ev.address.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q) ||
          ev.expectedModels.some((m) => m.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && ev.locationState !== selectedRegion) {
        return false;
      }

      // Model filter
      if (selectedModel !== 'all' && !ev.expectedModels.includes(selectedModel)) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 'all') {
        const monthNum = ev.dateStart.split('-')[1];
        if (monthNum !== selectedMonth) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedRegion, selectedModel, selectedMonth]);

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId);
  }, [events, selectedEventId]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center roughly around Germany / Central Europe
      const map = L.map(mapContainerRef.current, {
        center: [50.5, 10.2],
        zoom: 6,
        minZoom: 4,
        maxZoom: 18,
      });

      // Dark Matter CartoDB tiles for an ultra-sleek dark aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers with filteredEvents
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    filteredEvents.forEach((ev) => {
      const isSelected = ev.id === selectedEventId;

      // Custom SVG Marker Icon with fire truck badge
      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div class="flex items-center justify-center w-9 h-9 rounded-full ${
            isSelected
              ? 'bg-red-500 ring-4 ring-red-500/40 scale-110 shadow-lg shadow-red-500/50'
              : 'bg-red-700/90 hover:bg-red-600 hover:scale-105'
          } text-white font-bold text-xs border border-red-300/40 transition-all shadow-md">
            <span>${ev.attendeeVehiclesCount || '🚒'}</span>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45 border-r border-b border-red-300/30"></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-fire-marker',
        html: markerHtml,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker(ev.coordinates, { icon }).addTo(map);

      marker.on('click', () => {
        setSelectedEventId(ev.id);
      });

      markersRef.current[ev.id] = marker;
    });

    // If only one event filtered or selected, pan to it smoothly
    if (selectedEventId && markersRef.current[selectedEventId]) {
      const selEv = events.find((e) => e.id === selectedEventId);
      if (selEv) {
        map.panTo(selEv.coordinates, { animate: true, duration: 0.6 });
      }
    }
  }, [filteredEvents, selectedEventId, setSelectedEventId, events]);

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    const ev = events.find((e) => e.id === id);
    if (ev && mapInstanceRef.current) {
      mapInstanceRef.current.setView(ev.coordinates, 9, { animate: true });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitPhotoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !photoUrl.trim()) return;

    onAddPhotoToEvent(selectedEventId, {
      url: photoUrl,
      caption: photoCaption.trim() || 'Erinnerungsfoto',
      uploaderName: photoUploader.trim() || 'Oldtimer-Kamerad',
      year: photoYear || 2026,
    });

    setPhotoUrl('');
    setPhotoCaption('');
    setPhotoUploader('');
    setShowUploadPhotoModal(false);
  };

  const submitNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventCity.trim()) return;

    const lat = parseFloat(newEventLat) || 50.0;
    const lng = parseFloat(newEventLng) || 10.0;

    onAddEvent({
      title: newEventTitle,
      dateStart: newEventDateStart || '2026-08-15',
      dateEnd: newEventDateEnd || newEventDateStart || '2026-08-16',
      locationCity: newEventCity,
      locationState: newEventState,
      country: newEventCountry,
      address: newEventAddress || `${newEventCity}, Festplatz`,
      coordinates: [lat, lng],
      description: newEventDesc,
      expectedModels: newEventModels,
      organizer: newEventOrganizer || 'Traditionsfeuerwehr e.V.',
      attendeeVehiclesCount: 45,
    });

    setShowAddEventModal(false);
    setNewEventTitle('');
    setNewEventCity('');
    setNewEventDesc('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Search & Multi-Criteria Filter Bar */}
      <div className="bg-[#0f172a]/95 border-b border-slate-800 p-4 shrink-0 shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Treffen & Ausfahrten</span>
                <span className="text-xs font-normal text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-400">
                  {filteredEvents.length} von {events.length} Veranstaltungen
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Europaweite Oldtimer-Feuerwehr-Sternfahrten, Schauübungen und Traditionsfeste
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddEventModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Neues Treffen melden</span>
              </button>
            </div>
          </div>

          {/* Extended Multi-Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* Free text search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Stadt, Veranstaltung oder Stichwort..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Region / Bundesland Filter */}
            <div className="flex items-center">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="all">Alle Bundesländer & Regionen</option>
                {allRegions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Date / Month Filter */}
            <div className="flex items-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="all">Alle Termine (2026)</option>
                <option value="05">Mai 2026</option>
                <option value="06">Juni 2026</option>
                <option value="07">Juli 2026</option>
                <option value="08">August 2026</option>
                <option value="09">September 2026</option>
              </select>
            </div>

            {/* Expected Models Filter (Explicitly requested requirement!) */}
            <div className="flex items-center">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="all">Alle vertretenen Modelle</option>
                {allExpectedModels.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter badges / quick reset */}
          {(searchQuery || selectedRegion !== 'all' || selectedMonth !== 'all' || selectedModel !== 'all') && (
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Aktive Filter:</span>
              {selectedRegion !== 'all' && (
                <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  Region: {selectedRegion}
                </span>
              )}
              {selectedModel !== 'all' && (
                <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  Modell: {selectedModel}
                </span>
              )}
              {selectedMonth !== 'all' && (
                <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  Monat: {selectedMonth}.2026
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSelectedMonth('all');
                  setSelectedModel('all');
                }}
                className="text-red-400 hover:text-red-300 underline underline-offset-2 ml-1"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace: Split View with Leaflet Map + Event Explorer Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Leaflet Map Canvas */}
        <div className="flex-1 relative min-h-[340px] lg:min-h-full">
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#090d16]" />

          {/* Map floating quick-legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 shadow-xl pointer-events-none hidden sm:block">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">
                80
              </div>
              <span>Zahl im Pin = Erwartete Teilnehmerfahrzeuge</span>
            </div>
          </div>
        </div>

        {/* Sidebar Event List / Detail Drawer */}
        <div className="w-full lg:w-[440px] bg-[#0c1017] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-72 lg:h-full z-10">
          {selectedEvent ? (
            /* Detailed view of selected meeting */
            <div className="flex-1 flex flex-col overflow-y-auto p-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-red-400 font-semibold uppercase tracking-wider">
                    <span>{selectedEvent.locationState}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedEvent.country}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                    {selectedEvent.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedEventId(undefined)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Zurück zur Liste"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Event Quick Facts */}
              <div className="py-3 border-b border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    {selectedEvent.dateStart === selectedEvent.dateEnd
                      ? selectedEvent.dateStart
                      : `${selectedEvent.dateStart} bis ${selectedEvent.dateEnd}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{selectedEvent.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    ca. <strong className="text-white font-mono tabular-nums">{selectedEvent.attendeeVehiclesCount}</strong> gemeldete Klassiker
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="py-3 text-xs leading-relaxed text-slate-300 border-b border-slate-800/80">
                <p>{selectedEvent.description}</p>
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-slate-400">
                  <p>
                    <strong className="text-slate-300">Veranstalter:</strong> {selectedEvent.organizer}
                  </p>
                  {selectedEvent.contactEmail && (
                    <p className="mt-0.5">
                      <strong className="text-slate-300">Kontakt:</strong> {selectedEvent.contactEmail}
                    </p>
                  )}
                  {selectedEvent.websiteUrl && (
                    <a
                      href={selectedEvent.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 mt-1"
                    >
                      <span>Offizielle Webseite besuchen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Expected classic models (User requirement) */}
              <div className="py-3 border-b border-slate-800/80">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Erwartete Oldtimer-Modelle
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.expectedModels.map((mod, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-slate-200"
                    >
                      🚒 {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Memory Photos & Upload Section (User requirement!) */}
              <div className="pt-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-red-400" />
                    <span>Erinnerungsfotos ({selectedEvent.photos.length})</span>
                  </h3>
                  <button
                    onClick={() => setShowUploadPhotoModal(true)}
                    className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-2.5 py-1 rounded border border-red-800/40"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Foto hochladen</span>
                  </button>
                </div>

                {selectedEvent.photos.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-900/60 rounded-lg border border-slate-800">
                    <Camera className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">
                      Noch keine Fotos für dieses Treffen hinterlegt.
                    </p>
                    <button
                      onClick={() => setShowUploadPhotoModal(true)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      Laden Sie das erste Erinnerungsfoto hoch
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEvent.photos.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setActivePhotoPreview(p.url)}
                        className="group relative cursor-pointer aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all"
                      >
                        <img
                          src={p.url}
                          alt={p.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                          <p className="text-[11px] font-medium text-white truncate">{p.caption}</p>
                          <p className="text-[9px] text-slate-400">
                            {p.uploaderName} · {p.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Overview list of events */
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Treffen-Übersicht ({filteredEvents.length})
              </div>

              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Keine Treffen mit den aktuellen Filterkriterien gefunden.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('all');
                      setSelectedMonth('all');
                      setSelectedModel('all');
                    }}
                    className="mt-3 text-red-400 hover:underline"
                  >
                    Alle Filter zurücksetzen
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => handleSelectEvent(ev.id)}
                      className="p-4 hover:bg-slate-900/60 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-mono tabular-nums text-red-400 font-semibold">
                          {ev.dateStart}
                        </span>
                        <span>
                          {ev.locationCity} ({ev.locationState})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ev.description}</p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{ev.attendeeVehiclesCount} Fahrzeuge erwartet</span>
                        <span className="text-red-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Details ansehen <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Upload Photo for Event */}
      {showUploadPhotoModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-red-500" />
                <span>Erinnerungsfoto hochladen</span>
              </h3>
              <button
                onClick={() => setShowUploadPhotoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPhotoUpload} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Foto auswählen (vom Gerät)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Oder Bild-URL eingeben
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {photoUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-700 aspect-video bg-black">
                  <img
                    src={photoUrl}
                    alt="Vorschau"
                    className="w-full h-full object-cover"
                    onError={() => alert('Bild konnte nicht geladen werden')}
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bildunterschrift</label>
                <input
                  type="text"
                  placeholder="z. B. Magirus LF 16 bei der Schauübung"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fotograf / Name</label>
                  <input
                    type="text"
                    placeholder="Ihr Name / Verein"
                    value={photoUploader}
                    onChange={(e) => setPhotoUploader(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Aufnahmejahr</label>
                  <input
                    type="number"
                    value={photoYear}
                    onChange={(e) => setPhotoYear(parseInt(e.target.value) || 2026)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadPhotoModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!photoUrl}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg"
                >
                  Foto veröffentlichen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Meeting */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Neues Oldtimer-Treffen melden</span>
              </h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitNewEvent} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titel des Treffens *</label>
                <input
                  type="text"
                  required
                  placeholder="z. B. 12. Bayerisches Feuerwehr-Oldtimertreffen"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Beginn Datum *</label>
                  <input
                    type="date"
                    required
                    value={newEventDateStart}
                    onChange={(e) => setNewEventDateStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ende Datum</label>
                  <input
                    type="date"
                    value={newEventDateEnd}
                    onChange={(e) => setNewEventDateEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stadt / Ort *</label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Nürnberg"
                    value={newEventCity}
                    onChange={(e) => setNewEventCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Bundesland / Region</label>
                  <select
                    value={newEventState}
                    onChange={(e) => setNewEventState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  >
                    <option value="Baden-Württemberg">Baden-Württemberg</option>
                    <option value="Bayern">Bayern</option>
                    <option value="Berlin / Brandenburg">Berlin / Brandenburg</option>
                    <option value="Bremen / Niedersachsen">Bremen / Niedersachsen</option>
                    <option value="Hessen">Hessen</option>
                    <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                    <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
                    <option value="Sachsen">Sachsen</option>
                    <option value="Salzburg / Österreich">Salzburg / Österreich</option>
                    <option value="Elsass / Frankreich">Elsass / Frankreich</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Genaue Adresse / Treffpunkt</label>
                <input
                  type="text"
                  placeholder="z. B. Hauptmarkt 1, 90403 Nürnberg"
                  value={newEventAddress}
                  onChange={(e) => setNewEventAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Breitengrad (Lat)</label>
                  <input
                    type="text"
                    value={newEventLat}
                    onChange={(e) => setNewEventLat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Längengrad (Lng)</label>
                  <input
                    type="text"
                    value={newEventLng}
                    onChange={(e) => setNewEventLng(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Erwartete Modelle (Kommagetrennt)
                </label>
                <input
                  type="text"
                  placeholder="Magirus Rundhauber, Mercedes Kurzhauber, Opel Blitz"
                  value={newEventModels.join(', ')}
                  onChange={(e) =>
                    setNewEventModels(
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Veranstalter / Verein</label>
                <input
                  type="text"
                  placeholder="z. B. FF Nürnberg Löschzug Klassik e.V."
                  value={newEventOrganizer}
                  onChange={(e) => setNewEventOrganizer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Programm & Beschreibung</label>
                <textarea
                  rows={3}
                  placeholder="Details zur Ausfahrt, Schauübung, Verpflegung..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  Treffen eintragen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview */}
      {activePhotoPreview && (
        <div
          onClick={() => setActivePhotoPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
        >
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-slate-700">
            <img
              src={activePhotoPreview}
              alt="Erinnerungsfoto Großansicht"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
