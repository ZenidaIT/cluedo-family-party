import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CELL_STATES } from '../constants';
import Swal from 'sweetalert2';
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
    const [currentEdition, setCurrentEdition] = useState(null);
    const [gamePlayers, setGamePlayers] = useState([{ id: 'p1', name: 'Tu', colorIdx: 0 }]);
    const [gridData, setGridData] = useState({});
    const [historyLog, setHistoryLog] = useState([]);
    
    // Derived UI State
    const stepParam = searchParams.get('step');
    let viewMode = 'LOADING';

    if (!loading && !error) {
        if (stepParam === 'setup_edition') {
            viewMode = 'SETUP_EDITION';
        } else if (stepParam === 'setup_players') {
            viewMode = 'SETUP_PLAYERS';
        } else if (currentEdition && stepParam === 'game') {
             viewMode = 'GAME';
        } else {
            // Heuristic (Default behavior)
            if (!currentEdition) viewMode = 'SETUP_EDITION';
            else if (!gamePlayers || gamePlayers.length <= 1) viewMode = 'SETUP_PLAYERS';
            else viewMode = 'GAME';
        }
    }

    // --- LOAD SESSION ---
    useEffect(() => {
        if (!sessionId || !user) return;

        console.log("Subscribing to session:", sessionId);
        const unsub = onSnapshot(doc(db, 'sessions', sessionId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                try {
                    const gameState = JSON.parse(data.gameData);
                    
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

    // Watch for changes (skip if loading/error covers it, but effect dependency handles it)
    useEffect(() => {
        if (loading || error) return;

        const currentState = {
            edition: currentEdition,
            players: gamePlayers,
            gridData: gridData,
            historyLog: historyLog
        };
        debouncedSave(currentState);
    }, [currentEdition, gamePlayers, gridData, historyLog, sessionId]);


    // --- GAME ACTIONS ---

    const handleSelectEdition = (edition) => {
        setCurrentEdition(edition);
        setSearchParams({ step: 'setup_players' });
        // Immediate save
        saveGameToFirestore({
            edition: edition,
            players: gamePlayers,
            gridData: gridData,
            historyLog: historyLog
        });
    };

    const handleStartGame = () => {
        setSearchParams({ step: 'game' });
        // Immediate save
        saveGameToFirestore({
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
        if (playerIdx === 'SOLUTION') {
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
                onBack={() => setSearchParams({ step: 'setup_edition' })}
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
            onNewMatch={() => {
                Swal.fire({
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
                }).then(() => Swal.fire('Salvato', '', 'success'));
            }}
            onLoadHistory={() => {}}
            onReturnHome={() => {
                Swal.fire({
                    title: 'Tornare alla Lobby?',
                    text: 'La partita è salvata.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'OK'
                }).then((r) => {
                    if (r.isConfirmed) navigate('/');
                })
            }}
            onEditPlayers={() => setSearchParams({ step: 'setup_players' })}
        />
    );
};

export default GamePage;
