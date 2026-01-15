import React from 'react';
import { ArrowLeft, User, Search, Plus, Save, Pencil, Check, GripVertical, X, UserPlus } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';
import PlayerEditForm from './PlayerEditForm';

const SetupPlayersDesktop = ({
    user,
    savedPlayers,
    players,
    searchTerm,
    setSearchTerm,
    handleCreate,
    isStandalone,
    onBack,
    onStartGame,
    
    // State for List Logic
    filteredLibrary,
    onToggleSquad, // Logic to add/remove or do nothing
    isInSquad, // (player) => boolean

    // State for Editing
    editingId,
    editingName,
    setEditingName,
    editingColorIdx,
    setEditingColorIdx,
    startEditing,
    handleUpdatePlayer,
    handleDeleteSavedPlayer,
    setEditingId,

    // Dnd
    onDragStart,
    onDragEnter,
    removeFromSquad
}) => {
    return (
     <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-row h-[90vh]">
            
            {/* LEFT PANE: LIBRARY (Rubrica) */}
            <div className="w-5/12 border-r border-slate-200 bg-white flex flex-col min-h-0">
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
                       const inSquad = isInSquad(sp);
                       const isEditingThis = editingId === sp.id;
                       
                       const playerColorIdx = sp.colorIdx !== undefined ? sp.colorIdx : (sp.id.charCodeAt(0) % PLAYER_COLORS.length);
                       const playerColorClass = PLAYER_COLORS[playerColorIdx]?.class || 'bg-gray-400';

                       return (
                           <div key={sp.id} 
                                onClick={() => onToggleSquad(sp)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none
                                    ${isEditingThis
                                        ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' // Highlight when editing
                                        : (inSquad ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/50 shadow-md' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm')
                                    }
                                `}
                            >
                               <div className="flex items-center gap-3 flex-1 min-w-0">
                                   <div className={`w-8 h-8 rounded-full ${playerColorClass} shadow-sm border border-white/50 ring-1 ring-slate-200 shrink-0`}></div>
                                   <span className={`font-bold truncate text-base ${inSquad ? 'text-indigo-900' : 'text-slate-700'}`}>{sp.name}</span>
                               </div>

                               <div className="flex items-center gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); startEditing(sp); }} 
                                        className={`p-2 rounded-full transition ${inSquad ? 'text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'}`}>
                                        <Pencil size={16}/>
                                    </button>
                               </div>
                           </div>
                       );
                    })}
                </div>
            </div>

            {/* RIGHT PANE: CONTEXT (Squad or Edit Form) */}
            <div className={`w-7/12 bg-white flex flex-col h-auto shadow-none z-20 order-2`}>
                
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
                        <div className="block h-full">
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

             {/* DESKTOP MODAL (Game Mode Only) - For editing from list while in game mode */}
             {!isStandalone && editingId && (
                <div className="flex fixed inset-0 z-[60] bg-black/20 items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
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
    );
}

export default SetupPlayersDesktop;
