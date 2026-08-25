import React, { useState } from 'react';
import { GameProject, PalettePreset, Tile, TileActionType, SnakeOrLadder } from '../../../types';
import { PALETTE_PRESETS, TILE_ICONS } from '../../../data/templates';
import { Palette, Paintbrush, Check, Plus, Trash2 } from 'lucide-react';

interface AestheticsStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
  selectedTileIndex: number | null;
  onSelectTile: (tileIndex: number) => void;
}

const ACTION_TYPES: { id: TileActionType; label: string }[] = [
  { id: 'none', label: 'None (Standard Tile)' },
  { id: 'gain_gold', label: '💰 Gain Gold / Bounty' },
  { id: 'lose_gold', label: '💸 Pay Tax / Penalty' },
  { id: 'draw_card', label: '📜 Draw Artifact Card' },
  { id: 'advance', label: '⏩ Advance Extra Tiles' },
  { id: 'retreat', label: '⏪ Retreat Backward' },
  { id: 'roll_again', label: '🎲 Roll Bonus Turn' },
  { id: 'lose_turn', label: '⏳ Lose Next Turn' },
  { id: 'safe_zone', label: '🛡️ Safe Sanctuary' },
  { id: 'teleport', label: '🌀 Teleport / Shortcut' },
  { id: 'jail', label: '⛓️ Dungeon / Jail' },
];

const PRESET_SWATCHES = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#64748b', '#18181b',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#fdf4ff', '#fee2e2', '#fef3c7', '#dcfce7', '#e0f2fe', '#f3e8ff',
];

export const AestheticsStep: React.FC<AestheticsStepProps> = ({
  project,
  onChangeProject,
  selectedTileIndex,
  onSelectTile,
}) => {
  const { paletteId, tiles, snakesAndLadders = [] } = project;
  const [paintMode, setPaintMode] = useState<'preset' | 'individual'>('preset');

  const selectedTile = tiles.find((t) => t.index === selectedTileIndex) || tiles[0];

  // Apply a Global Palette Preset
  const handleApplyPalette = (palette: PalettePreset) => {
    const updatedTiles = tiles.map((tile) => {
      const isAlt = (tile.row + tile.col) % 2 === 0;
      return {
        ...tile,
        color: isAlt ? palette.lightTile : palette.darkTile,
        textColor: isAlt ? palette.textColor : '#ffffff',
      };
    });

    onChangeProject({
      ...project,
      paletteId: palette.id,
      tiles: updatedTiles,
    });
  };

  // Update specific properties of the selected tile
  const handleUpdateSelectedTile = (updates: Partial<Tile>) => {
    if (!selectedTile) return;
    const updatedTiles = tiles.map((t) =>
      t.index === selectedTile.index ? { ...t, ...updates } : t
    );
    onChangeProject({ ...project, tiles: updatedTiles });
  };

  // Quick Checkered Reapply
  const handleReapplyCheckered = () => {
    const activePalette = PALETTE_PRESETS.find((p) => p.id === paletteId) || PALETTE_PRESETS[0];
    const updatedTiles = tiles.map((tile) => {
      const isAlt = (tile.row + tile.col) % 2 === 0;
      return {
        ...tile,
        color: isAlt ? activePalette.lightTile : activePalette.darkTile,
        textColor: isAlt ? activePalette.textColor : '#ffffff',
      };
    });
    onChangeProject({ ...project, tiles: updatedTiles });
  };

  // Add Snake or Ladder connection
  const handleAddSnakeLadder = (type: 'snake' | 'ladder') => {
    const newFrom = selectedTile ? selectedTile.index : 10;
    const newTo = type === 'ladder' ? Math.min(newFrom + 15, tiles.length) : Math.max(newFrom - 15, 1);
    
    const newLink: SnakeOrLadder = {
      id: `sl_${Date.now()}`,
      fromIndex: newFrom,
      toIndex: newTo,
      type,
      label: type === 'ladder' ? 'Ladder Shortcut' : 'Snake Slide',
    };

    // Update tile trigger as well
    const updatedTiles = tiles.map((t) => {
      if (t.index === newFrom) {
        return {
          ...t,
          icon: type === 'ladder' ? '🪜' : '🐍',
          subLabel: type === 'ladder' ? `+to ${newTo}` : `-to ${newTo}`,
          actionType: 'teleport' as TileActionType,
          actionValue: newTo,
        };
      }
      return t;
    });

    onChangeProject({
      ...project,
      snakesAndLadders: [...snakesAndLadders, newLink],
      tiles: updatedTiles,
    });
  };

  const handleRemoveSnakeLadder = (id: string) => {
    const link = snakesAndLadders.find((s) => s.id === id);
    const updatedLinks = snakesAndLadders.filter((s) => s.id !== id);
    
    let updatedTiles = tiles;
    if (link) {
      updatedTiles = tiles.map((t) => {
        if (t.index === link.fromIndex) {
          return {
            ...t,
            icon: undefined,
            subLabel: undefined,
            actionType: 'none',
          };
        }
        return t;
      });
    }

    onChangeProject({
      ...project,
      snakesAndLadders: updatedLinks,
      tiles: updatedTiles,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-zinc-700" />
          <span>Step 2: Board Colours & Tile Painter</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Select a master palette or paint individual squares with custom colors, icons, and triggers.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex border border-zinc-200 rounded-lg p-1 bg-zinc-100">
        <button
          onClick={() => setPaintMode('preset')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
            paintMode === 'preset'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Color Palettes</span>
        </button>

        <button
          onClick={() => setPaintMode('individual')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
            paintMode === 'individual'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Individual Tiles</span>
        </button>
      </div>

      {/* Preset Palettes Grid */}
      {paintMode === 'preset' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PALETTE_PRESETS.map((palette) => {
              const isSelected = paletteId === palette.id;
              return (
                <div
                  key={palette.id}
                  onClick={() => handleApplyPalette(palette)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold">
                      {palette.name}
                    </h4>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-white text-zinc-900">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  
                  {/* Swatches strip */}
                  <div className="flex gap-1 h-5 rounded-md overflow-hidden border border-zinc-200 p-0.5 bg-zinc-50">
                    <div className="flex-1 rounded-xs" style={{ backgroundColor: palette.lightTile }} />
                    <div className="flex-1 rounded-xs" style={{ backgroundColor: palette.darkTile }} />
                    <div className="flex-1 rounded-xs" style={{ backgroundColor: palette.accent }} />
                    <div className="flex-1 rounded-xs" style={{ backgroundColor: palette.boardBg }} />
                  </div>

                  <p className={`text-[11px] mt-2 line-clamp-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {palette.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={handleReapplyCheckered}
              className="w-full py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
            >
              Reset to Alternating Checkered Pattern
            </button>
          </div>
        </div>
      ) : (
        
        /* Individual Tile Customizer */
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
          
          {/* Active selected tile header */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <div>
              <span className="text-xs font-bold text-zinc-900 block">
                Editing Tile #{selectedTile?.index} ({selectedTile?.label || 'Square'})
              </span>
              <span className="text-[11px] text-zinc-500">
                Row {selectedTile?.row + 1}, Col {selectedTile?.col + 1}
              </span>
            </div>

            {/* Tile index quick jumper */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">Jump:</span>
              <select
                value={selectedTile?.index}
                onChange={(e) => onSelectTile(Number(e.target.value))}
                className="px-2 py-1 rounded-md bg-white border border-zinc-300 text-xs text-zinc-800 focus:outline-hidden"
              >
                {tiles.map((t) => (
                  <option key={t.index} value={t.index}>
                    #{t.index} {t.label ? `(${t.label})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Swatch Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Tile Background Color
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  onClick={() => handleUpdateSelectedTile({ color: hex })}
                  className={`w-6 h-6 rounded-md border transition-transform ${
                    selectedTile?.color === hex ? 'scale-115 ring-2 ring-zinc-900 border-white' : 'border-zinc-300'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-500 font-medium">Custom Color:</span>
              <input
                type="color"
                value={selectedTile?.color || '#ffffff'}
                onChange={(e) => handleUpdateSelectedTile({ color: e.target.value })}
                className="w-7 h-7 rounded border border-zinc-300 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-zinc-700">{selectedTile?.color}</span>
            </div>
          </div>

          {/* Tile Labels */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Main Tile Label
              </label>
              <input
                type="text"
                value={selectedTile?.label || ''}
                onChange={(e) => handleUpdateSelectedTile({ label: e.target.value })}
                placeholder="e.g. START, B8, 42"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Sub-Label / Action Note
              </label>
              <input
                type="text"
                value={selectedTile?.subLabel || ''}
                onChange={(e) => handleUpdateSelectedTile({ subLabel: e.target.value })}
                placeholder="e.g. +100 GP, DRAW"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Emblem / Tile Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Tile Icon
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              <button
                onClick={() => handleUpdateSelectedTile({ icon: undefined })}
                className={`p-1.5 rounded-md border text-xs text-center transition-all ${
                  !selectedTile?.icon ? 'bg-zinc-900 text-white font-bold' : 'bg-white border-zinc-200 text-zinc-600'
                }`}
                title="None"
              >
                None
              </button>
              {TILE_ICONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleUpdateSelectedTile({ icon: item.icon })}
                  className={`p-1.5 rounded-md border text-base text-center transition-all ${
                    selectedTile?.icon === item.icon
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Tile Action / Trigger Effect
            </label>
            <select
              value={selectedTile?.actionType || 'none'}
              onChange={(e) => handleUpdateSelectedTile({ actionType: e.target.value as TileActionType })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            >
              {ACTION_TYPES.map((act) => (
                <option key={act.id} value={act.id}>{act.label}</option>
              ))}
            </select>
          </div>

        </div>
      )}

      {/* Snake and Ladder Links Section */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-900">
            Tile Connectors & Shortcuts ({snakesAndLadders.length})
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddSnakeLadder('ladder')}
              className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Ladder (Up)</span>
            </button>
            <button
              onClick={() => handleAddSnakeLadder('snake')}
              className="px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1 hover:bg-red-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Snake (Down)</span>
            </button>
          </div>
        </div>

        {snakesAndLadders.length === 0 ? (
          <p className="text-xs text-zinc-500">
            No special shortcuts configured. Click above to add climbing ladders or snakes between tiles.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {snakesAndLadders.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs"
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{link.type === 'ladder' ? '🪜' : '🐍'}</span>
                  <span className={link.type === 'ladder' ? 'text-emerald-700' : 'text-red-700'}>
                    {link.type.toUpperCase()}: Tile #{link.fromIndex} ➔ Tile #{link.toIndex}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveSnakeLadder(link.id)}
                  className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                  title="Remove connector"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};


