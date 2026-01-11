import React, { useState, useMemo } from 'react';
import { ArrowLeft, GripVertical, Trash2, Plus, UserPlus, Save, Check, Search, X, Pencil, User, Palette } from 'lucide-react';
import { PLAYER_COLORS } from '../constants';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import MySwal from '../utils/swal';

// --- SUB-COMPONENT: EDIT FORM ---
const PlayerEditForm = ({ name, setName, colorIdx, setColorIdx, onSave, onDelete, onCancel, variant = 'card' }) => {
    const isCard = variant === 'card';
    const containerClasses = isCard 
        ? "bg-white p-5 rounded-2xl border border-indigo-100 shadow-xl relative animate-in zoom-in-95 duration-200"
        : "bg-transparent p-0 relative h-full flex flex-col";

    return (
        <div className={containerClasses}>
            {isCard && (
                <button onClick={onCancel} className="absolute top-3 right-3 text-slate-300 hover:text-slate-500">
                    <X size={20}/>
                </button>
            )}
            
            <div className={`mb-6 ${!isCard && 'mt-4'}`}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Giocatore</label>
                <input 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full text-4xl font-black text-slate-800 border-b-2 border-indigo-100 focus:border-indigo-500 outline-none pb-2 bg-transparent transition placeholder:text-slate-200"
                    placeholder="Nome..."
                    autoFocus
                />
            </div>

            <div className="mb-8 flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette size={14}/> Colore Pedina
                </label>
                <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {PLAYER_COLORS.map((c, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setColorIdx(idx)}
                            className={`w-12 h-12 rounded-full transition transform hover:scale-105 flex items-center justify-center shrink-0
                                ${c.class} ring-2 ring-offset-2
                                ${colorIdx === idx ? 'ring-indigo-500 scale-110 shadow-lg' : 'ring-transparent opacity-60 hover:opacity-100'}
                            `}
                            title={c.label}
                        >
                            {colorIdx === idx && <Check size={20} className={idx === 41 ? "text-slate-900" : "text-white"} strokeWidth={3}/>} 
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex gap-3 pt-6 border-t border-slate-100 ${!isCard && 'mt-auto'}`}>
                <button onClick={onSave} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg">
                    <Save size={20}/> Salva Modifiche
                </button>
                <button onClick={onDelete} className="px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100" title="Elimina">
                    <Trash2 size={24}/>
                </button>
                {!isCard && (
                    <button onClick={onCancel} className="px-6 py-4 text-slate-400 hover:bg-slate-50 rounded-xl transition">
                        Annulla
                    </button>
                )}
            </div>
        </div>
    );
};


const SetupPlayers = ({ players, setPlayers, onBack, onStartGame, savedPlayers = [], user, isStandalone = false, onGoHome }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editing State
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
  const handleCreate = async () => {
      const trimmedTerm = searchTerm.trim();
      if (!trimmedTerm) return;

      const existing = savedPlayers.find(p => p.name.toLowerCase() === trimmedTerm.toLowerCase());
      if (existing) {
          MySwal.fire('Attenzione', `${existing.name} è già presente in rubrica.`, 'warning');
      } else {
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
                  title: 'Aggiunto!',
                  timer: 1000,
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

  const startEditing = (sp) => {
      setEditingId(sp.id);
      setEditingName(sp.name);
      setEditingColorIdx(sp.colorIdx !== undefined ? sp.colorIdx : 0);
  };

  const handleUpdatePlayer = async () => {
      if (!editingName.trim() || !editingId) return;
      
      const duplicate = savedPlayers.find(p => p.name.toLowerCase() === editingName.trim().toLowerCase() && p.id !== editingId);
      if (duplicate) {
          return MySwal.fire('Attenzione', `Il nome ${duplicate.name} è già in uso.`, 'warning');
      }

      try {
           await updateDoc(doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players', editingId), {
              name: editingName.trim(),
              colorIdx: editingColorIdx
           });
           
           setEditingId(null);
           setEditingName('');
           setEditingColorIdx(0);
      } catch (e) {
          console.error(e);
          MySwal.fire('Errore', e.message, 'error');
      }
  };

  const handleDeleteSavedPlayer = async () => {
      if (!editingId) return;
      const result = await MySwal.fire({
          title: 'Eliminare?',
          text: "Rimuovere definitivamente dalla rubrica?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Elimina',
          cancelButtonText: 'Annulla'
      });

      if (result.isConfirmed) {
          await deleteDoc(doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players', editingId));
          if (!isStandalone) {
              setPlayers(players.filter(p => p.originalId !== editingId));
          }
          setEditingId(null);
      }
  };

  const addToSquad = (savedP) => {
      if (players.some(p => p.originalId === savedP.id)) return;
      setPlayers([...players, { 
          id: Date.now().toString() + Math.random(), 
          originalId: savedP.id,
          name: savedP.name, 
          colorIdx: savedP.colorIdx !== undefined ? savedP.colorIdx : (players.length % PLAYER_COLORS.length) 
      }]);
  };

  const filteredLibrary = useMemo(() => {
      return savedPlayers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [savedPlayers, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">

        {/* MAIN CONTAINER */}
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[90vh]">
            
            {/* LEFT PANE: LIBRARY (Rubrica) */}
            <div className="flex-1 md:w-1/2 lg:w-5/12 border-r border-slate-200 bg-white flex flex-col min-h-0">
                {/* Header Left */}
                <div className="p-4 border-b border-slate-100 flex flex-col gap-3 shrink-0 z-10 bg-white">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500"><ArrowLeft size={20}/></button>
                            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <User size={20} className="text-indigo-500"/> Rubrica
                            </h2>
                         </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={isStandalone ? "Cerca o crea nuovo..." : "Cerca per aggiungere..."}
                            className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-12 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        />
                        <button onClick={handleCreate} 
                            disabled={!searchTerm.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-white shadow-sm border text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white transition disabled:opacity-50">
                            {savedPlayers.some(p => p.name.toLowerCase() === searchTerm.trim().toLowerCase()) 
                                ? (isStandalone ? <Search size={18}/> : <Plus size={18}/>) 
                                : <Save size={18}/>
                            }
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
                    {filteredLibrary.length === 0 && (
                        <div className="text-center text-slate-400 py-10">
                            {searchTerm ? 'Premi invio per creare.' : 'Rubrica vuota.'}
                        </div>
                    )}

                    {filteredLibrary.map(sp => {
                       const isInSquad = !isStandalone && players.some(p => p.originalId === sp.id);
                       const isEditingThis = editingId === sp.id;
                       
                       const playerColorIdx = sp.colorIdx !== undefined ? sp.colorIdx : (sp.id.charCodeAt(0) % PLAYER_COLORS.length);
                       const playerColorClass = PLAYER_COLORS[playerColorIdx]?.class || 'bg-gray-400';

                       // Handles Toggle logic (if enabled)
                       const handleCardClick = () => {
                           if (!isStandalone) {
                               if (isInSquad) {
                                   const playerToRemove = players.find(p => p.originalId === sp.id);
                                   if (playerToRemove) removeFromSquad(playerToRemove.id);
                               } else {
                                   addToSquad(sp);
                               }
                           }
                           // If Standalone, do nothing on card click.
                       };

                       return (
                           <React.Fragment key={sp.id}>
                               <div 
                                    onClick={handleCardClick}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none
                                        ${isEditingThis
                                            ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' // Highlight when editing
                                            : (isInSquad ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/50 shadow-md' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm')
                                        }
                                    `}
                                >
                                   <div className="flex items-center gap-3 flex-1 min-w-0">
                                       <div className={`w-8 h-8 rounded-full ${playerColorClass} shadow-sm border border-white/50 ring-1 ring-slate-200 shrink-0`}></div>
                                       <span className={`font-bold truncate text-base ${isInSquad ? 'text-indigo-900' : 'text-slate-700'}`}>{sp.name}</span>
                                   </div>

                                   <div className="flex items-center gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); startEditing(sp); }} 
                                            className={`p-2 rounded-full transition ${isInSquad ? 'text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'}`}>
                                            <Pencil size={16}/>
                                        </button>
                                   </div>
                               </div>
                               
                               {/* MOBILE INLINE EDITOR */}
                               {isEditingThis && (
                                   <div className="md:hidden mt-2 mb-4 pl-4 border-l-4 border-indigo-300 animate-in slide-in-from-left-4">
                                        <PlayerEditForm 
                                            name={editingName} setName={setEditingName}
                                            colorIdx={editingColorIdx} setColorIdx={setEditingColorIdx}
                                            onSave={handleUpdatePlayer}
                                            onDelete={handleDeleteSavedPlayer}
                                            onCancel={() => setEditingId(null)}
                                            variant="card"
                                        />
                                   </div>
                               )}
                           </React.Fragment>
                       );
                    })}
                </div>
            </div>

            {/* RIGHT PANE: CONTEXT (Squad or Edit Form) */}
            <div className={`md:w-1/2 lg:w-7/12 bg-white flex-col h-[35vh] md:h-auto border-b md:border-b-0 border-slate-200 shadow-lg md:shadow-none z-20 flex order-1 md:order-2`}>
                
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <h2 className="font-bold text-xl text-slate-800">
                         {isStandalone 
                             ? (editingId ? 'Modifica Giocatore' : 'Dettagli') 
                             : `In gioco (${players.length})` 
                         }
                    </h2>

                    {!isStandalone && !editingId && (
                        <button onClick={onStartGame} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2 animate-in zoom-in">
                            <Check size={20}/> Gioca
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 relative">
                    {/* DESKTOP CONTENT LOGIC */}
                    {isStandalone ? (
                        /* MODE 1: STANDALONE RUBRICA */
                        <div className="hidden md:block h-full">
                            {editingId ? (
                                <div className="h-full">
                                    <PlayerEditForm 
                                        name={editingName} setName={setEditingName}
                                        colorIdx={editingColorIdx} setColorIdx={setEditingColorIdx}
                                        onSave={handleUpdatePlayer}
                                        onDelete={handleDeleteSavedPlayer}
                                        onCancel={() => setEditingId(null)}
                                        variant="flat"
                                    />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                                    <User size={64} className="mb-4 opacity-10"/>
                                    <p className="text-xl font-medium text-slate-500">Seleziona la matita</p>
                                    <p className="text-sm mt-2">per modificare un giocatore.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* MODE 2: GAME SETUP (Always Squad List in Right Pane) */
                        <div className="space-y-3 max-w-2xl mx-auto">
                            {players.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                    <UserPlus size={48} className="mx-auto mb-4 opacity-30"/>
                                    <p className="font-medium text-lg">La tua squadra è vuota.</p>
                                    <p className="text-sm">Aggiungi giocatori dalla Rubrica a sinistra.</p>
                                </div>
                            ) : (
                                players.map((p, idx) => (
                                    <div key={p.id} draggable 
                                        onDragStart={(e) => onDragStart(e, idx)} 
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnter={(e) => onDragEnter(e, idx)}
                                        className="flex items-center gap-3 md:gap-4 bg-white border border-slate-200 p-2 md:p-4 rounded-xl shadow-sm cursor-move hover:border-indigo-300 hover:shadow-md transition group animate-in zoom-in-95 duration-200">
                                        
                                        <GripVertical className="text-slate-300 group-hover:text-indigo-400" size={20}/>
                                        
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${PLAYER_COLORS[p.colorIdx]?.class || 'bg-gray-400'} shadow-md border-2 border-white ring-1 ring-slate-200 flex items-center justify-center font-bold text-white text-[10px] md:text-xs`}>
                                            {idx + 1}
                                        </div>
                                        
                                        <span className="font-bold text-slate-800 text-sm md:text-lg flex-1 truncate">{p.name}</span>
                                        
                                        <button onClick={() => removeFromSquad(p.id)} className="p-1.5 md:p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <X size={20}/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* DESKTOP MODAL (Game Mode Only) */}
            {!isStandalone && editingId && (
                <div className="hidden md:flex fixed inset-0 z-[60] bg-black/20 items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                     <div className="w-full max-w-lg shadow-2xl">
                          <PlayerEditForm 
                                name={editingName} setName={setEditingName}
                                colorIdx={editingColorIdx} setColorIdx={setEditingColorIdx}
                                onSave={handleUpdatePlayer}
                                onDelete={handleDeleteSavedPlayer}
                                onCancel={() => setEditingId(null)}
                            />
                     </div>
                </div>
            )}
            
        </div>
    </div>
  );
};

export default SetupPlayers;
