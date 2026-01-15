import React, { useRef, useState, useEffect } from 'react';
import { Menu, RotateCcw, User, Home, Plus, Filter } from 'lucide-react';
import Grid from './Grid';
import LogView from './LogView';

const GameViewDesktop = ({ 
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
    
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
             <header className="bg-slate-900 text-white px-6 py-3 shadow-md shrink-0 flex justify-between items-center z-50">
                <button onClick={onReturnHome} className="flex items-center gap-2 font-bold text-lg hover:text-indigo-300 transition-colors">
                    <span>{currentEdition.name}</span>
                </button>
                
                <div className="flex gap-4 items-center">
                    <span className="text-slate-400 text-sm font-medium hidden xl:block">
                        Codice Partita: <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded select-all">{window.location.pathname.split('/').pop()}</span>
                    </span>
                    
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white">
                            <Menu size={24}/>
                        </button>
                        
                        {menuOpen && (
                            <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[60] animate-in fade-in zoom-in-95 origin-top-right text-slate-800">
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

            {/* MAIN CONTENT - SPLIT VIEW */}
            <div className="flex-1 min-h-0 flex flex-row overflow-hidden relative">
                
                {/* GRID SECTION (LEFT) */}
                <div className="flex-1 flex flex-col min-h-0">
                     <Grid 
                        gamePlayers={gamePlayers} 
                        currentEdition={currentEdition} 
                        gridData={gridData} 
                        onCellClick={onCellClick} 
                    />
                </div>
                
                {/* LOG SECTION (RIGHT) */}
                <div className="w-[35%] xl:w-[30%] border-l border-slate-200 bg-white shadow-xl z-20 max-w-md flex flex-col">
                    <LogView 
                        historyLog={historyLog} 
                        filters={filters} 
                        gamePlayers={gamePlayers} 
                        onEditLog={startEditLog}
                        onDeleteLog={(id) => onLogEntry(null, id, true)}
                        setModals={setModals}
                    />
                </div>

                {/* FLOATING ACTION BUTTON */}
                <button 
                    onClick={() => { setEditingLogId(null); setModals({...modals, hypothesis: true}); }}
                    className="fixed bottom-8 right-[37%] xl:right-[32%] z-[60] bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 active:scale-95 flex items-center justify-center transition-all hover:rotate-90"
                    title="Nuova Ipotesi"
                >
                    <Plus size={32} />
                </button>
            </div>
        </div>
    );
};

export default GameViewDesktop;
