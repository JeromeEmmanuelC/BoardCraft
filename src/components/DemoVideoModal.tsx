import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ArrowRight } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreating: () => void;
}

interface DemoStep {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  visualType: 'layout' | 'color' | 'pieces' | 'dice' | 'rules' | 'cards' | 'playtest';
}

const DEMO_STEPS: DemoStep[] = [
  {
    title: '1. Choose Board Geometry',
    subtitle: 'Square Grid or Custom Rectangular Path',
    icon: '📐',
    description: 'Select from Square Grids (Chess, Monopoly), Winding Paths, or custom rectangular dimensions with real-time scaling.',
    visualType: 'layout',
  },
  {
    title: '2. Board Colors & Tile Painter',
    subtitle: 'Palettes & Tile Properties',
    icon: '🎨',
    description: 'Apply curated color palettes or assign custom colors, trigger icons, and action properties to any tile.',
    visualType: 'color',
  },
  {
    title: '3. Piece & Token Customization',
    subtitle: 'Configure Player Tokens',
    icon: '♟️',
    description: 'Equip player tokens from classical chess figures, meeples, knights, or custom icons, and position them on starting squares.',
    visualType: 'pieces',
  },
  {
    title: '4. Dice & Movement Setup',
    subtitle: 'D6, 2xD6, D20 & Spinners',
    icon: '🎲',
    description: 'Configure standard or polyhedral dice with re-roll rules, doubles bonuses, and test rolls in the interactive roller.',
    visualType: 'dice',
  },
  {
    title: '5. Rules & Turn System',
    subtitle: 'Turn Phases & Win Conditions',
    icon: '📜',
    description: 'Set player counts, game duration, and write structured rules for victory conditions and special tile actions.',
    visualType: 'rules',
  },
  {
    title: '6. Artifact & Card Deck Builder',
    subtitle: 'Item & Event Cards',
    icon: '🃏',
    description: 'Create custom action cards, item artifacts, event decks, and property deeds with custom rarity and effects.',
    visualType: 'cards',
  },
  {
    title: '7. Live Playtest & Export',
    subtitle: 'Interactive Simulator & Print Sheets',
    icon: '🏆',
    description: 'Switch instantly into Playtest Mode to roll dice, advance pieces, and export print-ready PDF/JSON game files.',
    visualType: 'playtest',
  }
];

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({
  isOpen,
  onClose,
  onStartCreating,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setActiveStepIndex(0);
      setProgress(0);
      return;
    }

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveStepIndex((curr) => (curr + 1) % DEMO_STEPS.length);
            return 0;
          }
          return prev + 3;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeStepIndex]);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[activeStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      
      {/* Video Player Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              BoardCraft Feature Walkthrough
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Explore the 7-step board game creation workflow.
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Canvas Area */}
        <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center p-6 overflow-hidden">
          
          {/* Mockup based on step */}
          <div className="relative z-10 w-full max-w-lg bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-lg text-white">
            
            {currentStep.visualType === 'layout' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200">Step 1: Board Architecture</span>
                  <span className="text-zinc-400">8 × 8 Grid</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 h-36 bg-zinc-950 p-2 rounded border border-zinc-800">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded flex items-center justify-center text-xs font-medium ${
                        (Math.floor(i / 6) + (i % 6)) % 2 === 0
                          ? 'bg-zinc-200 text-zinc-900'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {i === 0 ? '🚩' : i === 23 ? '👑' : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.visualType === 'color' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200">Step 2: Palette & Tile Styling</span>
                  <span className="text-zinc-400">Slate Minimal Preset</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="grid grid-cols-4 gap-1.5 w-36 h-36 bg-zinc-950 p-2 rounded border border-zinc-800">
                    <div className="bg-zinc-100 rounded flex items-center justify-center text-xs text-zinc-900">🚩</div>
                    <div className="bg-zinc-700 rounded flex items-center justify-center text-xs text-white">⭐</div>
                    <div className="bg-zinc-100 rounded flex items-center justify-center text-xs text-zinc-900">📜</div>
                    <div className="bg-rose-600 rounded flex items-center justify-center text-xs text-white">💀</div>
                    <div className="bg-zinc-700 rounded flex items-center justify-center text-xs text-white">💎</div>
                    <div className="bg-zinc-100 rounded flex items-center justify-center text-xs text-zinc-900">🔥</div>
                    <div className="bg-zinc-700 rounded flex items-center justify-center text-xs text-white">🛡️</div>
                    <div className="bg-amber-600 rounded flex items-center justify-center text-xs text-white">👑</div>
                    <div className="bg-zinc-100 rounded flex items-center justify-center text-xs text-zinc-900">📦</div>
                    <div className="bg-zinc-700 rounded flex items-center justify-center text-xs text-white">⚔️</div>
                    <div className="bg-zinc-100 rounded flex items-center justify-center text-xs text-zinc-900">🍺</div>
                    <div className="bg-zinc-700 rounded flex items-center justify-center text-xs text-white">🌀</div>
                  </div>
                  <div className="flex-1 space-y-2 text-xs text-zinc-300">
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      <span className="font-medium text-white block">Tile #8: Goal Spire</span>
                      <span className="text-zinc-400">Trigger: Advance +2</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-zinc-100" />
                      <span className="w-4 h-4 rounded-full bg-zinc-700" />
                      <span className="w-4 h-4 rounded-full bg-rose-600" />
                      <span className="w-4 h-4 rounded-full bg-emerald-600" />
                      <span className="w-4 h-4 rounded-full bg-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep.visualType === 'pieces' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200">Step 3: Player Tokens</span>
                  <span className="text-zinc-400">4 Active Players</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-red-500/50">
                    <span className="text-2xl">♟️</span>
                    <p className="font-semibold text-xs text-zinc-200 mt-1">Player 1</p>
                    <p className="text-[10px] text-red-400">Red</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-emerald-500/50">
                    <span className="text-2xl">♞</span>
                    <p className="font-semibold text-xs text-zinc-200 mt-1">Player 2</p>
                    <p className="text-[10px] text-emerald-400">Green</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-blue-500/50">
                    <span className="text-2xl">🧙</span>
                    <p className="font-semibold text-xs text-zinc-200 mt-1">Player 3</p>
                    <p className="text-[10px] text-blue-400">Blue</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-500/50">
                    <span className="text-2xl">⛵</span>
                    <p className="font-semibold text-xs text-zinc-200 mt-1">Player 4</p>
                    <p className="text-[10px] text-amber-400">Yellow</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.visualType === 'dice' && (
              <div className="space-y-3 text-center">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2 text-left">
                  <span className="font-semibold text-zinc-200">Step 4: Dice & RNG Engine</span>
                  <span className="text-zinc-400">D6 Standard</span>
                </div>
                <div className="flex items-center justify-center gap-6 py-2">
                  <div className="w-14 h-14 rounded-xl bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center text-2xl font-bold shadow-md">
                    5
                  </div>
                  <div className="text-left text-xs text-zinc-300 space-y-1">
                    <p className="font-medium text-white">Rule: Extra roll on 6</p>
                    <p className="text-zinc-400">Doubles bonus: Enabled</p>
                    <p className="text-zinc-400">Values: 1, 2, 3, 4, 5, 6</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.visualType === 'rules' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200">Step 5: Rule Engine</span>
                  <span className="text-zinc-400">First to Reach Finish</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between text-zinc-400 text-[11px] font-medium">
                    <span>Players: 2 - 4</span>
                    <span>Duration: 25 Mins</span>
                    <span>Age: 8+</span>
                  </div>
                  <p className="text-zinc-200 text-xs">
                    Navigate tokens across the board, resolve tile events, and reach the final tile to win.
                  </p>
                </div>
              </div>
            )}

            {currentStep.visualType === 'cards' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200">Step 6: Cards & Artifacts</span>
                  <span className="text-zinc-400">Event Deck</span>
                </div>
                <div className="flex justify-center gap-3">
                  <div className="w-32 bg-zinc-950 rounded-lg p-2.5 text-zinc-200 border border-zinc-700 text-center space-y-1">
                    <span className="text-[10px] text-amber-400 font-semibold block uppercase">Action Card</span>
                    <span className="text-xl">👑</span>
                    <h5 className="text-xs font-semibold text-white">Crown Favor</h5>
                    <p className="text-[10px] text-zinc-400 leading-tight">Advance 4 tiles.</p>
                  </div>
                  <div className="w-32 bg-zinc-950 rounded-lg p-2.5 text-zinc-200 border border-zinc-700 text-center space-y-1">
                    <span className="text-[10px] text-blue-400 font-semibold block uppercase">Item Relic</span>
                    <span className="text-xl">🗝️</span>
                    <h5 className="text-xs font-semibold text-white">Master Key</h5>
                    <p className="text-[10px] text-zinc-400 leading-tight">Bypass obstacles.</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.visualType === 'playtest' && (
              <div className="space-y-3 text-center">
                <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2 text-left">
                  <span className="font-semibold text-zinc-200">Step 7: Playtest & Export</span>
                  <span className="text-zinc-400">Live Simulator</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1.5">
                  <span className="text-2xl">🎲 🏆</span>
                  <h4 className="font-semibold text-xs text-white">Ready to Play</h4>
                  <p className="text-xs text-zinc-400">
                    Roll dice, move pieces interactively, and export print-ready assets.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Subtitle Bar */}
          <div className="absolute bottom-3 left-4 right-4 z-20 bg-zinc-900/90 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm">{currentStep.icon}</span>
              <div>
                <span className="font-semibold text-zinc-200 block">{currentStep.title}</span>
                <span className="text-zinc-400 text-[11px]">{currentStep.description}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Player Controls & Step Timeline */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-3">
          
          {/* Progress bar */}
          <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
            <div
              className="bg-zinc-900 h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Bottom Bar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Step Selection Chips */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
              {DEMO_STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setProgress(0);
                  }}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-all ${
                    idx === activeStepIndex
                      ? 'bg-zinc-900 text-white font-medium shadow-xs'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                  }`}
                >
                  {idx + 1}. {step.title.split('.')[1]}
                </button>
              ))}
            </div>

            {/* Play/Pause & Launch Studio */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-zinc-700" />}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onStartCreating();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


