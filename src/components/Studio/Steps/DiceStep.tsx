import React, { useState } from 'react';
import { GameProject, DiceConfig, DiceType } from '../../../types';
import { Dices, Check, Play, Shuffle } from 'lucide-react';

interface DiceStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
}

const DICE_TYPES: { id: DiceType; label: string; sides: number; desc: string; icon: string }[] = [
  { id: 'd6', label: 'Standard D6', sides: 6, desc: 'Classic 6-sided die (1-6)', icon: '🎲' },
  { id: '2d6', label: 'Two D6 (2d6)', sides: 6, desc: 'Two 6-sided dice combined (2-12)', icon: '🎲🎲' },
  { id: 'd4', label: 'D4', sides: 4, desc: '4-sided die (1-4)', icon: '🔺' },
  { id: 'd8', label: 'D8', sides: 8, desc: '8-sided die (1-8)', icon: '💎' },
  { id: 'd10', label: 'D10', sides: 10, desc: '10-sided die (1-10)', icon: '🔟' },
  { id: 'd12', label: 'D12', sides: 12, desc: '12-sided die (1-12)', icon: '⬟' },
  { id: 'd20', label: 'D20', sides: 20, desc: '20-sided die (1-20)', icon: '⭐' },
  { id: 'coin', label: 'Coin Flip', sides: 2, desc: 'Heads (+2) / Tails (+1)', icon: '🪙' },
  { id: 'spinner', label: 'Wheel Spinner', sides: 8, desc: 'Spinner with 8 sectors (1-8)', icon: '🎯' },
];

export const DiceStep: React.FC<DiceStepProps> = ({
  project,
  onChangeProject,
}) => {
  const { diceConfig } = project;
  
  // Interactive Live Roller State
  const [isRolling, setIsRolling] = useState(false);
  const [testResult, setTestResult] = useState<{ total: number; roll1: number; roll2?: number; text?: string } | null>(null);

  const handleUpdateConfig = (updates: Partial<DiceConfig>) => {
    onChangeProject({
      ...project,
      diceConfig: {
        ...diceConfig,
        ...updates,
      },
    });
  };

  const handleSelectDiceType = (type: DiceType) => {
    const selected = DICE_TYPES.find((d) => d.id === type) || DICE_TYPES[0];
    handleUpdateConfig({
      type,
      sidesCount: selected.sides,
      label: selected.label,
    });
  };

  const handleTestRoll = () => {
    setIsRolling(true);
    let count = 0;
    
    const interval = setInterval(() => {
      count++;
      if (diceConfig.type === '2d6') {
        const r1 = Math.floor(Math.random() * 6) + 1;
        const r2 = Math.floor(Math.random() * 6) + 1;
        setTestResult({ total: r1 + r2 + diceConfig.modifier, roll1: r1, roll2: r2 });
      } else if (diceConfig.type === 'coin') {
        const isHeads = Math.random() > 0.5;
        setTestResult({ total: isHeads ? 2 : 1, roll1: isHeads ? 2 : 1, text: isHeads ? 'HEADS (+2)' : 'TAILS (+1)' });
      } else {
        const r = Math.floor(Math.random() * diceConfig.sidesCount) + 1;
        setTestResult({ total: r + diceConfig.modifier, roll1: r });
      }

      if (count > 8) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Dices className="w-4 h-4 text-zinc-700" />
          <span>Step 4: Dice & Movement Method</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Choose whether players move via standard dice, double dice, coins, or custom spinners.
        </p>
      </div>

      {/* Dice Selection Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-zinc-700">
          Movement Method
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DICE_TYPES.map((dt) => {
            const isSelected = diceConfig.type === dt.id;
            return (
              <div
                key={dt.id}
                onClick={() => handleSelectDiceType(dt.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl">{dt.icon}</span>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-white text-zinc-900">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold">
                    {dt.label}
                  </h4>
                  <p className={`text-[11px] mt-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {dt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules & Modifiers */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h4 className="text-xs font-bold text-zinc-900">
          Movement Rules & Modifiers
        </h4>

        <div className="space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={diceConfig.allowReRollOnMax}
              onChange={(e) => handleUpdateConfig({ allowReRollOnMax: e.target.checked })}
              className="w-4 h-4 accent-zinc-900 rounded"
            />
            <span className="text-xs text-zinc-700 font-medium">
              Bonus Roll on Max Value (Rolling the highest number gives an extra roll)
            </span>
          </label>

          {diceConfig.type === '2d6' && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={diceConfig.doublesRule || false}
                onChange={(e) => handleUpdateConfig({ doublesRule: e.target.checked })}
                className="w-4 h-4 accent-zinc-900 rounded"
              />
              <span className="text-xs text-zinc-700 font-medium">
                Doubles Rule (Rolling identical numbers grants an extra turn)
              </span>
            </label>
          )}

          <div>
            <div className="flex justify-between text-xs text-zinc-700 font-medium mb-1">
              <span>Flat Movement Modifier:</span>
              <span className="font-bold">{diceConfig.modifier >= 0 ? `+${diceConfig.modifier}` : diceConfig.modifier}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="5"
              value={diceConfig.modifier}
              onChange={(e) => handleUpdateConfig({ modifier: Number(e.target.value) })}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Interactive Live Dice Roll Test Pad */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="text-xs font-bold text-zinc-900 block">
            Test Dice Roll
          </span>
          <p className="text-xs text-zinc-500">
            Preview the random generator output for your current dice setup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xl transition-all ${
              isRolling ? 'animate-bounce' : ''
            }`}
          >
            {testResult ? testResult.total : diceConfig.sidesCount}
          </div>

          <button
            onClick={handleTestRoll}
            disabled={isRolling}
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Roll Test</span>
          </button>
        </div>
      </div>

    </div>
  );
};


