import React, { useState } from 'react';
import { Plus, Trash2, Edit, ChevronRight, X, Save, ArrowLeft, Copy, Globe, Lock, Book } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import MySwal from '../utils/swal';
import { ADMIN_EMAIL } from '../constants'; 

const SetupEdition = ({ onSelectEdition, user, privateEditions = [], publicEditions = [], onBack, onGoHome }) => {
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ name: '', suspects: [], weapons: [], rooms: [], isPublic: false });
  
  // Temp inputs for lists
  const [tempSuspect, setTempSuspect] = useState('');
  const [tempWeapon, setTempWeapon] = useState('');
  const [tempRoom, setTempRoom] = useState('');

  const isAdmin = user?.email === ADMIN_EMAIL;

  const startCreate = () => {
    setEditingId('NEW');
    setFormData({ name: '', suspects: [], weapons: [], rooms: [], isPublic: false });
  };

  const startEdit = (e, edition) => {
    e.stopPropagation();
    setEditingId(edition.id);
    setFormData({ ...edition });
  };

  const startClone = (e, edition) => {
      e.stopPropagation();
      setEditingId('NEW');
      setFormData({ 
          ...edition, 
          name: `${edition.name} (Copia)`,
          isPublic: false 
      });
  };

  const handleDelete = async (e, edition) => {
    e.stopPropagation();
    
    // Use SweetAlert for consistency
    const result = await MySwal.fire({
        title: 'Eliminare Edizione?',
        text: "Questa azione non è reversibile.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sì, elimina',
        cancelButtonText: 'Annulla'
    });

    if (result.isConfirmed) {
        try {
            const collectionPath = edition.isPublic && isAdmin 
                ? 'public_editions' 
                : `artifacts/default-app-id/users/${user.uid}/editions`;
                
            if (edition.isPublic && !isAdmin) return; 

            // Deleting from the correct collection
            await deleteDoc(doc(db, collectionPath, edition.id));
            
            MySwal.fire('Eliminata!', '', 'success');
        } catch (error) {
            console.error("Delete error:", error);
            MySwal.fire('Errore', error.message, 'error');
        }
    }
  };

  const handleSave = async () => {
    if (!formData.name) return MySwal.fire('Attenzione', "Inserisci un nome per l'edizione.", 'warning');
    if (formData.suspects.length < 2 || formData.weapons.length < 2 || formData.rooms.length < 2) {
        return MySwal.fire('Attenzione', "Inserisci almeno 2 elementi per categoria.", 'warning');
    }

    try {
        const collectionRef = (formData.isPublic && isAdmin)
            ? collection(db, 'public_editions')
            : collection(db, 'artifacts', 'default-app-id', 'users', user.uid, 'editions');

        if (editingId === 'NEW') {
             const { id, ...dataToSave } = formData;
             await addDoc(collectionRef, {
                ...dataToSave,
                createdAt: Date.now()
            });
        } else {
             const docRef = (formData.isPublic && isAdmin)
                ? doc(db, 'public_editions', editingId)
                : doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'editions', editingId);

             await updateDoc(docRef, formData);
        }
        MySwal.fire({ icon: 'success', title: 'Salvato!', timer: 1500, showConfirmButton: false });
        setEditingId(null);
    } catch (error) {
        console.error("Error saving edition:", error);
        MySwal.fire('Errore', error.message, 'error');
    }
  };

  const addItem = (listKey, value, setter) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [listKey]: [...prev[listKey], value.trim()] }));
    setter('');
  };

  const removeItem = (listKey, index) => {
    setFormData(prev => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));
  };

  // --- RENDER ---
  const allEditions = [...publicEditions, ...privateEditions];
  const isEditing = !!editingId;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[90vh]">
        
        {/* LEFT PANE: LIST */}
        <div className={`md:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col ${isEditing ? 'hidden md:flex' : 'flex h-full'}`}>
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
                            onClick={(e) => startEdit(e, ed)}
                            className={`p-4 rounded-xl border transition group cursor-pointer flex flex-col gap-2
                                ${isActive ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}
                            `}
                        >
                            <div className="flex items-start justify-between">
                                <h3 className={`font-bold text-base leading-tight ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{ed.name}</h3>
                                {ed.isPublic ? <Globe size={14} className="text-indigo-400"/> : <Lock size={14} className="text-slate-400"/>}
                            </div>
                            
                            <div className="text-xs text-slate-500 flex flex-wrap gap-1 mt-1">
                                <span className="bg-slate-100 px-2 py-1 rounded">Sospettati: <b>{ed.suspects?.length || 0}</b></span>
                                <span className="bg-slate-100 px-2 py-1 rounded">Armi: <b>{ed.weapons?.length || 0}</b></span>
                                <span className="bg-slate-100 px-2 py-1 rounded">Luoghi: <b>{ed.rooms?.length || 0}</b></span>
                            </div>

                            {(canEdit || ed.isPublic) && (
                                <div className="border-t border-slate-100 pt-2 flex justify-end gap-1 mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                     {/* Buttons logic same as before but always visible on mobile */}
                                     {canEdit && <button onClick={(e) => handleDelete(e, ed)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button>}
                                     {ed.isPublic && <button onClick={(e) => startClone(e, ed)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Copy size={18}/></button>}
                                </div>
                            )}
                        </div>
                    );
                 })}
            </div>
        </div>

        {/* RIGHT PANE: FORM */}
        <div className={`md:w-2/3 bg-white flex flex-col ${!isEditing ? 'hidden md:flex' : 'flex h-full fixed inset-0 z-50 md:static'}`}>
            {/* Header for Right Pane */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                 <div className="flex items-center gap-3 md:hidden">
                    <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><ArrowLeft size={20}/></button>
                    <span className="font-bold">Indietro</span>
                 </div>
                 
                 <h2 className="text-xl font-extrabold text-slate-800 hidden md:block">
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
                            {[
                                { title: 'Sospettati', key: 'suspects', val: tempSuspect, setVal: setTempSuspect, color: 'text-rose-600', bg: 'bg-rose-50' },
                                { title: 'Armi', key: 'weapons', val: tempWeapon, setVal: setTempWeapon, color: 'text-sky-600', bg: 'bg-sky-50' },
                                { title: 'Luoghi', key: 'rooms', val: tempRoom, setVal: setTempRoom, color: 'text-amber-600', bg: 'bg-amber-50' }
                            ].map(section => (
                                <div key={section.key} className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 ${section.key === 'rooms' ? 'lg:col-span-2' : ''}`}>
                                    <h3 className={`font-bold ${section.color} uppercase text-xs tracking-wider mb-4 flex items-center gap-2`}>
                                        {section.title} <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">{formData[section.key].length}</span>
                                    </h3>
                                    
                                    <div className="flex gap-2 mb-4">
                                        <input 
                                            value={section.val} 
                                            onChange={e => section.setVal(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addItem(section.key, section.val, section.setVal)}
                                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                            placeholder={`Aggiungi ${section.title}...`}
                                        />
                                        <button onClick={() => addItem(section.key, section.val, section.setVal)} className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl transition shadow-lg shadow-slate-200"><Plus size={20}/></button>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                        {formData[section.key].map((item, idx) => (
                                            <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 flex items-center gap-2 shadow-sm">
                                                {item}
                                                <button onClick={() => removeItem(section.key, idx)} className="text-slate-300 hover:text-red-500 transition"><X size={14}/></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );

};

export default SetupEdition;
