import React from 'react';
import { X, Save, Trash2, Check, Palette } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const PlayerEditForm = ({ name, setName, colorIdx, setColorIdx, onSave, onDelete, onCancel, variant = 'card' }) => {
    const isCard = variant === 'card';
    const containerClasses = isCard 
        ? "bg-white p-5 rounded-2xl border border-indigo-100 shadow-xl relative animate-in zoom-in-95 duration-200"
        : "bg-transparent p-0 relative h-full flex flex-col";

    return (
        <div className={containerClasses}>
            {isCard && (
                <button onClick={onCancel} className="absolute top-3 right-3 text-slate-300 hover:text-slate-500">
                    <X size={20}/>
                </button>
            )}
            
            <div className={`mb-6 ${!isCard && 'mt-4'}`}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Giocatore</label>
                <input 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full text-4xl font-black text-slate-800 border-b-2 border-indigo-100 focus:border-indigo-500 outline-none pb-2 bg-transparent transition placeholder:text-slate-200"
                    placeholder="Nome..."
                    autoFocus
                />
            </div>

            <div className="mb-8 flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette size={14}/> Colore Pedina
                </label>
                <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
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

            <div className={`flex gap-3 pt-6 border-t border-slate-100 ${!isCard && 'mt-auto'}`}>
                <button onClick={onSave} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg">
                    <Save size={20}/> Salva Modifiche
                </button>
                <button onClick={onDelete} className="px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100" title="Elimina">
                    <Trash2 size={24}/>
                </button>
                {!isCard && (
                    <button onClick={onCancel} className="px-6 py-4 text-slate-400 hover:bg-slate-50 rounded-xl transition">
                        Annulla
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlayerEditForm;
