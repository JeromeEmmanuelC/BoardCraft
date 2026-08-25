import React, { useState } from 'react';
import { X, Grid, Square, Check, ArrowRight } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSquare: (size: number, template?: string) => void;
  onCreateRectangular: (rows: number, cols: number) => void;
  onSelectBuiltinTemplate: (templateId: 'chess' | 'snakes_ladders' | 'ludo' | 'monopoly') => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreateSquare,
  onCreateRectangular,
  onSelectBuiltinTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'templates'>('architecture');
  const [selectedDesign, setSelectedDesign] = useState<'square' | 'rectangular'>('square');
  
  // Custom Dimension states
  const [squareSize, setSquareSize] = useState<number>(8);
  const [rectRows, setRectRows] = useState<number>(6);
  const [rectCols, setRectCols] = useState<number>(8);

  if (!isOpen) return null;

  const handleCreateFromDesign = () => {
    if (selectedDesign === 'square') {
      onCreateSquare(squareSize);
    } else {
      onCreateRectangular(rectRows, rectCols);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white text-zinc-900 rounded-xl border border-zinc-200 shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Create New Board
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Choose a custom board layout or pick a starter template.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'architecture'
                ? 'bg-white text-zinc-900 border-b-2 border-zinc-900 font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>Custom Geometry</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'templates'
                ? 'bg-white text-zinc-900 border-b-2 border-zinc-900 font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>Built-in Templates</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {activeTab === 'architecture' ? (
            <div className="space-y-5">
              
              {/* The Two Designs: Square Board vs Custom Rectangular */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Design 1: Square Board */}
                <div
                  onClick={() => setSelectedDesign('square')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDesign === 'square'
                      ? 'bg-zinc-50 border-zinc-900 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl">🔲</span>
                    {selectedDesign === 'square' && (
                      <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                    Square Board
                  </h3>
                  <p className="text-xs text-zinc-500 mb-2">
                    Chess, Checkers, and grid arenas ($N \times N$).
                  </p>
                  <span className="text-[11px] font-medium text-zinc-600 bg-zinc-200/70 px-2 py-0.5 rounded inline-block">
                    {squareSize} × {squareSize} ({squareSize * squareSize} Tiles)
                  </span>
                </div>

                {/* Design 2: Custom Rectangular */}
                <div
                  onClick={() => setSelectedDesign('rectangular')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDesign === 'rectangular'
                      ? 'bg-zinc-50 border-zinc-900 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl">📐</span>
                    {selectedDesign === 'rectangular' && (
                      <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                    Rectangular Board
                  </h3>
                  <p className="text-xs text-zinc-500 mb-2">
                    Custom aspect ratios and linear adventure lanes.
                  </p>
                  <span className="text-[11px] font-medium text-zinc-600 bg-zinc-200/70 px-2 py-0.5 rounded inline-block">
                    {rectRows} × {rectCols} ({rectRows * rectCols} Tiles)
                  </span>
                </div>

              </div>

              {/* Dimension Tuner */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
                <div className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Configure Dimensions
                </div>

                {selectedDesign === 'square' ? (
                  <div>
                    <div className="flex justify-between text-xs text-zinc-700 mb-1.5 font-medium">
                      <span>Grid Dimensions:</span>
                      <span>{squareSize} × {squareSize} ({squareSize * squareSize} tiles)</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="14"
                      step="1"
                      value={squareSize}
                      onChange={(e) => setSquareSize(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                      <span>4×4</span>
                      <span>8×8 (Chess)</span>
                      <span>10×10</span>
                      <span>14×14</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-700 mb-1.5 font-medium">
                        <span>Rows:</span>
                        <span>{rectRows}</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="14"
                        value={rectRows}
                        onChange={(e) => setRectRows(Number(e.target.value))}
                        className="w-full accent-zinc-900 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-zinc-700 mb-1.5 font-medium">
                        <span>Columns:</span>
                        <span>{rectCols}</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="16"
                        value={rectCols}
                        onChange={(e) => setRectCols(Number(e.target.value))}
                        className="w-full accent-zinc-900 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleCreateFromDesign}
                className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Create Board & Open Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ) : (
            
            /* Built-in Templates Selection */
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">
                Choose a pre-configured template with ready-to-use tiles, pieces, dice, and rules:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Chess Template */}
                <div
                  onClick={() => {
                    onSelectBuiltinTemplate('chess');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 cursor-pointer group transition-all flex items-center gap-3"
                >
                  <span className="text-2xl p-2 rounded-lg bg-zinc-100">♟️</span>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
                      Grandmaster Chess
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      8×8 Checkered • 32 Pieces • Standard Rules
                    </p>
                  </div>
                </div>

                {/* Snake & Ladder Template */}
                <div
                  onClick={() => {
                    onSelectBuiltinTemplate('snakes_ladders');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 cursor-pointer group transition-all flex items-center gap-3"
                >
                  <span className="text-2xl p-2 rounded-lg bg-zinc-100">🪜</span>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
                      Snakes & Ladders
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      100 Serpentine Tiles • Climbs & Perils • D6
                    </p>
                  </div>
                </div>

                {/* Ludo Template */}
                <div
                  onClick={() => {
                    onSelectBuiltinTemplate('ludo');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 cursor-pointer group transition-all flex items-center gap-3"
                >
                  <span className="text-2xl p-2 rounded-lg bg-zinc-100">⭐</span>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
                      Pachisi / Ludo
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      4 Home Quadrants • Safe Stars • Center Spire
                    </p>
                  </div>
                </div>

                {/* Monopoly Template */}
                <div
                  onClick={() => {
                    onSelectBuiltinTemplate('monopoly');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 cursor-pointer group transition-all flex items-center gap-3"
                >
                  <span className="text-2xl p-2 rounded-lg bg-zinc-100">🏰</span>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
                      Circuit Track
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      40-Tile Loop • Property Districts • Event Decks
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};


