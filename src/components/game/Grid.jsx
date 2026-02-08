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
          case CELL_STATES.MAYBE: return <HelpCircle className="text-amber-700 mx-auto w-3.5 h-3.5 md:w-5 md:h-5 lg:w-6 lg:h-6" />;
          case CELL_STATES.YES: return <Check className="text-green-700 mx-auto w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" strokeWidth={4} />;
          case CELL_STATES.NO: return <X className="text-red-600 mx-auto w-3.5 h-3.5 md:w-5 md:h-5 lg:w-6 lg:h-6" strokeWidth={3} />; 
          // Solved matches YES
          case CELL_STATES.SOLVED: return <Check className="text-green-700 mx-auto w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" strokeWidth={4} />;
          default: return null;
        }
    };

    const getCellClass = (state) => {
        switch(state) {
            case CELL_STATES.MAYBE: return 'bg-amber-100'; // More intense
            case CELL_STATES.YES: return 'bg-green-200';   // More intense, No ring
            case CELL_STATES.NO: return 'bg-red-100';      // More intense
            case CELL_STATES.SOLVED: return 'bg-green-200'; // Match YES
            default: return '';
        }
    };

    return (
        // Main Container: Full Size, Natural Height
        <div className="flex-1 relative flex flex-col bg-white">
            
            {/* Table Wrapper - No Scroll here, parent handles it */}
            <div className="w-full shadow-none bg-white">
                <table className="border-collapse w-full font-sans text-xs md:text-sm lg:text-base">
                    
                    {/* TABLE HEADER */}
                    <thead className="bg-slate-50 text-slate-700 font-bold sticky top-0 z-40 shadow-sm leading-none">
                        <tr>
                            {/* Empty Corner (was Carte) */}
                            <th className="bg-slate-50 border-r border-b border-slate-300 min-w-[80px] w-[100px] max-w-[120px] md:w-[150px] md:max-w-none h-8 md:h-12 px-1 text-left align-middle">
                                {/* Intentionally Empty */}
                            </th>

                            {/* Player Headers */}
                            {gamePlayers.map((p) => (
                                <th key={p.id} className="min-w-[45px] w-[55px] max-w-[65px] md:min-w-[80px] md:w-[100px] md:max-w-none h-8 md:h-12 border-r border-b border-slate-200/50 bg-slate-50 p-0.5 md:p-2 font-normal relative group">
                                    <div className="flex flex-col items-center justify-center h-full overflow-hidden">
                                        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full mb-0.5 md:mb-1 shrink-0 ${PLAYER_COLORS[p.colorIdx].class}`}></div>
                                        <span className="text-[9px] md:text-xs lg:text-sm font-bold text-slate-700 truncate w-full text-center leading-none px-0.5">{p.name}</span>
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
                                        <div className={`w-full px-2 md:px-4 py-1 md:py-2 text-[9px] md:text-xs font-bold uppercase tracking-wider text-white ${section.bg}`}>{section.title}</div>
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
                                        <tr key={item} className={`h-9 md:h-12 lg:h-14 ${rowClass} border-b border-slate-100 last:border-0`}>
                                            
                                            {/* Card Name + Solution Integration */}
                                            <td 
                                                onClick={() => onCellClick(item, 'SOLUTION')}
                                                className={`font-semibold text-slate-700 px-2 md:px-4 border-r border-slate-300 truncate cursor-pointer transition-colors active:scale-[0.98] select-none relative ${nameCellClass}`} 
                                                title={item}
                                            >
                                                <div className="flex items-center justify-between gap-1 overflow-hidden">
                                                    <span className="truncate text-[10px] sm:text-xs md:text-sm lg:text-base">{item}</span>
                                                    {/* Optional: mini icon indicator if needed, but background color is usually enough */}
                                                </div>
                                            </td>

                                            {/* Player Cells */}
                                            {gamePlayers.map((p, pIdx) => (
                                                <td 
                                                    key={pIdx} 
                                                    onClick={() => onCellClick(item, pIdx)}
                                                    className={`border-r border-slate-100 cursor-pointer active:scale-95 transition-all text-center p-0 md:p-1 ${getCellClass(gridData[`${item}_${pIdx}`])}`}
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
