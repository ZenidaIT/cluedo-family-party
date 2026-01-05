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
          case CELL_STATES.MAYBE: return <HelpCircle size={16} className="text-yellow-600 mx-auto" />;
          case CELL_STATES.YES: return <Check size={18} className="text-green-600 mx-auto" strokeWidth={4} />;
          case CELL_STATES.NO: return <X size={16} className="text-red-500 mx-auto opacity-50" strokeWidth={3} />;
          case CELL_STATES.SOLVED: return <Check size={20} className="text-green-600 mx-auto drop-shadow-md" strokeWidth={4} />;
          default: return null;
        }
    };

    const getCellClass = (state) => {
        switch(state) {
            case CELL_STATES.MAYBE: return 'bg-yellow-50';
            case CELL_STATES.YES: return 'bg-green-100 ring-2 ring-inset ring-green-400';
            case CELL_STATES.NO: return 'bg-red-50 opacity-60';
            case CELL_STATES.SOLVED: return 'bg-green-100 ring-2 ring-inset ring-green-500';
            default: return '';
        }
    };

    return (
        // Main Container: Flex centered for desktop, scrolling for mobile
        <div className="flex-1 min-h-0 relative flex flex-col items-center bg-slate-100 p-2 overflow-hidden">
            
            {/* Scroll Wrapper */}
            <div className="w-full max-w-full overflow-auto pb-32 shadow-sm border rounded-lg bg-white">
                <table className="border-collapse w-max min-w-full font-sans text-sm">
                    
                    {/* TABLE HEADER */}
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-40 shadow-sm leading-none">
                        <tr>
                            {/* Empty Corner */}
                            <th className="bg-slate-100 border-r border-b border-slate-300 min-w-[100px] h-10 px-2 text-left align-bottom pb-1">
                                <span className="text-[10px] text-slate-400 font-normal">Carte</span>
                            </th>

                            {/* Solution Header */}
                            <th className="bg-slate-100 border-r-2 border-b border-slate-300 text-center min-w-[40px] h-10">
                                <div className="text-[10px] text-purple-700 uppercase tracking-wider">Sol</div>
                            </th>

                            {/* Player Headers */}
                            {gamePlayers.map((p) => (
                                <th key={p.id} className="min-w-[70px] h-10 border-r border-b border-slate-200/50 bg-slate-100 p-1 font-normal relative group">
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className={`w-2.5 h-2.5 rounded-full mb-1 ${PLAYER_COLORS[p.colorIdx].class}`}></div>
                                        <span className="text-[10px] font-bold text-slate-700 truncate max-w-full leading-tight">{p.name}</span>
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
                                    <td colSpan={2 + gamePlayers.length} className="p-0 border-b border-slate-200">
                                        <div className={`w-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white ${section.bg}`}>{section.title}</div>
                                    </td>
                                </tr>

                                {/* ITEM ROWS */}
                                {section.items.map((item, idx) => {
                                    const isSolved = gridData[`${item}_SOLUTION`] === CELL_STATES.SOLVED;
                                    const rowClass = isSolved ? 'bg-green-50/50' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50');
                                    
                                    return (
                                        <tr key={item} className={`h-10 ${rowClass} border-b border-slate-100 last:border-0`}>
                                            
                                            {/* Card Name */}
                                            <td className={`font-medium text-slate-700 px-2 border-r border-slate-200 truncate ${rowClass} max-w-[100px]`} title={item}>
                                                <span className="text-xs truncate block">{item}</span>
                                            </td>

                                            {/* Solution Status */}
                                            <td 
                                                onClick={() => onCellClick(item, 'SOLUTION')}
                                                className={`border-r-2 border-slate-300 cursor-pointer min-w-[40px] text-center transition-colors hover:bg-slate-100 ${getCellClass(gridData[`${item}_SOLUTION`])} ${rowClass}`}
                                            >
                                                <div className="flex items-center justify-center h-full w-full">
                                                    {getCellIcon(gridData[`${item}_SOLUTION`])}
                                                </div>
                                            </td>

                                            {/* Player Cells */}
                                            {gamePlayers.map((p, pIdx) => (
                                                <td 
                                                    key={pIdx} 
                                                    onClick={() => onCellClick(item, pIdx)}
                                                    className={`border-r border-slate-100 cursor-pointer active:scale-95 transition-all text-center p-0 min-w-[70px] ${getCellClass(gridData[`${item}_${pIdx}`])}`}
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
