import React from 'react';
import { HelpCircle, Check, X, Briefcase } from 'lucide-react';
import { CELL_STATES, PLAYER_COLORS } from '../../constants';

const Grid = ({ gamePlayers, currentEdition, gridData, onCellClick }) => {

    const getCellIcon = (state) => {
        switch(state) {
          case CELL_STATES.MAYBE: return <HelpCircle size={16} className="text-yellow-600 mx-auto" />;
          case CELL_STATES.YES: return <Check size={18} className="text-green-600 mx-auto" strokeWidth={4} />;
          case CELL_STATES.NO: return <X size={16} className="text-red-500 mx-auto opacity-50" strokeWidth={3} />;
          case CELL_STATES.SOLVED: return <Check size={20} className="text-green-600 mx-auto drop-shadow-md" strokeWidth={4} />; // Changed from Briefcase
          default: return null;
        }
    };

    const getCellClass = (state) => {
        switch(state) {
            case CELL_STATES.MAYBE: return 'bg-yellow-50';
            case CELL_STATES.YES: return 'bg-green-100 ring-2 ring-inset ring-green-400';
            case CELL_STATES.NO: return 'bg-red-50 opacity-60';
            case CELL_STATES.SOLVED: return 'bg-green-100 ring-2 ring-inset ring-green-500'; // Match YES style roughly but maybe distinct if needed
            default: return '';
        }
    };

    return (
        <div className="flex-1 min-h-0 overflow-auto bg-slate-100 p-2 pb-32 relative">
            {/* GRID CONTAINER FOR HORIZONTAL SCROLL */}
            <div className="inline-block min-w-full align-middle">
                {/* STICKY HEADER */}
                <div className="sticky top-0 z-40 flex bg-slate-100 pb-2 border-b border-slate-300 pt-2 w-max">
                    {/* Corner Cell - Fixed Left */}
                    <div className="w-[120px] min-w-[120px] sticky left-0 z-50 bg-slate-100 border-r border-slate-200"></div>
                    
                    {/* Solution Column - Fixed 2nd */}
                     <div className="w-12 min-w-[48px] text-center border-r-2 border-slate-300 sticky left-[120px] bg-slate-100 z-50 shadow-[5px_0_10px_-5px_rgba(0,0,0,0.1)]">
                        <div className="text-[10px] font-bold text-purple-700">SOL</div>
                    </div>

                    {/* Player Columns */}
                    {gamePlayers.map((p, i) => (
                        <div key={p.id} className="w-[80px] min-w-[80px] flex flex-col items-center group relative border-r border-slate-200/50 bg-slate-100">
                            <div className={`w-3 h-3 rounded-full mb-1 ${PLAYER_COLORS[p.colorIdx].class}`}></div>
                            <div className="text-[10px] font-bold text-slate-700 truncate max-w-full px-1">{p.name}</div>
                        </div>
                    ))}
                </div>

                {/* SECTIONS */}
                {[{title: 'Sospettati', items: currentEdition.suspects, color: 'text-rose-700', bg: 'bg-rose-700'},
                {title: 'Armi', items: currentEdition.weapons, color: 'text-sky-700', bg: 'bg-slate-700'},
                {title: 'Luoghi', items: currentEdition.rooms, color: 'text-amber-700', bg: 'bg-amber-700'}].map((section, sIdx) => (
                    <div key={sIdx} className="mt-4 bg-white rounded-lg shadow-sm border overflow-hidden w-max">
                        <div className={`${section.bg} text-white text-xs font-bold uppercase px-3 py-1.5 sticky left-0 z-20 w-full`}>{section.title}</div>
                        {section.items.map((item, idx) => {
                            const isSolved = gridData[`${item}_SOLUTION`] === CELL_STATES.SOLVED;
                            const rowBg = isSolved ? 'bg-green-50/50' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50');
                            return (
                                <div key={item} className={`flex border-b last:border-b-0 text-sm ${rowBg} h-10`}>
                                    <div className={`w-[120px] min-w-[120px] px-3 font-medium text-slate-700 border-r flex items-center sticky left-0 z-30 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]`}>
                                        <span className="truncate text-xs">{item}</span>
                                    </div>
                                    
                                    <div onClick={() => onCellClick(item, 'SOLUTION')}
                                        className={`w-12 min-w-[48px] flex items-center justify-center cursor-pointer border-r-2 border-slate-300 sticky left-[120px] z-30 ${rowBg} ${getCellClass(gridData[`${item}_SOLUTION`])} shadow-[5px_0_10px_-5px_rgba(0,0,0,0.1)]`}>
                                        {getCellIcon(gridData[`${item}_SOLUTION`])}
                                    </div>

                                    {gamePlayers.map((p, pIdx) => (
                                        <div key={pIdx} onClick={() => onCellClick(item, pIdx)}
                                            className={`w-[80px] min-w-[80px] border-r flex items-center justify-center cursor-pointer active:scale-95 transition-transform ${getCellClass(gridData[`${item}_${pIdx}`])}`}>
                                            {getCellIcon(gridData[`${item}_${pIdx}`])}
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;
