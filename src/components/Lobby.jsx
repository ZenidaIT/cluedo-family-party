import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Book, User, Play, Loader2 } from 'lucide-react';
import logo from '../assets/logo.svg';
import { collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import MySwal from '../utils/swal';
import { useNavigate } from 'react-router-dom';

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
              '<input id="swal-sessionname" class="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-slate-50 text-base" placeholder="Nome Partita (opzionale)">' +
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
            <div className="w-full max-w-7xl animate-in fade-in zoom-in-95 flex flex-col flex-1">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Cluedo Family Party" className="h-16 w-auto drop-shadow-sm"/>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cluedo Family Party</h1>
                            <p className="text-slate-500 font-medium text-sm">Investigatore: <span className="text-indigo-600">{user.displayName}</span></p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => navigate('/players')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm border border-slate-200">
                            <User size={20}/> Rubrica
                        </button>
                        <button onClick={() => navigate('/editions')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-50 hover:text-amber-600 transition shadow-sm border border-slate-200">
                            <Book size={20}/> Edizioni
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider flex items-center gap-2">
                        Le tue partite <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{sessions.length}</span>
                     </h3>
                     {loading && <Loader2 className="animate-spin text-slate-400"/>}
                </div>

                {/* SESSIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                    
                    {/* NEW GAME CARD */}
                    <button onClick={handleCreateSession} className="group bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-6 cursor-pointer transition-all shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-4 min-h-[160px] border-2 border-transparent hover:border-indigo-500/50">
                        <div className="bg-white/10 group-hover:bg-white/20 p-4 rounded-full transition-colors">
                            <Plus size={32}/>
                        </div>
                        <span className="font-bold text-lg">Nuova Partita</span>
                    </button>

                    {/* SESSION CARDS */}
                    {sessions.map(s => (
                        <div key={s.id} onClick={() => handleJoinSession(s)}
                            className="group bg-white hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                            
                            <div className="flex justify-between items-start">
                                <div className="bg-slate-100 text-slate-500 p-3 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                    <Play size={24} fill="currentColor"/>
                                </div>
                                <button onClick={(e) => handleDeleteSession(e, s.id)} 
                                    className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition z-10"
                                    title="Elimina partita">
                                    <Trash2 size={18}/>
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="font-bold text-slate-800 text-xl leading-tight mb-1 truncate">{s.username}</div>
                                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    Ultima modifica: {new Date(s.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sessions.length === 0 && !loading && (
                     <div className="text-center py-10 text-slate-400 col-span-full">
                         <p className="mb-2">Nessuna partita attiva.</p>
                         <p className="text-sm">Inizia una nuova indagine!</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default Lobby;
