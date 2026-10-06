import React from 'react';
import { GameProject, Tile } from '../../types';

interface BoardCanvasProps {
  project: GameProject;
  selectedTileIndex: number | null;
  onSelectTile: (tileIndex: number) => void;
  highlightedTiles?: number[];
  activePlayerPieceIndex?: number;
  previewMode?: boolean;
  showMoveOrder?: boolean;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({
  project,
  selectedTileIndex,
  onSelectTile,
  highlightedTiles = [],
  previewMode = false,
  showMoveOrder = false,
}) => {
  const { designType, rows, cols, tiles, snakesAndLadders = [], pieces } = project;

  // Helper to get tile center in 0..1000 SVG coordinates
  const getTileCenter = (tileIndex: number) => {
    const tile = tiles.find((t) => t.index === tileIndex);
    if (!tile) return null;
    const r = tile.row ?? Math.floor((tile.index - 1) / cols);
    const c = tile.col ?? ((tile.index - 1) % cols);
    return {
      x: ((c + 0.5) / cols) * 1000,
      y: ((r + 0.5) / rows) * 1000,
    };
  };

  // Render SVG Ladders and Tunnels directly between cells
  const renderConnectorsOverlay = () => {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="connectorShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Draw subtle move path arrows if showMoveOrder is enabled */}
        {showMoveOrder && (
          <g opacity="0.45">
            {tiles.map((tile, i) => {
              if (i === tiles.length - 1) return null;
              const nextTile = tiles[i + 1];
              const p1 = getTileCenter(tile.index);
              const p2 = getTileCenter(nextTile.index);
              if (!p1 || !p2) return null;
              return (
                <line
                  key={`path_${tile.index}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#92400e"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              );
            })}
          </g>
        )}

        {/* Draw each Ladder or Tunnel connector */}
        {snakesAndLadders.map((conn) => {
          const p1 = getTileCenter(conn.fromIndex);
          const p2 = getTileCenter(conn.toIndex);
          if (!p1 || !p2) return null;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) return null;

          const nx = -dy / len;
          const ny = dx / len;

          if (conn.type === 'ladder') {
            // Ladder design: two wooden rails with rungs
            const railOffset = 15;
            const rungs = Math.max(3, Math.floor(len / 42));

            const rail1X1 = p1.x + nx * railOffset;
            const rail1Y1 = p1.y + ny * railOffset;
            const rail1X2 = p2.x + nx * railOffset;
            const rail1Y2 = p2.y + ny * railOffset;

            const rail2X1 = p1.x - nx * railOffset;
            const rail2Y1 = p1.y - ny * railOffset;
            const rail2X2 = p2.x - nx * railOffset;
            const rail2Y2 = p2.y - ny * railOffset;

            return (
              <g key={conn.id} filter="url(#connectorShadow)">
                {/* Side Rail 1 */}
                <line
                  x1={rail1X1}
                  y1={rail1Y1}
                  x2={rail1X2}
                  y2={rail1Y2}
                  stroke="#854d0e"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Side Rail 2 */}
                <line
                  x1={rail2X1}
                  y1={rail2Y1}
                  x2={rail2X2}
                  y2={rail2Y2}
                  stroke="#854d0e"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Ladder Rungs */}
                {Array.from({ length: rungs }).map((_, rIdx) => {
                  const t = (rIdx + 1) / (rungs + 1);
                  const rx = p1.x + dx * t;
                  const ry = p1.y + dy * t;
                  return (
                    <line
                      key={`rung_${rIdx}`}
                      x1={rx + nx * railOffset}
                      y1={ry + ny * railOffset}
                      x2={rx - nx * railOffset}
                      y2={ry - ny * railOffset}
                      stroke="#d97706"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Anchor endpoints */}
                <circle cx={p1.x} cy={p1.y} r="8" fill="#ca8a04" stroke="#713f12" strokeWidth="2" />
                <circle cx={p2.x} cy={p2.y} r="8" fill="#ca8a04" stroke="#713f12" strokeWidth="2" />
              </g>
            );
          } else {
            // Tunnel design: Subterranean arched passage tube
            return (
              <g key={conn.id} filter="url(#connectorShadow)">
                {/* Outer Stone Tube */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#27272a"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Inner Track / Conduit */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#52525b"
                  strokeWidth="12"
                  strokeDasharray="12 8"
                  strokeLinecap="round"
                />
                {/* Archway Entrance Portals */}
                <circle cx={p1.x} cy={p1.y} r="14" fill="#18181b" stroke="#a1a1aa" strokeWidth="3" />
                <circle cx={p2.x} cy={p2.y} r="14" fill="#18181b" stroke="#a1a1aa" strokeWidth="3" />
                {/* Small indicator dots */}
                <circle cx={p1.x} cy={p1.y} r="5" fill="#f59e0b" />
                <circle cx={p2.x} cy={p2.y} r="5" fill="#10b981" />
              </g>
            );
          }
        })}
      </svg>
    );
  };

  // Render Square / Rectangular / Snakes and Ladders Grid
  const renderStandardGrid = () => {
    return (
      <div className="relative w-full aspect-square max-w-[620px] mx-auto">
        
        {/* Render Connectors Overlay on top of the tiles */}
        {renderConnectorsOverlay()}

        <div
          className="grid gap-1 p-2 bg-stone-100 rounded-lg border border-stone-300 shadow-inner w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {tiles.map((tile) => {
            const isSelected = selectedTileIndex === tile.index;
            const isHighlighted = highlightedTiles.includes(tile.index);
            const piecesOnTile = pieces.filter((p) => p.currentTileIndex === tile.index);

            // Check if this tile is the start or destination of a ladder or tunnel
            const connStart = snakesAndLadders.find((sl) => sl.fromIndex === tile.index);
            const connEnd = snakesAndLadders.find((sl) => sl.toIndex === tile.index);
            const isStartTile = tile.index === 1;
            const isEndTile = tile.index === tiles.length;

            return (
              <div
                key={tile.id || tile.index}
                onClick={() => onSelectTile(tile.index)}
                className={`aspect-square relative rounded-md p-1 flex flex-col justify-between items-center cursor-pointer transition-all duration-150 select-none border border-stone-300/80 ${
                  isSelected
                    ? 'ring-2 ring-stone-900 ring-offset-2 ring-offset-white scale-105 z-30 shadow-md'
                    : 'hover:brightness-95 hover:z-10'
                } ${isHighlighted ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}
                style={{
                  backgroundColor: tile.color || '#ffffff',
                  color: tile.textColor || '#18181b',
                }}
              >
                {/* Tile Index / Label Header */}
                <div className="w-full flex items-center justify-between text-[10px] leading-none opacity-90 font-medium">
                  <span className={showMoveOrder ? 'font-bold text-amber-900 bg-amber-100 px-1 py-0.5 rounded text-[9px]' : ''}>
                    {tile.label || `#${tile.index}`}
                  </span>
                  
                  {/* Start or Finish badges */}
                  {isStartTile && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-emerald-600 text-white leading-none">
                      START
                    </span>
                  )}
                  {isEndTile && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-amber-600 text-white leading-none">
                      GOAL
                    </span>
                  )}

                  {/* Connector Badge */}
                  {connStart && (
                    <span
                      className={`text-[9px] font-bold px-1 rounded flex items-center gap-0.5 ${
                        connStart.type === 'ladder'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-800 text-white'
                      }`}
                      title={connStart.type === 'ladder' ? `Ladder to #${connStart.toIndex}` : `Tunnel to #${connStart.toIndex}`}
                    >
                      {connStart.type === 'ladder' ? '🪜' : '🚇'} #{connStart.toIndex}
                    </span>
                  )}
                  {!connStart && connEnd && (
                    <span className="text-[8px] px-1 rounded bg-stone-100 text-stone-600 border border-stone-200">
                      Exit
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
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-40 pointer-events-none">
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

