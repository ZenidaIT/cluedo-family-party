import React, { useState, useRef, useEffect } from 'react';
import { Archive, MoreHorizontal, Menu, RotateCcw, User, Home, Plus, Filter, ChevronDown } from 'lucide-react';
import Grid from './game/Grid';
import LogView from './game/LogView';
import Modal from './Modal';
import { PLAYER_COLORS } from '../constants';

const GameView = ({ 
    currentEdition, gamePlayers, gridData, historyLog, 
    onCellClick, onLogEntry, onNewMatch, onSaveGame, onLoadHistory, onReturnHome, onEditPlayers 
}) => {
    
    const [view, setView] = useState('GRID'); // GRID, LOG
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    // Modals
    const [modals, setModals] = useState({
        hypothesis: false,
        filters: false
    });

    // Forms
    const [turnAsker, setTurnAsker] = useState(0);
    const [turnResponder, setTurnResponder] = useState(0);
    const [selectedCards, setSelectedCards] = useState({ suspect: '', weapon: '', room: '' });
    const [editingLogId, setEditingLogId] = useState(null);
    const [filters, setFilters] = useState({ asker: '', responder: '', suspect: '', weapon: '', room: '' });

    // Click Outside Menu
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleSaveLog = () => {
         if (!selectedCards.suspect || !selectedCards.weapon || !selectedCards.room) return;
         
         const asker = gamePlayers[turnAsker];
         const responder = turnResponder === 0 ? null : gamePlayers[turnResponder - 1];

         const entry = {
             id: editingLogId || Date.now(),
             askerId: asker.id,
             askerName: asker.name,
             askerColorIdx: asker.colorIdx,
             responderId: responder ? responder.id : null,
             responderName: responder ? responder.name : 'Nessuno',
             responderColorIdx: responder ? responder.colorIdx : null,
             cards: [selectedCards.suspect, selectedCards.weapon, selectedCards.room],
             timestamp: Date.now()
         };
         
         onLogEntry(entry, editingLogId);
         setModals({...modals, hypothesis: false});
         setEditingLogId(null);
         // Reset selection for next time? Maybe keep them for convenience.
    };

    const startEditLog = (entry) => {
        const askerIndex = gamePlayers.findIndex(p => p.id === entry.askerId);
        const responderIndex = entry.responderId ? gamePlayers.findIndex(p => p.id === entry.responderId) + 1 : 0;
        
        setTurnAsker(askerIndex >= 0 ? askerIndex : 0);
        setTurnResponder(responderIndex);
        setSelectedCards({ suspect: entry.cards[0], weapon: entry.cards[1], room: entry.cards[2] });
        setEditingLogId(entry.id);
        setModals({...modals, hypothesis: true});
        if(view !== 'LOG') setView('LOG');
    };

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-100 font-sans overflow-hidden">
            {/* HEADER */}
            <header className="bg-slate-900 text-white px-4 py-3 shadow-md shrink-0 flex justify-between items-center z-50">
                <button onClick={onReturnHome} className="flex items-center gap-2 font-bold text-lg truncate hover:text-indigo-300 transition-colors">
                    <span className="truncate">{currentEdition.name}</span>
                </button>
                
                <div className="flex gap-3 items-center">
                    <div className="bg-slate-800 p-1 rounded-lg flex lg:hidden">
                        <button onClick={() => setView('GRID')} className={`p-1.5 rounded ${view === 'GRID' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}><Archive size={18}/></button>
                        <button onClick={() => setView('LOG')} className={`p-1.5 rounded ${view === 'LOG' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}><MoreHorizontal size={18}/></button>
                    </div>
                    
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-slate-800 rounded-full transition">
                            <Menu size={24}/>
                        </button>
                        
                        {menuOpen && (
                            <div className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[60] animate-in fade-in zoom-in-95 origin-top-right">
                                <button onClick={() => { setMenuOpen(false); onNewMatch(); }} className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-indigo-700 font-medium flex items-center gap-3">
                                    <RotateCcw size={18}/> Nuova Partita
                                </button>
                                <button onClick={() => { setMenuOpen(false); onEditPlayers(); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 flex items-center gap-3">
                                    <User size={18}/> Modifica Giocatori
                                </button>
                                <div className="border-t my-1"></div>
                                <button onClick={() => { setMenuOpen(false); onReturnHome(); }} className="w-full text-left px-4 py-3 hover:bg-slate-100 text-slate-800 flex items-center gap-3">
                                    <Home size={18}/> Menu Principale
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT - SPLIT VIEW ON LG+ */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
                
                {/* GRID SECTION */}
                <div className={`flex-1 flex flex-col min-h-0 ${(view === 'GRID') ? 'flex' : 'hidden lg:flex'}`}>
                     <Grid 
                        gamePlayers={gamePlayers} 
                        currentEdition={currentEdition} 
                        gridData={gridData} 
                        onCellClick={onCellClick} 
                    />
                </div>
                
                {/* LOG SECTION */}
                <div className={`
                    lg:w-[400px] lg:border-l lg:border-slate-200 lg:bg-white lg:shadow-xl z-20
                    ${(view === 'LOG') ? 'flex-1 flex flex-col min-h-0' : 'hidden lg:flex flex-col'}
                `}>
                    <LogView 
                        historyLog={historyLog} 
                        filters={filters} 
                        gamePlayers={gamePlayers} 
                        onEditLog={startEditLog}
                        onDeleteLog={(id) => onLogEntry(null, id, true)}
                        setModals={setModals}
                    />
                </div>

                {/* FLOATING ACTION & FILTERS (Mobile Only or Adjusted) */}
                <button 
                    onClick={() => { setEditingLogId(null); setModals({...modals, hypothesis: true}); }}
                    className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[60] bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 active:scale-95 flex items-center justify-center transition-all"
                >
                    <Plus size={32} />
                </button>

                {(view === 'LOG' || window.innerWidth >= 1024) && (
                     <button 
                        onClick={() => setModals({...modals, filters: true})}
                        className="fixed bottom-24 right-6 lg:bottom-24 lg:right-8 z-[60] bg-white text-slate-600 w-12 h-12 rounded-full shadow-lg border border-slate-200 hover:text-indigo-600 active:scale-95 flex items-center justify-center transition-all lg:hidden" // Hide on desktop if we put filters inside LogView header? For now keep floating but maybe limit visibility
                    >
                        <Filter size={20} className={Object.values(filters).some(Boolean) ? 'text-indigo-600' : ''} />
                        {Object.values(filters).some(Boolean) && <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>}
                    </button>
                )}
            </div>

            {view === 'LOG' && (
                <button 
                    onClick={() => setModals({...modals, filters: true})}
                    className="fixed bottom-24 right-6 z-[60] bg-white text-slate-600 w-12 h-12 rounded-full shadow-lg border border-slate-200 hover:text-indigo-600 active:scale-95 flex items-center justify-center transition-all"
                >
                    <Filter size={20} className={Object.values(filters).some(Boolean) ? 'text-indigo-600' : ''} />
                    {Object.values(filters).some(Boolean) && <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>}
                </button>
            )}

            {/* MODALS */}
            {/* Hypothesis Modal */}
            <Modal isOpen={modals.hypothesis} onClose={() => setModals({...modals, hypothesis: false})} title={editingLogId ? "Modifica" : "Nuova Ipotesi"}
                footer={
                    <button onClick={handleSaveLog} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg">
                        {editingLogId ? 'Salva Modifiche' : 'Registra'}
                    </button>
                }>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Chi Chiede?</label>
                            <div className="relative">
                                <select className="w-full p-2 bg-slate-50 border rounded font-medium appearance-none" value={turnAsker} onChange={e => setTurnAsker(Number(e.target.value))}>
                                    {gamePlayers.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-3 text-slate-400" size={14}/>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Chi Risponde?</label>
                            <div className="relative">
                            <select className="w-full p-2 bg-slate-50 border rounded font-medium appearance-none" value={turnResponder} onChange={e => setTurnResponder(Number(e.target.value))}>
                                <option value={0}>Nessuno</option>
                                {gamePlayers.map((p, i) => <option key={i} value={i+1}>{p.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-3 text-slate-400" size={14}/>
                            </div>
                        </div>
                    </div>

                    {[
                        {label: 'Sospettato', val: 'suspect', list: currentEdition.suspects},
                        {label: 'Arma', val: 'weapon', list: currentEdition.weapons},
                        {label: 'Luogo', val: 'room', list: currentEdition.rooms},
                    ].map(field => (
                        <div key={field.val}>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{field.label}</label>
                            <div className="flex flex-wrap gap-2">
                                {field.list.map(item => (
                                    <button key={item} 
                                        onClick={() => setSelectedCards({...selectedCards, [field.val]: item})}
                                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${selectedCards[field.val] === item ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
            
             {/* Filters Modal */}
             <Modal isOpen={modals.filters} onClose={() => setModals({...modals, filters: false})} title="Filtri Avanzati"
                     footer={
                         <div className="flex gap-2">
                             <button onClick={() => { setFilters({asker:'',responder:'',suspect:'',weapon:'',room:''}); setModals({...modals, filters: false}); }} className="flex-1 border py-2 rounded text-slate-600">Reset</button>
                             <button onClick={() => setModals({...modals, filters: false})} className="flex-1 bg-indigo-600 text-white py-2 rounded">Applica</button>
                         </div>
                     }>
                  <div className="space-y-4">
                       <div>
                           <label className="text-xs font-bold text-slate-400 uppercase">Chi Chiede</label>
                           <select className="w-full border p-2 rounded mt-1 bg-slate-50" value={filters.asker} onChange={e => setFilters({...filters, asker: e.target.value})}>
                               <option value="">Tutti</option>
                               {gamePlayers.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                           </select>
                       </div>
                       <div>
                           <label className="text-xs font-bold text-slate-400 uppercase">Chi Risponde</label>
                           <select className="w-full border p-2 rounded mt-1 bg-slate-50" value={filters.responder} onChange={e => setFilters({...filters, responder: e.target.value})}>
                               <option value="">Tutti</option>
                               <option value="Nessuno">Nessuno</option>
                               {gamePlayers.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                           </select>
                       </div>
                       {[{l:'Sospettato', k:'suspect', lst: currentEdition.suspects}, {l:'Arma', k:'weapon', lst: currentEdition.weapons}, {l:'Luogo', k:'room', lst: currentEdition.rooms}].map(f => (
                           <div key={f.k}>
                               <label className="text-xs font-bold text-slate-400 uppercase">{f.l}</label>
                               <select className="w-full border p-2 rounded mt-1 bg-slate-50" value={filters[f.k]} onChange={e => setFilters({...filters, [f.k]: e.target.value})}>
                                   <option value="">Tutti</option>
                                   {f.lst.map(i => <option key={i} value={i}>{i}</option>)}
                               </select>
                           </div>
                       ))}
                  </div>
              </Modal>
        </div>
    );
};

export default GameView;
