import React, { useState } from 'react';
import { GameProject } from '../../types';
import { X, Printer, Download, Copy, Check, FileText, Layout, Layers } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GameProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportTab, setExportTab] = useState<'rulebook' | 'cards' | 'json'>('rulebook');

  if (!isOpen) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a1008] text-[#f4ebd0] rounded-2xl vintage-border shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2a1a0f] px-6 py-4 border-b border-[#5c3e21] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#ffd700]" />
            <h2 className="font-cinzel text-lg font-bold text-[#f5edd6]">
              Publish, Print & Export: {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#c29b38] hover:bg-[#d8ae43] text-[#1a1008] font-cinzel font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#bfa07e] hover:text-white hover:bg-[#3d2410]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#5c3e21] bg-[#170e08] px-6 pt-2">
          {[
            { id: 'rulebook', label: '📖 Printable Rulebook Codex', icon: FileText },
            { id: 'cards', label: '🃏 Print-&-Play Card Sheets', icon: Layers },
            { id: 'json', label: '💾 Raw JSON Blueprint', icon: Download },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setExportTab(t.id as any)}
              className={`px-4 py-2.5 text-xs font-cinzel font-bold border-b-2 transition-all ${
                exportTab === t.id
                  ? 'border-[#ffd700] text-[#ffd700] bg-[#24170e]'
                  : 'border-transparent text-[#8c6b4a] hover:text-[#f5edd6]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#170e08]">
          
          {/* Printable Rulebook Codex */}
          {exportTab === 'rulebook' && (
            <div className="bg-parchment text-[#2a1a0f] p-8 rounded-xl shadow-2xl border-4 border-[#8c5a24] space-y-6 max-w-2xl mx-auto print:m-0 print:border-none">
              <div className="text-center border-b-2 border-[#8c5a24] pb-4 space-y-1">
                <span className="text-xs font-cinzel font-bold text-[#8c5a24] uppercase tracking-widest block">
                  ✦ Official Codex & Rules of Engagement ✦
                </span>
                <h1 className="font-cinzel-dec text-3xl font-black text-[#3d2410]">
                  {project.name}
                </h1>
                <p className="font-crimson text-sm italic text-[#78512b]">
                  {project.ruleEngine.tagline || 'A Masterpiece of BoardCraft'}
                </p>
                <div className="flex justify-center gap-4 text-xs font-cinzel text-[#8c5a24] pt-2">
                  <span>Players: {project.ruleEngine.minPlayers}-{project.ruleEngine.maxPlayers}</span>
                  <span>•</span>
                  <span>Duration: ~{project.ruleEngine.estimatedMinutes} mins</span>
                  <span>•</span>
                  <span>Difficulty: {project.ruleEngine.difficulty}</span>
                </div>
              </div>

              {/* Victory Condition */}
              <div className="bg-[#ede2c8] p-4 rounded-lg border border-[#b89355] space-y-1">
                <h3 className="font-cinzel text-sm font-black text-[#8c2d19] uppercase tracking-wider">
                  🏆 Victory Condition
                </h3>
                <p className="font-crimson text-sm text-[#1c1208] leading-relaxed">
                  {project.ruleEngine.winConditionDetails || 'The first player to fulfill all objectives triumphs.'}
                </p>
              </div>

              {/* Chapters */}
              <div className="space-y-4">
                {project.ruleEngine.sections.map((sec, i) => (
                  <div key={sec.id} className="space-y-1">
                    <h4 className="font-cinzel text-sm font-bold text-[#3d2410] border-b border-[#b89355]/40 pb-0.5">
                      {sec.title}
                    </h4>
                    <p className="font-crimson text-sm text-[#2a1a0f] leading-relaxed whitespace-pre-wrap">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Movement Engine note */}
              <div className="border-t border-[#8c5a24]/40 pt-3 text-xs font-crimson text-[#78512b] text-center">
                Movement: {project.diceConfig.label} ({project.diceConfig.sidesCount} sides). Designed with BoardCraft Artisan Studio.
              </div>
            </div>
          )}

          {/* Cards Print Sheet */}
          {exportTab === 'cards' && (
            <div className="space-y-4">
              <div className="text-center text-xs font-cinzel text-[#ffd700]">
                ✦ Cut along dashed lines for high-quality tabletop cards ✦
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.cards.map((c) => (
                  <div
                    key={c.id}
                    className="bg-parchment text-[#2a1a0f] p-4 rounded-lg border-2 border-dashed border-[#8c5a24] shadow-md flex flex-col justify-between space-y-2 aspect-[2/3]"
                  >
                    <div className="text-center border-b border-[#8c5a24]/30 pb-1">
                      <span className="text-[8px] font-cinzel font-bold text-[#8c5a24] uppercase block">
                        {c.deckName}
                      </span>
                      <h4 className="font-cinzel text-xs font-bold text-[#3d2410]">{c.title}</h4>
                      <span className="text-[8px] font-cinzel px-1.5 py-0.5 rounded bg-[#3d2410] text-[#ffd700]">
                        {c.rarity}
                      </span>
                    </div>

                    <div className="text-center my-auto">
                      <span className="text-2xl block mb-1">{c.icon}</span>
                      <p className="font-crimson text-xs font-semibold">{c.effectText}</p>
                    </div>

                    <div className="text-center border-t border-[#8c5a24]/30 pt-1 text-[9px] font-crimson italic text-[#78512b]">
                      "{c.flavorText || 'Artisan relic'}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON */}
          {exportTab === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-cinzel text-[#8c6b4a]">
                  Full JSON state structure of this board game project:
                </span>
                <button
                  onClick={handleCopyJSON}
                  className="px-3 py-1.5 rounded bg-[#3d2410] hover:bg-[#523116] border border-[#ffd700] text-[#ffd700] text-xs font-cinzel font-bold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#0f0a06] border border-[#5c3e21] text-xs text-[#86efac] font-mono overflow-auto max-h-[400px]">
                {JSON.stringify(project, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
