import React from 'react';
import { Save, Plus, X, Edit, Copy, Trash2, Ban } from 'lucide-react';

const EditionForm = ({ 
    formData, 
    setFormData, 
    isAdmin, 
    handleSave, 
    isNew, // boolean to check if NEW or EDIT
    // Temp states for lists
    tempSuspect, setTempSuspect,
    tempWeapon, setTempWeapon,
    tempRoom, setTempRoom,
    addItem, 
    removeItem,
    // Actions props
    handleDelete,
    handleClone,
    handleCancel
}) => {
    
    // Helper to render sections
    const renderSection = (title, key, val, setVal, color, bg) => (
        <div key={key} className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 ${key === 'rooms' ? 'lg:col-span-2' : ''}`}>
            <h3 className={`font-bold ${color} uppercase text-xs tracking-wider mb-4 flex items-center gap-2`}>
                {title} <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">{formData[key].length}</span>
            </h3>
            
            <div className="flex gap-2 mb-4">
                <input 
                    value={val} 
                    onChange={e => setVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addItem(key, val, setVal)}
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder={`Aggiungi ${title}...`}
                />
                <button onClick={() => addItem(key, val, setVal)} className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl transition shadow-lg shadow-slate-200"><Plus size={20}/></button>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {formData[key].map((item, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 flex items-center gap-2 shadow-sm">
                        {item}
                        <button onClick={() => removeItem(key, idx)} className="text-slate-300 hover:text-red-500 transition"><X size={14}/></button>
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Name Input */}
            <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Nome Edizione</label>
                 <input 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full text-2xl font-bold border-b-2 border-slate-200 focus:border-indigo-600 outline-none py-2 bg-transparent transition-colors placeholder:text-slate-300"
                    placeholder="Nome..."
                    autoFocus
                />
                {isAdmin && (
                    <div className="mt-2 flex items-center gap-2">
                        <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} className="rounded text-indigo-600 w-4 h-4"/>
                        <span className="text-sm font-bold text-indigo-900">Pubblica</span>
                    </div>
                )}
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSection('Sospettati', 'suspects', tempSuspect, setTempSuspect, 'text-rose-600', 'bg-rose-50')}
                {renderSection('Armi', 'weapons', tempWeapon, setTempWeapon, 'text-sky-600', 'bg-sky-50')}
                {renderSection('Luoghi', 'rooms', tempRoom, setTempRoom, 'text-amber-600', 'bg-amber-50')}
            </div>

            {/* Actions Bar (Command Area) */}
            <div className="flex gap-4 pt-6 border-t border-slate-100 mt-8 items-center">
                {handleCancel && (
                    <button onClick={handleCancel} className="min-w-[140px] px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold transition flex items-center justify-center gap-2">
                        <Ban size={18}/> Annulla
                    </button>
                )}

                <div className="flex-1 flex gap-2 justify-center">
                    {/* Delete (Only if not New and Author/Admin) */}
                    {!isNew && handleDelete && (
                        <button onClick={handleDelete} className="min-w-[140px] px-4 py-3 rounded-xl border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 font-bold transition flex items-center justify-center gap-2">
                            <Trash2 size={18}/> Elimina
                        </button>
                    )}
                    
                    {/* Clone (Only if not NEW) */}
                    {!isNew && handleClone && (
                        <button onClick={handleClone} className="min-w-[140px] px-4 py-3 rounded-xl border border-emerald-100 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-bold transition flex items-center justify-center gap-2">
                            <Copy size={18}/> Duplica
                        </button>
                    )}
                </div>

                <button onClick={handleSave} className="min-w-[160px] bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                    <Save size={20}/> Salva
                </button>
            </div>
        </div>
    );
};

export default EditionForm;
