import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Search,
  Plus,
  Save,
  Pencil,
  Check,
  UserPlus,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { PLAYER_COLORS } from "../../constants";
import PlayerEditForm from "./PlayerEditForm";
import SortablePlayerItem from "./SortablePlayerItem";
import PlayerItem from "./PlayerItem";

const SetupPlayersDesktop = ({
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
  onToggleSquad, // Logic to add/remove or do nothing
  isInSquad, // (player) => boolean

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

  // Dnd
  removeFromSquad,
  movePlayer,
  isModalMode = false,
}) => {
  // Dnd Kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    // Do not call parent onDragStart as it expects HTML5 DnD event
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      // Find indexes based on item ID (passed as player.id)
      const oldIndex = players.findIndex((p) => p.id === active.id);
      const newIndex = players.findIndex((p) => p.id === over.id);

      if (movePlayer) movePlayer(oldIndex, newIndex);
    }
  };

  return (
    <div
      className={`w-full max-w-6xl mx-auto bg-slate-900 flex flex-row ${isModalMode ? "h-full" : "h-[90vh] shadow-xl border border-slate-800 rounded-2xl overflow-hidden"}`}
    >
      {/* LEFT PANE: LIBRARY (Rubrica) */}
      <div className="w-5/12 border-r border-slate-700 bg-slate-800 flex flex-col min-h-0">
        {/* Header Left */}
        <div className="p-4 border-b border-slate-700 flex flex-col gap-3 shrink-0 z-10 bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isModalMode && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <User size={20} className="text-amber-500" /> Rubrica
              </h2>
            </div>
          </div>

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
              className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-12 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-amber-500 font-medium placeholder:text-slate-600"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={!searchTerm.trim()}
              className="absolute right-2 top-2 p-1.5 bg-slate-700 shadow-sm border border-slate-600 text-slate-300 rounded-lg hover:bg-amber-600 hover:text-white transition disabled:opacity-50"
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
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-800">
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
              <div
                key={sp.id}
                onClick={() =>
                  isStandalone ? startEditing(sp) : onToggleSquad(sp)
                }
                className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none
                                    ${
                                      isEditingThis
                                        ? "bg-amber-900/60 border-amber-900/50 ring-1 ring-amber-900/50" // Highlight when editing
                                        : inSquad
                                          ? "bg-amber-900/40 border-amber-900/30 ring-1 ring-amber-900/20 shadow-md"
                                          : "bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700"
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
                  {!isStandalone && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(sp);
                      }}
                      className={`p-2 rounded-full transition ${inSquad ? "text-amber-600 hover:bg-amber-900/30" : "text-slate-600 hover:text-slate-300 hover:bg-slate-800"}`}
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANE: CONTEXT (Squad or Edit Form) */}
      <div
        className={`w-7/12 bg-slate-900 flex flex-col h-auto shadow-none z-20 order-2`}
      >
        {/* TOOLBAR */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
          <h2 className="font-bold text-xl text-slate-100">
            {isStandalone
              ? editingId
                ? "Modifica Giocatore"
                : "Dettagli"
              : `In gioco (${players.length})`}
          </h2>

          {!isStandalone && !editingId && !isModalMode && (
            <button
              onClick={onStartGame}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-amber-200 transition flex items-center gap-2 animate-in zoom-in"
            >
              <Check size={20} /> Gioca
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900 relative">
          {/* DESKTOP CONTENT LOGIC */}
          {isStandalone ? (
            /* MODE 1: STANDALONE RUBRICA */
            <div className="block h-full">
              {editingId ? (
                <div className="h-full">
                  <PlayerEditForm
                    name={editingName}
                    setName={setEditingName}
                    colorIdx={editingColorIdx}
                    setColorIdx={setEditingColorIdx}
                    onSave={handleUpdatePlayer}
                    onDelete={handleDeleteSavedPlayer}
                    onCancel={() => setEditingId(null)}
                    variant="flat"
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                  <User size={64} className="mb-4 opacity-10" />
                  <p className="text-xl font-medium text-slate-400">
                    Seleziona la matita
                  </p>
                  <p className="text-sm mt-2 text-slate-500">
                    per modificare un giocatore.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: GAME SETUP (Always Squad List in Right Pane) */
            <div className="space-y-3 max-w-2xl mx-auto">
              {players.length === 0 ? (
                <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                  <UserPlus size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-lg text-slate-400">
                    La tua squadra è vuota.
                  </p>
                  <p className="text-sm text-slate-500">
                    Aggiungi giocatori dalla Rubrica a sinistra.
                  </p>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    modifiers={[restrictToVerticalAxis]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                  >
                    <SortableContext
                      items={players.map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {players.map((p, idx) => (
                          <SortablePlayerItem
                            key={p.id}
                            player={p}
                            index={idx}
                            onRemove={removeFromSquad}
                          />
                        ))}
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {activeId ? (
                        <PlayerItem
                          player={players.find((p) => p.id === activeId)}
                          index={players.findIndex((p) => p.id === activeId)}
                          className="shadow-2xl scale-105 ring-2 ring-amber-500 cursor-grabbing bg-white/90 backdrop-blur"
                        />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP MODAL (Game Mode Only) - For editing from list while in game mode */}
      {!isStandalone && editingId && (
        <div className="flex fixed inset-0 z-[60] bg-black/20 items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg shadow-2xl">
            <PlayerEditForm
              name={editingName}
              setName={setEditingName}
              colorIdx={editingColorIdx}
              setColorIdx={setEditingColorIdx}
              onSave={handleUpdatePlayer}
              onDelete={handleDeleteSavedPlayer}
              onCancel={() => setEditingId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPlayersDesktop;
