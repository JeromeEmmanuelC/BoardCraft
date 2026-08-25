import React from 'react';
import { GameProject, Tile } from '../../types';

interface BoardCanvasProps {
  project: GameProject;
  selectedTileIndex: number | null;
  onSelectTile: (tileIndex: number) => void;
  highlightedTiles?: number[];
  activePlayerPieceIndex?: number;
  previewMode?: boolean;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({
  project,
  selectedTileIndex,
  onSelectTile,
  highlightedTiles = [],
  previewMode = false,
}) => {
  const { designType, rows, cols, tiles, snakesAndLadders = [], pieces } = project;

  // Render Square / Rectangular / Snakes and Ladders Grid
  const renderStandardGrid = () => {
    return (
      <div
        className="grid gap-1 p-2 bg-zinc-100 rounded-lg border border-zinc-200 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {tiles.map((tile) => {
          const isSelected = selectedTileIndex === tile.index;
          const isHighlighted = highlightedTiles.includes(tile.index);
          const piecesOnTile = pieces.filter((p) => p.currentTileIndex === tile.index);

          // Check if this tile is the start of a snake or ladder
          const slItem = snakesAndLadders.find((sl) => sl.fromIndex === tile.index);

          return (
            <div
              key={tile.id || tile.index}
              onClick={() => onSelectTile(tile.index)}
              className={`aspect-square relative rounded-md p-1 flex flex-col justify-between items-center cursor-pointer transition-all duration-150 select-none border border-zinc-200/80 ${
                isSelected
                  ? 'ring-2 ring-zinc-900 ring-offset-2 ring-offset-white scale-105 z-20 shadow-md'
                  : 'hover:brightness-95 hover:z-10'
              } ${isHighlighted ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}
              style={{
                backgroundColor: tile.color || '#ffffff',
                color: tile.textColor || '#18181b',
              }}
            >
              {/* Tile Index / Label Header */}
              <div className="w-full flex items-center justify-between text-[10px] leading-none opacity-80 font-medium">
                <span>{tile.label || tile.index}</span>
                {slItem && (
                  <span className={`text-xs ${slItem.type === 'ladder' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {slItem.type === 'ladder' ? '🪜' : '🐍'}
                  </span>
                )}
              </div>

              {/* Central Tile Icon or Action */}
              <div className="flex-1 flex items-center justify-center text-center my-0.5">
                {tile.icon ? (
                  <span className="text-base sm:text-lg">{tile.icon}</span>
                ) : tile.subLabel ? (
                  <span className="text-[9px] font-semibold uppercase tracking-tight text-center leading-tight line-clamp-1">
                    {tile.subLabel}
                  </span>
                ) : null}
              </div>

              {/* Player Pieces Resting on This Tile */}
              {piecesOnTile.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-30 pointer-events-none">
                  {piecesOnTile.map((piece) => (
                    <div
                      key={piece.id}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 border-white shadow-md transform -translate-y-1 hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: piece.color || '#2563eb',
                        color: '#ffffff',
                      }}
                      title={`${piece.name} (Player ${piece.playerNumber})`}
                    >
                      <span>{piece.icon}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-label footer */}
              {tile.subLabel && !tile.icon && (
                <span className="text-[8px] opacity-75 truncate max-w-full font-medium">
                  {tile.subLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render Perimeter Track (Monopoly Style)
  const renderPerimeterTrack = () => {
    const sideCount = Math.floor(tiles.length / 4) || 10;
    
    const bottomTiles = tiles.slice(0, sideCount);
    const leftTiles = tiles.slice(sideCount, sideCount * 2);
    const topTiles = tiles.slice(sideCount * 2, sideCount * 3);
    const rightTiles = tiles.slice(sideCount * 3, sideCount * 4);

    return (
      <div className="relative w-full aspect-square max-w-[620px] mx-auto bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
        
        {/* Center Plaque */}
        <div className="absolute inset-16 sm:inset-20 bg-white rounded-lg border border-zinc-200 shadow-xs p-4 flex flex-col items-center justify-center text-center space-y-1.5 pointer-events-none">
          <span className="text-2xl select-none">👑</span>
          <h3 className="text-base sm:text-xl font-bold text-zinc-900">
            {project.name}
          </h3>
          <p className="text-xs text-zinc-500 italic max-w-xs">
            {project.ruleEngine.tagline || 'Custom Perimeter Board'}
          </p>
          <div className="flex gap-2 pt-1 text-[11px] font-medium text-zinc-400">
            <span>{project.cards.length} Cards</span>
            <span>•</span>
            <span>{project.ruleEngine.difficulty}</span>
          </div>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-10 gap-1">
          {topTiles.map((tile) => renderSingleTile(tile))}
        </div>

        {/* Middle Area */}
        <div className="flex justify-between flex-1 py-1">
          <div className="flex flex-col justify-between gap-1 w-[9%]">
            {leftTiles.map((tile) => renderSingleTile(tile))}
          </div>

          <div className="flex flex-col justify-between gap-1 w-[9%]">
            {rightTiles.map((tile) => renderSingleTile(tile))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-10 gap-1">
          {bottomTiles.map((tile) => renderSingleTile(tile))}
        </div>

      </div>
    );
  };

  const renderSingleTile = (tile: Tile) => {
    const isSelected = selectedTileIndex === tile.index;
    const isHighlighted = highlightedTiles.includes(tile.index);
    const piecesOnTile = pieces.filter((p) => p.currentTileIndex === tile.index);

    return (
      <div
        key={tile.id || tile.index}
        onClick={() => onSelectTile(tile.index)}
        className={`aspect-square relative rounded-xs p-0.5 sm:p-1 flex flex-col justify-between items-center cursor-pointer transition-all border border-zinc-200 ${
          isSelected
            ? 'ring-2 ring-zinc-900 ring-offset-1 ring-offset-white scale-105 z-20 shadow-md'
            : 'hover:brightness-95'
        } ${isHighlighted ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}
        style={{
          backgroundColor: tile.color || '#ffffff',
          color: tile.textColor || '#18181b',
        }}
      >
        <span className="text-[8px] font-medium leading-none truncate w-full text-center">
          {tile.label || tile.index}
        </span>

        {tile.icon && <span className="text-xs">{tile.icon}</span>}

        {piecesOnTile.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-30">
            {piecesOnTile.map((piece) => (
              <span
                key={piece.id}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-white shadow-xs"
                style={{ backgroundColor: piece.color }}
              >
                {piece.icon}
              </span>
            ))}
          </div>
        )}

        {tile.subLabel && (
          <span className="text-[7px] font-medium truncate leading-none">
            {tile.subLabel}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-xl bg-white p-3 sm:p-5 border border-zinc-200 shadow-xs overflow-hidden">
      
      {/* Board Header Bar */}
      <div className="flex flex-wrap items-center justify-between mb-3 pb-2 border-b border-zinc-100 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="text-zinc-900 font-semibold">{project.name}</span>
          <span className="text-zinc-400">({designType.toUpperCase()})</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 font-medium">
          <span>{tiles.length} Tiles</span>
          <span>•</span>
          <span>{pieces.length} Pieces</span>
        </div>
      </div>

      {/* Main Board Viewport */}
      <div className="flex justify-center items-center overflow-auto max-h-[600px] p-1">
        {designType === 'track' ? renderPerimeterTrack() : renderStandardGrid()}
      </div>

      {/* Tile Selection Legend */}
      {!previewMode && (
        <div className="mt-3 pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs text-zinc-500">
          <span>Click any square to edit color, icon, and trigger</span>
          {selectedTileIndex !== null && (
            <span className="text-zinc-900 font-medium">
              Selected: #{selectedTileIndex} ({tiles.find((t) => t.index === selectedTileIndex)?.label || 'Square'})
            </span>
          )}
        </div>
      )}

    </div>
  );
};

