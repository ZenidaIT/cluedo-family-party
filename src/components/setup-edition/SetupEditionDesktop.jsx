import React from 'react';
import { ArrowLeft, Book, Plus, Edit, Trash2, Copy, Globe, Lock, Save, Play } from 'lucide-react';
import EditionForm from './EditionForm';

const SetupEditionDesktop = ({
    // Shared Props
    onSelectEdition,
    user,
    privateEditions,
    publicEditions,
    onBack,
    isAdmin, // computed in container
    isSelectionMode,
    
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
    
    // Context Detection
    // isSelectionMode is now explicitly passed from parent.
    const allEditions = [...publicEditions, ...privateEditions];
    const isEditing = !!editingId;

    return (
     <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-row h-[90vh]">
        
        {/* LEFT PANE: LIST */}
        <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col h-full">
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

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
                            onClick={(e) => isSelectionMode ? onSelectEdition(ed) : startEdit(e, ed)}
                            className={`relative p-5 rounded-2xl border transition group cursor-pointer flex flex-col gap-3
                                ${isActive ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1'}
                            `}
                        >
                            <div className="flex items-start justify-between">
                                <h3 className={`font-bold text-lg leading-tight ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{ed.name}</h3>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {ed.isPublic 
                                    ? <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-100"><Globe size={10}/> Pubblica</span>
                                    : <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1"><Lock size={10}/> Privata</span>
                                }
                            </div>
                            
                            <div className="text-xs text-slate-500 flex flex-wrap gap-2 mt-auto">
                                <span className="bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">Sospettati: <b>{ed.suspects?.length || 0}</b></span>
                                <span className="bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">Armi: <b>{ed.weapons?.length || 0}</b></span>
                                <span className="bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">Luoghi: <b>{ed.rooms?.length || 0}</b></span>
                            </div>

                            {/* No Actions on Card - pure click interaction */}
                        </div>
                    );
                 })}
            </div>
        </div>

        {/* RIGHT PANE: FORM */}
        <div className="w-2/3 bg-white flex flex-col h-full">
            {/* Header for Right Pane */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                 <h2 className="text-xl font-extrabold text-slate-800">
                    {isEditing ? (editingId === 'NEW' ? 'Nuova Edizione' : 'Modifica Edizione') : 'Seleziona un\'edizione'}
                 </h2>

                 {isEditing && (
                    <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2">
                        <Save size={18}/> Salva
                    </button>
                 )}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                {!isEditing ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Edit size={48} className="mb-4 opacity-20"/>
                        <p className="text-lg">Seleziona un'edizione a sinistra per modificarla</p>
                        <p className="text-sm">oppure creane una nuova con il tasto +</p>
                    </div>
                ) : (
                    <EditionForm 
                        formData={formData} 
                        setFormData={setFormData}
                        isAdmin={isAdmin} 
                        handleSave={handleSave} 
                        // Actions
                        handleDelete={(e) => handleDelete(e, allEditions.find(ed => ed.id === editingId))}
                        handleClone={(e) => startClone(e, allEditions.find(ed => ed.id === editingId))}
                        handleCancel={() => setEditingId(null)}
                        
                        tempSuspect={tempSuspect} setTempSuspect={setTempSuspect}
                        tempWeapon={tempWeapon} setTempWeapon={setTempWeapon}
                        tempRoom={tempRoom} setTempRoom={setTempRoom}
                        addItem={addItem} removeItem={removeItem}
                    />
                )}
            </div>
        </div>
      </div>
    );
};

export default SetupEditionDesktop;
