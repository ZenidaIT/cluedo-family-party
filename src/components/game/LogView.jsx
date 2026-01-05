import React from 'react';
import { Briefcase } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const LogView = ({ historyLog, filters, gamePlayers, onEditLog, onDeleteLog, setModals }) => {

    if (historyLog.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-32 flex flex-col items-center justify-center text-slate-400">
                <Briefcase size={48} className="mb-4 opacity-20"/>
                <p>Nessuna ipotesi registrata.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-32">
           <div className="space-y-3">
               {historyLog.filter(entry => {
                   if (filters.asker && entry.askerName !== filters.asker) return false;
                   if (filters.responder && entry.responderName !== filters.responder) return false;
                   if (filters.suspect && entry.cards[0] !== filters.suspect) return false;
                   if (filters.weapon && entry.cards[1] !== filters.weapon) return false;
                   if (filters.room && entry.cards[2] !== filters.room) return false;
                   return true;
               }).map(entry => (
                   <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group">
                       <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-b border-slate-100 text-xs">
                           <div className="flex items-center gap-2 w-1/3">
                               <span className={`w-2 h-2 rounded-full ${PLAYER_COLORS[entry.askerColorIdx].class}`}></span>
                               <span className="font-bold text-slate-800 truncate">{entry.askerName}</span>
                           </div>
                           <div className="text-slate-400 italic text-[10px] uppercase w-1/3 text-center">Contestato da</div>
                           <div className="flex items-center gap-2 justify-end w-1/3">
                               <span className={`font-bold truncate ${entry.responderName === 'Nessuno' ? 'text-slate-400' : 'text-slate-800'}`}>{entry.responderName}</span>
                               {entry.responderColorIdx !== null && <span className={`w-2 h-2 rounded-full ${PLAYER_COLORS[entry.responderColorIdx].class}`}></span>}
                           </div>
                       </div>
                       
                       <div className="flex items-center justify-between px-3 py-3 text-sm">
                           <span className="w-1/3 text-left font-medium text-rose-700 truncate">{entry.cards[0]}</span>
                           <span className="w-1/3 text-center font-medium text-slate-700 truncate">{entry.cards[1]}</span>
                           <span className="w-1/3 text-right font-medium text-amber-700 truncate">{entry.cards[2]}</span>
                       </div>

                       <div className="bg-slate-50 px-3 py-1 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => onEditLog(entry)} className="text-indigo-500 text-xs font-bold hover:underline">Modifica</button>
                           <button onClick={(e) => { e.stopPropagation(); onDeleteLog(entry.id); }} className="text-red-500 text-xs font-bold hover:underline">Elimina</button>
                       </div>
                   </div>
               ))}
           </div>
        </div>
    );
};

export default LogView;
