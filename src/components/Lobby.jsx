import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Key, User, Play, Loader2 } from 'lucide-react';
import logo from '../assets/logo.svg';
import { collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import MySwal from '../utils/swal';

const Lobby = ({ user }) => {
    const navigate = useNavigate();
    
    // Removed local MobileSwal definition in favor of centralized utility

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!user) return; 

        const q = query(
            collection(db, 'sessions'), 
            where('ownerId', '==', user.uid),
            orderBy('updatedAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (err) => {
            console.error("Firestore Error:", err);
            setLoading(false); 
            
            // Check for missing index error
            if (err.message.includes("indexes?create_composite=")) {
                const link = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)[0];
                MySwal.fire({
                    title: 'Indice Mancante',
                    html: `Il database richiede un indice per funzionare.<br><br><a href="${link}" target="_blank" style="color:blue;text-decoration:underline;">CLICCA QUI PER CREARLO</a>`,
                    icon: 'warning',
                    confirmButtonText: 'Chiudi'
                });
            } else {
                MySwal.fire({
                    title: 'Errore Database',
                    text: err.message,
                    icon: 'error'
                });
            }
        });
        return unsubscribe;
    }, [user]);

    const handleCreateSession = async () => {
        const { value: formValues } = await MySwal.fire({
            title: 'Nuova Partita',
            html:
              '<div class="flex flex-col gap-3 mt-2">' +
              '<input id="swal-sessionname" class="swal2-input m-0 w-full box-border" placeholder="Nome Partita (opzionale)" style="margin:0 !important">' +
              '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Crea',
            cancelButtonText: 'Annulla',
            preConfirm: () => {
              const sessionName = document.getElementById('swal-sessionname').value;
              return { sessionName: sessionName || 'Partita di ' + (user.displayName || 'Investigatore') };
            }
        });

        if (formValues) {
            try {
                // Initialize default game state with EMPTY players
                const defaultState = {
                    players: [],
                    gridData: {},
                    historyLog: [],
                    edition: null 
                };

                const serializedData = JSON.stringify(defaultState);

                const docRef = await addDoc(collection(db, 'sessions'), {
                    ownerId: user.uid,
                    username: formValues.sessionName, // Used as Title
                    gameData: serializedData, 
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
                
                await MySwal.fire({
                    icon: 'success',
                    title: 'Partita Creata!',
                    timer: 1000,
                    showConfirmButton: false
                });

                navigate(`/game/${docRef.id}`);

            } catch (error) {
                console.error(error);
                MySwal.fire('Errore', 'Impossibile creare: ' + error.message, 'error');
            }
        }
    };

    const handleJoinSession = (session) => {
        navigate(`/game/${session.id}`);
    };

    const handleDeleteSession = async (e, id) => {
        e.stopPropagation();
        const result = await MySwal.fire({
            title: 'Eliminare?',
            text: "Non potrai più recuperare questa partita.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sì, elimina',
            cancelButtonText: 'Annulla',
            customClass: {
                popup: 'rounded-xl shadow-xl',
                confirmButton: 'bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700',
                cancelButton: 'bg-white text-slate-500 px-4 py-3 rounded-lg font-bold border hover:bg-slate-50',
                actions: 'gap-3'
            }
        });

        if (result.isConfirmed) {
            await deleteDoc(doc(db, 'sessions', id));
            MySwal.fire({
                icon: 'success',
                title: 'Eliminata',
                timer: 1500,
                showConfirmButton: false,
                width: '300px'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] flex-1">
                <div className="flex flex-col items-center justify-center mb-6 shrink-0 relative">
                    <img src={logo} alt="Cluedo Family Party" className="h-20 w-auto mb-2"/>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center">Cluedo Family Party</h1>
                    {loading && <div className="absolute top-0 right-0"><Loader2 className="animate-spin text-slate-400"/></div>}
                </div>

                {/* NAVIGATION TOOLBAR */}
                <div className="grid grid-cols-2 gap-2 mb-6 shrink-0">
                    <button onClick={() => navigate('/players')} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition border border-indigo-200">
                        <User size={20}/> Rubrica
                    </button>
                    <button onClick={() => navigate('/editions')} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition border border-amber-200">
                        <Key size={20}/> Edizioni
                    </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider">Le tue partite</h3>
                     <span className="text-xs text-slate-400">{sessions.length} trovate</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 min-h-0">
                    {sessions.length === 0 && !loading && (
                         <div className="text-center py-10 text-slate-400">
                             <p className="mb-2">Nessuna partita attiva.</p>
                             <p className="text-sm">Creane una per iniziare!</p>
                         </div>
                    )}

                    {sessions.map(s => (
                        <div key={s.id} onClick={() => handleJoinSession(s)}
                            className="group bg-slate-50 hover:bg-white border hover:border-indigo-500 rounded-xl p-3 cursor-pointer transition-all shadow-sm hover:shadow-md flex items-center justify-between gap-3">
                            
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="bg-slate-200 text-slate-500 p-2.5 rounded-full shrink-0 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                    <Play size={20} fill="currentColor"/>
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-slate-800 truncate text-lg leading-tight">{s.username}</div>
                                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                        {new Date(s.updatedAt).toLocaleDateString()} {new Date(s.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>

                            <button onClick={(e) => handleDeleteSession(e, s.id)} 
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition border border-transparent hover:border-red-100 shrink-0"
                                title="Elimina partita">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={handleCreateSession} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2 shrink-0">
                    <Plus/> Nuova Partita
                </button>
            </div>
        </div>
    );
};

export default Lobby;
