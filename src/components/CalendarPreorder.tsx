import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Flame,
  Heart,
  ShieldCheck,
  Truck,
  CheckCircle,
  Tag,
  Clock,
  ChevronRight,
  Eye,
  Gift,
  FileText,
  X,
  CreditCard,
  Download,
} from 'lucide-react';
import { CalendarPreOrder } from '../types';

export const CalendarPreorder: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    zipCity: '',
    country: 'Deutschland',
    dedication: '',
    agreedToTerms: true,
  });

  const [submittedOrder, setSubmittedOrder] = useState<CalendarPreOrder | null>(null);
  const [previewMonth, setPreviewMonth] = useState<number | null>(null);
  const [reservedCount, setReservedCount] = useState(416); // 416 of 500 ordered

  const calculatePrice = (qty: number) => {
    if (qty === 1) return 19.9;
    if (qty === 2) return 36.0;
    if (qty === 3) return 49.9;
    return Math.round((qty * 16.5) * 100) / 100;
  };

  const regularPrice = (qty: number) => qty * 24.9;
  const currentPrice = calculatePrice(quantity);
  const savedAmount = Math.round((regularPrice(quantity) - currentPrice) * 100) / 100;

  const months = [
    {
      month: 'Januar 2027',
      title: 'Neujahrsglanz am Rundhauber',
      vehicle: 'Magirus-Deutz Rundhauber (1956)',
      desc: 'Funkelndes Chrom im ersten Frost: Unsere Schriftführerin Sabine an der Front des legendären Ulmer Allrad-Klassikers.',
      image: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'Februar 2027',
      title: 'Schrauber-Feuer & Funkenflug',
      vehicle: 'Mercedes-Benz LF 16 Kurzhauber (1968)',
      desc: 'Kameradschaftliche Wärme in der Werkstatt: 2. Vorsitzende Petra poliert die Scheinwerferringe im nostalgischen Retro-Look.',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'März 2027',
      title: 'Frühlingserwachen mit dem Blitz',
      vehicle: 'Opel Blitz LF 8 (1962)',
      desc: 'Vorstandskollegin Marion mit dem historischen C-Strahlrohr am schnittigen Opel-Klassiker mit Vorbaupumpe.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'April 2027',
      title: 'Volle Pumpe im Lenz',
      vehicle: 'Magirus FP 16/8 Pumpe',
      desc: 'Kassenwartin Andrea am Pumpenbedienstand: Höchstdruck, Messingarmaturen und zeitlose Feuerwehr-Eleganz.',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'Mai 2027',
      title: 'Dem Himmel so nah',
      vehicle: 'Metz Drehleiter DL 30 (1964)',
      desc: 'Höhenluft und Nostalgie: Vorstandssprecherin Claudia hoch oben am Leiterpark vor malerischer Kulisse.',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'Juni 2027',
      title: 'Sommerglanz & Blaulicht',
      vehicle: 'Borgward B 2000 A (1959)',
      desc: 'Sonnige Sternfahrt: Jugendleiterin Katrin posiert stilvoll mit historischer Schutzhaube am offenen Mannschaftswagen.',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'Juli 2027',
      title: 'Wassermarsch im Abendlicht',
      vehicle: 'Tanklöschfahrzeug TLF 16',
      desc: 'Glänzende Wasserfontänen und Abendstimmung mit dem Vorstandsteam der historischen Löschfreunde.',
      image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'August 2027',
      title: 'Alpenüberquerung & Kameradschaft',
      vehicle: 'Steyr 680 g (1969)',
      desc: 'Urgewalt im Gebirge: Steyr-Diesel, Leder-Stiefel und das legendäre Martinshorn der Österreich-Ausfahrt.',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'September 2027',
      title: 'Goldener Herbst am Deutz-Diesel',
      vehicle: 'Magirus Eckhauber TLF 24/50',
      desc: 'Der ungezähmte Klang von 8 luftgekühlten Zylindern und die stolzen Damen des Fördervereins.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'Oktober 2027',
      title: 'Nachtübung & Scheinwerferkegel',
      vehicle: 'Hanomag-Henschel F 45 (1971)',
      desc: 'Nostalgischer Glanz in der Dämmerung: Flackernde Suchscheinwerfer und warmes Kaffeelächeln.',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'November 2027',
      title: 'Tradition & Zeitgeschichte',
      vehicle: 'Historischer Löschzug komplett',
      desc: 'Gemeinsam im Gedenken an 150 Jahre Feuerschutz – stilvoll inszeniert mit Vintage-Uniformen.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    {
      month: 'Dezember 2027',
      title: 'Feuerzauber zum Jahresausklang',
      vehicle: 'Festlich beleuchtete Drehleiter',
      desc: 'Das gesamte Vorstandsfrauen-Team wünscht besinnliche Stunden: Das große Finale im Lichtermeer.',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.street || !formData.zipCity) {
      alert('Bitte fülle alle erforderlichen Adressfelder aus.');
      return;
    }

    const orderNum = `BN-CAL27-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CalendarPreOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: formData.name,
      email: formData.email,
      street: formData.street,
      zipCity: formData.zipCity,
      country: formData.country,
      quantity,
      totalPrice: currentPrice,
      personalDedication: formData.dedication,
      orderedAt: new Date().toLocaleDateString('de-DE'),
      status: 'bestätigt',
    };

    setSubmittedOrder(newOrder);
    setReservedCount((prev) => Math.min(500, prev + quantity));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Special Offer Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <Heart className="w-80 h-80" />
          </div>

          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Offizielle Vorbesteller-Aktion 2027</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-white">Nur noch {500 - reservedCount} von 500 Exemplaren</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Oldtimer-Feuerwehr Erotikkalender 2027
            </h1>
            <p className="text-lg font-medium text-rose-100">
              „Stil, Dampf &amp; Blaulicht: Der exklusive Benefiz-Kalender der Vorstandsfrauen“
            </p>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl">
              Zwölf kunstvoll und mit Augenzwinkern inszenierte Hochglanz-Motive im edlen DIN A3
              Querformat (Kunstdruck 250 g/m²). Unsere engagierten Vorstandsfrauen posieren mit
              zeitgenössischem Retro-Charme vor den schönsten Feuerwehr-Oldtimern Europas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-300" />
                <span>Frühbucherpreis: <strong>19,90 €</strong> (statt 24,90 €)</span>
              </div>
              <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-300" />
                <span>100% des Erlöses gehen an den Restaurationsfonds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Sonderpreis &amp; Widmung</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vorbesteller sparen 5,00 € pro Exemplar und erhalten auf Wunsch eine persönliche
              handsignierte Grußwidmung der Vorstandsdamen.
            </p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Garantierte Lieferung vor Weihnachten</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Der Versand erfolgt ab Ende Oktober 2026 im knickfesten Sicherheitskarton – pünktlich
              als perfektes Weihnachtsgeschenk für Feuerwehr-Liebhaber.
            </p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Förderverein &amp; Guter Zweck</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jeder verkaufte Kalender finanziert dringend benötigte Ersatzteile für die Überholung
              der Metz Drehleiter DL 30 und die historische Jugendarbeit.
            </p>
          </div>
        </div>

        {/* Month Teaser Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span>Monats-Vorschau 2027 (12 Kunstdruck-Motive)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Klicke auf einen Monat, um die Bildbeschreibung und das Baumuster anzusehen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {months.map((m, idx) => (
              <div
                key={idx}
                onClick={() => setPreviewMonth(idx)}
                className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden cursor-pointer group hover:border-red-500/50 transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {m.month.split(' ')[0]}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-amber-200">
                      {m.title}
                    </span>
                  </div>
                </div>
                <div className="p-2 text-[10px] text-slate-400 truncate bg-slate-900/60">
                  {m.vehicle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Month Preview */}
        {previewMonth !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-black">
                <img
                  src={months[previewMonth].image}
                  alt={months[previewMonth].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewMonth(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                  {months[previewMonth].month}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-white">{months[previewMonth].title}</h3>
                <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>Fahrzeug-Klassiker: {months[previewMonth].vehicle}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {months[previewMonth].desc}
                </p>
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setPreviewMonth(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pre-order Form & Pricing Calculator */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {submittedOrder ? (
            <div className="text-center py-8 space-y-5 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">Vorbestellung erfolgreich reserviert!</h2>
                <p className="text-sm text-slate-400">
                  Herzlichen Dank für deine Unterstützung unserer Oldtimer-Restauration!
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Reservierungsnummer:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {submittedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kunde:</span>
                  <span className="text-white font-medium">{submittedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">E-Mail:</span>
                  <span className="text-white font-mono">{submittedOrder.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lieferadresse:</span>
                  <span className="text-slate-300 text-right">
                    {submittedOrder.street}, {submittedOrder.zipCity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Anzahl Kalender:</span>
                  <span className="text-white font-bold">{submittedOrder.quantity}x DIN A3 Kalender</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                  <span className="text-white">Gesamtbetrag (Sonderpreis):</span>
                  <span className="text-emerald-400">{submittedOrder.totalPrice.toFixed(2)} €</span>
                </div>
                {submittedOrder.personalDedication && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-rose-300 italic">
                    „Gewünschte Widmung: {submittedOrder.personalDedication}“
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Reservierungsbeleg drucken</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedOrder(null);
                    setFormData({
                      name: '',
                      email: '',
                      street: '',
                      zipCity: '',
                      country: 'Deutschland',
                      dedication: '',
                      agreedToTerms: true,
                    });
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Weitere Vorbestellung aufgeben
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-red-500" />
                  <span>Vorbestellung zum garantierten Frühbucher-Sonderpreis</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sichere dir dein limitiertes Exemplar vor offiziellem Druckstart. Keine Vorauskasse
                  nötig – Zahlung bequem per Rechnung bei Lieferung!
                </p>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Wähle dein Kalender-Paket:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setQuantity(1)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      quantity === 1
                        ? 'border-red-500 bg-red-950/20 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">1x Einzelkalender</div>
                    <div className="text-xl font-black text-amber-400 mt-1">19,90 €</div>
                    <div className="text-[11px] text-slate-400 line-through">statt 24,90 €</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Du sparst 5,00 €
                    </div>
                  </div>

                  <div
                    onClick={() => setQuantity(2)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                      quantity === 2
                        ? 'border-red-500 bg-red-950/20 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Beliebt
                    </div>
                    <div className="text-xs font-bold text-white">2x Feuerwehr-Duo</div>
                    <div className="text-xl font-black text-amber-400 mt-1">36,00 €</div>
                    <div className="text-[11px] text-slate-400 line-through">statt 49,80 €</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Du sparst 13,80 € (18,00 € / Stk)
                    </div>
                  </div>

                  <div
                    onClick={() => setQuantity(3)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                      quantity === 3
                        ? 'border-red-500 bg-red-950/20 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="absolute top-2 right-2 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Vorstands-Paket
                    </div>
                    <div className="text-xs font-bold text-white">3x Förderer-Paket</div>
                    <div className="text-xl font-black text-amber-400 mt-1">49,90 €</div>
                    <div className="text-[11px] text-slate-400 line-through">statt 74,70 €</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Du sparst 24,80 € + Gratis Pin
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vor- und Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Florian Brandner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    E-Mail-Adresse für Reservierungsbestätigung *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="florian@feuerwehr-vintage.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Straße &amp; Hausnummer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Feuerwachestraße 12"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    PLZ &amp; Ort *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="80331 München"
                    value={formData.zipCity}
                    onChange={(e) => setFormData({ ...formData, zipCity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Persönliche handsignierte Grußwidmung der Vorstandsfrauen (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="z. B. Für die Kameraden der FF Löschwitz – Gut Schlauch!"
                    value={formData.dedication}
                    onChange={(e) => setFormData({ ...formData, dedication: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Price summary & checkout action */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Vorbestell-Gesamtsumme inkl. MwSt. &amp; Spende:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400">{currentPrice.toFixed(2)} €</span>
                    <span className="text-xs text-slate-500 line-through">
                      {regularPrice(quantity).toFixed(2)} €
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      (Du sparst {savedAmount.toFixed(2)} €)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Kostenloser Versand in Deutschland, Österreich und der Schweiz.
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current text-rose-200" />
                  <span>Jetzt verbindlich zum Sonderpreis vorbestellen</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
