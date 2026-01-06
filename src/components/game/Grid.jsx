import React from 'react';
import { HelpCircle, Check, X } from 'lucide-react';
import { CELL_STATES, PLAYER_COLORS } from '../../constants';

const COL_WIDTHS = {
    NAME: 120, // px
    SOL: 48,   // px
    PLAYER: 80 // px
};

const Grid = ({ gamePlayers, currentEdition, gridData, onCellClick }) => {

    const getCellIcon = (state) => {
        switch(state) {
          case CELL_STATES.MAYBE: return <HelpCircle size={14} className="text-amber-600 mx-auto" />;
          case CELL_STATES.YES: return <Check size={16} className="text-green-600 mx-auto" strokeWidth={4} />;
          case CELL_STATES.NO: return <X size={14} className="text-red-500 mx-auto opacity-40" strokeWidth={3} />;
          // Solved state is now just YES in the logic, but keeping fail-safe
          case CELL_STATES.SOLVED: return <Check size={16} className="text-green-600 mx-auto" strokeWidth={4} />;
          default: return null;
        }
    };

    const getCellClass = (state) => {
        switch(state) {
            case CELL_STATES.MAYBE: return 'bg-amber-50';
            case CELL_STATES.YES: return 'bg-green-100 ring-1 ring-inset ring-green-400';
            case CELL_STATES.NO: return 'bg-red-50';
            case CELL_STATES.SOLVED: return 'bg-green-100 ring-1 ring-inset ring-green-400';
            default: return '';
        }
    };

    return (
        // Main Container: Centered, minimal padding
        <div className="flex-1 min-h-0 relative flex flex-col items-center bg-slate-100 p-1 lg:p-2 overflow-hidden">
            
            {/* Scroll Wrapper */}
            <div className="w-full max-w-full overflow-auto pb-24 shadow-sm border rounded bg-white">
                <table className="border-collapse w-full font-sans text-xs">
                    
                    {/* TABLE HEADER */}
                    <thead className="bg-slate-50 text-slate-700 font-bold sticky top-0 z-40 shadow-sm leading-none">
                        <tr>
                            {/* Empty Corner (was Carte) */}
                            <th className="bg-slate-50 border-r border-b border-slate-300 min-w-[80px] w-[100px] max-w-[120px] h-8 px-1 text-left align-middle">
                                {/* Intentionally Empty */}
                            </th>

                            {/* Player Headers */}
                            {gamePlayers.map((p) => (
                                <th key={p.id} className="min-w-[45px] w-[55px] max-w-[65px] h-8 border-r border-b border-slate-200/50 bg-slate-50 p-0.5 font-normal relative group">
                                    <div className="flex flex-col items-center justify-center h-full overflow-hidden">
                                        <div className={`w-2 h-2 rounded-full mb-0.5 shrink-0 ${PLAYER_COLORS[p.colorIdx].class}`}></div>
                                        <span className="text-[9px] font-bold text-slate-700 truncate w-full text-center leading-none px-0.5">{p.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody>
                        {[{title: 'Sospettati', items: currentEdition.suspects, color: 'text-rose-700', bg: 'bg-rose-700'},
                          {title: 'Armi', items: currentEdition.weapons, color: 'text-sky-700', bg: 'bg-slate-700'},
                          {title: 'Luoghi', items: currentEdition.rooms, color: 'text-amber-700', bg: 'bg-amber-700'}
                        ].map((section, sIdx) => (
                            <React.Fragment key={sIdx}>
                                {/* SECTION HEADER ROW */}
                                <tr className="bg-white">
                                    <td colSpan={1 + gamePlayers.length} className="p-0 border-b border-slate-200">
                                        <div className={`w-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white ${section.bg}`}>{section.title}</div>
                                    </td>
                                </tr>

                                {/* ITEM ROWS */}
                                {section.items.map((item, idx) => {
                                    // Row coloring
                                    const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';
                                    
                                    // Solution State determines Name Cell styling
                                    const solState = gridData[`${item}_SOLUTION`];
                                    const nameCellClass = getCellClass(solState);

                                    return (
                                        <tr key={item} className={`h-9 ${rowClass} border-b border-slate-100 last:border-0`}>
                                            
                                            {/* Card Name + Solution Integration */}
                                            <td 
                                                onClick={() => onCellClick(item, 'SOLUTION')}
                                                className={`font-semibold text-slate-700 px-2 border-r border-slate-300 truncate cursor-pointer transition-colors active:scale-[0.98] select-none relative ${nameCellClass}`} 
                                                title={item}
                                            >
                                                <div className="flex items-center justify-between gap-1 overflow-hidden">
                                                    <span className={`truncate text-[10px] sm:text-xs ${solState === CELL_STATES.NO ? 'line-through decoration-red-500/50 decoration-2 text-slate-400' : ''}`}>{item}</span>
                                                    {/* Optional: mini icon indicator if needed, but background color is usually enough */}
                                                </div>
                                            </td>

                                            {/* Player Cells */}
                                            {gamePlayers.map((p, pIdx) => (
                                                <td 
                                                    key={pIdx} 
                                                    onClick={() => onCellClick(item, pIdx)}
                                                    className={`border-r border-slate-100 cursor-pointer active:scale-95 transition-all text-center p-0 ${getCellClass(gridData[`${item}_${pIdx}`])}`}
                                                >
                                                    <div className="flex items-center justify-center h-full w-full">
                                                        {getCellIcon(gridData[`${item}_${pIdx}`])}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Grid;
