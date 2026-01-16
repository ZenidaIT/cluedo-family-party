import React, { useState, useMemo } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PLAYER_COLORS } from '../constants';
import MySwal from '../utils/swal';

// Device Views
import SetupPlayersDesktop from './setup-players/SetupPlayersDesktop';
import SetupPlayersMobile from './setup-players/SetupPlayersMobile';

const SetupPlayers = ({ players, setPlayers, onBack, onStartGame, savedPlayers = [], user, isStandalone = false, onGoHome }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingColorIdx, setEditingColorIdx] = useState(0);

  // --- SQUAD LOGIC ---
  const removeFromSquad = (gamePlayerId) => {
      setPlayers(players.filter(p => p.id !== gamePlayerId));
  };

  const movePlayer = (fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;
      const newP = [...players];
      const item = newP[fromIndex];
      newP.splice(fromIndex, 1);
      newP.splice(toIndex, 0, item);
      setPlayers(newP);
  };

  const [draggedPeerIdx, setDraggedPeerIdx] = React.useState(null);
  const onDragStart = (e, idx) => { setDraggedPeerIdx(idx); e.dataTransfer.effectAllowed = "move"; }
  const onDragEnter = (e, targetIdx) => {
       if (draggedPeerIdx !== null && draggedPeerIdx !== targetIdx) {
           movePlayer(draggedPeerIdx, targetIdx);
           setDraggedPeerIdx(targetIdx);
       }
  }

  // --- ADDRESS BOOK LOGIC ---
  const handleCreate = async () => {
      const trimmedTerm = searchTerm.trim();
      if (!trimmedTerm) return;

      const existing = savedPlayers.find(p => p.name.toLowerCase() === trimmedTerm.toLowerCase());
      if (existing) {
          MySwal.fire({
              title: 'Giocatore già esistente',
              text: `"${existing.name}" è già nella tua rubrica. Usa un soprannome o una variante se intendi un'altra persona.`,
              icon: 'info',
              confirmButtonText: 'Capito',
              allowEnterKey: false // Prevent immediate dismissal if triggered by Enter
          });
      } else {
          try {
              const newColorIdx = Math.floor(Math.random() * PLAYER_COLORS.length);
              const docRef = await addDoc(collection(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players'), {
                  name: trimmedTerm,
                  colorIdx: newColorIdx,
                  createdAt: Date.now()
              });
              
              if (!isStandalone) {
                  addToSquad({ id: docRef.id, name: trimmedTerm, colorIdx: newColorIdx });
              }
              setSearchTerm(''); // Clear input
              MySwal.fire({
                  icon: 'success',
                  title: 'Aggiunto!',
                  timer: 1000,
                  showConfirmButton: false,
                  toast: true,
                  position: 'top-end'
              });

          } catch (e) {
              console.error(e);
              MySwal.fire('Errore', e.message, 'error');
          }
      }
  };

  const startEditing = (sp) => {
      setEditingId(sp.id);
      setEditingName(sp.name);
      setEditingColorIdx(sp.colorIdx !== undefined ? sp.colorIdx : 0);
  };

  const handleUpdatePlayer = async () => {
      if (!editingName.trim() || !editingId) return;
      
      const duplicate = savedPlayers.find(p => p.name.toLowerCase() === editingName.trim().toLowerCase() && p.id !== editingId);
      if (duplicate) {
          return MySwal.fire({
              title: 'Nome già in uso',
              text: `Il nome "${duplicate.name}" è già presente in rubrica. Scegline uno diverso per evitare confusione.`,
              icon: 'warning',
              confirmButtonText: 'Ok, cambio nome'
          });
      }

      try {
           await updateDoc(doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players', editingId), {
              name: editingName.trim(),
              colorIdx: editingColorIdx
           });
           
           // If editing a player in squad, update their name/color in current session too (optional, but good UX)
           // Actually, players in squad have a copy of name/color. If we want them to update, we'd need to map them.
           // For now, we only update the DB source. The live squad might need a manual refresh or we can update local state.
           setPlayers(prev => prev.map(p => {
                if (p.originalId === editingId) {
                    return { ...p, name: editingName.trim(), colorIdx: editingColorIdx };
                }
                return p;
           }));
           
           setEditingId(null);
           setEditingName('');
           setEditingColorIdx(0);
      } catch (e) {
          console.error(e);
          MySwal.fire('Errore', e.message, 'error');
      }
  };

  const handleDeleteSavedPlayer = async () => {
      if (!editingId) return;
      const result = await MySwal.fire({
          title: 'Eliminare?',
          text: "Rimuovere definitivamente dalla rubrica?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Elimina',
          cancelButtonText: 'Annulla'
      });

      if (result.isConfirmed) {
          await deleteDoc(doc(db, 'artifacts', 'default-app-id', 'users', user.uid, 'players', editingId));
          if (!isStandalone) {
              setPlayers(players.filter(p => p.originalId !== editingId));
          }
          setEditingId(null);
      }
  };

  const addToSquad = (savedP) => {
      if (players.some(p => p.originalId === savedP.id)) return;
      setPlayers([...players, { 
          id: Date.now().toString() + Math.random(), 
          originalId: savedP.id,
          name: savedP.name, 
          colorIdx: savedP.colorIdx !== undefined ? savedP.colorIdx : (players.length % PLAYER_COLORS.length) 
      }]);
  };
  
  const onToggleSquad = (sp) => {
       if (isStandalone) return;
       const isIn = players.some(p => p.originalId === sp.id);
       if (isIn) {
           const pToRemove = players.find(p => p.originalId === sp.id);
           removeFromSquad(pToRemove.id);
       } else {
           addToSquad(sp);
       }
  };
  
  const isInSquad = (sp) => !isStandalone && players.some(p => p.originalId === sp.id);

  const filteredLibrary = useMemo(() => {
      return savedPlayers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [savedPlayers, searchTerm]);

  // Props intended for both views
  const viewProps = {
      user,
      savedPlayers,
      players,
      searchTerm,
      setSearchTerm,
      handleCreate,
      isStandalone,
      onBack,
      onStartGame,
      
      // List State
      filteredLibrary,
      onToggleSquad,
      isInSquad,
      
      // Edit State
      editingId,
      editingName,
      setEditingName,
      editingColorIdx,
      setEditingColorIdx,
      startEditing,
      handleUpdatePlayer,
      handleDeleteSavedPlayer,
      setEditingId,
      
      // Dnd / Squad mgmt
      removeFromSquad,
      movePlayer,
      onDragStart,
      onDragEnter
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        {/* Render Mobile View on small screens, Desktop on md+ */}
        {/* We use CSS display logic to keep both in DOM or we could use media query hook to mount only one. 
            Given the goal of "distinct interfaces", mounting only one is cleaner for accessible DOM, 
            but CSS hiding is faster to implement now avoiding huge refactor of main entry. 
            Let's stick to CSS hidden classes for instant switching if user resizes.
        */}
        
        <div className="md:hidden w-full">
            <SetupPlayersMobile {...viewProps} />
        </div>
        
        <div className="hidden md:block w-full">
            <SetupPlayersDesktop {...viewProps} />
        </div>
    </div>
  );
};

export default SetupPlayers;
