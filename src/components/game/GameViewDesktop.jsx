import React, { useRef, useState, useEffect } from "react";
import {
  Menu,
  RotateCcw,
  User,
  Home,
  Plus,
  Filter,
  Copy,
  BookOpen,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  ZoomIn,
  X,
} from "lucide-react";
import Grid from "./Grid";
import LogView from "./LogView";
import Swal from "sweetalert2";

const GameViewDesktop = ({
  currentEdition,
  gamePlayers,
  gridData,
  historyLog,
  onCellClick,
  onLogEntry,
  onNewMatch,
  onReturnHome,
  onEditPlayers,

  // Modal Controls
  startEditLog,
  setEditingLogId,
  modals,
  setModals,
  filters,
  setFilters,
}) => {
  // Default Log open on Left as per request "aprire sulla sinistra"
  // PERSISTENCE: Check localStorage
  const [logOpen, setLogOpen] = useState(() => {
    const saved = localStorage.getItem("cluedo_log_sidebar");
    return saved ? JSON.parse(saved) : false; // Default closed if no save
  });

  // Save state on change
  useEffect(() => {
    localStorage.setItem("cluedo_log_sidebar", JSON.stringify(logOpen));
  }, [logOpen]);

  // Highlight State
  const [highlightedLogId, setHighlightedLogId] = useState(null);
  const [highlightedCards, setHighlightedCards] = useState([]);

  const handleLogHighlight = (id, cards) => {
    if (highlightedLogId === id) {
      // Toggle off
      setHighlightedLogId(null);
      setHighlightedCards([]);
    } else {
      setHighlightedLogId(id);
      setHighlightedCards(cards);
    }
  };

  const handleCopyCode = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Link copiato!",
      });
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // FIXED: Just call the prop. The parent GamePage handles the confirmation Swal.
  const handleHomeClick = () => {
    onReturnHome();
  };

  // Helper for Sidebar Buttons
  const SidebarBtn = ({
    icon: Icon,
    label,
    onClick,
    active = false,
    extraClass = "",
  }) => (
    <button
      onClick={onClick}
      className={`
                w-full flex flex-col items-center justify-center py-4 px-1 gap-1.5 transition-all
                text-slate-400 hover:text-white hover:bg-slate-800 relative group
                ${active ? "text-white bg-slate-800 shadow-[inset_4px_0_0_0_#f59e0b]" : ""}
                ${extraClass}
            `}
      title={label}
    >
      <Icon
        size={26}
        strokeWidth={1.5}
        className="group-hover:scale-110 transition-transform"
      />
      <span className="text-[10px] font-medium tracking-wide uppercase">
        {label}
      </span>
    </button>
  );

  return (
    <div className="w-full h-[100dvh] flex bg-slate-950 font-sans overflow-hidden">
      {/* 1. NARROW LEFT SIDEBAR - NAVIGATION */}
      <aside className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-50 shadow-2xl relative">
        {/* Logo / Home */}
        <div
          onClick={handleHomeClick}
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-800"
        >
          <Home
            size={26}
            className="text-slate-400 hover:text-white transition-colors"
          />
        </div>

        {/* Main Actions */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
          <SidebarBtn
            icon={Plus}
            label="Ipotesi"
            onClick={() => {
              setEditingLogId(null);
              setModals({ ...modals, hypothesis: true });
            }}
          />
          <SidebarBtn
            icon={BookOpen}
            label="Diario"
            onClick={() => setLogOpen(!logOpen)}
            active={logOpen}
          />
          <div className="h-px w-10 mx-auto bg-slate-800 my-2"></div>
          <SidebarBtn
            icon={User}
            label="Giocatori"
            onClick={() => setModals({ ...modals, players: true })}
          />
          <SidebarBtn icon={RotateCcw} label="Reset" onClick={onNewMatch} />
        </nav>

        {/* Bottom Info */}
        <div className="py-4 border-t border-slate-800 text-center bg-slate-900">
          <div className="text-[9px] text-slate-600 font-mono">v3.0</div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-950 overflow-hidden relative shadow-inner">
        {/* Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30 shadow-md">
          <h1 className="text-xl font-black text-white tracking-tight leading-none">
            {currentEdition.name}
          </h1>

          <div
            className="flex items-center gap-2 text-amber-200/70 hover:text-amber-200 transition-colors cursor-pointer group"
            onClick={handleCopyCode}
          >
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              Codice partita: {window.location.pathname.split("/").pop()}
            </span>
            <Copy
              size={14}
              className="opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </header>

        {/* Scrollable Content - ABSOLUTE FULL SCREEN */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="min-h-full p-4 md:p-6 pb-32">
            <Grid
              gamePlayers={gamePlayers}
              currentEdition={currentEdition}
              gridData={gridData}
              onCellClick={onCellClick}
              highlightedCards={highlightedCards}
            />
          </div>
        </div>
      </main>

      {/* 3. LOG SIDEBAR (RIGHT, EXPANDABLE) */}
      <aside
        className={`
                bg-slate-900 border-l border-slate-800 shadow-2xl z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col overflow-hidden
                ${logOpen ? "w-80 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-10"}
            `}
      >
        <div className="h-16 shrink-0 border-b border-slate-800 flex items-center justify-center px-5 bg-slate-900 text-white shadow-sm relative">
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
            <BookOpen size={20} className="text-white" />
            Diario delle ipotesi
          </h2>
        </div>

        <div className="flex-1 overflow-auto bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <LogView
            historyLog={historyLog}
            filters={filters}
            gamePlayers={gamePlayers}
            onEditLog={startEditLog}
            onDeleteLog={(id) => onLogEntry(null, id, true)}
            setModals={setModals}
            onHighlight={handleLogHighlight}
            highlightedLogId={highlightedLogId}
          />
        </div>
      </aside>
    </div>
  );
};

export default GameViewDesktop;
