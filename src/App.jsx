import React, { useState, useEffect, useRef, useCallback } from 'react';
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, addDoc, query, orderBy, updateDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { CLASSIC_EDITION, CELL_STATES } from './constants';
import Lobby from './components/Lobby';
import SetupEdition from './components/SetupEdition';
import SetupPlayers from './components/SetupPlayers';
import GameView from './components/GameView';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import Swal from 'sweetalert2';

import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // App Navigation
  const [mode, setMode] = useState('LOBBY'); 
  
  // Session Access
  const [sessionId, setSessionId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error

  // Game Data State
  const [privateEditions, setPrivateEditions] = useState([]);
  const [publicEditions, setPublicEditions] = useState([]);
  const [savedPlayers, setSavedPlayers] = useState([]);
  const [currentEdition, setCurrentEdition] = useState(null); // If null -> SETUP_EDITION mode
  const [gamePlayers, setGamePlayers] = useState([{ id: 'p1', name: 'Tu', colorIdx: 0 }]); 
  const [gridData, setGridData] = useState({}); 
  const [historyLog, setHistoryLog] = useState([]);
  
  // --- INIT & AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
        // Log output for debugging purposes
        console.log("Auth State Changed:", u ? `User ${u.uid} isAnonymous=${u.isAnonymous}` : "No User");
        
        setUser(u);
        
        if (u) {
            // Restore Session if available in LocalStorage
            const lastSessionId = localStorage.getItem('cluedo_lastSessionId');
            const lastMode = localStorage.getItem('cluedo_lastMode');

            if (lastSessionId && lastMode) { // Logic: if we have history, try to restore
                try {
                    const sessionDoc = await getDoc(doc(db, 'sessions', lastSessionId));
                    if (sessionDoc.exists()) {
                         const sessionData = sessionDoc.data();
                         // Verify ownership (optional but good)
                         if(sessionData.ownerId === u.uid) {
                             const gameState = JSON.parse(sessionData.gameData);
                             
                             // Restore State
                             setSessionId(lastSessionId);
                             setCurrentEdition(gameState.edition);
                             setGamePlayers(gameState.players || []);
                             setGridData(gameState.gridData || {});
                             setHistoryLog(gameState.historyLog || []);
                             setMode(lastMode);
                             console.log("Session Restored:", lastSessionId, "Mode:", lastMode);
                         } else {
                             // Session exists but not yours (shouldn't happen with private storage but safe to clear)
                             localStorage.removeItem('cluedo_lastSessionId');
                             localStorage.removeItem('cluedo_lastMode');
                         }
                    } else {
                        // Session deleted remotely
                        localStorage.removeItem('cluedo_lastSessionId');
                        localStorage.removeItem('cluedo_lastMode');
                    }
                } catch (e) {
                    console.error("Restoration Failed:", e);
                    localStorage.removeItem('cluedo_lastSessionId');
                    localStorage.removeItem('cluedo_lastMode');
                }
            }

            setAuthLoading(false); // Only unset loading after restoration attempt is done

            // Subscribe to Private Editions
            const qPrivate = query(collection(db, 'artifacts', 'default-app-id', 'users', u.uid, 'editions'), orderBy('createdAt', 'desc'));
            const unsubPrivate = onSnapshot(qPrivate, (snapshot) => {
                const editions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setPrivateEditions(editions);
            }, (error) => {
                console.error("Error fetching private editions:", error);
            });

            // Subscribe to Public Editions
            const qPublic = query(collection(db, 'public_editions'), orderBy('createdAt', 'desc'));
            const unsubPublic = onSnapshot(qPublic, (snapshot) => {
                const editions = snapshot.docs.map(doc => ({id: doc.id, isPublic: true, ...doc.data()}));
                setPublicEditions(editions);
            }, (error) => {
                 console.error("Error fetching public editions:", error);
            });

            // Subscribe to Saved Players
            const qPlayers = query(collection(db, 'artifacts', 'default-app-id', 'users', u.uid, 'players'), orderBy('name', 'asc'));
            const unsubPlayers = onSnapshot(qPlayers, (snapshot) => {
                const players = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setSavedPlayers(players);
            });

            return () => {
                unsubPrivate();
                unsubPublic();
                unsubPlayers();
            };
        } else {
            setAuthLoading(false);
        }
    });
    return () => unsubscribe();
  }, []);

  // --- AUTO SAVE ---
  const saveGameToFirestore = async (state) => {
    if (!sessionId || !db) return;
    
    try {
        setSaveStatus('saving');
        // No Encryption - Save as JSON string
        const serializedData = JSON.stringify(state);
        
        await updateDoc(doc(db, 'sessions', sessionId), {
            gameData: serializedData,
            updatedAt: Date.now()
        });
        setSaveStatus('saved');
    } catch (e) {
        console.error("Auto-save failed", e);
        setSaveStatus('error');
    }
  };

  // Debounced Save Function
  const debouncedSave = useCallback(
    _.debounce((newState) => {
        saveGameToFirestore(newState);
    }, 2000),
    [sessionId] // Re-create if session changes
  );

  // Watch for changes
  useEffect(() => {
      if (mode === 'LOBBY' || !sessionId) return;
      
      // Persist to LocalStorage for Reload Resiliency
      localStorage.setItem('cluedo_lastSessionId', sessionId);
      localStorage.setItem('cluedo_lastMode', mode);
      
      const currentState = {
          edition: currentEdition,
          players: gamePlayers,
          gridData: gridData,
          historyLog: historyLog
      };

      debouncedSave(currentState);

  }, [currentEdition, gamePlayers, gridData, historyLog, sessionId]);


  // --- ACTIONS ---

  const handleJoinSession = (id, _, gameState) => {
      setSessionId(id);
      
      if (gameState.edition) {
          setCurrentEdition(gameState.edition);
          setGamePlayers(gameState.players || []);
          setGridData(gameState.gridData || {});
          setHistoryLog(gameState.historyLog || []);
          setMode('GAME');
      } else {
          // New game, setup needed
          setGamePlayers(gameState.players || [{ id: 'p1', name: 'Tu', colorIdx: 0 }]);
          setMode('SETUP_EDITION');
      }
  };

  const handleReturnToLobby = () => {
      // Clear sensitive state
      setSessionId(null);
      setCurrentEdition(null);
      setGamePlayers([]);
      setGridData({});
      setHistoryLog([]);
      setMode('LOBBY');
      
      // Clear Persistence
      localStorage.removeItem('cluedo_lastSessionId');
      localStorage.removeItem('cluedo_lastMode');
  };

  // --- GAME VIEW ACTIONS ---
  const handleCellClick = (cardName, playerIdx) => {
    const key = `${cardName}_${playerIdx}`;
    const currentState = gridData[key] || CELL_STATES.EMPTY;

    let nextState;
    if (playerIdx === 'SOLUTION') {
        // Cycle: EMPTY -> SOLVED (green check) -> MAYBE (?) -> EMPTY
        if (currentState === CELL_STATES.EMPTY) nextState = CELL_STATES.SOLVED;
        else if (currentState === CELL_STATES.SOLVED) nextState = CELL_STATES.MAYBE;
        else nextState = CELL_STATES.EMPTY;
    } else {
        if (currentState === CELL_STATES.EMPTY) nextState = CELL_STATES.MAYBE;
        else if (currentState === CELL_STATES.MAYBE) nextState = CELL_STATES.YES;
        else if (currentState === CELL_STATES.YES) nextState = CELL_STATES.NO;
        else nextState = CELL_STATES.EMPTY;
    }
    setGridData(prev => ({ ...prev, [key]: nextState }));
  };

  const handleLogEntry = (entry, editId, isDelete = false) => {
      if (isDelete) {
          Swal.fire({
              title: 'Eliminare questa ipotesi?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sì, elimina',
              cancelButtonText: 'Annulla'
          }).then((result) => {
              if (result.isConfirmed) {
                  setHistoryLog(historyLog.filter(h => h.id !== editId));
              }
          });
      } else if (editId) {
         setHistoryLog(historyLog.map(h => h.id === editId ? entry : h));
      } else {
         setHistoryLog([entry, ...historyLog]);
      }
  };

  // --- RENDER ---
  
  // Show loading spinner while Auth initializes
  if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
  }

  if (!user) {
    return <Login />;
  }

  if (mode === 'LOBBY') {
      return (
        <Lobby 
            onJoinSession={handleJoinSession} 
            user={user} 
            onManageEditions={() => setMode('MANAGE_EDITIONS')}
            onManagePlayers={() => setMode('MANAGE_PLAYERS')}
        />
      );
  }

  // EDITIONS MANAGER (Standalone)
  if (mode === 'MANAGE_EDITIONS') {
      return (
        <SetupEdition 
            onSelectEdition={() => {}} // No selection action needed in manager
            user={user}
            privateEditions={privateEditions}
            publicEditions={publicEditions}
            gameHistory={[]} 
            onLoadGame={() => {}}
            isStandalone={true} // Allow component to know it's in manager mode
            onBack={() => setMode('LOBBY')}
            onGoHome={() => setMode('LOBBY')}
        />
      );
  }

  // PLAYERS MANAGER (Standalone)
  if (mode === 'MANAGE_PLAYERS') {
      return (
        <SetupPlayers 
            players={[]} // No squad needed in manager
            setPlayers={() => {}} 
            savedPlayers={savedPlayers}
            user={user}
            onBack={() => setMode('LOBBY')}
            onStartGame={() => {}}
            isStandalone={true}
            onGoHome={() => setMode('LOBBY')}
        />
      );
  }

  // Only show SetupEdition if we are logged in but have no edition
  if (mode === 'SETUP_EDITION') {
      return (
        <SetupEdition 
            onSelectEdition={(ed) => { setCurrentEdition(ed); setMode('SETUP_PLAYERS'); }} 
            user={user}
            privateEditions={privateEditions}
            publicEditions={publicEditions}
            gameHistory={[]} 
            onLoadGame={() => {}}
            onBack={() => setMode('LOBBY')} // Allow backing out
            onGoHome={() => setMode('LOBBY')}
        />
      );
  }

  if (mode === 'SETUP_PLAYERS') {
      return (
        <SetupPlayers 
            players={gamePlayers} 
            setPlayers={setGamePlayers} 
            savedPlayers={savedPlayers}
            user={user}
            onBack={() => setMode('SETUP_EDITION')}
            onStartGame={() => setMode('GAME')}
            onGoHome={() => setMode('LOBBY')}
        />
      );
  }

  return (
    <>
        <GameView 
            currentEdition={currentEdition}
            gamePlayers={gamePlayers}
            gridData={gridData}
            historyLog={historyLog}
            onCellClick={handleCellClick}
            onLogEntry={handleLogEntry}
            onNewMatch={() => {
                 Swal.fire({
                    title: 'Nuova Partita?',
                    text: "Svuoto la griglia e il diario. La partita corrente verrà sovrascritta.", 
                    // This creates a semantic issue: logic says "reset state". 
                    // Since we autosave, this overwrites the session. 
                    // Correct behavior for "New Match" in same session.
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Conferma'
                 }).then((r) => {
                     if(r.isConfirmed) {
                        setGridData({});
                        setHistoryLog([]);
                     }
                 });
            }}
            onSaveGame={() => {
                // Manual trigger (optional, since autosave exists)
                saveGameToFirestore({
                    edition: currentEdition,
                    players: gamePlayers,
                    gridData: gridData,
                    historyLog: historyLog
                }).then(() => Swal.fire('Salvato', '', 'success'));
            }}
            onLoadHistory={() => {}} // feature removed/replaced by Lobby
            onReturnHome={() => {
                Swal.fire({
                    title: 'Tornare alla Lobby?',
                    text: 'La partita viene salvata automaticamente.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'OK'
                }).then((r) => {
                    if (r.isConfirmed) handleReturnToLobby();
                })
            }}
            onEditPlayers={() => setMode('SETUP_PLAYERS')}
        />
    </>
  );
}

export default App;
