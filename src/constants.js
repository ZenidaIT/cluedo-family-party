export const CELL_STATES = {
  EMPTY: 'empty',
  MAYBE: 'maybe', // Dubbio (?)
  YES: 'yes',     // Certezza (V)
  NO: 'no',       // Esclusione (X)
  SOLVED: 'solved'
};

export const PLAYER_COLORS = [
  // Rossi / Rosa / Aranci
  { label: 'Rosso', class: 'bg-red-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#ef4444' },
  { label: 'Rosso Scuro', class: 'bg-red-700 text-white border-2 border-white ring-1 ring-slate-200', hex: '#b91c1c' },
  { label: 'Corallo', class: 'bg-rose-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#f43f5e' },
  { label: 'Rosa', class: 'bg-pink-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#ec4899' },
  { label: 'Rosa Confetto', class: 'bg-pink-300 text-slate-900 border-2 border-white ring-1 ring-slate-200', hex: '#f9a8d4' },
  { label: 'Fucsia', class: 'bg-fuchsia-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#d946ef' },
  { label: 'Viola', class: 'bg-purple-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#a855f7' },
  { label: 'Lavanda', class: 'bg-purple-400 text-white border-2 border-white ring-1 ring-slate-200', hex: '#c084fc' },
  { label: 'Indaco', class: 'bg-indigo-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#6366f1' },
  
  // Caldi / Gialli
  { label: 'Arancio', class: 'bg-orange-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#f97316' },
  { label: 'Salmone', class: 'bg-orange-300 text-slate-900 border-2 border-white ring-1 ring-slate-200', hex: '#fdba74' },
  { label: 'Ambra', class: 'bg-amber-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#f59e0b' },
  { label: 'Giallo', class: 'bg-yellow-400 text-slate-900 border-2 border-white ring-1 ring-slate-200', hex: '#facc15' },
  { label: 'Crema', class: 'bg-yellow-200 text-slate-900 border-2 border-white ring-1 ring-slate-200', hex: '#fef08a' },
  { label: 'Lime', class: 'bg-lime-400 text-slate-900 border-2 border-white ring-1 ring-slate-200', hex: '#a3e635' },
  { label: 'Oliva', class: 'bg-yellow-800 text-white border-2 border-white ring-1 ring-slate-200', hex: '#854d0e' },
  
  // Verdi / Blu / Ciano
  { label: 'Verde', class: 'bg-green-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#22c55e' },
  { label: 'Verde Scuro', class: 'bg-green-700 text-white border-2 border-white ring-1 ring-slate-200', hex: '#15803d' },
  { label: 'Menta', class: 'bg-emerald-300 text-slate-900 border-2 border-white ring-1 ring-slate-200', hex: '#6ee7b7' },
  { label: 'Smeraldo', class: 'bg-emerald-600 text-white border-2 border-white ring-1 ring-slate-200', hex: '#059669' },
  { label: 'Turchese', class: 'bg-teal-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#14b8a6' },
  { label: 'Ciano', class: 'bg-cyan-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#06b6d4' },
  { label: 'Celeste', class: 'bg-sky-400 text-white border-2 border-white ring-1 ring-slate-200', hex: '#38bdf8' },
  { label: 'Blu', class: 'bg-blue-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#3b82f6' },
  { label: 'Blu Reale', class: 'bg-blue-700 text-white border-2 border-white ring-1 ring-slate-200', hex: '#1d4ed8' },
  { label: 'Navy', class: 'bg-slate-800 text-white border-2 border-white ring-1 ring-slate-200', hex: '#1e293b' },
  { label: 'Blu Notte', class: 'bg-blue-950 text-white border-2 border-white ring-1 ring-slate-200', hex: '#172554' },

  // Neutri / Scuri
  { label: 'Grigio', class: 'bg-gray-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#6b7280' },
  { label: 'Antracite', class: 'bg-gray-800 text-white border-2 border-white ring-1 ring-slate-200', hex: '#1f2937' },
  { label: 'Zinco', class: 'bg-zinc-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#71717a' },
  { label: 'Pietra', class: 'bg-stone-500 text-white border-2 border-white ring-1 ring-slate-200', hex: '#78716c' },
  { label: 'Marrone', class: 'bg-amber-800 text-white border-2 border-white ring-1 ring-slate-200', hex: '#92400e' },
  { label: 'Bordeaux', class: 'bg-rose-900 text-white border-2 border-white ring-1 ring-slate-200', hex: '#881337' },
  { label: 'Melanzana', class: 'bg-purple-900 text-white border-2 border-white ring-1 ring-slate-200', hex: '#581c87' },
  
  // Estremi
  { label: 'Nero', class: 'bg-black text-white border-2 border-white ring-1 ring-slate-200', hex: '#000000' },
  { label: 'Bianco', class: 'bg-white text-slate-900 border-2 border-slate-200 ring-1 ring-slate-300', hex: '#ffffff' },
  { label: 'Oro', class: 'bg-yellow-600 text-white border-2 border-white ring-1 ring-slate-200', hex: '#ca8a04' },
];

export const CLASSIC_EDITION = {
  id: 'classic_default',
  name: 'Cluedo Classico',
  suspects: ['Miss Scarlett', 'Col. Mustard', 'Dott.ssa White', 'Sig. Green', 'Sig.ra Peacock', 'Prof. Plum'],
  weapons: ['Pugnale', 'Candelabro', 'Rivoltella', 'Corda', 'Tubo di Piombo', 'Chiave Inglese'],
  rooms: ['Ingresso', 'Salotto', 'Sala da Pranzo', 'Cucina', 'Sala da Ballo', 'Serra', 'Sala da Biliardo', 'Biblioteca', 'Studio']
};

export const ADMIN_EMAIL = 'zenida89@gmail.com';
