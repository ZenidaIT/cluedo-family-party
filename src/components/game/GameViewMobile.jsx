import React, { useRef, useState, useEffect } from 'react';
import { Menu, RotateCcw, User, Home, Plus, Filter, Archive, MoreHorizontal } from 'lucide-react';
import Grid from './Grid';
import LogView from './LogView';

const GameViewMobile = ({ 
    currentEdition, 
    gamePlayers, 
    gridData, 
    historyLog, 
    onCellClick, 
    onLogEntry, 
    onNewMatch, 
    onReturnHome, 
    onEditPlayers,
    
    // Modal Controls
    startEditLog,
    setEditingLogId,
    modals,
    setModals,
    filters,
    setFilters
}) => {
    
    const [view, setView] = useState('GRID'); // GRID, LOG
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Auto-switch to LOG when editing (if needed, though modal covers screen usually)
    // Effect to handle view switch if externally requested could go here

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

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-100 font-sans overflow-hidden">
             {/* HEADER */}
             <header className="bg-slate-900 text-white px-4 py-3 shadow-md shrink-0 flex justify-between items-center z-50">
                <button onClick={onReturnHome} className="flex items-center gap-2 font-bold text-lg truncate hover:text-indigo-300 transition-colors max-w-[40%]">
                    <span className="truncate">{currentEdition.name}</span>
                </button>
                
                <div className="flex gap-3 items-center">
                    {/* View Toggles */}
                    <div className="bg-slate-800 p-1 rounded-lg flex">
                        <button onClick={() => setView('GRID')} className={`p-1.5 rounded transition ${view === 'GRID' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}>
                            <Archive size={18}/>
                        </button>
                        <button onClick={() => setView('LOG')} className={`p-1.5 rounded transition ${view === 'LOG' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}>
                            <MoreHorizontal size={18}/>
                        </button>
                    </div>
                    
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white">
                            <Menu size={24}/>
                        </button>
                        
                        {menuOpen && (
                            <div className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[60] animate-in fade-in zoom-in-95 origin-top-right text-slate-800">
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

            {/* MAIN CONTENT */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
                
                {/* GRID VIEW */}
                <div className={`flex-1 flex flex-col min-h-0 ${view === 'GRID' ? 'flex' : 'hidden'}`}>
                     <Grid 
                        gamePlayers={gamePlayers} 
                        currentEdition={currentEdition} 
                        gridData={gridData} 
                        onCellClick={onCellClick} 
                    />
                </div>
                
                {/* LOG VIEW */}
                <div className={`flex-1 flex flex-col min-h-0 ${view === 'LOG' ? 'flex' : 'hidden'}`}>
                    <LogView 
                        historyLog={historyLog} 
                        filters={filters} 
                        gamePlayers={gamePlayers} 
                        onEditLog={(entry) => {
                            startEditLog(entry);
                            // Ensure we stay in LOG view probably, or modal opens on top anyway
                        }}
                        onDeleteLog={(id) => onLogEntry(null, id, true)}
                        setModals={setModals}
                    />
                </div>

                {/* FLOATING ACTION BUTTON (New Hypothesis) */}
                <button 
                    onClick={() => { setEditingLogId(null); setModals({...modals, hypothesis: true}); }}
                    className="fixed bottom-6 right-6 z-[60] bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 active:scale-95 flex items-center justify-center transition-all"
                >
                    <Plus size={32} />
                </button>

                {/* FLOATING FILTER BUTTON (Only in LOG view) */}
                {view === 'LOG' && (
                     <button 
                        onClick={() => setModals({...modals, filters: true})}
                        className="fixed bottom-24 right-6 z-[60] bg-white text-slate-600 w-12 h-12 rounded-full shadow-lg border border-slate-200 hover:text-indigo-600 active:scale-95 flex items-center justify-center transition-all"
                    >
                        <Filter size={20} className={Object.values(filters).some(Boolean) ? 'text-indigo-600' : ''} />
                        {Object.values(filters).some(Boolean) && <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GameViewMobile;
