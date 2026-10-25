import React, { useState } from 'react';
import { BookOpen, Search, Filter, Shield, Wrench, ChevronRight, X, Clock, Gauge, Scale, Plus } from 'lucide-react';
import { FireModelDatabaseEntry } from '../types';

interface ModelDatabaseProps {
  models: FireModelDatabaseEntry[];
}

export const ModelDatabase: React.FC<ModelDatabaseProps> = ({ models }) => {
  const [search, setSearch] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<FireModelDatabaseEntry | null>(null);

  // Comparison state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareId1, setCompareId1] = useState<string>(models[0]?.id || '');
  const [compareId2, setCompareId2] = useState<string>(models[1]?.id || models[0]?.id || '');

  const manufacturers = Array.from(new Set(models.map((m) => m.manufacturer.split('(')[0].trim()))).sort();

  const filteredModels = models.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        m.name.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.typeBadge.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedManufacturer !== 'all' && !m.manufacturer.includes(selectedManufacturer)) {
      return false;
    }
    return true;
  });

  const model1 = models.find((m) => m.id === compareId1) || models[0];
  const model2 = models.find((m) => m.id === compareId2) || models[1] || models[0];

  const handleQuickCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareId1(models[0]?.id || '');
    setCompareId2(id);
    setIsCompareModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
              <span>Technisches Archiv</span>
              <span aria-hidden="true">·</span>
              <span>Modell-Lexikon &amp; Vergleich</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Historische Feuerwehr-Klassiker &amp; Baumuster
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Detaillierte Baudaten, Pumpenleistungen nach DIN-Norm, Fahrgestellmerkmale und
              historische Bedeutungen der bedeutendsten europäischen Einsatzfahrzeuge.
            </p>
          </div>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-lg transition-all shrink-0"
          >
            <Scale className="w-4 h-4" />
            <span>Fahrzeuge vergleichen</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Modellname, Kennung (z.B. LF 16, Rundhauber) oder Motor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">Alle Hersteller</option>
              {manufacturers.map((manuf) => (
                <option key={manuf} value={manuf}>
                  {manuf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModels.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedModel(entry)}
              className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col cursor-pointer group shadow-lg relative"
            >
              {/* Photo Showcase */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={entry.imageUrl}
                  alt={entry.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                  {entry.typeBadge}
                </div>
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded border border-white/10 font-mono tabular-nums">
                  {entry.era}
                </div>
              </div>

              {/* Information */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">{entry.manufacturer}</div>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                    {entry.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-red-400" />
                      <span>{entry.pumpCapacity}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.chassisType}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-3">
                    {entry.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-medium">
                  <span className="text-red-400 group-hover:underline">Komplettes Datenblatt öffnen</span>
                  <button
                    onClick={(e) => handleQuickCompare(entry.id, e)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5 text-red-400" />
                    <span>Vergleichen</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Modal */}
        {isCompareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-5xl w-full p-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/20 text-red-400 rounded-lg">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Fahrzeug-Vergleichsanicht</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direkter technischer und historischer Vergleich zweier Feuerwehr-Baumuster
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Model Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Fahrzeug 1 (Basis)
                  </label>
                  <select
                    value={compareId1}
                    onChange={(e) => setCompareId1(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.manufacturer} - {m.name} ({m.typeBadge})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Fahrzeug 2 (Vergleich)
                  </label>
                  <select
                    value={compareId2}
                    onChange={(e) => setCompareId2(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.manufacturer} - {m.name} ({m.typeBadge})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Comparison Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div>Kriterium</div>
                  <div className="text-white px-2">{model1.name}</div>
                  <div className="text-white px-2">{model2.name}</div>
                </div>

                {/* Images Row */}
                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800 p-4">
                  <div className="text-xs font-semibold text-slate-400 flex items-center">Fahrzeugbild</div>
                  <div className="px-2">
                    <div className="aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black">
                      <img src={model1.imageUrl} alt={model1.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black">
                      <img src={model2.imageUrl} alt={model2.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Manufacturer & Era */}
                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                  <div className="font-semibold text-slate-400">Hersteller</div>
                  <div className="px-2 text-slate-200 font-medium">{model1.manufacturer}</div>
                  <div className="px-2 text-slate-200 font-medium">{model2.manufacturer}</div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                  <div className="font-semibold text-slate-400">Bauzeit / Ära</div>
                  <div className="px-2 text-slate-200 font-mono tabular-nums">{model1.era}</div>
                  <div className="px-2 text-slate-200 font-mono tabular-nums">{model2.era}</div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                  <div className="font-semibold text-slate-400">DIN-Typenbezeichnung</div>
                  <div className="px-2"><span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold">{model1.typeBadge}</span></div>
                  <div className="px-2"><span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold">{model2.typeBadge}</span></div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                  <div className="font-semibold text-slate-400">Pumpenleistung</div>
                  <div className="px-2 text-slate-200 font-semibold">{model1.pumpCapacity}</div>
                  <div className="px-2 text-slate-200 font-semibold">{model2.pumpCapacity}</div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                  <div className="font-semibold text-slate-400">Fahrgestell / Antrieb</div>
                  <div className="px-2 text-slate-200">{model1.chassisType}</div>
                  <div className="px-2 text-slate-200">{model2.chassisType}</div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                  <div className="font-semibold text-slate-400">Normbesatzung</div>
                  <div className="px-2 text-slate-200 font-semibold">{model1.crew}</div>
                  <div className="px-2 text-slate-200 font-semibold">{model2.crew}</div>
                </div>

                {/* Key specs comparison */}
                <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs bg-slate-900/40">
                  <div className="font-semibold text-slate-300 col-span-3">Technische Kenndaten im Vergleich</div>
                </div>
                {model1.keySpecs.map((spec1, idx) => {
                  const spec2 = model2.keySpecs[idx] || { label: spec1.label, value: 'k.A.' };
                  return (
                    <div key={idx} className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800/80 p-3 text-xs">
                      <div className="font-semibold text-slate-400">{spec1.label}</div>
                      <div className="px-2 text-slate-200 font-mono tabular-nums">{spec1.value}</div>
                      <div className="px-2 text-slate-200 font-mono tabular-nums">{spec2.value}</div>
                    </div>
                  );
                })}

                {/* Historical significance */}
                <div className="grid grid-cols-3 divide-x divide-slate-800 p-4 text-xs">
                  <div className="font-semibold text-slate-400">Feuerwehrhistorische Bedeutung</div>
                  <div className="px-2 text-slate-300 leading-relaxed">{model1.historicalSignificance}</div>
                  <div className="px-2 text-slate-300 leading-relaxed">{model2.historicalSignificance}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  Vergleich schließen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Model Modal */}
        {selectedModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-3xl w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-red-400 font-semibold uppercase">
                    <span>{selectedModel.manufacturer}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{selectedModel.era}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">{selectedModel.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image banner */}
              <div className="my-4 aspect-video rounded-lg overflow-hidden border border-slate-800">
                <img
                  src={selectedModel.imageUrl}
                  alt={selectedModel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Technical Specifications Table */}
              <div className="my-5 p-4 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-red-400" />
                    <span>Technische Spezifikationen &amp; DIN-Kennwerte</span>
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedModel(null);
                      setCompareId1(selectedModel.id);
                      setIsCompareModalOpen(true);
                    }}
                    className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-2.5 py-1 rounded text-xs font-medium transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Mit anderem Modell vergleichen</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Pumpenleistung / Aggregat</span>
                    <span className="font-semibold text-slate-200">{selectedModel.pumpCapacity}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Fahrgestellbauweise</span>
                    <span className="font-semibold text-slate-200">{selectedModel.chassisType}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Normbesatzung</span>
                    <span className="font-semibold text-slate-200">{selectedModel.crew}</span>
                  </div>
                  {selectedModel.keySpecs.map((spec, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <span className="text-slate-400">{spec.label}</span>
                      <span className="font-semibold text-slate-200 font-mono tabular-nums">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Significance */}
              <div className="my-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span>Feuerwehrhistorische Bedeutung</span>
                </h3>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  {selectedModel.historicalSignificance}
                </p>
              </div>

              {/* Common derivatives */}
              <div className="my-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Typische Varianten &amp; Aufbauhersteller
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModel.commonDerivatives.map((der, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded bg-slate-800/70 border border-slate-700 text-slate-300"
                    >
                      {der}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedModel(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
