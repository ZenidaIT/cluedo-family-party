import React, { useState, useEffect, Suspense } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from './firebase';
import { Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';

// Components / Pages
import Login from './components/Login';
import Lobby from './components/Lobby';

// Lazy Load heavy components
const SetupEdition = React.lazy(() => import('./components/SetupEdition'));
const SetupPlayers = React.lazy(() => import('./components/SetupPlayers'));
const GamePage = React.lazy(() => import('./pages/GamePage'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

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
                // Enforce proper alphabetical sort (case-insensitive)
                players.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
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
            
            {/* LOBBY (Eager) */}
            <Route path="/" element={
                 <Lobby 
                    user={user} 
                 /> 
            } />
            
            {/* GAME SESSION (Lazy) */}
            <Route path="/game/:sessionId" element={
                <Suspense fallback={<PageLoader />}>
                    <GamePage />
                </Suspense>
            } />

            {/* MANAGERS (Standalone - Lazy) */}
            <Route path="/editions" element={
                <Suspense fallback={<PageLoader />}>
                    <SetupEdition 
                        isStandalone={true}
                        isSelectionMode={false}
                        user={user}
                        privateEditions={privateEditions}
                        publicEditions={publicEditions}
                        onSelectEdition={() => {}}
                        onBack={() => navigate('/')} 
                        onGoHome={() => navigate('/')}
                    />
                </Suspense>
            } />
            
            <Route path="/players" element={
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
    </Routes>
  );
}

export default App;
