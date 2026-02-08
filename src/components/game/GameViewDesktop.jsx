import React, { useRef, useState, useEffect } from 'react';
import { Menu, RotateCcw, User, Home, Plus, Filter, Copy } from 'lucide-react';
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

    const handleCopyCode = async () => {
        const code = window.location.pathname.split('/').pop();
        try {
            await navigator.clipboard.writeText(code);
            // Simple visual feedback could be added here, but for now relying on system behavior or could add a toast if we had the prop.
            // Using a temporary alert or just console is not enough UX.
            // Let's assume the user knows it copied if clicking.
            // Better: Change icon momentarily? simpler: just copy.
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-100 font-sans overflow-hidden">
             {/* HEADER */}
             <header className="bg-slate-900 text-white px-4 py-2 shadow-md shrink-0 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    {/* Home Button */}
                    <button onClick={onReturnHome} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors" title="Torna al menu">
                        <Home size={24} />
                    </button>
                    
                    {/* Title & Code Group */}
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg leading-tight text-white select-none">
                            {currentEdition.name}
                        </h1>
                        <button 
                            onClick={handleCopyCode}
                            className="text-xs text-slate-400 font-mono hover:text-indigo-300 transition-colors text-left flex items-center gap-1 group w-fit"
                            title="Clicca per copiare il codice partita"
                        >
                            <span>#{window.location.pathname.split('/').pop()}</span>
                            <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-4 items-center">
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
                
                {/* GRID SECTION (LEFT) - Full space now */}
                <div className="flex-1 flex flex-col min-h-0 relative overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                     <Grid 
                        gamePlayers={gamePlayers} 
                        currentEdition={currentEdition} 
                        gridData={gridData} 
                        onCellClick={onCellClick} 
                    />
                </div>
                
                {/* LOG SECTION (RIGHT) - Fixed Sidebar */}
                <div className="w-80 xl:w-96 border-l border-slate-200 bg-white shadow-xl z-20 flex flex-col shrink-0">
                    <LogView 
                        historyLog={historyLog} 
                        filters={filters} 
                        gamePlayers={gamePlayers} 
                        onEditLog={startEditLog}
                        onDeleteLog={(id) => onLogEntry(null, id, true)}
                        setModals={setModals}
                    />
                </div>

                {/* FLOATING ACTION BUTTON - Positioned relative to Sidebar */}
                <button 
                    onClick={() => { setEditingLogId(null); setModals({...modals, hypothesis: true}); }}
                    className="fixed bottom-8 right-[21rem] xl:right-[25rem] z-[60] bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 active:scale-95 flex items-center justify-center transition-all hover:rotate-90"
                    title="Nuova Ipotesi"
                >
                    <Plus size={32} />
                </button>
            </div>
        </div>
    );
};

export default GameViewDesktop;
