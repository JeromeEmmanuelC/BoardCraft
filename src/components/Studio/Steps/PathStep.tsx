import React, { useState } from 'react';
import { GameProject, TileConnector, ConnectorType } from '../../../types';
import { GitCommit, Plus, Trash2, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface PathStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
  selectedTileIndex: number | null;
  onSelectTile: (tileIndex: number) => void;
  showMoveOrder: boolean;
  onToggleMoveOrder: (show: boolean) => void;
}

export const PathStep: React.FC<PathStepProps> = ({
  project,
  onChangeProject,
  selectedTileIndex,
  onSelectTile,
  showMoveOrder,
  onToggleMoveOrder,
}) => {
  const { tiles, snakesAndLadders = [] } = project;

  // New connector form state
  const [connectorType, setConnectorType] = useState<ConnectorType>('ladder');
  const [fromCell, setFromCell] = useState<number>(selectedTileIndex || 4);
  const [toCell, setToCell] = useState<number>(Math.min((selectedTileIndex || 4) + 12, tiles.length));

  // Sync fromCell when a user clicks a cell on the board
  React.useEffect(() => {
    if (selectedTileIndex !== null) {
      setFromCell(selectedTileIndex);
      if (connectorType === 'ladder') {
        setToCell(Math.min(selectedTileIndex + 10, tiles.length));
      } else {
        setToCell(Math.max(selectedTileIndex - 10, 1));
      }
    }
  }, [selectedTileIndex, connectorType, tiles.length]);

  const handleAddConnector = () => {
    if (fromCell === toCell) return;
    if (fromCell < 1 || fromCell > tiles.length) return;
    if (toCell < 1 || toCell > tiles.length) return;

    const newConnector: TileConnector = {
      id: `conn_${Date.now()}`,
      fromIndex: fromCell,
      toIndex: toCell,
      type: connectorType,
      label: connectorType === 'ladder' ? `Ladder to ${toCell}` : `Tunnel to ${toCell}`,
    };

    // Update the tile trigger action so landing on it teleports player
    const updatedTiles = tiles.map((t) => {
      if (t.index === fromCell) {
        return {
          ...t,
          icon: connectorType === 'ladder' ? '🪜' : '🚇',
          subLabel: connectorType === 'ladder' ? `Up to #${toCell}` : `Tunnel to #${toCell}`,
          actionType: 'teleport' as const,
          actionValue: toCell,
        };
      }
      return t;
    });

    onChangeProject({
      ...project,
      snakesAndLadders: [...snakesAndLadders, newConnector],
      tiles: updatedTiles,
    });
  };

  const handleRemoveConnector = (id: string) => {
    const conn = snakesAndLadders.find((c) => c.id === id);
    const updatedList = snakesAndLadders.filter((c) => c.id !== id);

    // Reset tile icon/subLabel if it was set by this connector
    const updatedTiles = tiles.map((t) => {
      if (conn && t.index === conn.fromIndex) {
        return {
          ...t,
          icon: undefined,
          subLabel: undefined,
          actionType: 'none' as const,
          actionValue: undefined,
        };
      }
      return t;
    });

    onChangeProject({
      ...project,
      snakesAndLadders: updatedList,
      tiles: updatedTiles,
    });
  };

  const startTile = tiles[0];
  const endTile = tiles[tiles.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-3">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-amber-700" />
          <span>Move Order & Cell Connectors</span>
        </h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
          See the exact order pieces move around the board, and link two cells together with ladders or tunnels.
        </p>
      </div>

      {/* Part 1: How Pieces Move */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              Piece Movement Order
            </h4>
            <p className="text-xs text-stone-500">
              Pieces start at Cell #{startTile?.index || 1} and move step-by-step to Cell #{endTile?.index || tiles.length}.
            </p>
          </div>

          <button
            onClick={() => onToggleMoveOrder(!showMoveOrder)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showMoveOrder
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
          >
            {showMoveOrder ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-stone-500" />}
            <span>{showMoveOrder ? 'Hide Move Numbers' : 'Show Move Numbers'}</span>
          </button>
        </div>

        {/* Move Path Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-[11px] text-stone-500 block">Start Cell</span>
            <span className="text-sm font-bold text-emerald-700">#{startTile?.index || 1}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-[11px] text-stone-500 block">Finish Cell</span>
            <span className="text-sm font-bold text-amber-700">#{endTile?.index || tiles.length}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-[11px] text-stone-500 block">Total Steps</span>
            <span className="text-sm font-bold text-stone-900">{tiles.length} Cells</span>
          </div>
        </div>
      </div>

      {/* Part 2: Add Cell Connectors (Ladders & Tunnels) */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-stone-900">
            Connect Two Cells (Ladder or Tunnel)
          </h4>
          <p className="text-xs text-stone-500">
            When a player lands on the start cell, they will automatically travel to the destination cell.
          </p>
        </div>

        {/* Choose Design: Ladder vs Tunnel */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConnectorType('ladder')}
            className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
              connectorType === 'ladder'
                ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-500 text-stone-900'
                : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
          >
            <span className="text-2xl">🪜</span>
            <div>
              <span className="text-xs font-bold block">Ladder Design</span>
              <span className="text-[11px] text-stone-500">Climb forward to a higher cell</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setConnectorType('tunnel')}
            className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
              connectorType === 'tunnel'
                ? 'bg-stone-800 border-stone-900 ring-1 ring-stone-900 text-white'
                : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
          >
            <span className="text-2xl">🚇</span>
            <div>
              <span className="text-xs font-bold block">Tunnel Design</span>
              <span className={`text-[11px] ${connectorType === 'tunnel' ? 'text-stone-300' : 'text-stone-500'}`}>
                Passage / shortcut to another cell
              </span>
            </div>
          </button>
        </div>

        {/* From Cell & To Cell Selectors */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Start Cell (Entrance)
            </label>
            <select
              value={fromCell}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFromCell(val);
                onSelectTile(val);
              }}
              className="w-full px-2.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
            >
              {tiles.map((t) => (
                <option key={`from_${t.index}`} value={t.index}>
                  Cell #{t.index} {t.label ? `(${t.label})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Destination Cell (Exit)
            </label>
            <select
              value={toCell}
              onChange={(e) => setToCell(Number(e.target.value))}
              className="w-full px-2.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
            >
              {tiles.map((t) => (
                <option key={`to_${t.index}`} value={t.index}>
                  Cell #{t.index} {t.label ? `(${t.label})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddConnector}
          className="w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add {connectorType === 'ladder' ? 'Ladder' : 'Tunnel'} Between Cell #{fromCell} and #{toCell}</span>
        </button>
      </div>

      {/* Part 3: List of Active Connectors */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-900">
            Active Connectors on Board ({snakesAndLadders.length})
          </h4>
          <span className="text-[11px] text-stone-500">
            Rendered directly between cells
          </span>
        </div>

        {snakesAndLadders.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-stone-300 rounded-lg text-xs text-stone-500">
            No ladders or tunnels created yet. Use the form above to connect any two cells.
          </div>
        ) : (
          <div className="space-y-2">
            {snakesAndLadders.map((connector) => {
              const isLadder = connector.type === 'ladder';
              const diff = connector.toIndex - connector.fromIndex;

              return (
                <div
                  key={connector.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-300 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">
                      {isLadder ? '🪜' : '🚇'}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <span>{isLadder ? 'Ladder' : 'Tunnel'}</span>
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                          #{connector.fromIndex}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                          #{connector.toIndex}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {diff > 0 ? `+${diff} cells forward` : `${diff} cells`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveConnector(connector.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete connector"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
