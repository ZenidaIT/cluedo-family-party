import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import logo from '../assets/logo.svg';

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Failed", error);
      alert("Errore durante il login: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-in fade-in zoom-in-95">
        <img src={logo} alt="Cluedo Logo" className="h-24 w-auto mb-6 drop-shadow-lg" />
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Cluedo Party Family</h1>
        <p className="text-slate-500 mb-8 text-center text-sm">Il compagno ideale per le tue indagini.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all active:scale-95"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
          <span>Accedi con Google</span>
        </button>
        
        <div className="mt-8 text-xs text-slate-400 text-center">
            Accedendo accetti di diventare un investigatore certificato.
        </div>
      </div>
    </div>
  );
};

export default Login;
