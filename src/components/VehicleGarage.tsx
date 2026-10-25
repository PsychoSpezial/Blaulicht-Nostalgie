import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Calendar,
  FileText,
  Camera,
  Trash2,
  X,
  Wrench,
  Award,
  ChevronRight,
  Upload,
  Layers,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { VehicleProfile, RestorationMilestone } from '../types';

interface VehicleGarageProps {
  vehicles: VehicleProfile[];
  onAddVehicle: (vehicle: Omit<VehicleProfile, 'id'>) => void;
  onDeleteVehicle: (id: string) => void;
  isOpenAddModal: boolean;
  setIsOpenAddModal: (val: boolean) => void;
}

export const VehicleGarage: React.FC<VehicleGarageProps> = ({
  vehicles,
  onAddVehicle,
  onDeleteVehicle,
  isOpenAddModal,
  setIsOpenAddModal,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile | null>(null);

  // Form state for creating a new vehicle profile
  const [ownerName, setOwnerName] = useState('');
  const [ownerCity, setOwnerCity] = useState('');
  const [brand, setBrand] = useState('Magirus-Deutz');
  const [model, setModel] = useState('');
  const [fireCode, setFireCode] = useState('LF 16 (Löschgruppenfahrzeug)');
  const [buildYear, setBuildYear] = useState<number>(1965);
  const [vin, setVin] = useState('');
  const [formerStation, setFormerStation] = useState('');
  const [restorationStory, setRestorationStory] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  // Technical Specs form state
  const [specEngine, setSpecEngine] = useState('');
  const [specPowerHp, setSpecPowerHp] = useState<number>(125);
  const [specPump, setSpecPump] = useState('FP 16/8');
  const [specTank, setSpecTank] = useState<number>(800);
  const [specSeats, setSpecSeats] = useState<number>(9);
  const [specWeight, setSpecWeight] = useState<number>(7.49);

  // Dynamic milestones inside create modal
  const [milestones, setMilestones] = useState<Omit<RestorationMilestone, 'id'>[]>([
    {
      date: '2023-05-01',
      title: 'Kauf & Bergung',
      notes: 'Fahrzeug übernommen, Standzeit ca. 12 Jahre in trockener Scheune.',
      costEuro: 3500,
    },
  ]);

  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneNotes, setNewMilestoneNotes] = useState('');
  const [newMilestoneCost, setNewMilestoneCost] = useState<number>(0);

  // Handle multi-photo file upload
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadedPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addPhotoByUrl = () => {
    if (tempPhotoUrl.trim()) {
      setUploadedPhotos((prev) => [...prev, tempPhotoUrl.trim()]);
      setTempPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      {
        date: newMilestoneDate || new Date().toISOString().split('T')[0],
        title: newMilestoneTitle,
        notes: newMilestoneNotes,
        costEuro: newMilestoneCost || undefined,
      },
    ]);
    setNewMilestoneTitle('');
    setNewMilestoneNotes('');
    setNewMilestoneCost(0);
  };

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !vin.trim()) return;

    onAddVehicle({
      ownerName: ownerName.trim() || 'Feuerwehrfreund',
      ownerCity: ownerCity.trim() || 'Deutschland',
      brand,
      model,
      fireCode,
      buildYear: buildYear || 1965,
      vin: vin.trim().toUpperCase(),
      formerStation: formerStation.trim() || 'Freiwillige Feuerwehr',
      restorationStory: restorationStory.trim() || 'Restaurationsprojekt in stetiger Pflege.',
      milestones: milestones.map((m, idx) => ({ ...m, id: `m-custom-${Date.now()}-${idx}` })),
      photos:
        uploadedPhotos.length > 0
          ? uploadedPhotos
          : ['https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'],
      specs: {
        engine: specEngine || 'Dieselmotor',
        powerHp: specPowerHp || 120,
        pumpModel: specPump || 'FP 16/8',
        waterTankLiters: specTank || 0,
        crewSeats: specSeats || 9,
        weightTons: specWeight || 7.5,
      },
    });

    // Reset form
    setBrand('Magirus-Deutz');
    setModel('');
    setVin('');
    setRestorationStory('');
    setUploadedPhotos([]);
    setIsOpenAddModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
              <span>Traditions-Register</span>
              <span aria-hidden="true">·</span>
              <span>Eigentümer-Garage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Mein Oldtimer – Fahrzeugprofile
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Dokumentieren Sie die Restaurationsgeschichte, Fahrgestellnummer, Meilensteine und Fotos
              Ihres historischen Feuerwehrfahrzeugs für die europäische Community.
            </p>
          </div>

          <button
            onClick={() => setIsOpenAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-lg shadow-md transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Neues Fahrzeug registrieren</span>
          </button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((veh) => (
            <div
              key={veh.id}
              className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col overflow-hidden shadow-lg group"
            >
              {/* Photo Showcase banner */}
              <div
                onClick={() => setSelectedVehicle(veh)}
                className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
              >
                {veh.photos.length > 0 ? (
                  <img
                    src={veh.photos[0]}
                    alt={`${veh.brand} ${veh.model}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                    <Truck className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                  {veh.fireCode}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded flex items-center gap-1.5 border border-white/10 font-mono tabular-nums">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>{veh.photos.length} Fotos</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">{veh.brand}</span>
                    <span className="font-mono tabular-nums bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      Bj. {veh.buildYear}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedVehicle(veh)}
                    className="text-lg font-bold text-white hover:text-red-400 cursor-pointer transition-colors"
                  >
                    {veh.model}
                  </h3>

                  {/* VIN Box (Explicit user requirement) */}
                  <div className="mt-2.5 p-2 bg-slate-900/90 rounded border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Fahrgestell-Nr. (FIN):</span>
                    <span className="font-mono font-bold text-red-400 tracking-wider">
                      {veh.vin}
                    </span>
                  </div>

                  {/* Former Station */}
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{veh.formerStation}</span>
                  </div>

                  {/* Restoration teaser */}
                  <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {veh.restorationStory}
                  </p>
                </div>

                {/* Footer action bar */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span>Eigentümer: </span>
                    <strong className="text-slate-300">{veh.ownerName}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVehicle(veh)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                    >
                      Chronik & Fotos
                    </button>
                    <button
                      onClick={() => onDeleteVehicle(veh.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Fahrzeugprofil löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Vehicle Modal (Full dossier with timeline, photos, specs) */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-3xl w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-red-400 font-semibold uppercase">
                    <span>{selectedVehicle.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span>Baujahr {selectedVehicle.buildYear}</span>
                    <span aria-hidden="true">·</span>
                    <span className="bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800/60 font-mono">
                      {selectedVehicle.fireCode}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    {selectedVehicle.model}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Eigentümer: {selectedVehicle.ownerName} ({selectedVehicle.ownerCity}) · Früher:{' '}
                    {selectedVehicle.formerStation}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* FIN / VIN Display Banner */}
              <div className="my-4 p-3 bg-red-950/30 rounded-lg border border-red-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-300 font-medium">Offizielle Fahrgestellnummer (FIN / VIN):</span>
                <span className="text-sm font-mono font-bold text-red-400 tracking-wider">
                  {selectedVehicle.vin}
                </span>
              </div>

              {/* Photo Gallery Grid */}
              <div className="my-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-red-400" />
                  <span>Foto-Galerie ({selectedVehicle.photos.length} Aufnahmen)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedVehicle.photos.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800"
                    >
                      <img
                        src={img}
                        alt={`Ansicht ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Data Sheet */}
              <div className="my-5 p-4 bg-slate-900/80 rounded-lg border border-slate-800">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-red-400" />
                  <span>Technische Spezifikationen</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Motor</span>
                    <strong className="text-slate-200">{selectedVehicle.specs.engine}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Leistung</span>
                    <strong className="text-slate-200 font-mono tabular-nums">
                      {selectedVehicle.specs.powerHp} PS
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Feuerlöschpumpe</span>
                    <strong className="text-slate-200">{selectedVehicle.specs.pumpModel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Löschwassertank</span>
                    <strong className="text-slate-200 font-mono tabular-nums">
                      {selectedVehicle.specs.waterTankLiters || 'Ohne Tank'} Liter
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Besatzungsstärke</span>
                    <strong className="text-slate-200">
                      {selectedVehicle.specs.crewSeats} Sitzplätze
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Zul. Gesamtgewicht</span>
                    <strong className="text-slate-200 font-mono tabular-nums">
                      {selectedVehicle.specs.weightTons} t
                    </strong>
                  </div>
                </div>
              </div>

              {/* Restoration Chronicle / Story */}
              <div className="my-5">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-400" />
                  <span>Restaurationsgeschichte</span>
                </h3>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  {selectedVehicle.restorationStory}
                </p>
              </div>

              {/* Restoration Milestones Timeline */}
              {selectedVehicle.milestones && selectedVehicle.milestones.length > 0 && (
                <div className="my-5">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-red-400" />
                    <span>Restaurations-Meilensteine</span>
                  </h3>
                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 pl-7">
                    {selectedVehicle.milestones.map((m) => (
                      <div key={m.id} className="relative text-xs">
                        <div className="absolute -left-7 top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-[#0f172a]" />
                        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                          <span>{m.date}</span>
                          {m.costEuro && (
                            <span className="text-emerald-400">· {m.costEuro.toLocaleString('de-DE')} €</span>
                          )}
                        </div>
                        <h4 className="font-bold text-white mt-0.5">{m.title}</h4>
                        <p className="text-slate-400 mt-0.5">{m.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Vehicle Profile (Requested by User) */}
        {isOpenAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-red-500" />
                  <span>Neues Feuerwehr-Oldtimer Profil anlegen</span>
                </h3>
                <button
                  onClick={() => setIsOpenAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitVehicle} className="mt-5 space-y-4 text-xs">
                {/* 1. Basic vehicle info */}
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    1. Basisdaten & Identifikation
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Marke / Hersteller *</label>
                      <input
                        type="text"
                        required
                        placeholder="z. B. Magirus-Deutz, Mercedes-Benz, Opel, Borgward"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Modellbezeichnung *</label>
                      <input
                        type="text"
                        required
                        placeholder="z. B. Mercur 125 A Rundhauber, L 1113"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Baujahr *</label>
                      <input
                        type="number"
                        required
                        value={buildYear}
                        onChange={(e) => setBuildYear(parseInt(e.target.value) || 1965)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-medium mb-1">
                        Fahrgestellnummer (FIN / VIN) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="z. B. MD-1963-88421-U oder 328-012-998"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono tracking-wider focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Feuerwehr-Typ / Norm</label>
                      <input
                        type="text"
                        placeholder="z. B. LF 16, TLF 16/25, DL 30, TSF"
                        value={fireCode}
                        onChange={(e) => setFireCode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Frühere Dienststelle / Wehr</label>
                      <input
                        type="text"
                        placeholder="z. B. Freiwillige Feuerwehr Würzburg"
                        value={formerStation}
                        onChange={(e) => setFormerStation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Restoration Story (User requirement) */}
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    2. Beschreibung der Restaurationsgeschichte
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Ausführliche Restaurationschronik
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Beschreiben Sie Fundzustand, Karosseriearbeiten, Motorüberholung, Pumpenreparatur, Lackierung in RAL 3000 und TÜV-Zulassung..."
                      value={restorationStory}
                      onChange={(e) => setRestorationStory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Add Milestone Sub-form */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="block text-slate-300 font-medium mb-1.5">
                      Restaurations-Meilensteine hinzufügen ({milestones.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                      <input
                        type="date"
                        value={newMilestoneDate}
                        onChange={(e) => setNewMilestoneDate(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Titel (z.B. Motorüberholt)"
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        className="sm:col-span-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium"
                      >
                        + Meilenstein
                      </button>
                    </div>

                    {/* Milestones list */}
                    {milestones.length > 0 && (
                      <div className="space-y-1.5">
                        {milestones.map((ms, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-slate-900/90 rounded border border-slate-800 text-[11px]"
                          >
                            <span className="text-slate-400 font-mono">{ms.date}:</span>
                            <span className="font-semibold text-white truncate max-w-[200px]">
                              {ms.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMilestone(idx)}
                              className="text-slate-500 hover:text-red-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Multi-Photo Upload (User requirement) */}
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                    <span>3. Multi-Foto Upload ({uploadedPhotos.length} Fotos)</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">
                      Fotos vom Computer / Smartphone auswählen (Mehrfachauswahl möglich)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleFiles}
                      className="w-full text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                    />
                  </div>

                  {/* Or add via URL */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Oder Bild-URL einfügen (https://...)"
                      value={tempPhotoUrl}
                      onChange={(e) => setTempPhotoUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={addPhotoByUrl}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                    >
                      Hinzufügen
                    </button>
                  </div>

                  {/* Thumbnail gallery preview with delete buttons */}
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                      {uploadedPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded overflow-hidden border border-slate-700 group bg-black"
                        >
                          <img
                            src={photo}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                            title="Foto entfernen"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Owner & Specs info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Ihr Name / Besitzer</label>
                    <input
                      type="text"
                      placeholder="Vorname Nachname / Verein"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Standort / Stadt</label>
                    <input
                      type="text"
                      placeholder="z. B. Stuttgart, Köln, München"
                      value={ownerCity}
                      onChange={(e) => setOwnerCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsOpenAddModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-lg shadow"
                  >
                    Fahrzeugprofil speichern
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
