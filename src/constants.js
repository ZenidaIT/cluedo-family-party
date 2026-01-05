export const CELL_STATES = {
  EMPTY: 'empty',
  MAYBE: 'maybe', // Dubbio (?)
  YES: 'yes',     // Certezza (V)
  NO: 'no',       // Esclusione (X)
  SOLVED: 'solved'
};

export const PLAYER_COLORS = [
  // Rossi / Rosa / Aranci
  { label: 'Rosso', class: 'bg-red-500 text-white', hex: '#ef4444' },
  { label: 'Rosso Scuro', class: 'bg-red-700 text-white', hex: '#b91c1c' },
  { label: 'Rosa', class: 'bg-pink-500 text-white', hex: '#ec4899' },
  { label: 'Fucsia', class: 'bg-fuchsia-500 text-white', hex: '#d946ef' },
  { label: 'Viola', class: 'bg-purple-500 text-white', hex: '#a855f7' },
  { label: 'Indaco', class: 'bg-indigo-500 text-white', hex: '#6366f1' },
  { label: 'Arancio', class: 'bg-orange-500 text-white', hex: '#f97316' },
  { label: 'Ambra', class: 'bg-amber-500 text-white', hex: '#f59e0b' },
  { label: 'Giallo', class: 'bg-yellow-400 text-black', hex: '#facc15' },
  { label: 'Lime', class: 'bg-lime-400 text-black', hex: '#a3e635' },
  // Verdi / Blu / Ciano
  { label: 'Verde', class: 'bg-green-500 text-white', hex: '#22c55e' },
  { label: 'Verde Scuro', class: 'bg-green-700 text-white', hex: '#15803d' },
  { label: 'Smeraldo', class: 'bg-emerald-500 text-white', hex: '#10b981' },
  { label: 'Turchese', class: 'bg-teal-500 text-white', hex: '#14b8a6' },
  { label: 'Ciano', class: 'bg-cyan-500 text-white', hex: '#06b6d4' },
  { label: 'Celeste', class: 'bg-sky-500 text-white', hex: '#0ea5e9' },
  { label: 'Blu', class: 'bg-blue-500 text-white', hex: '#3b82f6' },
  { label: 'Blu Scuro', class: 'bg-blue-700 text-white', hex: '#1d4ed8' },
  { label: 'Navy', class: 'bg-slate-800 text-white', hex: '#1e293b' },
  // Neutri / Altri
  { label: 'Grigio', class: 'bg-gray-500 text-white', hex: '#6b7280' },
  { label: 'Grigio Scuro', class: 'bg-gray-700 text-white', hex: '#374151' },
  { label: 'Zinco', class: 'bg-zinc-500 text-white', hex: '#71717a' },
  { label: 'Pietra', class: 'bg-stone-500 text-white', hex: '#78716c' },
  { label: 'Marrone', class: 'bg-amber-800 text-white', hex: '#92400e' },
  { label: 'Bordeaux', class: 'bg-rose-900 text-white', hex: '#881337' },
  { label: 'Viola Scuro', class: 'bg-purple-900 text-white', hex: '#581c87' },
  { label: 'Blu Notte', class: 'bg-blue-950 text-white', hex: '#172554' },
  { label: 'Nero', class: 'bg-black text-white', hex: '#000000' },
  { label: 'Bianco', class: 'bg-white text-slate-900 border border-slate-300', hex: '#ffffff' },
  { label: 'Oro', class: 'bg-yellow-600 text-white', hex: '#ca8a04' },
];

export const CLASSIC_EDITION = {
  id: 'classic_default',
  name: 'Cluedo Classico',
  suspects: ['Miss Scarlett', 'Col. Mustard', 'Dott.ssa White', 'Sig. Green', 'Sig.ra Peacock', 'Prof. Plum'],
  weapons: ['Pugnale', 'Candelabro', 'Rivoltella', 'Corda', 'Tubo di Piombo', 'Chiave Inglese'],
  rooms: ['Ingresso', 'Salotto', 'Sala da Pranzo', 'Cucina', 'Sala da Ballo', 'Serra', 'Sala da Biliardo', 'Biblioteca', 'Studio']
};

export const ADMIN_EMAIL = 'zenida89@gmail.com';
