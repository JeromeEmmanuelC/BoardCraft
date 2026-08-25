import React from 'react';
import { 
  Play, 
  Plus,
  ArrowRight,
  LayoutGrid, 
  Palette, 
  Dices, 
  ScrollText, 
  Layers, 
  Download,
  Users
} from 'lucide-react';
import { GameProject } from '../types';

interface LandingPageProps {
  onOpenDemo: () => void;
  onLoginClick: () => void;
  onExploreTemplates: (templateId: string) => void;
  onStartCreating: () => void;
  sampleProjects: GameProject[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDemo,
  onLoginClick,
  onExploreTemplates,
  onStartCreating,
  sampleProjects,
}) => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-700">
            <span>Tabletop Board Game Creator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 max-w-3xl mx-auto leading-[1.15]">
            Design, playtest, and export custom board games.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Create grid layouts, serpentine tracks, and circuits. Customize piece tokens, calibrate dice RNG, formulate rules, and design printable card decks in a simple, minimal studio.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              id="landing-start-btn"
              onClick={onStartCreating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Board</span>
            </button>

            <button
              id="landing-demo-btn"
              onClick={onOpenDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 font-semibold text-sm border border-zinc-200 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 text-zinc-500 fill-zinc-500" />
              <span>Watch 1-Min Demo</span>
            </button>
          </div>
        </div>

        {/* Minimal Interactive Board Preview Card */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-xl border border-zinc-200 shadow-sm p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs font-semibold text-zinc-800">Preview: 8×8 Strategy Grid</span>
            </div>
            <span className="text-xs text-zinc-500">Click any template below to customize</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-64 aspect-square bg-zinc-100 rounded-lg p-2 border border-zinc-200 shadow-inner flex items-center justify-center">
              <div className="grid grid-cols-8 gap-0.5 w-full h-full bg-zinc-300 p-0.5 rounded">
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  const isLight = (r + c) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center text-[10px] font-bold ${
                        isLight ? 'bg-white text-zinc-800' : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {i === 4 ? '♚' : i === 3 ? '♛' : i === 60 ? '♔' : i === 59 ? '♕' : i === 1 || i === 62 ? '♞' : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">What you can build in BoardCraft:</h3>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span><strong>Square & Rectangular Grids:</strong> Chess, Checkers, Strategy maps ($N \times M$).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span><strong>Winding & Serpentine Paths:</strong> Snakes & Ladders, Adventure journeys.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span><strong>Perimeter Circuit Tracks:</strong> Property trading, Monopoly circuits, Racing tracks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span><strong>Cross & Courtyards:</strong> Ludo, Pachisi, 4-Quadrant quadrant bases.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* Classic Templates Section */}
      <section className="py-12 bg-white border-y border-zinc-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Starter Templates
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Select a baseline template or customize it directly in the studio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Chess Template */}
            <div 
              onClick={() => onExploreTemplates('chess')}
              className="bg-zinc-50 hover:bg-white rounded-xl p-4 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-white rounded-lg border border-zinc-200 mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-0.5 w-20 h-20 bg-zinc-200 p-0.5 rounded">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-center text-xs font-bold ${
                          (Math.floor(i/4) + (i%4)) % 2 === 0 ? 'bg-white text-zinc-900' : 'bg-zinc-300 text-zinc-800'
                        }`}
                      >
                        {i === 1 ? '♛' : i === 2 ? '♚' : i === 13 ? '♙' : ''}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                    Grandmaster Chess
                  </h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">8×8</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  Classic 64-tile checkered board with full piece set and customizable rules.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span>2 Players</span>
                <span className="font-medium text-zinc-900 group-hover:text-blue-600 flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Snakes & Ladders */}
            <div 
              onClick={() => onExploreTemplates('snakes_ladders')}
              className="bg-zinc-50 hover:bg-white rounded-xl p-4 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-white rounded-lg border border-zinc-200 mb-3 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-1">🪜🐍</span>
                  <span className="text-xs font-semibold text-zinc-800">100 Tiles Path</span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                    Snakes & Ladders
                  </h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">10×10</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  100 serpentine tiles with animated climbs, peril slides, and D6 dice movement.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span>2-4 Players</span>
                <span className="font-medium text-zinc-900 group-hover:text-blue-600 flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Ludo */}
            <div 
              onClick={() => onExploreTemplates('ludo')}
              className="bg-zinc-50 hover:bg-white rounded-xl p-4 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-white rounded-lg border border-zinc-200 mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1 w-16 h-16">
                    <div className="bg-red-500 rounded flex items-center justify-center text-[10px] text-white font-bold">R</div>
                    <div className="bg-emerald-500 rounded flex items-center justify-center text-[10px] text-white font-bold">G</div>
                    <div className="bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold">B</div>
                    <div className="bg-amber-400 rounded flex items-center justify-center text-[10px] text-zinc-900 font-bold">Y</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                    Pachisi / Ludo
                  </h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">15×15</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  Four home quadrants with safety stars, central target column, and capturing rules.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span>2-4 Players</span>
                <span className="font-medium text-zinc-900 group-hover:text-blue-600 flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Monopoly Circuit */}
            <div 
              onClick={() => onExploreTemplates('monopoly')}
              className="bg-zinc-50 hover:bg-white rounded-xl p-4 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-white rounded-lg border border-zinc-200 mb-3 flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-zinc-800 rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-zinc-800">TRACK</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                    Circuit Track
                  </h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">40 Tiles</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  Perimeter circuit with property districts, event tiles, and gold economy cards.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span>2-6 Players</span>
                <span className="font-medium text-zinc-900 group-hover:text-blue-600 flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Simple 4-Feature Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-zinc-900">
            Simple, focused tools
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Everything you need to craft, test, and share tabletop board games.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900">1. Grid Geometry</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Square grids, custom rectangular dimensions, serpentine paths, or circuit tracks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900">2. Tiles & Pieces</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Custom tile colors, icons, hazard effects, and customizable piece tokens for 1-6 players.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Dices className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900">3. Dice & Rules</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              D6, 2xD6, D20 polyhedral dice, win conditions, and editable chapter rulebook codex.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900">4. Playtest & Export</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Simulate turn-by-turn gameplay live in the browser, export JSON, or print sheets.
            </p>
          </div>

        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-6 bg-white border-t border-zinc-200 text-center text-xs text-zinc-500">
        <p>BoardCraft • Minimal Board Game Creator & Simulator</p>
      </footer>

    </div>
  );
};


