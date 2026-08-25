import React from 'react';
import { GameProject, RuleEngineConfig, RuleSection, WinConditionType } from '../../../types';
import { BookOpen, Plus, Trash2, Trophy, Feather } from 'lucide-react';

interface RulesStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
}

const WIN_CONDITIONS: { id: WinConditionType; label: string; desc: string }[] = [
  { id: 'first_to_finish', label: 'First to Finish / Goal', desc: 'First player to reach the final tile (e.g. Tile 100) wins.' },
  { id: 'elimination', label: 'Piece Elimination / Checkmate', desc: 'Capture or defeat all opponent pieces or the King.' },
  { id: 'wealth_target', label: 'Wealth / Gold Accumulation', desc: 'First player to amass the target amount of gold wins.' },
  { id: 'bankruptcy', label: 'Rival Bankruptcy', desc: 'Eliminate rivals by draining their points or money via tile penalties.' },
  { id: 'territory_control', label: 'Territory / District Control', desc: 'Claim and hold the majority of board zones.' },
  { id: 'custom', label: 'Custom Condition', desc: 'Write custom game victory mechanics.' },
];

export const RulesStep: React.FC<RulesStepProps> = ({
  project,
  onChangeProject,
}) => {
  const { ruleEngine } = project;

  const handleUpdateRuleEngine = (updates: Partial<RuleEngineConfig>) => {
    onChangeProject({
      ...project,
      ruleEngine: {
        ...ruleEngine,
        ...updates,
      },
    });
  };

  const handleAddSection = () => {
    const newSection: RuleSection = {
      id: `sec_${Date.now()}`,
      title: `Rule ${ruleEngine.sections.length + 1}: Custom Mechanic`,
      content: 'Describe the specific rules, constraints, or turn sequence for this part of the game.',
    };
    handleUpdateRuleEngine({
      sections: [...ruleEngine.sections, newSection],
    });
  };

  const handleUpdateSection = (id: string, updates: Partial<RuleSection>) => {
    const updated = ruleEngine.sections.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    handleUpdateRuleEngine({ sections: updated });
  };

  const handleDeleteSection = (id: string) => {
    const updated = ruleEngine.sections.filter((s) => s.id !== id);
    handleUpdateRuleEngine({ sections: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-zinc-700" />
          <span>Step 5: Rule Engine & Setup</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Define victory conditions, player counts, estimated playtime, and custom written rules.
        </p>
      </div>

      {/* Game Overview Card */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h4 className="text-xs font-bold text-zinc-900">
          Game Details & Specifications
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Game Title
            </label>
            <input
              type="text"
              value={ruleEngine.title}
              onChange={(e) => handleUpdateRuleEngine({ title: e.target.value })}
              placeholder="e.g. Grand Checkers, Space Journey"
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Short Description / Tagline
            </label>
            <input
              type="text"
              value={ruleEngine.tagline}
              onChange={(e) => handleUpdateRuleEngine({ tagline: e.target.value })}
              placeholder="e.g. A fast-paced strategic race to the finish"
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Players, Duration, Difficulty */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Min Players
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={ruleEngine.minPlayers}
              onChange={(e) => handleUpdateRuleEngine({ minPlayers: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Max Players
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={ruleEngine.maxPlayers}
              onChange={(e) => handleUpdateRuleEngine({ maxPlayers: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Minutes
            </label>
            <input
              type="number"
              min="5"
              max="180"
              step="5"
              value={ruleEngine.estimatedMinutes}
              onChange={(e) => handleUpdateRuleEngine({ estimatedMinutes: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Difficulty
            </label>
            <select
              value={ruleEngine.difficulty}
              onChange={(e) => handleUpdateRuleEngine({ difficulty: e.target.value as RuleEngineConfig['difficulty'] })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            >
              <option value="Easy / Family">Easy / Family</option>
              <option value="Tactical">Tactical</option>
              <option value="Grand Strategy">Grand Strategy</option>
              <option value="Party">Party</option>
            </select>
          </div>
        </div>

      </div>

      {/* Win Condition Engine */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h4 className="text-xs font-bold text-zinc-900">
          Win Conditions
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {WIN_CONDITIONS.map((wc) => {
            const isSelected = ruleEngine.winCondition === wc.id;
            return (
              <div
                key={wc.id}
                onClick={() => handleUpdateRuleEngine({ winCondition: wc.id })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                }`}
              >
                <h5 className="text-xs font-bold">{wc.label}</h5>
                <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>{wc.desc}</p>
              </div>
            );
          })}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Victory Condition Notes
          </label>
          <textarea
            rows={2}
            value={ruleEngine.winConditionDetails}
            onChange={(e) => handleUpdateRuleEngine({ winConditionDetails: e.target.value })}
            placeholder="e.g. Reach tile 100 first or have the highest gold count after 30 rounds"
            className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* Structured Rulebook Chapters */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-700">
            Rules & Instructions ({ruleEngine.sections.length})
          </span>
          <button
            onClick={handleAddSection}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>

        <div className="space-y-3">
          {ruleEngine.sections.map((section) => (
            <div
              key={section.id}
              className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                  className="px-2.5 py-1 rounded-md bg-white border border-zinc-300 text-xs font-bold text-zinc-900 w-2/3 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
                {ruleEngine.sections.length > 1 && (
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={section.content}
                onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-800 leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


