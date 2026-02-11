import React from "react";
import {
  ArrowLeft,
  User,
  Search,
  Plus,
  Save,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { PLAYER_COLORS } from "../../constants";
import PlayerEditForm from "./PlayerEditForm";

const SetupPlayersMobile = ({
  user,
  savedPlayers,
  players,
  searchTerm,
  setSearchTerm,
  handleCreate,
  isStandalone,
  onBack,
  onStartGame,

  // State for List Logic
  filteredLibrary,
  onToggleSquad,
  isInSquad,

  // State for Editing
  editingId,
  editingName,
  setEditingName,
  editingColorIdx,
  setEditingColorIdx,
  startEditing,
  handleUpdatePlayer,
  handleDeleteSavedPlayer,
  setEditingId,

  // Dnd (Simplified or removed for mobile often, but we can keep remove button)
  removeFromSquad,
}) => {
  // Mobile Tab State (Game Mode: Rubrica vs Squadra)
  const [activeTab, setActiveTab] = React.useState("library"); // 'library' | 'squad'

  // When standalone, we only have library essentially, but let's keep it simple.
  // If not standalone, we might want to switch tabs to see who is in game.

  return (
    <div className="w-full bg-slate-800 flex flex-col h-[85vh] rounded-2xl shadow-xl overflow-hidden border border-slate-700">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-700 flex flex-col gap-3 shrink-0 z-10 bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-700 rounded-full transition text-slate-400"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <User size={20} className="text-indigo-500" />
              {isStandalone
                ? "Gestione Giocatori"
                : activeTab === "library"
                  ? "Rubrica"
                  : "Squadra"}
            </h2>
          </div>

          {!isStandalone && (
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("library")}
                className={`px-3 py-1 rounded-md text-sm font-bold transition ${activeTab === "library" ? "bg-slate-700 shadow text-slate-200" : "text-slate-500"}`}
              >
                Tutti
              </button>
              <button
                onClick={() => setActiveTab("squad")}
                className={`px-3 py-1 rounded-md text-sm font-bold transition ${activeTab === "squad" ? "bg-slate-700 shadow text-slate-200" : "text-slate-500"}`}
              >
                In Gioco ({players.length})
              </button>
            </div>
          )}
        </div>

        {/* Search Bar only in Library Mode */}
        {(isStandalone || activeTab === "library") && (
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-slate-500"
              size={18}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isStandalone
                  ? "Cerca o crea nuovo..."
                  : "Cerca per aggiungere..."
              }
              className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-12 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium placeholder:text-slate-600"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={!searchTerm.trim()}
              className="absolute right-2 top-2 p-1.5 bg-slate-700 shadow-sm border border-slate-600 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition disabled:opacity-50"
            >
              {savedPlayers.some(
                (p) => p.name.toLowerCase() === searchTerm.trim().toLowerCase(),
              ) ? (
                isStandalone ? (
                  <Search size={18} />
                ) : (
                  <Plus size={18} />
                )
              ) : (
                <Save size={18} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-800">
        {/* VIEW: SQUAD LIST (Only in Game Mode) */}
        {!isStandalone && activeTab === "squad" && (
          <div className="space-y-2">
            {players.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>Nessun giocatore selezionato.</p>
                <button
                  onClick={() => setActiveTab("library")}
                  className="text-indigo-400 font-bold mt-2"
                >
                  Vai alla rubrica
                </button>
              </div>
            ) : (
              players.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-sm"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${PLAYER_COLORS[p.colorIdx]?.class || "bg-gray-400"} shadow-sm border border-white/10 flex items-center justify-center font-bold text-white text-xs`}
                  >
                    {idx + 1}
                  </div>
                  <span className="font-bold text-slate-200 text-sm flex-1 truncate">
                    {p.name}
                  </span>
                  <button
                    onClick={() => removeFromSquad(p.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))
            )}

            {/* Start Game Button Mobile */}
            {players.length > 0 && (
              <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                <button
                  onClick={onStartGame}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  <Check size={20} /> Gioca
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: LIBRARY LIST */}
        {(isStandalone || activeTab === "library") && (
          <>
            {filteredLibrary.length === 0 && (
              <div className="text-center text-slate-500 py-10">
                {searchTerm ? "Premi invio per creare." : "Rubrica vuota."}
              </div>
            )}

            {filteredLibrary.map((sp) => {
              const inSquad = isInSquad(sp);
              const isEditingThis = editingId === sp.id;
              const playerColorIdx =
                sp.colorIdx !== undefined
                  ? sp.colorIdx
                  : sp.id.charCodeAt(0) % PLAYER_COLORS.length;
              const playerColorClass =
                PLAYER_COLORS[playerColorIdx]?.class || "bg-gray-400";

              return (
                <React.Fragment key={sp.id}>
                  <div
                    onClick={() => onToggleSquad(sp)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none
                                            ${
                                              isEditingThis
                                                ? "bg-amber-900/60 border-amber-900/50 ring-1 ring-amber-900/50"
                                                : inSquad
                                                  ? "bg-amber-900/40 border-amber-900/30 ring-1 ring-amber-900/20 shadow-md"
                                                  : "bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700 hover:shadow-sm"
                                            }
                                        `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full ${playerColorClass} shadow-sm border border-white/10 ring-1 ring-slate-700 shrink-0`}
                      ></div>
                      <span
                        className={`font-bold truncate text-base ${inSquad ? "text-slate-200" : "text-slate-400"}`}
                      >
                        {sp.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(sp);
                        }}
                        className={`p-2 rounded-full transition ${inSquad ? "text-amber-600 hover:bg-amber-900/30" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"}`}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </div>

                  {/* INLINE EDITOR MOBILE */}
                  {isEditingThis && (
                    <div className="mt-2 mb-4 pl-4 border-l-4 border-indigo-500/50 animate-in slide-in-from-left-4">
                      <PlayerEditForm
                        name={editingName}
                        setName={setEditingName}
                        colorIdx={editingColorIdx}
                        setColorIdx={setEditingColorIdx}
                        onSave={handleUpdatePlayer}
                        onDelete={handleDeleteSavedPlayer}
                        onCancel={() => setEditingId(null)}
                        variant="card"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default SetupPlayersMobile;
