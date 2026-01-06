import React, { useState, useMemo } from 'react';
import { ArrowLeft, GripVertical, Trash2, Plus, UserPlus, Save, Check, Search, X, Pencil, User } from 'lucide-react';
import { PLAYER_COLORS } from '../constants';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import MySwal from '../utils/swal';

const SetupPlayers = ({ players, setPlayers, onBack, onStartGame, savedPlayers = [], user, isStandalone = false, onGoHome }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingColorIdx, setEditingColorIdx] = useState(0);

  // --- SQUAD LOGIC ---
  const removeFromSquad = (gamePlayerId) => {
      setPlayers(players.filter(p => p.id !== gamePlayerId));
  };

  const movePlayer = (fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;
      const newP = [...players];
      const item = newP[fromIndex];
      newP.splice(fromIndex, 1);
      newP.splice(toIndex, 0, item);
      setPlayers(newP);
  };

  const [draggedPeerIdx, setDraggedPeerIdx] = React.useState(null);
  const onDragStart = (e, idx) => { setDraggedPeerIdx(idx); e.dataTransfer.effectAllowed = "move"; }
  const onDragEnter = (e, targetIdx) => {
       if (draggedPeerIdx !== null && draggedPeerIdx !== targetIdx) {
           movePlayer(draggedPeerIdx, targetIdx);
           setDraggedPeerIdx(targetIdx);
       }
  }

  // --- ADDRESS BOOK LOGIC ---
  const handleAction = async () => {
      const trimmedTerm = searchTerm.trim();
      if (!trimmedTerm) return;

      // 1. Check if ANY match exists (case insensitive)
      const existing = savedPlayers.find(p => p.name.toLowerCase() === trimmedTerm.toLowerCase());

      if (existing) {
          MySwal.fire('Attenzione', `${existing.name} è già presente in rubrica. Scegli un nome univoco.`, 'warning');
      } else {
          // If NOT existing, CREATE NEW
          try {
              const newColorIdx = Math.floor(Math.random() * PLAYER_COLORS.length);
              const docRef = await addDoc(collection(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players'), {
                  name: trimmedTerm,
                  colorIdx: newColorIdx,
                  createdAt: Date.now()
              });
              
              if (!isStandalone) {
                  addToSquad({ id: docRef.id, name: trimmedTerm, colorIdx: newColorIdx });
              }
              setSearchTerm(''); // Clear input
              MySwal.fire({
                  icon: 'success',
                  title: 'Creato',
                  text: `${trimmedTerm} aggiunto alla rubrica!`,
                  timer: 1500,
                  showConfirmButton: false,
                  toast: true,
                  position: 'top-end'
              });

          } catch (e) {
              console.error(e);
              MySwal.fire('Errore', e.message, 'error');
          }
      }
  };

  const handleUpdatePlayer = async () => {
      if (!editingName.trim() || !editingId) return;
      
      // Check for duplicates (excluding self)
      const duplicate = savedPlayers.find(p => p.name.toLowerCase() === editingName.trim().toLowerCase() && p.id !== editingId);
      if (duplicate) {
          return MySwal.fire('Attenzione', `Il nome ${duplicate.name} è già in uso. Scegline uno univoco.`, 'warning');
      }

      try {
           await updateDoc(doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players', editingId), {
              name: editingName.trim(),
              colorIdx: editingColorIdx
           });
           
           // NOTE: We do NOT need to manually update 'players' state here anymore.
           // The parent component (GamePage) syncs 'gamePlayers' with 'savedPlayers' automatically.
           
           setEditingId(null);
           setEditingName('');
           setEditingColorIdx(0);
      } catch (e) {
          console.error(e);
          MySwal.fire('Errore', e.message, 'error');
      }
  };

  const handleDeleteSavedPlayer = async (id) => {
      const result = await MySwal.fire({
          title: 'Eliminare?',
          text: "Rimuovere definitivamente dalla rubrica? Verrà rimosso anche dalla partita corrente.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Elimina',
          cancelButtonText: 'Annulla'
      });

      if (result.isConfirmed) {
          await deleteDoc(doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players', id));
          if (!isStandalone) {
              setPlayers(players.filter(p => p.originalId !== id));
          }
      }
  };

  const addToSquad = (savedP) => {
      if (players.some(p => p.originalId === savedP.id)) return;
      setPlayers([...players, { 
          id: Date.now().toString() + Math.random(), 
          originalId: savedP.id, // CRITICAL: This links to address book
          name: savedP.name, 
          colorIdx: savedP.colorIdx !== undefined ? savedP.colorIdx : (players.length % PLAYER_COLORS.length) 
      }]);
  };

  const filteredLibrary = useMemo(() => {
      return savedPlayers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [savedPlayers, searchTerm]);

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center sm:p-4 z-50">
        <div className="bg-white w-full h-full sm:h-[90vh] max-w-md sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* HEADER */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition"><ArrowLeft size={20}/></button>
                    <h2 className="text-lg font-bold">{isStandalone ? 'Rubrica Giocatori' : 'Gestione Giocatori'}</h2>
                </div>
                {/* Home shortcut if needed */}
                {onGoHome && isStandalone && ( null )}

                {!isStandalone && (
                    <button onClick={onStartGame} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow transition">
                        Inizia ({players.length})
                    </button>
                )}
            </div>

            {/* SQUAD SECTION (Only if NOT standalone) */}
            {!isStandalone && (
                <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex-shrink-0 max-h-[35%] overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">La Tua Squadra</h3>
                        <span className="text-xs text-indigo-400">Trascina per ordinare</span>
                    </div>
                    
                    {players.length === 0 ? (
                        <div className="text-center py-6 text-indigo-300 border-2 border-dashed border-indigo-200 rounded-lg bg-white/50">
                            Digita un nome sotto e premi Invio
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {players.map((p, idx) => (
                                <div key={p.id} draggable 
                                    onDragStart={(e) => onDragStart(e, idx)} 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={(e) => onDragEnter(e, idx)}
                                    className="flex items-center gap-3 bg-white border border-indigo-100 p-2 rounded-lg shadow-sm cursor-move animate-in zoom-in-95 duration-200">
                                    <GripVertical className="text-slate-300" size={16}/>
                                    {/* Small visual fix for white color in squad view too if needed, but constants handles it. No icon inside. */}
                                    <div className={`w-6 h-6 rounded-full ${PLAYER_COLORS[p.colorIdx]?.class || 'bg-gray-400'} shadow-sm border border-black/5`}></div>
                                    <span className="font-bold text-slate-700 flex-1 truncate">{p.name}</span>
                                    <button onClick={() => removeFromSquad(p.id)} className="text-slate-300 hover:text-red-500 p-1">
                                        <X size={16}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* LIBRARY SECTION */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-4 border-b bg-white z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                        <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={isStandalone ? "Cerca o crea nuovo..." : "Cerca o crea per aggiungere..."}
                        className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-12 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        onKeyDown={e => e.key === 'Enter' && handleAction()}
                        />
                        <button onClick={handleAction} 
                            disabled={!searchTerm.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white transition disabled:opacity-50">
                            {savedPlayers.some(p => p.name.toLowerCase() === searchTerm.trim().toLowerCase()) 
                                ? (isStandalone ? <Search size={18}/> : <Plus size={18}/>) 
                                : <Save size={18}/>
                            }
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredLibrary.length === 0 && (
                        <div className="text-center text-slate-400 py-8">
                            {searchTerm ? 'Premi invio per creare.' : 'Rubrica.'}
                        </div>
                    )}

                    {filteredLibrary.map(sp => {
                       const isInSquad = !isStandalone && players.some(p => p.originalId === sp.id);
                       const isEditing = editingId === sp.id;
                       
                       const playerColorIdx = sp.colorIdx !== undefined ? sp.colorIdx : (sp.id.charCodeAt(0) % PLAYER_COLORS.length);
                       const playerColorClass = PLAYER_COLORS[playerColorIdx]?.class || 'bg-gray-400';

                       return (
                           <div key={sp.id} className={`flex flex-col p-3 rounded-lg border transition-all ${isEditing ? 'bg-white border-indigo-500 shadow-md z-10' : (isInSquad ? 'bg-indigo-50 border-indigo-100 opacity-80' : 'bg-white hover:border-indigo-300')}`}>
                               
                               {/* ROW 1: Main Info */}
                               <div className="flex items-center justify-between gap-3">
                                   {isEditing ? (
                                       <div className="flex-1 flex gap-2">
                                           <input 
                                               value={editingName} 
                                               onChange={e => setEditingName(e.target.value)}
                                               className="flex-1 border-b-2 border-indigo-500 px-2 py-1 text-lg font-bold outline-none text-slate-800 bg-transparent"
                                               autoFocus
                                               placeholder="Nome giocatore"
                                            />
                                       </div>
                                   ) : (
                                       <div className="flex items-center gap-3 flex-1 overflow-hidden group">
                                           {/* CLICKABLE COLOR CIRCLE FOR EDITING */}
                                           <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(sp.id); 
                                                    setEditingName(sp.name); 
                                                    setEditingColorIdx(sp.colorIdx !== undefined ? sp.colorIdx : playerColorIdx); 
                                                }}
                                                className={`w-8 h-8 rounded-full shadow-inner ${playerColorClass} border-2 border-white/50 ring-1 ring-slate-200 transition transform hover:scale-110 flex shrink-0`}
                                                title="Cambia Colore / Modifica"
                                           ></button>
                                           
                                           {/* NAME CLICK ADDS TO SQUAD */}
                                           <div className="flex-1 truncate flex items-center gap-2 cursor-pointer" onClick={() => !isInSquad && !isStandalone && addToSquad(sp)}>
                                                <span className={`font-medium text-lg leading-tight ${isInSquad ? 'text-indigo-700' : 'text-slate-700'}`}>{sp.name}</span>
                                                {isInSquad && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">In Gioco</span>}
                                           </div>
                                       </div>
                                   )}

                                   {/* ACTIONS */}
                                   <div className="flex items-center gap-1">
                                       {isEditing ? (
                                           <>
                                                <button onClick={handleUpdatePlayer} className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow"><Check size={18}/></button>
                                                <button onClick={() => {setEditingId(null); setEditingName(''); setEditingColorIdx(0);}} className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg"><X size={18}/></button>
                                           </>
                                       ) : (
                                           <>
                                                {!isInSquad && !isStandalone && (
                                                    <button onClick={() => addToSquad(sp)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full">
                                                        <Plus size={18}/>
                                                    </button>
                                                )}
                                                <button onClick={() => { 
                                                    setEditingId(sp.id); 
                                                    setEditingName(sp.name); 
                                                    setEditingColorIdx(sp.colorIdx !== undefined ? sp.colorIdx : playerColorIdx); 
                                                }} className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-slate-50 rounded-full">
                                                    <Pencil size={16}/>
                                                </button>
                                                <button onClick={() => handleDeleteSavedPlayer(sp.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full">
                                                    <Trash2 size={16}/>
                                                </button>
                                           </>
                                       )}
                                   </div>
                               </div>

                               {/* ROW 2: Color Picker (Only when editing) */}
                               {isEditing && (
                                   <div className="mt-4 animate-in slide-in-from-top-2">
                                       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Colore</label>
                                       <div className="flex flex-wrap gap-2">
                                           {PLAYER_COLORS.map((c, idx) => (
                                               <button 
                                                    key={idx}
                                                    onClick={() => setEditingColorIdx(idx)}
                                                    className={`w-8 h-8 rounded-full border-2 transition hover:scale-110 flex items-center justify-center
                                                        ${c.class}
                                                        ${editingColorIdx === idx ? 'border-slate-800 ring-2 ring-slate-300 scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}
                                                    `}
                                                    title={c.label}
                                                    // Ensure white has visibility: The class from constants includes border-slate-300 for white.
                                                    // That should be enough, but we can enforce local override if needed? No, constants is cleaner.
                                               >
                                                   {editingColorIdx === idx && <Check size={12} className={idx === 41 ? "text-slate-900" : "text-white drop-shadow-md"}/>} 
                                                   {/* If color is white (idx 41 approx), make checkmark dark */}
                                               </button>
                                           ))}
                                       </div>
                                   </div>
                               )}
                           </div>
                       );
                    })}
                </div>
            </div>

        </div>
    </div>
  );
};

export default SetupPlayers;
