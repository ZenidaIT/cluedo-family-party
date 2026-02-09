import React, { useRef, useState, useEffect } from 'react';
import { Menu, RotateCcw, User, Home, Plus, Filter, Copy, BookOpen, Settings, ChevronRight, ChevronLeft, LogOut, ZoomIn, X } from 'lucide-react';
import Grid from './Grid';
import LogView from './LogView';
import Swal from 'sweetalert2';

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
    
    // Default Log open on Left as per request "aprire sulla sinistra"
    const [logOpen, setLogOpen] = useState(false);
    
    // Highlight State
    const [highlightedLogId, setHighlightedLogId] = useState(null);
    const [highlightedCards, setHighlightedCards] = useState([]);

    const handleLogHighlight = (id, cards) => {
        if (highlightedLogId === id) {
            // Toggle off
            setHighlightedLogId(null);
            setHighlightedCards([]);
        } else {
            setHighlightedLogId(id);
            setHighlightedCards(cards);
        }
    };

    const handleCopyCode = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Link copiato!"
            });
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleHomeClick = () => {
        Swal.fire({
            title: "Torna alla Lobby?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sì",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                onReturnHome();
            }
        });
    };

    // Helper for Sidebar Buttons
    const SidebarBtn = ({ icon: Icon, label, onClick, active = false, extraClass = '' }) => (
        <button 
            onClick={onClick}
            className={`
                w-full flex flex-col items-center justify-center py-4 px-1 gap-1.5 transition-all
                text-slate-400 hover:text-white hover:bg-slate-800 relative group
                ${active ? 'text-white bg-slate-800 shadow-[inset_4px_0_0_0_#6366f1]' : ''}
                ${extraClass}
            `}
            title={label}
        >
            <Icon size={26} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
        </button>
    );

    return (
        <div className="w-full h-[100dvh] flex bg-slate-100 font-sans overflow-hidden">
             
            {/* 1. NARROW LEFT SIDEBAR - NAVIGATION */}
            <aside className="w-20 bg-slate-900 text-white flex flex-col justify-between shrink-0 z-50 shadow-2xl">
                
                {/* Logo / Home */}
                <div onClick={handleHomeClick} className="h-20 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-800">
                     <Home size={28} className="text-slate-300 hover:text-white transition-colors" />
                </div>

                {/* Main Actions */}
                <nav className="flex-1 overflow-y-auto py-2">
                    <SidebarBtn 
                        icon={Plus} 
                        label="Ipotesi" 
                        onClick={() => { setEditingLogId(null); setModals({...modals, hypothesis: true}); }} 
                    />
                    <SidebarBtn 
                        icon={BookOpen} 
                        label="Diario" 
                        onClick={() => setLogOpen(!logOpen)} 
                        active={logOpen}
                    />
                     <div className="h-px w-10 mx-auto bg-slate-800 my-2"></div>
                    <SidebarBtn 
                        icon={User} 
                        label="Giocatori" 
                        onClick={onEditPlayers} 
                    />
                     <SidebarBtn 
                        icon={RotateCcw} 
                        label="Reset" 
                        onClick={onNewMatch} 
                    />
                </nav>

                {/* Bottom Info */}
                <div className="py-4 border-t border-slate-800 text-center">
                    <div className="text-[9px] text-slate-600 font-mono">v3.0</div>
                </div>
            </aside>


            {/* 2. LOG SIDEBAR (LEFT, EXPANDABLE) */}
            <aside className={`
                bg-white border-r border-slate-200 shadow-xl z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col overflow-hidden
                ${logOpen ? 'w-72 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10'}
            `}>
                <div className="h-14 shrink-0 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/80 backdrop-blur">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg tracking-tight">
                        <BookOpen size={20} className="text-indigo-600"/>
                        Diario
                    </h2>
                    <button onClick={() => setLogOpen(false)} className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={16} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-auto bg-slate-50/30">
                    <LogView 
                        historyLog={historyLog} 
                        filters={filters} 
                        gamePlayers={gamePlayers} 
                        onEditLog={startEditLog}
                        onDeleteLog={(id) => onLogEntry(null, id, true)}
                        setModals={setModals}
                        onHighlight={handleLogHighlight}
                        highlightedLogId={highlightedLogId}
                    />
                </div>
            </aside>


            {/* 3. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-100 overflow-hidden">
                
                {/* Header */}
                <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-30">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">{currentEdition.name}</h1>
                        <span className="text-slate-300">|</span>
                         <button 
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-3 py-1 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-slate-500 hover:text-indigo-700 transition-all group"
                            title="Copia link completo"
                        >
                            <span className="font-mono text-xs font-medium">Codice: {window.location.pathname.split('/').pop()}</span>
                            <Copy size={12} className="opacity-50 group-hover:opacity-100"/>
                        </button>
                    </div>
                </header>

                {/* Scrollable Content - ABSOLUTE FULL SCREEN */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                     <div className="min-h-full p-2">
                        <Grid 
                            gamePlayers={gamePlayers} 
                            currentEdition={currentEdition} 
                            gridData={gridData} 
                            onCellClick={onCellClick} 
                            highlightedCards={highlightedCards}
                        />
                     </div>
                </div>
            </main>

        </div>
    );
};

export default GameViewDesktop;
