import React, { useState } from 'react';
import { Plus, Trash2, Edit, ChevronRight, X, Save, ArrowLeft, Copy, Globe, Lock } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';
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
    const result = await Swal.fire({
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
            
            Swal.fire('Eliminata!', '', 'success');
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire('Errore', error.message, 'error');
        }
    }
  };

  const handleSave = async () => {
    if (!formData.name) return Swal.fire('Attenzione', "Inserisci un nome per l'edizione.", 'warning');
    if (formData.suspects.length < 2 || formData.weapons.length < 2 || formData.rooms.length < 2) {
        return Swal.fire('Attenzione', "Inserisci almeno 2 elementi per categoria.", 'warning');
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
        Swal.fire({ icon: 'success', title: 'Salvato!', timer: 1500, showConfirmButton: false });
        setEditingId(null);
    } catch (error) {
        console.error("Error saving edition:", error);
        Swal.fire('Errore', error.message, 'error');
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
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center sm:p-4 z-50">
      <div className="bg-white w-full h-full sm:h-[90vh] max-w-lg sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 shadow-md z-10">
            <div className="flex items-center gap-3">
                {isEditing ? (
                     <button onClick={() => setEditingId(null)} className="p-1 hover:bg-white/10 rounded-full transition"><ArrowLeft size={20}/></button>
                ) : (
                     onBack && <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition"><ArrowLeft size={20}/></button>
                )}
                
                <h2 className="text-lg font-bold">
                    {isEditing 
                        ? (editingId === 'NEW' ? 'Nuova Edizione' : 'Modifica Edizione')
                        : 'Gestione Edizioni'
                    }
                </h2>
            </div>
            
            {isEditing && (
                <button onClick={handleSave} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow transition flex items-center gap-2">
                    <Save size={16}/> Salva
                </button>
            )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            
            {/* EDIT MODE */}
            {isEditing ? (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nome Edizione</label>
                        <input 
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full text-lg font-bold border-b border-slate-200 focus:border-indigo-600 outline-none py-2"
                            placeholder="Es. Harry Potter Cluedo"
                        />
                        {isAdmin && (
                            <div className="mt-4 flex items-center gap-2">
                                <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} className="rounded text-indigo-600"/>
                                <span className="text-sm font-bold text-indigo-900">Pubblica</span>
                            </div>
                        )}
                    </div>

                    {[
                        { title: 'Sospettati', key: 'suspects', val: tempSuspect, setVal: setTempSuspect, color: 'text-rose-600' },
                        { title: 'Armi', key: 'weapons', val: tempWeapon, setVal: setTempWeapon, color: 'text-sky-600' },
                        { title: 'Luoghi', key: 'rooms', val: tempRoom, setVal: setTempRoom, color: 'text-amber-600' }
                    ].map(section => (
                        <div key={section.key} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                           <h3 className={`font-bold ${section.color} uppercase text-xs tracking-wider mb-3`}>
                                {section.title} ({formData[section.key].length})
                           </h3>
                           <div className="flex gap-2 mb-3">
                                <input 
                                    value={section.val} 
                                    onChange={e => section.setVal(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addItem(section.key, section.val, section.setVal)}
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Aggiungi..."
                                />
                                <button onClick={() => addItem(section.key, section.val, section.setVal)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg"><Plus size={20}/></button>
                           </div>
                           <div className="flex flex-wrap gap-2">
                                {formData[section.key].map((item, idx) => (
                                    <span key={idx} className="bg-slate-50 border px-2 py-1 rounded-md text-sm font-medium text-slate-700 flex items-center gap-2">
                                        {item}
                                        <button onClick={() => removeItem(section.key, idx)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                                    </span>
                                ))}
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* LIST MODE */
                <div className="space-y-4">
                     {isAdmin && <div className="text-center text-xs font-mono bg-indigo-100 text-indigo-800 p-1 rounded">ADMIN MODE</div>}

                     {allEditions.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <p>Nessuna edizione trovata.</p>
                        </div>
                     )}

                     {allEditions.map(ed => {
                        const canEdit = ed.isPublic ? isAdmin : true;
                        
                        return (
                            <div key={ed.id} 
                                onClick={() => onSelectEdition(ed)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group cursor-pointer flex flex-col gap-3"
                            >
                                {/* HEADER: Title & Status */}
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{ed.name}</h3>
                                    {ed.isPublic ? (
                                        <span className="shrink-0 bg-indigo-50 text-indigo-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 border border-indigo-100">
                                            <Globe size={10}/> Public
                                        </span>
                                    ) : (
                                        <span className="shrink-0 bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 border border-slate-200">
                                            <Lock size={10}/> Private
                                        </span>
                                    )}
                                </div>

                                {/* DETAILS: Counts */}
                                <div className="text-xs text-slate-500 flex flex-wrap gap-2 items-center">
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{ed.suspects?.length || 0} Sosp.</span>
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{ed.weapons?.length || 0} Armi</span>
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{ed.rooms?.length || 0} Luoghi</span>
                                </div>

                                {/* FOOTER: Actions */}
                                {(canEdit || ed.isPublic) && (
                                    <div className="border-t border-slate-100 pt-3 flex justify-end gap-2 mt-1">
                                         {canEdit && (
                                            <>
                                                <button onClick={(e) => startEdit(e, ed)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Modifica">
                                                    <Edit size={18}/>
                                                </button>
                                                <button onClick={(e) => handleDelete(e, ed)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Elimina">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </>
                                         )}
                                         {ed.isPublic && (
                                             <button onClick={(e) => startClone(e, ed)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Clona come nuova">
                                                 <Copy size={18}/>
                                             </button>
                                         )}
                                    </div>
                                )}
                            </div>
                        );
                     })}

                     <button onClick={startCreate} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:text-indigo-600 hover:border-indigo-400 hover:bg-white transition flex items-center justify-center gap-2">
                        <Plus/> Nuova Edizione
                     </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SetupEdition;
