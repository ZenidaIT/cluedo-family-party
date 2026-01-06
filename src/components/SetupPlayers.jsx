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
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
        {/* MAIN CONTAINER */}
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[90vh]">
            
            {/* LEFT PANE: LIBRARY (Rubrica) */}
            <div className="flex-1 md:w-1/2 lg:w-5/12 border-r border-slate-200 bg-white flex flex-col min-h-0 order-2 md:order-1">
                {/* Header Left */}
                <div className="p-4 border-b border-slate-100 flex flex-col gap-3 shrink-0 z-10 bg-white">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 md:hidden"><ArrowLeft size={20}/></button>
                            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <User size={20} className="text-indigo-500"/> Rubrica
                            </h2>
                         </div>
                         {/* On Desktop, Back button is in the other pane or global */}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={isStandalone ? "Cerca o crea nuovo..." : "Cerca per aggiungere..."}
                            className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-12 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            onKeyDown={e => e.key === 'Enter' && handleAction()}
                        />
                        <button onClick={handleAction} 
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
                       const isEditing = editingId === sp.id;
                       
                       const playerColorIdx = sp.colorIdx !== undefined ? sp.colorIdx : (sp.id.charCodeAt(0) % PLAYER_COLORS.length);
                       const playerColorClass = PLAYER_COLORS[playerColorIdx]?.class || 'bg-gray-400';

                       // In Standalone, clicking edits. In Game, clicking adds to squad.
                       const handleClick = () => {
                           if (isStandalone) {
                               setEditingId(sp.id); 
                               setEditingName(sp.name); 
                               setEditingColorIdx(sp.colorIdx !== undefined ? sp.colorIdx : playerColorIdx); 
                           } else {
                               if (!isInSquad) addToSquad(sp);
                           }
                       };

                       return (
                           <div key={sp.id} 
                                onClick={handleClick}
                                className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer
                                    ${isEditing 
                                        ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                                        : (isInSquad ? 'bg-indigo-50/50 border-indigo-100 opacity-70' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm')
                                    }
                                `}
                            >
                               <div className="flex items-center gap-3 flex-1 min-w-0">
                                   <div className={`w-8 h-8 rounded-full ${playerColorClass} shadow-sm border border-white/50 ring-1 ring-slate-200 shrink-0`}></div>
                                   <span className={`font-bold truncate text-base ${isInSquad ? 'text-indigo-700' : 'text-slate-700'}`}>{sp.name}</span>
                               </div>

                               <div className="flex items-center gap-1">
                                    {/* Edit / Delete Actions */}
                                    <button onClick={(e) => { e.stopPropagation(); 
                                        setEditingId(sp.id); 
                                        setEditingName(sp.name); 
                                        setEditingColorIdx(sp.colorIdx !== undefined ? sp.colorIdx : playerColorIdx); 
                                    }} className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition"><Pencil size={16}/></button>
                               </div>
                           </div>
                       );
                    })}
                </div>
            </div>

            {/* RIGHT PANE: CONTEXT (Squad or Edit Form) */}
            <div className="md:w-1/2 lg:w-7/12 bg-white flex flex-col order-1 md:order-2 h-[35vh] md:h-auto border-b md:border-b-0 border-slate-200 shadow-lg md:shadow-none z-20">
                
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                         {onBack && <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 hidden md:block"><ArrowLeft size={20}/></button>}
                         <h2 className="font-bold text-xl text-slate-800">
                             {isStandalone ? (editingId ? 'Modifica Giocatore' : 'Dettagli') : 'La Tua Squadra'}
                         </h2>
                    </div>

                    {!isStandalone && (
                        <button onClick={onStartGame} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2 animate-in zoom-in">
                            <Check size={20}/> Inizia ({players.length})
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 relative">
                    {isStandalone ? (
                        /* STANDALONE: EDIT FORM */
                        editingId ? (
                            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Giocatore</label>
                                <input 
                                   value={editingName} 
                                   onChange={e => setEditingName(e.target.value)}
                                   className="w-full text-3xl font-black text-slate-800 border-b-2 border-indigo-100 focus:border-indigo-500 outline-none pb-2 bg-transparent transition"
                                   autoFocus
                                   placeholder="Nome..."
                                />

                                <div className="mt-8">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Colore Pedina</label>
                                    <div className="flex flex-wrap gap-3">
                                        {PLAYER_COLORS.map((c, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setEditingColorIdx(idx)}
                                                className={`w-10 h-10 rounded-full transition transform hover:scale-110 flex items-center justify-center
                                                    ${c.class} ring-2 ring-offset-2
                                                    ${editingColorIdx === idx ? 'ring-indigo-500 scale-110' : 'ring-transparent opacity-60 hover:opacity-100'}
                                                `}
                                                title={c.label}
                                            >
                                                {editingColorIdx === idx && <Check size={16} className={idx === 41 ? "text-slate-900" : "text-white"} strokeWidth={3}/>} 
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3 pt-6 border-t border-slate-100">
                                    <button onClick={handleUpdatePlayer} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                        Salva Modifiche
                                    </button>
                                    <button onClick={() => handleDeleteSavedPlayer(editingId)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100">
                                        <Trash2 size={24}/>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                                <User size={64} className="mb-4 opacity-10"/>
                                <p className="text-xl font-medium text-slate-500">Seleziona un giocatore dalla rubrica</p>
                                <p className="text-sm mt-2">per modificare il nome o il colore.</p>
                            </div>
                        )
                    ) : (
                        /* GAME MODE: SQUAD LIST */
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
                                        className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm cursor-move hover:border-indigo-300 hover:shadow-md transition group animate-in zoom-in-95 duration-200">
                                        
                                        <GripVertical className="text-slate-300 group-hover:text-indigo-400" size={20}/>
                                        
                                        <div className={`w-10 h-10 rounded-full ${PLAYER_COLORS[p.colorIdx]?.class || 'bg-gray-400'} shadow-md border-2 border-white ring-1 ring-slate-200 flex items-center justify-center font-bold text-white text-xs`}>
                                            {idx + 1}
                                        </div>
                                        
                                        <span className="font-bold text-slate-800 text-lg flex-1 truncate">{p.name}</span>
                                        
                                        <button onClick={() => removeFromSquad(p.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <X size={20}/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SetupPlayers;
