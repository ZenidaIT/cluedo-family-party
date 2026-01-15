import React from 'react';
import { ArrowLeft, Book, Plus, Edit, Trash2, Copy, Globe, Lock, Save } from 'lucide-react';
import EditionForm from './EditionForm';

const SetupEditionMobile = ({
    // Shared Props
    onSelectEdition,
    user,
    privateEditions,
    publicEditions,
    onBack,
    isAdmin, // computed in container
    
    // Logic/State
    editingId,
    setEditingId,
    startCreate,
    startEdit,
    startClone,
    handleDelete,
    handleSave,
    
    // Form State
    formData,
    setFormData,
    
    // Temp Items State
    tempSuspect, setTempSuspect,
    tempWeapon, setTempWeapon,
    tempRoom, setTempRoom,
    addItem,
    removeItem
}) => {
    
    const allEditions = [...publicEditions, ...privateEditions];
    const isEditing = !!editingId;

    // Mobile View: If Editing, show Full Screen Form, else show List
    if (isEditing) {
        return (
             <div className="w-full bg-white flex flex-col h-[85vh] fixed inset-0 z-50 overflow-hidden">
                {/* Header Editors */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                     <div className="flex items-center gap-3">
                        <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><ArrowLeft size={20}/></button>
                        <span className="font-bold text-slate-800">
                             {editingId === 'NEW' ? 'Nuova' : 'Modifica'}
                        </span>
                     </div>
                     
                     <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2 text-sm">
                        <Save size={18}/> Salva
                     </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                    <EditionForm 
                        formData={formData} 
                        setFormData={setFormData}
                        isAdmin={isAdmin} 
                        handleSave={handleSave} 
                        tempSuspect={tempSuspect} setTempSuspect={setTempSuspect}
                        tempWeapon={tempWeapon} setTempWeapon={setTempWeapon}
                        tempRoom={tempRoom} setTempRoom={setTempRoom}
                        addItem={addItem} removeItem={removeItem}
                    />
                </div>
             </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500"><ArrowLeft size={20}/></button>}
                    <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Book size={20} className="text-indigo-500"/> Edizioni
                    </h2>
                </div>
                <button onClick={startCreate} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700 transition" title="Nuova Edizione">
                    <Plus size={20}/>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
                 {isAdmin && <div className="text-center text-[10px] font-mono bg-indigo-100 text-indigo-800 p-1 rounded uppercase tracking-wider">Admin Mode</div>}
                 
                 {allEditions.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <p>Nessuna edizione.</p>
                    </div>
                 )}

                 {allEditions.map(ed => {
                    const canEdit = ed.isPublic ? isAdmin : true;
                    // Highlight if currently editing this one
                    const isActive = editingId === ed.id;

                    return (
                        <div key={ed.id} 
                            onClick={() => onSelectEdition(ed)}
                            className={`p-4 rounded-xl border transition group cursor-pointer flex flex-col gap-2 bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm`}
                        >
                            <div className="flex items-start justify-between">
                                <h3 className={`font-bold text-base leading-tight ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{ed.name}</h3>
                                {ed.isPublic ? <Globe size={14} className="text-indigo-400"/> : <Lock size={14} className="text-slate-400"/>}
                            </div>
                            
                            <div className="text-xs text-slate-500 flex flex-wrap gap-1 mt-1">
                                <span className="bg-slate-100 px-2 py-1 rounded">Sosp: {ed.suspects?.length || 0}</span>
                                <span className="bg-slate-100 px-2 py-1 rounded">Armi: {ed.weapons?.length || 0}</span>
                                <span className="bg-slate-100 px-2 py-1 rounded">Luo: {ed.rooms?.length || 0}</span>
                            </div>

                            {(canEdit || ed.isPublic) && (
                                <div className="border-t border-slate-100 pt-2 flex justify-end gap-1 mt-2">
                                     {canEdit && <button onClick={(e) => startEdit(e, ed)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded" title="Modifica"><Edit size={18}/></button>}
                                     {canEdit && <button onClick={(e) => handleDelete(e, ed)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded" title="Elimina"><Trash2 size={18}/></button>}
                                     {ed.isPublic && <button onClick={(e) => startClone(e, ed)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Clona"><Copy size={18}/></button>}
                                </div>
                            )}
                        </div>
                    );
                 })}
            </div>
        </div>
    );
};

export default SetupEditionMobile;
