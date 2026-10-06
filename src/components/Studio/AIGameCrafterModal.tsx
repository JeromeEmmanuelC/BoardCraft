import React, { useState } from 'react';
import { GameProject } from '../../types';
import { api } from '../../lib/api';
import { Sparkles, X, Wand2, Compass, Scroll, Dices, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIGameCrafterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated: (project: GameProject) => void;
}

const INSPIRATION_PROMPTS = [
  'Victorian London gaslight mystery race through cobblestone alleys and fog-shrouded docks',
  '1888 Transatlantic steamship voyage racing past iceberg hazards and coal shortages',
  'Silk Road merchant caravan trading spices and navigating desert mirages',
  'Jules Verne subterranean descent into crystalline caverns with magnetic anomalies',
  'Renaissance Venetian gondola race with secret carnival masquerade boons',
];

export const AIGameCrafterModal: React.FC<AIGameCrafterModalProps> = ({
  isOpen,
  onClose,
  onGameCreated,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (targetPrompt?: string) => {
    const activePrompt = (targetPrompt || prompt).trim();
    if (!activePrompt || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setStatusMessage('Consulting the vintage ludology archives...');

    const stepTimer1 = setTimeout(() => {
      setStatusMessage('Drafting board topology, route geometry, and tile actions...');
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setStatusMessage('Engineering the rule engine codex, victory axioms, and dice dynamics...');
    }, 3200);

    const stepTimer3 = setTimeout(() => {
      setStatusMessage('Illuminating vintage artifact cards and character pawns...');
    }, 4800);

    try {
      const generated = await api.generateGameAI(activePrompt);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      onGameCreated(generated);
      onClose();
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      setError(err.message || 'Failed to craft board game via AI. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
      <div 
        id="ai_game_crafter_modal"
        className="w-full max-w-xl bg-[#faf8f5] border border-stone-300 rounded-xl shadow-2xl overflow-hidden text-stone-900 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#f4eee3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                AI Ludology & Rule Crafter
              </h3>
              <p className="text-xs text-stone-600">
                Generate tailored board layouts, rulebooks, piece tokens, and artifacts
              </p>
            </div>
          </div>
          <button
            id="btn_close_ai_crafter"
            onClick={onClose}
            disabled={isGenerating}
            className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-300/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-serif text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Describe the Game Premise, Theme, or Lore
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={3}
              placeholder="e.g. A 19th-century race between two merchant airships across treacherous mountain peaks and electric storms..."
              className="w-full p-3 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-600 font-sans"
            />
          </div>

          {/* Preset Prompts */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-stone-600 mb-2">
              <Scroll className="w-3.5 h-3.5 text-amber-700" />
              <span>Vintage Inspiration Archives</span>
            </div>
            <div className="space-y-1.5">
              {INSPIRATION_PROMPTS.map((insp, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => {
                    setPrompt(insp);
                  }}
                  className="w-full text-left p-2 rounded border border-stone-200 bg-white hover:bg-stone-100 text-xs text-stone-700 transition-colors flex items-center justify-between group"
                >
                  <span className="line-clamp-1 italic">"{insp}"</span>
                  <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-stone-800 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Crafting State */}
          {isGenerating && (
            <div className="p-4 rounded-lg bg-stone-100 border border-stone-200 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin shrink-0" />
              <div className="text-xs text-stone-700 font-serif italic">
                {statusMessage}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-[#f7f4ed] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
          >
            Cancel
          </button>
          <button
            id="btn_submit_ai_craft"
            type="button"
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-amber-200 text-xs font-bold shadow-xs transition-colors"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? 'Forging Game...' : 'Forge Board & Rule Engine'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
