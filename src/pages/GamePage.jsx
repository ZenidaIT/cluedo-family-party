import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CELL_STATES } from '../constants';
import MySwal from '../utils/swal';
import _ from 'lodash';

import SetupEdition from '../components/SetupEdition';
import SetupPlayers from '../components/SetupPlayers';
import GameView from '../components/GameView';

const GamePage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, privateEditions, publicEditions, savedPlayers } = useOutletContext();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState('saved');

    // Game State
    const [status, setStatus] = useState('setup'); // 'setup' | 'active'
    const [currentEdition, setCurrentEdition] = useState(null);
    const [gamePlayers, setGamePlayers] = useState([{ id: 'p1', name: 'Tu', colorIdx: 0 }]);
    const [gridData, setGridData] = useState({});
    const [historyLog, setHistoryLog] = useState([]);
    
    // Derived UI State
    const stepParam = searchParams.get('step');
    let viewMode = 'LOADING';

    if (!loading && !error) {
        // Priority 1: Explicit URL Step (if valid)
        // Priority 2: Game Status (Persistent)
        // Priority 3: Fallback Heuristics
        
        // We need to know if the game is ACTUALLY started.
        // We'll trust searchParams if present AND valid, otherwise we look at data.
        
        // New Logic: Check 'status' field.
        const gameStatus = currentEdition ? (gridData._status || 'setup') : 'setup'; 
        // Note: I will store status in gridData._status for now to avoid migrating root schema, 
        // OR better, I will assume if 'step' param is missing, we check persistence.
        
        if (stepParam) {
            if (stepParam === 'setup_edition') viewMode = 'SETUP_EDITION';
            else if (stepParam === 'setup_players') viewMode = 'SETUP_PLAYERS';
            else if (stepParam === 'game') viewMode = 'GAME';
        } else {
            // Priority 2: Game Status (Persistent)
            if (!currentEdition) viewMode = 'SETUP_EDITION';
            else if (status === 'active') viewMode = 'GAME'; // Only go to game if explicitly active
            else viewMode = 'SETUP_PLAYERS';
        }
    }

    const isRemoteUpdate = React.useRef(false);

    // --- LOAD SESSION ---
    useEffect(() => {
        if (!sessionId || !user) return;

        console.log("Subscribing to session:", sessionId);
        const unsub = onSnapshot(doc(db, 'sessions', sessionId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                try {
                    const gameState = JSON.parse(data.gameData);
                    
                    // Flag this as a remote update to prevent echo-saving
                    isRemoteUpdate.current = true;

                    setStatus(gameState.status || 'setup');
                    setCurrentEdition(gameState.edition);
                    setGamePlayers(gameState.players || []);
                    setGridData(gameState.gridData || {});
                    setHistoryLog(gameState.historyLog || []);
                    setLoading(false);

                } catch (e) {
                    console.error("Corrupt Game Data", e);
                    setError("Dati partita corrotti.");
                }
            } else {
                setError("Partita non trovata.");
                setLoading(false);
            }
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsub();
    }, [sessionId, user]);

    // --- AUTO SAVE ---
    const saveGameToFirestore = async (state) => {
        if (!sessionId) return;
        try {
            setSaveStatus('saving');
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

    const debouncedSave = useCallback(
        _.debounce((newState) => {
            saveGameToFirestore(newState);
        }, 1000), 
        [sessionId]
    );

    // --- SYNC PLAYERS WITH ADDRESS BOOK ---
    // This ensures changes in Rubrica (Name/Color) propagate to active game
    useEffect(() => {
        if (!savedPlayers || savedPlayers.length === 0 || !gamePlayers || gamePlayers.length === 0) return;

        let hasChanges = false;
        const updatedPlayers = gamePlayers.map(gp => {
            // Find correspondig saved player by originalId
            // Note: Older games might lack originalId. 
            // We could try to match by name as fallback, but originalId is safer.
            if (!gp.originalId) return gp; 

            const savedP = savedPlayers.find(sp => sp.id === gp.originalId);
            if (savedP) {
                // Check if updates needed
                if (savedP.name !== gp.name || (savedP.colorIdx !== undefined && savedP.colorIdx !== gp.colorIdx)) {
                    hasChanges = true;
                    return { ...gp, name: savedP.name, colorIdx: savedP.colorIdx };
                }
            }
            return gp;
        });

        if (hasChanges) {
            console.log("Syncing players with Address Book...");
            setGamePlayers(updatedPlayers);
            // This will trigger debouncedSave via the existing effect
        }
    }, [savedPlayers, gamePlayers]);


    // Watch for changes to trigger Save
    useEffect(() => {
        if (loading || error) return;

        // Loop Breaker: If this change came from Firestore, DO NOT save it back.
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        const currentState = {
            status: status,
            edition: currentEdition,
            players: gamePlayers,
            gridData: gridData,
            historyLog: historyLog
        };
        debouncedSave(currentState);
    }, [status, currentEdition, gamePlayers, gridData, historyLog, sessionId]);


    // --- GAME ACTIONS ---

    const handleSelectEdition = (edition) => {
        setCurrentEdition(edition);
        setSearchParams({ step: 'setup_players', from: 'setup_edition' });
        // Immediate save
        saveGameToFirestore({
            status: 'setup',
            edition: edition,
            players: gamePlayers,
            gridData: gridData,
            historyLog: historyLog
        });
    };

    const handleStartGame = () => {
        setSearchParams({ step: 'game' });
        setStatus('active');
        // Immediate save
        saveGameToFirestore({
            status: 'active',
            edition: currentEdition,
            players: gamePlayers,
            gridData: gridData,
            historyLog: historyLog
        });
    };

    const handleCellClick = (cardName, playerIdx) => {
        const key = `${cardName}_${playerIdx}`;
        const currentState = gridData[key] || CELL_STATES.EMPTY;
    
        let nextState;
        // Unified Logic: Empty -> Yes (Green) -> Maybe (Yellow) -> No (Red) -> Empty
        // This applies to both Players and Solution (which is just another column logically now)
        if (currentState === CELL_STATES.EMPTY) nextState = CELL_STATES.YES;
        else if (currentState === CELL_STATES.YES) nextState = CELL_STATES.MAYBE;
        else if (currentState === CELL_STATES.MAYBE) nextState = CELL_STATES.NO;
        else nextState = CELL_STATES.EMPTY;
        
        setGridData(prev => ({ ...prev, [key]: nextState }));
    };

    const handleLogEntry = (entry, editId, isDelete = false) => {
        if (isDelete) {
            MySwal.fire({
                title: 'Eliminare questa ipotesi?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sì, elimina',
                cancelButtonText: 'Annulla'
            }).then((result) => {
                if (result.isConfirmed) {
                    setHistoryLog(prev => prev.filter(h => h.id !== editId));
                }
            });
        } else if (editId) {
           setHistoryLog(prev => prev.map(h => h.id === editId ? entry : h));
        } else {
           setHistoryLog(prev => [entry, ...prev]);
        }
    };

    // --- RENDER ---

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h2 className="text-xl font-bold text-red-500">{error}</h2>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-200 rounded-lg">Torna alla Home</button>
        </div>
    );

    if (viewMode === 'SETUP_EDITION') {
        return (
            <SetupEdition 
                isSelectionMode={true} 
                onSelectEdition={handleSelectEdition}
                user={user}
                privateEditions={privateEditions}
                publicEditions={publicEditions}
                gameHistory={[]} 
                onLoadGame={() => {}}
                onBack={() => navigate('/')}
                onGoHome={() => navigate('/')}
            />
        );
    }

    if (viewMode === 'SETUP_PLAYERS') {
        return (
            <SetupPlayers 
                players={gamePlayers} 
                setPlayers={setGamePlayers} 
                savedPlayers={savedPlayers}
                user={user}
                onBack={() => {
                    const from = searchParams.get('from');
                    if (from === 'game') setSearchParams({ step: 'game' });
                    else setSearchParams({ step: 'setup_edition' });
                }}
                onStartGame={handleStartGame}
                onGoHome={() => navigate('/')}
            />
        );
    }

    // Default: GAME
    return (
        <GameView 
            currentEdition={currentEdition}
            gamePlayers={gamePlayers}
            gridData={gridData}
            historyLog={historyLog}
            onCellClick={handleCellClick}
            onLogEntry={handleLogEntry}
            setGamePlayers={setGamePlayers}
            savedPlayers={savedPlayers}
            user={user}
            onNewMatch={() => {
                MySwal.fire({
                    title: 'Nuova Partita?',
                    text: "Svuoto la griglia e il diario.", 
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Conferma'
                }).then((r) => {
                    if(r.isConfirmed) {
                        setGridData({});
                        setHistoryLog([]);
                        // Reset to setup edition if desired, or just clear data
                        // If clear data, stay in Game
                    }
                });
            }}
            onSaveGame={() => {
                 saveGameToFirestore({
                    edition: currentEdition,
                    players: gamePlayers,
                    gridData: gridData,
                    historyLog: historyLog
                }).then(() => MySwal.fire('Salvato', '', 'success'));
            }}
            onLoadHistory={() => {}}
            onReturnHome={() => {
                MySwal.fire({
                    title: 'Vuoi tornare alla Lobby?',
                    text: 'La partita verrà salvata automaticamente.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'OK'
                }).then((r) => {
                    if (r.isConfirmed) navigate('/');
                })
            }}
            onEditPlayers={() => setSearchParams({ step: 'setup_players', from: 'game' })}
        />
    );
};

export default GamePage;
