import React, { useState } from 'react';
import { GameProject, Piece } from '../../../types';
import { PIECE_ICONS } from '../../../data/templates';
import { Crown, Plus, Trash2 } from 'lucide-react';

interface PiecesStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
  onSelectTile: (tileIndex: number) => void;
}

const PLAYER_PRESET_COLORS = [
  '#ef4444', // Player 1 - Red
  '#22c55e', // Player 2 - Green
  '#3b82f6', // Player 3 - Blue
  '#eab308', // Player 4 - Yellow
  '#a855f7', // Player 5 - Purple
  '#18181b', // Player 6 - Dark
];

export const PiecesStep: React.FC<PiecesStepProps> = ({
  project,
  onChangeProject,
  onSelectTile,
}) => {
  const { pieces, tiles } = project;
  const [selectedPieceId, setSelectedPieceId] = useState<string>(pieces[0]?.id || '');

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId) || pieces[0];

  // Update selected piece
  const handleUpdatePiece = (updates: Partial<Piece>) => {
    if (!selectedPiece) return;
    const updated = pieces.map((p) =>
      p.id === selectedPiece.id ? { ...p, ...updates } : p
    );
    onChangeProject({ ...project, pieces: updated });
  };

  // Add new piece token
  const handleAddPiece = () => {
    const nextNum = (pieces.length % 6) + 1;
    const newPiece: Piece = {
      id: `piece_${Date.now()}`,
      name: `Player ${nextNum} Token`,
      icon: '♟',
      playerNumber: nextNum,
      color: PLAYER_PRESET_COLORS[nextNum - 1] || '#ef4444',
      currentTileIndex: 0,
      startTileIndex: 0,
      movementType: 'step',
      role: 'Token',
    };
    onChangeProject({ ...project, pieces: [...pieces, newPiece] });
    setSelectedPieceId(newPiece.id);
  };

  // Delete piece token
  const handleDeletePiece = (id: string) => {
    if (pieces.length <= 1) return; // Keep at least one
    const updated = pieces.filter((p) => p.id !== id);
    onChangeProject({ ...project, pieces: updated });
    if (selectedPieceId === id) {
      setSelectedPieceId(updated[0]?.id || '');
    }
  };

  // Quick Preset Piece Loaders
  const handleApply4PlayerTokens = () => {
    const fourPieces: Piece[] = [
      { id: 'p1_red', name: 'Red Token', icon: '♟', playerNumber: 1, color: '#ef4444', currentTileIndex: 0, startTileIndex: 0 },
      { id: 'p2_grn', name: 'Green Token', icon: '♞', playerNumber: 2, color: '#22c55e', currentTileIndex: 0, startTileIndex: 0 },
      { id: 'p3_blu', name: 'Blue Token', icon: '🧙', playerNumber: 3, color: '#3b82f6', currentTileIndex: 0, startTileIndex: 0 },
      { id: 'p4_gld', name: 'Yellow Token', icon: '⛵', playerNumber: 4, color: '#eab308', currentTileIndex: 0, startTileIndex: 0 },
    ];
    onChangeProject({ ...project, pieces: fourPieces });
    setSelectedPieceId(fourPieces[0].id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Crown className="w-4 h-4 text-zinc-700" />
          <span>Step 3: Choosing Pieces & Player Tokens</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Customize tokens for each player, choose icons, starting positions, and player colors.
        </p>
      </div>

      {/* Quick Setup Presets */}
      <div>
        <button
          onClick={handleApply4PlayerTokens}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
        >
          Load Standard 4-Player Token Set
        </button>
      </div>

      {/* Pieces Horizontal Grid */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-700">
            Player Pieces ({pieces.length})
          </span>
          <button
            onClick={handleAddPiece}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Piece</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {pieces.map((piece) => {
            const isSelected = selectedPiece?.id === piece.id;
            return (
              <div
                key={piece.id}
                onClick={() => {
                  setSelectedPieceId(piece.id);
                  onSelectTile(piece.currentTileIndex);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-between text-center relative ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                }`}
              >
                {pieces.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePiece(piece.id);
                    }}
                    className={`absolute top-1.5 right-1.5 p-1 transition-colors ${
                      isSelected ? 'text-zinc-400 hover:text-red-400' : 'text-zinc-400 hover:text-red-600'
                    }`}
                    title="Delete piece"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg text-white font-bold border-2 border-white shadow-xs my-1"
                  style={{ backgroundColor: piece.color }}
                >
                  {piece.icon}
                </div>

                <div className="w-full">
                  <h4 className="text-xs font-bold truncate">
                    {piece.name}
                  </h4>
                  <span className={`text-[10px] block ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Player {piece.playerNumber} • Tile #{piece.currentTileIndex}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Piece Editor Box */}
      {selectedPiece && (
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="text-xs font-bold text-zinc-900">
              Piece Settings: {selectedPiece.name}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              Player {selectedPiece.playerNumber}
            </span>
          </div>

          {/* Name & Player Assign */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Piece Name
              </label>
              <input
                type="text"
                value={selectedPiece.name}
                onChange={(e) => handleUpdatePiece({ name: e.target.value })}
                placeholder="e.g. Knight, Scout, Boat"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Assign to Player
              </label>
              <select
                value={selectedPiece.playerNumber}
                onChange={(e) => {
                  const pNum = Number(e.target.value);
                  handleUpdatePiece({
                    playerNumber: pNum,
                    color: PLAYER_PRESET_COLORS[pNum - 1] || selectedPiece.color,
                  });
                }}
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>Player {num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Piece Icon Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Select Token Icon
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {PIECE_ICONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleUpdatePiece({ icon: item.icon })}
                  className={`p-2 rounded-lg border text-lg text-center transition-all ${
                    selectedPiece.icon === item.icon
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                  title={item.name}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Piece Color & Starting Tile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Token Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedPiece.color}
                  onChange={(e) => handleUpdatePiece({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-zinc-300 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-zinc-700">{selectedPiece.color}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Starting Tile
              </label>
              <select
                value={selectedPiece.startTileIndex}
                onChange={(e) => {
                  const tileIdx = Number(e.target.value);
                  handleUpdatePiece({
                    startTileIndex: tileIdx,
                    currentTileIndex: tileIdx,
                  });
                  onSelectTile(tileIdx);
                }}
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              >
                {tiles.map((t) => (
                  <option key={t.index} value={t.index}>
                    Tile #{t.index} {t.label ? `(${t.label})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};


