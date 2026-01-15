import React, { useState } from 'react';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import MySwal from '../utils/swal';
import { ADMIN_EMAIL } from '../constants'; 

// Views
import SetupEditionDesktop from './setup-edition/SetupEditionDesktop';
import SetupEditionMobile from './setup-edition/SetupEditionMobile';

const SetupEdition = ({ onSelectEdition, user, privateEditions = [], publicEditions = [], onBack, onGoHome, isSelectionMode = false }) => {
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
    if (e) e.stopPropagation();
    setEditingId(edition.id);
    setFormData({ ...edition });
  };

  const startClone = (e, edition) => {
      if (e) e.stopPropagation();
      setEditingId('NEW');
      setFormData({ 
          ...edition, 
          name: `${edition.name} (Copia)`,
          isPublic: false 
      });
  };

  const handleDelete = async (e, edition) => {
    if (e) e.stopPropagation();
    
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

  const viewProps = {
      onSelectEdition, user, privateEditions, publicEditions, onBack, onGoHome, isAdmin, isSelectionMode,
      editingId, setEditingId,
      startCreate, startEdit, startClone, handleDelete, handleSave,
      formData, setFormData,
      tempSuspect, setTempSuspect,
      tempWeapon, setTempWeapon,
      tempRoom, setTempRoom,
      addItem, removeItem
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        {/* Mobile View */}
        <div className="md:hidden w-full">
            <SetupEditionMobile {...viewProps} />
        </div>
        
        {/* Desktop View */}
        <div className="hidden md:block w-full">
            <SetupEditionDesktop {...viewProps} />
        </div>
    </div>
  );
};

export default SetupEdition;
