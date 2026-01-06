import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from './firebase';
import { Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';

// Components / Pages
import Login from './components/Login';
import Lobby from './components/Lobby';
import SetupEdition from './components/SetupEdition';
import SetupPlayers from './components/SetupPlayers';
import GamePage from './pages/GamePage';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Global Data Subscriptions
  const [privateEditions, setPrivateEditions] = useState([]);
  const [publicEditions, setPublicEditions] = useState([]);
  const [savedPlayers, setSavedPlayers] = useState([]);

  // --- INIT & AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        console.log("Auth State Changed:", u ? `User ${u.uid}` : "No User");
        setUser(u);
        setAuthLoading(false);

        if (u) {
            // Subscribe to Private Editions
            const qPrivate = query(collection(db, 'artifacts', 'default-app-id', 'users', u.uid, 'editions'), orderBy('createdAt', 'desc'));
            const unsubPrivate = onSnapshot(qPrivate, (snapshot) => {
                const editions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setPrivateEditions(editions);
            });

            // Subscribe to Public Editions
            const qPublic = query(collection(db, 'public_editions'), orderBy('createdAt', 'desc'));
            const unsubPublic = onSnapshot(qPublic, (snapshot) => {
                const editions = snapshot.docs.map(doc => ({id: doc.id, isPublic: true, ...doc.data()}));
                setPublicEditions(editions);
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
        }
    });
    return () => unsubscribe();
  }, []);


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

  return (
    <Routes>
        <Route element={<Outlet context={{ user, privateEditions, publicEditions, savedPlayers }} />}>
            
            {/* LOBBY */}
            <Route path="/" element={
                 <Lobby 
                    user={user} 
                 /> 
            } />
            
            {/* GAME SESSION */}
            <Route path="/game/:sessionId" element={<GamePage />} />

            {/* MANAGERS (Standalone) */}
            <Route path="/editions" element={
                <SetupEdition 
                    isStandalone={true}
                    user={user}
                    privateEditions={privateEditions}
                    publicEditions={publicEditions}
                    onSelectEdition={() => {}}
                    onBack={() => navigate('/')} 
                    onGoHome={() => navigate('/')}
                />
            } />
            
            <Route path="/players" element={
                <SetupPlayers 
                    isStandalone={true}
                    savedPlayers={savedPlayers}
                    players={[]}
                    setPlayers={() => {}}
                    user={user}
                    onBack={() => navigate('/')} 
                    onStartGame={() => {}}
                    onGoHome={() => navigate('/')}
                />
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
    </Routes>
  );
}

export default App;
