import React from 'react';
import { X, Save, Trash2, Check, Palette, Ban } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const PlayerEditForm = ({ name, setName, colorIdx, setColorIdx, onSave, onDelete, onCancel, variant = 'card' }) => {
    const isCard = variant === 'card';
    const containerClasses = isCard 
        ? "bg-slate-900 p-5 rounded-2xl border border-slate-700 shadow-xl relative animate-in zoom-in-95 duration-200"
        : "bg-transparent p-0 relative h-full flex flex-col";

    return (
        <div className={containerClasses}>
            {isCard && (
                <button onClick={onCancel} className="absolute top-3 right-3 text-slate-500 hover:text-slate-300">
                    <X size={20}/>
                </button>
            )}
            
            <div className={`mb-6 ${!isCard && 'mt-4'}`}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Giocatore</label>
                <input 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full text-4xl font-black text-slate-100 border-b-2 border-slate-700 focus:border-indigo-500 outline-none pb-2 bg-transparent transition placeholder:text-slate-700"
                    placeholder="Nome..."
                    autoFocus
                />
            </div>

            <div className="mb-8 flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette size={14}/> Colore Pedina
                </label>
                <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-2">
                    {PLAYER_COLORS.map((c, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setColorIdx(idx)}
                            className={`w-12 h-12 rounded-full transition transform hover:scale-105 flex items-center justify-center shrink-0
                                ${c.class} ring-2 ring-offset-2
                                ${colorIdx === idx ? 'ring-indigo-500 scale-110 shadow-lg' : 'ring-transparent opacity-60 hover:opacity-100'}
                            `}
                            title={c.label}
                        >
                            {colorIdx === idx && <Check size={20} className={idx === 41 ? "text-slate-900" : "text-white"} strokeWidth={3}/>} 
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions Bar (Command Area) */}
            <div className={`flex gap-4 pt-6 border-t border-slate-800 items-center ${!isCard && 'mt-auto'}`}>
                {(!isCard || onCancel) && (
                    <button onClick={onCancel} className="flex-1 min-w-[120px] px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 font-bold transition flex items-center justify-center gap-2">
                        <Ban size={18}/> Annulla
                    </button>
                )}
                
                {onDelete && (
                    <button onClick={onDelete} className="flex-1 min-w-[120px] px-4 py-3 rounded-xl border border-rose-900/30 text-rose-400 bg-rose-900/10 hover:bg-rose-900/20 font-bold transition flex items-center justify-center gap-2">
                        <Trash2 size={18}/> Elimina
                    </button>
                )}

                <button onClick={onSave} className="flex-1 min-w-[120px] bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                    <Save size={20}/> Salva
                </button>
            </div>
        </div>

    );
};

export default PlayerEditForm;
