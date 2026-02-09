import React from 'react';
import { Briefcase } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const LogView = ({ historyLog, filters, gamePlayers, onEditLog, onDeleteLog, setModals, onHighlight, highlightedLogId }) => {

    if (historyLog.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-32 flex flex-col items-center justify-center text-slate-400">
                <Briefcase size={48} className="mb-4 opacity-20"/>
                <p>Nessuna ipotesi registrata.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-2 pb-32">
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
                            rounded-lg border overflow-hidden cursor-pointer transition-all duration-200
                            ${isHighlighted 
                                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
                                : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md'
                            }
                        `}
                   >
                       {/* Header: People involved */}
                       <div className={`
                            flex items-center justify-between px-3 py-1.5 border-b text-[10px] uppercase tracking-wider
                            ${isHighlighted ? 'bg-indigo-100/50 border-indigo-200' : 'bg-slate-50 border-slate-100'}
                       `}>
                           <div className="flex items-center gap-1.5">
                               <span className={`w-3 h-3 rounded-full ring-2 ring-white shadow-sm ${PLAYER_COLORS[entry.askerColorIdx].class}`}></span>
                               <span className="font-bold text-slate-700 truncate max-w-[80px]">{entry.askerName}</span>
                           </div>
                           <div className="text-slate-400 px-1">vs</div>
                           <div className="flex items-center gap-1.5 justify-end">
                               <span className={`font-bold truncate max-w-[80px] ${entry.responderName === 'Nessuno' ? 'text-slate-400' : 'text-slate-700'}`}>{entry.responderName}</span>
                               {entry.responderColorIdx !== null && <span className={`w-3 h-3 rounded-full ring-2 ring-white shadow-sm ${PLAYER_COLORS[entry.responderColorIdx].class}`}></span>}
                           </div>
                       </div>
                       
                       {/* Body: Vertical Triplets */}
                       <div className="px-3 py-2 space-y-1">
                           <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                                <span className="text-xs font-bold text-slate-700 truncate">{entry.cards[0]}</span>
                           </div>
                           <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                                <span className="text-xs font-bold text-slate-700 truncate">{entry.cards[1]}</span>
                           </div>
                           <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                                <span className="text-xs font-bold text-slate-700 truncate">{entry.cards[2]}</span>
                           </div>
                       </div>

                       {/* Actions (Hover only) */}
                       <div className="px-2 py-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 border-t border-slate-50">
                           <button onClick={(e) => { e.stopPropagation(); onEditLog(entry); }} className="text-indigo-500 text-[10px] font-bold hover:underline">MODIFICA</button>
                           <button onClick={(e) => { e.stopPropagation(); onDeleteLog(entry.id); }} className="text-red-500 text-[10px] font-bold hover:underline">ELIMINA</button>
                       </div>
                   </div>
               )})}
           </div>
        </div>
    );
};

export default LogView;
