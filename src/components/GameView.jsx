import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Modal from './Modal';

// Components
import GameViewDesktop from './game/GameViewDesktop';
import GameViewMobile from './game/GameViewMobile';
import SetupPlayers from './SetupPlayers';

const GameView = ({ 
    currentEdition, gamePlayers, setGamePlayers, savedPlayers, user, gridData, historyLog, 
    onCellClick, onLogEntry, onNewMatch, onSaveGame, onLoadHistory, onReturnHome, onEditPlayers 
}) => {
    
    // Global UI State
    const [modals, setModals] = useState({
        hypothesis: false,
        filters: false,
        players: false
    });

    // Form State (Shared between Mobile/Desktop and Modals)
    const [turnAsker, setTurnAsker] = useState(0);
    const [turnResponder, setTurnResponder] = useState(0);
    const [selectedCards, setSelectedCards] = useState({ suspect: '', weapon: '', room: '' });
    const [editingLogId, setEditingLogId] = useState(null);
    const [filters, setFilters] = useState({ asker: '', responder: '', suspect: '', weapon: '', room: '' });

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
    };

    const startEditLog = (entry) => {
        const askerIndex = gamePlayers.findIndex(p => p.id === entry.askerId);
        const responderIndex = entry.responderId ? gamePlayers.findIndex(p => p.id === entry.responderId) + 1 : 0;
        
        setTurnAsker(askerIndex >= 0 ? askerIndex : 0);
        setTurnResponder(responderIndex);
        setSelectedCards({ suspect: entry.cards[0], weapon: entry.cards[1], room: entry.cards[2] });
        setEditingLogId(entry.id);
        setModals({...modals, hypothesis: true});
    };
    
    const viewProps = {
        currentEdition, gamePlayers, gridData, historyLog,
        onCellClick, onLogEntry, onNewMatch, onSaveGame, onLoadHistory, onReturnHome, onEditPlayers,
        startEditLog, setEditingLogId, 
        modals, setModals, 
        filters, setFilters
    };

    return (
        <>
            {/* View Switching */}
            <div className="md:hidden w-full h-full">
                <GameViewMobile {...viewProps} />
            </div>
            
            <div className="hidden md:flex w-full h-full">
                <GameViewDesktop {...viewProps} />
            </div>

            {/* GLOBAL MODALS (Rendered here to be accessible by both views) */}
            
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
                                <select className="w-full p-2 bg-slate-50 border rounded font-medium appearance-none text-slate-800" value={turnAsker} onChange={e => setTurnAsker(Number(e.target.value))}>
                                    {gamePlayers.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-3 text-slate-400" size={14}/>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Chi Risponde?</label>
                            <div className="relative">
                            <select className="w-full p-2 bg-slate-50 border rounded font-medium appearance-none text-slate-800" value={turnResponder} onChange={e => setTurnResponder(Number(e.target.value))}>
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
                                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${selectedCards[field.val] === item ? 'bg-amber-500 text-white border-amber-500 shadow-md transform scale-105 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'}`}>
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
                           <select className="w-full border p-2 rounded mt-1 bg-slate-50 text-slate-800" value={filters.asker} onChange={e => setFilters({...filters, asker: e.target.value})}>
                               <option value="">Tutti</option>
                               {gamePlayers.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                           </select>
                       </div>
                       <div>
                           <label className="text-xs font-bold text-slate-400 uppercase">Chi Risponde</label>
                           <select className="w-full border p-2 rounded mt-1 bg-slate-50 text-slate-800" value={filters.responder} onChange={e => setFilters({...filters, responder: e.target.value})}>
                               <option value="">Tutti</option>
                               <option value="Nessuno">Nessuno</option>
                               {gamePlayers.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                           </select>
                       </div>
                       {[{l:'Sospettato', k:'suspect', lst: currentEdition.suspects}, {l:'Arma', k:'weapon', lst: currentEdition.weapons}, {l:'Luogo', k:'room', lst: currentEdition.rooms}].map(f => (
                           <div key={f.k}>
                               <label className="text-xs font-bold text-slate-400 uppercase">{f.l}</label>
                               <select className="w-full border p-2 rounded mt-1 bg-slate-50 text-slate-800" value={filters[f.k]} onChange={e => setFilters({...filters, [f.k]: e.target.value})}>
                                   <option value="">Tutti</option>
                                   {f.lst.map(i => <option key={i} value={i}>{i}</option>)}
                               </select>
                           </div>
                       ))}
                  </div>
              </Modal>

            {/* Players Editor Modal */}
            <Modal isOpen={modals.players} onClose={() => setModals({...modals, players: false})} title="Gestione Giocatori" maxWidth="max-w-6xl" darkMode={true}>
                 <div className="h-[75vh]">
                    <SetupPlayers 
                        players={gamePlayers}
                        setPlayers={setGamePlayers}
                        savedPlayers={savedPlayers}
                        user={user}
                        isModalMode={true}
                        isStandalone={false}
                        onBack={() => setModals({...modals, players: false})}
                    />
                 </div>
            </Modal>
        </>
    );
};

export default GameView;
