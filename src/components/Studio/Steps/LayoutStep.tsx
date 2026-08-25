import React from 'react';
import { GameProject } from '../../../types';
import { Grid, Wand2 } from 'lucide-react';
import { 
  createChessTemplate, 
  createSnakesAndLaddersTemplate, 
  createLudoTemplate, 
  createMonopolyTemplate, 
  createCustomGridTemplate 
} from '../../../data/templates';

interface LayoutStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
}

export const LayoutStep: React.FC<LayoutStepProps> = ({
  project,
  onChangeProject,
}) => {
  const { designType, rows, cols } = project;

  const handleApplyTemplate = (templateId: 'chess' | 'snakes_ladders' | 'ludo' | 'monopoly') => {
    if (templateId === 'chess') onChangeProject({ ...createChessTemplate(), id: project.id, name: project.name });
    if (templateId === 'snakes_ladders') onChangeProject({ ...createSnakesAndLaddersTemplate(), id: project.id, name: project.name });
    if (templateId === 'ludo') onChangeProject({ ...createLudoTemplate(), id: project.id, name: project.name });
    if (templateId === 'monopoly') onChangeProject({ ...createMonopolyTemplate(), id: project.id, name: project.name });
  };

  const handleResizeGrid = (newRows: number, newCols: number, isSquare: boolean) => {
    const fresh = createCustomGridTemplate(newRows, newCols, isSquare);
    onChangeProject({
      ...project,
      designType: isSquare ? 'square' : 'rectangular',
      rows: newRows,
      cols: newCols,
      tiles: fresh.tiles,
      snakesAndLadders: [],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Concept */}
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Grid className="w-4 h-4 text-zinc-700" />
          <span>Step 1: Board Architecture & Geometry</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Choose a symmetrical square board, custom rectangular dimensions, or load a built-in template.
        </p>
      </div>

      {/* Primary Design Selection */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-zinc-700">
          Board Geometry
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Square Board Option */}
          <div
            onClick={() => handleResizeGrid(8, 8, true)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              designType === 'square'
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                designType === 'square' ? 'bg-zinc-800' : 'bg-zinc-100'
              }`}>
                🔲
              </div>
              <div>
                <h4 className="text-xs font-bold">Square Board</h4>
                <p className={`text-[11px] ${designType === 'square' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Symmetrical N×N grid (Chess, Checkers, Strategy)
                </p>
              </div>
            </div>
          </div>

          {/* Custom Rectangular Option */}
          <div
            onClick={() => handleResizeGrid(6, 8, false)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              designType === 'rectangular'
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                designType === 'rectangular' ? 'bg-zinc-800' : 'bg-zinc-100'
              }`}>
                📐
              </div>
              <div>
                <h4 className="text-xs font-bold">Custom Rectangular</h4>
                <p className={`text-[11px] ${designType === 'rectangular' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Custom Rows × Columns for journey & quest maps
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Dimension Adjuster */}
      {designType === 'square' && (
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
          <div className="flex justify-between items-center text-xs font-medium text-zinc-700">
            <span>Square Grid Size</span>
            <span className="font-bold text-zinc-900">{rows} × {cols} ({rows * cols} tiles)</span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            value={rows}
            onChange={(e) => {
              const val = Number(e.target.value);
              handleResizeGrid(val, val, true);
            }}
            className="w-full accent-zinc-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
            <span>4×4 (Mini)</span>
            <span>8×8 (Chess)</span>
            <span>10×10 (100 Tiles)</span>
            <span>12×12 (Grand)</span>
          </div>
        </div>
      )}

      {designType === 'rectangular' && (
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-700">
            Configure Grid Dimensions
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-600 mb-1">
                <span>Rows</span>
                <span className="font-bold text-zinc-900">{rows}</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                value={rows}
                onChange={(e) => handleResizeGrid(Number(e.target.value), cols, false)}
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-600 mb-1">
                <span>Cols</span>
                <span className="font-bold text-zinc-900">{cols}</span>
              </div>
              <input
                type="range"
                min="3"
                max="14"
                value={cols}
                onChange={(e) => handleResizeGrid(rows, Number(e.target.value), false)}
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Built-in Classic Templates Injector */}
      <div className="space-y-2.5 pt-1">
        <label className="block text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-zinc-600" />
          <span>Or Load Built-in Template</span>
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleApplyTemplate('chess')}
            className={`p-3 rounded-lg border text-left transition-all ${
              project.templateId === 'chess'
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <span className="text-lg block mb-1">♟️</span>
            <span className="text-xs font-bold block">Chess Template</span>
            <span className={`text-[10px] ${project.templateId === 'chess' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              8×8 Checkered Grid
            </span>
          </button>

          <button
            onClick={() => handleApplyTemplate('snakes_ladders')}
            className={`p-3 rounded-lg border text-left transition-all ${
              project.templateId === 'snakes_ladders'
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <span className="text-lg block mb-1">🪜</span>
            <span className="text-xs font-bold block">Snake and Ladder</span>
            <span className={`text-[10px] ${project.templateId === 'snakes_ladders' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              100 Serpentine Path
            </span>
          </button>

          <button
            onClick={() => handleApplyTemplate('ludo')}
            className={`p-3 rounded-lg border text-left transition-all ${
              project.templateId === 'ludo'
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <span className="text-lg block mb-1">⭐</span>
            <span className="text-xs font-bold block">Ludo Template</span>
            <span className={`text-[10px] ${project.templateId === 'ludo' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Cross & Quadrants
            </span>
          </button>

          <button
            onClick={() => handleApplyTemplate('monopoly')}
            className={`p-3 rounded-lg border text-left transition-all ${
              project.templateId === 'monopoly'
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <span className="text-lg block mb-1">🏰</span>
            <span className="text-xs font-bold block">Monopoly Template</span>
            <span className={`text-[10px] ${project.templateId === 'monopoly' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Perimeter District Loop
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};


