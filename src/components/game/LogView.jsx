import React from 'react';
import { Briefcase } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const LogView = ({ historyLog, filters, gamePlayers, onEditLog, onDeleteLog, setModals, onHighlight, highlightedLogId }) => {

    if (historyLog.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto bg-slate-900 p-4 pb-32 flex flex-col items-center justify-center text-slate-600">
                <Briefcase size={48} className="mb-4 opacity-20"/>
                <p>Nessuna ipotesi registrata.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-900 p-2 pb-32 scrollbar-thin scrollbar-thumb-slate-700">
           <div className="space-y-2">
               {historyLog.filter(entry => {
                   if (filters.asker && entry.askerName !== filters.asker) return false;
                   if (filters.responder && entry.responderName !== filters.responder) return false;
                   if (filters.suspect && entry.cards[0] !== filters.suspect) return false;
                   if (filters.weapon && entry.cards[1] !== filters.weapon) return false;
                   if (filters.room && entry.cards[2] !== filters.room) return false;
                   return true;
               }).map(entry => {
                   const isHighlighted = highlightedLogId === entry.id;
                   
                   return (
                   <div 
                        key={entry.id} 
                        onClick={() => onHighlight(entry.id, entry.cards)}
                        className={`
                            rounded-lg border overflow-hidden cursor-pointer transition-all duration-200 relative group
                            ${isHighlighted 
                                ? 'bg-amber-900/20 border-amber-500/50 ring-1 ring-amber-500/50 shadow-[0_4px_20px_rgba(245,158,11,0.2)] z-10' 
                                : 'bg-slate-800 border-slate-700/80 shadow-md hover:border-slate-500 hover:shadow-lg hover:-translate-y-0.5'
                            }
                        `}
                   >
                       {/* Header: People involved */}
                       <div className={`
                            flex items-center justify-between px-3 py-2 border-b text-[10px] uppercase tracking-wider
                            ${isHighlighted ? 'bg-amber-900/40 border-amber-500/30' : 'bg-slate-900/50 border-slate-700'}
                       `}>
                           <div className="flex items-center gap-2">
                               <span className={`w-3 h-3 rounded-full ring-1 ring-slate-900 shadow-sm ${PLAYER_COLORS[entry.askerColorIdx].class}`}></span>
                               <span className="font-bold text-slate-300 truncate max-w-[80px]">{entry.askerName}</span>
                           </div>
                           <div className="text-slate-600 px-1">vs</div>
                           <div className="flex items-center gap-2 justify-end">
                               <span className={`font-bold truncate max-w-[80px] ${entry.responderName === 'Nessuno' ? 'text-slate-500' : 'text-slate-300'}`}>{entry.responderName}</span>
                               {entry.responderColorIdx !== null && <span className={`w-3 h-3 rounded-full ring-1 ring-slate-900 shadow-sm ${PLAYER_COLORS[entry.responderColorIdx].class}`}></span>}
                           </div>
                       </div>
                       
                       {/* Body: Vertical Triplets */}
                       <div className="px-1 py-1 flex flex-col gap-0.5">
                           <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded px-1.5 py-1 text-center shadow-sm">
                               <span className="text-xs font-bold text-slate-200 block tracking-wide">{entry.cards[0]}</span>
                           </div>
                           <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded px-1.5 py-1 text-center shadow-sm">
                               <span className="text-xs font-bold text-slate-200 block tracking-wide">{entry.cards[1]}</span>
                           </div>
                           <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded px-1.5 py-1 text-center shadow-sm">
                               <span className="text-xs font-bold text-slate-200 block tracking-wide">{entry.cards[2]}</span>
                           </div>
                       </div>

                       {/* Actions (Hover only) - Adapted for Mobile/Touch by always showing or explicit logic, but keep hover for desktop */}
                       <div className="px-2 py-1 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 border-t border-slate-700/50">
                           <button onClick={(e) => { e.stopPropagation(); onEditLog(entry); }} className="text-amber-400 text-[10px] font-bold hover:text-amber-300">MODIFICA</button>
                           <button onClick={(e) => { e.stopPropagation(); onDeleteLog(entry.id); }} className="text-red-400 text-[10px] font-bold hover:text-red-300">ELIMINA</button>
                       </div>
                   </div>
               )})}
           </div>
        </div>
    );
};

export default LogView;
