import React, { useRef, useState, useEffect } from 'react';
import { HelpCircle, Check, X, Shield, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';
import { CELL_STATES, PLAYER_COLORS } from '../../constants';

const ClueCard = ({ 
    type, // 'suspect', 'weapon', 'room'
    name, 
    solutionState, 
    players, 
    gridData, 
    onCellClick,
    isHighlighted = false
}) => {
    
    // --- BALANCED COLUMNS LOGIC ---
    const gridRef = useRef(null);
    const [cols, setCols] = useState(2); // Start safe

    useEffect(() => {
        if (!gridRef.current) return;
        const itemCount = players.length;
        const minWidth = 100; // Small but readable tile width
        const gap = 4;

        const calculate = (width) => {
             if (width <= 0) return;
             // Calculate max possible cols
             const maxPossibleCols = Math.floor((width + gap) / (minWidth + gap));
             const safeMaxCols = Math.max(1, maxPossibleCols);
             
             // Dynamic balancing:
             // 1. Calculate how many rows are strictly needed
             const rowsNeeded = Math.ceil(itemCount / safeMaxCols);
             
             // 2. Reduce columns to distribute items evenly across those rows
             // e.g. 5 items, space for 4. Rows=2. OptimalCols = ceil(5/2) = 3.
             // Result: 3 cols (3+2), instead of 4 cols (4+1).
             const optimalCols = Math.ceil(itemCount / Math.max(1, rowsNeeded));
             
             setCols(optimalCols);
        };

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                calculate(entry.contentRect.width);
            }
        });

        observer.observe(gridRef.current);
        return () => observer.disconnect();
    }, [players.length]);
    // ----------------------------

    // ... (rest of helper functions)

    // Status visual helpers for the CARD itself (Solution State)
    // PASTEL HEADERS: Using 500/20 for a softer, pastel-like tint on dark mode
    const getCardStatusStyle = (state) => {
        // ... (unchanged)
        switch(state) {
            case CELL_STATES.YES: 
            case CELL_STATES.SOLVED:
                return { 
                    border: 'border-green-500/50', 
                    headerBg: 'bg-green-500/20', 
                    text: 'text-green-200',
                    // Green Circle with Check
                    icon: (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center shadow-sm">
                            <Check size={12} className="text-green-200" strokeWidth={3} />
                        </div>
                    )
                };
            case CELL_STATES.NO: 
                return { 
                    border: 'border-red-500/50', 
                    headerBg: 'bg-red-500/20',
                    text: 'text-red-200',
                    // Red Circle with X
                    icon: (
                        <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center shadow-sm">
                            <X size={12} className="text-red-200" strokeWidth={3} />
                        </div>
                    )
                };
            case CELL_STATES.MAYBE: 
                return { 
                    border: 'border-amber-500/50', 
                    headerBg: 'bg-amber-500/20',
                    text: 'text-amber-200',
                    // Custom Circle with '?' Text
                    icon: (
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-sm">
                            <span className="text-xs font-black text-amber-200 leading-none">?</span>
                        </div>
                    )
                };
            default:
                // Neutral (Material Surface)
                return { 
                    border: 'border-slate-700', 
                    headerBg: 'bg-slate-700/30', 
                    text: 'text-slate-300',
                    icon: (
                        <div className="w-5 h-5 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center">
                        </div>
                    )
                };
        }
    };

    // Horizontal Layout -> Icons can be simpler
    // Compact: Smaller icons but readable
    const getPlayerStatusIcon = (state) => {
        switch(state) {
            case CELL_STATES.YES: return <Check size={16} className="text-green-400" strokeWidth={3} />;
            case CELL_STATES.NO: return <X size={16} className="text-red-400" strokeWidth={3} />; 
            case CELL_STATES.MAYBE: return <span className="text-base font-black text-amber-400 leading-none">?</span>;
            default: return null;
        }
    };

    // Tile Styles (Background & Border) - Matching Header Logic
    const getPlayerTileClass = (state) => {
        switch(state) {
            case CELL_STATES.YES: return 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30';
            case CELL_STATES.NO: return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'; 
            case CELL_STATES.MAYBE: return 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30';
            default: return 'bg-slate-700/30 border-slate-700 hover:bg-slate-700/50 hover:border-slate-500';
        }
    };

    // Text Colors for Players
    const getPlayerTextClass = (state) => {
        switch(state) {
            case CELL_STATES.YES: return 'text-green-200';
            case CELL_STATES.NO: return 'text-red-200'; 
            case CELL_STATES.MAYBE: return 'text-amber-200';
            default: return 'text-slate-400 group-hover:text-slate-200';
        }
    };

    const style = getCardStatusStyle(solutionState);
    
    // Placeholder Generic Icon (Material Style)
    const GenericIcon = ({ type }) => (
        <div className="w-6 h-6 rounded bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
             <Shield size={12} />
        </div>
    );

    return (
        <div className={`
            relative flex flex-col border rounded-lg overflow-hidden shadow-md transition-all duration-200 h-full
            ${style.border} bg-slate-800
            ${isHighlighted ? 'ring-2 ring-indigo-500 shadow-indigo-500/30 z-10 scale-[1.02]' : 'hover:shadow-lg hover:border-slate-500'}
        `}>
            
            {/* Header: Compact, Pastel Tint */}
            <div 
                className={`flex items-center justify-between px-2.5 py-2 border-b ${style.border} cursor-pointer select-none group ${style.headerBg} backdrop-blur-sm`}
                onClick={() => onCellClick(name, 'SOLUTION')}
                title="Clicca per cambiare stato soluzione"
            >
                {/* Left Side: Icon + Name */}
                <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                    <GenericIcon />
                    
                    <span className={`font-bold text-xs md:text-sm truncate ${style.text} tracking-tight leading-tight`}>
                        {name}
                    </span>
                </div>

                {/* Right Side: Status Icon */}
                <div className=" shrink-0 ml-2 transition-transform group-active:scale-95">
                    {style.icon}
                </div>
            </div>

            {/* Body: Possesso Section (Material Surface) */}
            <div className="p-2 flex-1 flex flex-col bg-slate-800">
                
                {/* Title Section (Restored) */}
                <div className="mb-2 px-1">
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Proprietario</span>
                </div>

                {/* Players Grid: BALANCED GRID */}
                <div 
                    ref={gridRef}
                    className="grid gap-1 w-full"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                >
                    {players.map((p, idx) => {
                        const cellState = gridData[`${name}_${idx}`];
                        
                        return (
                            <div 
                                key={p.id}
                                onClick={() => onCellClick(name, idx)}
                                className={`
                                    flex items-center px-1 py-1.5 rounded border cursor-pointer select-none transition-all
                                    relative overflow-hidden group min-w-0
                                    ${getPlayerTileClass(cellState)}
                                `}
                            >
                                {/* Left: Dot */}
                                <div className={`w-2.5 h-2.5 rounded-full shadow-sm shrink-0 mr-1.5 ${PLAYER_COLORS[p.colorIdx].class} ring-1 ring-white/10`} />
                                
                                {/* Center: Name */}
                                <span className={`flex-1 text-[11px] font-bold truncate leading-none ${getPlayerTextClass(cellState)}`}>
                                    {p.name}
                                </span>

                                {/* Right: Status Icon */}
                                <div className="ml-0.5 w-4 h-4 flex items-center justify-center shrink-0">
                                    {getPlayerStatusIcon(cellState)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ClueCard;
