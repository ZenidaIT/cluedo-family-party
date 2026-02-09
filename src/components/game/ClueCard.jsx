import React from 'react';
import { HelpCircle, Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
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

    // Status visual helpers for the CARD itself (Solution State)
    const getCardStatusStyle = (state) => {
        switch(state) {
            case CELL_STATES.YES: 
            case CELL_STATES.SOLVED:
                return { 
                    border: 'border-green-500', 
                    bg: 'bg-green-50', 
                    text: 'text-green-800',
                    icon: <ShieldCheck size={20} className="text-green-600" />
                };
            case CELL_STATES.NO: 
                return { 
                    border: 'border-red-500', 
                    bg: 'bg-red-50', 
                    text: 'text-red-800', // Removed grayscale/opacity
                    icon: <ShieldAlert size={20} className="text-red-600" />
                };
            case CELL_STATES.MAYBE: 
                return { 
                    border: 'border-amber-400', 
                    bg: 'bg-amber-50', 
                    text: 'text-amber-800',
                    icon: <HelpCircle size={20} className="text-amber-600" />
                };
            default:
                // Start Neutral/White
                return { 
                    border: 'border-slate-200', 
                    bg: 'bg-white', 
                    text: 'text-slate-700',
                    icon: <Shield size={20} className="text-slate-300" />
                };
        }
    };

    // Status visual helpers for PLAYERS (Possession State)
    const getPlayerStatusIcon = (state) => {
        switch(state) {
            case CELL_STATES.YES: return <Check size={16} className="text-green-700" strokeWidth={3} />;
            case CELL_STATES.NO: return <X size={16} className="text-red-600" strokeWidth={3} />;
            case CELL_STATES.MAYBE: return <HelpCircle size={16} className="text-amber-600" strokeWidth={2.5} />;
            default: return <div className="w-4 h-4" />;
        }
    };

    const getPlayerStatusClass = (state) => {
        switch(state) {
            case CELL_STATES.YES: return 'bg-green-100 border-green-400 ring-1 ring-green-400';
            case CELL_STATES.NO: return 'bg-red-100 border-red-400'; // More vivid red
            case CELL_STATES.MAYBE: return 'bg-amber-100 border-amber-400';
            default: return 'bg-white border-slate-200 hover:border-indigo-300';
        }
    };

    const style = getCardStatusStyle(solutionState);
    
    // Logic to visually differentiate "Empty" from "Maybe" if needed, 
    // but usually "Maybe" is the default interactive state or explicit "?"
    // Assuming simple cycling handled by parent logic.

    return (
        <div className={`
            relative flex flex-col border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300
            ${style.border} ${style.bg}
            ${isHighlighted ? 'ring-4 ring-indigo-400 ring-offset-2 z-10 scale-[1.02] shadow-indigo-200' : 'hover:shadow-md hover:scale-[1.01]'}
        `}>
            
            {/* Header: Card Name & Solution Toggle */}
            <div 
                className={`flex items-center justify-between px-3 py-2 border-b-2 ${style.border} cursor-pointer select-none group bg-white/50 backdrop-blur-sm`}
                onClick={() => onCellClick(name, 'SOLUTION')}
                title="Clicca per cambiare stato soluzione"
            >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <div className="shrink-0 transition-transform group-active:scale-95">
                        {style.icon}
                    </div>
                    <span className={`font-black text-sm md:text-base truncate ${style.text} transition-colors tracking-tight`}>
                        {name}
                    </span>
                </div>
            </div>

            {/* Body: Players Grid */}
            <div className="p-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {players.map((p, idx) => {
                    const cellState = gridData[`${name}_${idx}`];
                    return (
                        <div 
                            key={p.id}
                            onClick={() => onCellClick(name, idx)}
                            className={`
                                flex flex-col items-center justify-center p-1.5 rounded-lg border-2 cursor-pointer select-none transition-all
                                ${getPlayerStatusClass(cellState)}
                                active:scale-95
                            `}
                            title={`${p.name}: ${cellState}`}
                        >
                            {/* Player Indicator (Dot) - Made larger/clearer */}
                            <div className={`w-3 h-3 rounded-full mb-1 ring-1 ring-black/10 shadow-sm ${PLAYER_COLORS[p.colorIdx].class}`} />
                            
                            {/* Player Name */}
                            <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center leading-none mb-1">
                                {p.name}
                            </span>

                            {/* Status Icon */}
                            <div className="h-4 flex items-center justify-center">
                                {getPlayerStatusIcon(cellState)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClueCard;
