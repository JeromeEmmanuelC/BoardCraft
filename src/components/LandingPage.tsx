import React from 'react';
import { 
  Play, 
  Plus,
  ArrowRight,
  Sparkles,
  ScrollText, 
  Dices, 
  ShieldAlert, 
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
    <div className="min-h-screen bg-[#f7f3ec] text-[#2b221a] overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        <div className="space-y-6">
          {/* Engraved Vintage Seal Header Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#faedd9] border border-[#cfbe9e] text-xs font-serif font-bold text-[#5c4024] shadow-xs">
            <span>✦ ATELIER OF LUDOLOGICAL DESIGN & PARLOR ENTERTAINMENT ✦</span>
          </div>

          <h1 className="font-ornate text-4xl sm:text-5xl md:text-6xl font-black tracking-wide text-[#23170d] max-w-3xl mx-auto leading-[1.12]">
            Engrave, Playtest, & Print Bespoke Board Games.
          </h1>

          <p className="font-vintage text-xl sm:text-2xl italic text-[#594432] max-w-2xl mx-auto leading-relaxed">
            «Where classical Victorian craft meets modern ludology. Construct intricate grid geometries, calibrate consecrated dice RNG, draft rulebook codices, and duel live across telegraph links.»
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="landing-start-btn"
              onClick={onStartCreating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded vintage-btn-primary font-serif font-bold text-sm tracking-wide shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#ecd39e]" />
              <span>Engrave New Board</span>
            </button>

            <button
              id="landing-demo-btn"
              onClick={onOpenDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded vintage-btn-brass font-serif font-bold text-sm tracking-wide border border-[#bfa886] shadow-sm transition-all"
            >
              <Play className="w-4 h-4 text-[#6e502f] fill-[#6e502f]" />
              <span>View Exhibition Reel</span>
            </button>
          </div>
        </div>

        {/* Vintage Engraved Parchment Board Showcase */}
        <div className="mt-14 max-w-3xl mx-auto bg-[#fdfbf6] rounded border-2 border-[#b59b75] shadow-[0_4px_20px_rgba(40,25,12,0.08)] p-5 sm:p-7 text-left relative">
          
          {/* Corner Ornamental Rosettes */}
          <div className="absolute top-2 left-2 text-[#997c55] text-xs font-serif select-none">❖</div>
          <div className="absolute top-2 right-2 text-[#997c55] text-xs font-serif select-none">❖</div>
          <div className="absolute bottom-2 left-2 text-[#997c55] text-xs font-serif select-none">❖</div>
          <div className="absolute bottom-2 right-2 text-[#997c55] text-xs font-serif select-none">❖</div>

          <div className="flex items-center justify-between border-b border-[#ddcfbd] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8c6d37] inline-block shadow-xs"></span>
              <span className="font-serif font-bold text-xs uppercase tracking-widest text-[#3d2b1c]">
                Plate I — Royal 8×8 Strategy Grid (Chess Royale)
              </span>
            </div>
            <span className="font-typewriter text-[11px] text-[#7d674f]">Select archetype below to engrave</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Vintage Chess Board Preview */}
            <div className="w-full md:w-64 aspect-square bg-[#ede2cb] rounded p-2 border-2 border-[#a88d67] shadow-inner flex items-center justify-center">
              <div className="grid grid-cols-8 gap-0.5 w-full h-full bg-[#a38c6b] p-1 rounded shadow-inner">
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  const isLight = (r + c) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center text-xs font-bold font-serif ${
                        isLight ? 'bg-[#fcf7ee] text-[#2c1d12]' : 'bg-[#cbbb9f] text-[#20150d]'
                      }`}
                    >
                      {i === 4 ? '♚' : i === 3 ? '♛' : i === 60 ? '♔' : i === 59 ? '♕' : i === 1 || i === 62 ? '♞' : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 space-y-3 font-serif">
              <h3 className="text-base font-bold text-[#2b1e13] border-b border-[#e2d5c0] pb-1">
                Classical Game Topologies within the Studio:
              </h3>
              <ul className="text-xs sm:text-sm text-[#543f2d] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#8c6d37] font-bold">✦</span>
                  <span><strong>Cartesian Grids ($N \times M$):</strong> Grand Chess, Checkers, Strategy War Games, and Naval coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8c6d37] font-bold">✦</span>
                  <span><strong>Serpentine Pilgrim Tracks:</strong> 100-Tile Moral Pilgrimages, Victorian Snakes & Ladders with dynamic perils.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8c6d37] font-bold">✦</span>
                  <span><strong>Perimeter Imperial Circuits:</strong> Financial trading avenues, property titles, and circular railroad tracks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8c6d37] font-bold">✦</span>
                  <span><strong>Cross & Courtyard Sanctuaries:</strong> Pachisi, Royal Ludo, and four-player home sanctuaries.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* Classic Vintage Parchment Starter Plates */}
      <section className="py-14 bg-[#fdfbf6] border-y border-[#ddcfba] px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#e6dac9]">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#8c6d37] font-bold">ARCHIVAL MASTERPIECES</span>
              <h2 className="font-ornate text-2xl sm:text-3xl font-black text-[#261c14] tracking-wide mt-1">
                Historical Archetype Plates
              </h2>
              <p className="font-serif italic text-sm text-[#66503c] mt-0.5">
                Inspect a vintage baseline plate or engrave your personalized rules and tiles in the Studio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Chess Template */}
            <div 
              onClick={() => onExploreTemplates('chess')}
              className="bg-[#faf6ee] hover:bg-[#fffdf9] rounded p-4 border border-[#cfbe9e] hover:border-[#a88c67] vintage-card-hover cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-[#ede1cb] rounded border border-[#bda682] mb-3 flex items-center justify-center shadow-inner">
                  <div className="grid grid-cols-4 gap-0.5 w-20 h-20 bg-[#a68d69] p-1 rounded">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-center text-xs font-serif font-bold ${
                          (Math.floor(i/4) + (i%4)) % 2 === 0 ? 'bg-[#fcf8f0] text-[#20150d]' : 'bg-[#c5b59a] text-[#1c120a]'
                        }`}
                      >
                        {i === 1 ? '♛' : i === 2 ? '♚' : i === 13 ? '♙' : ''}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-[#24170d] group-hover:text-[#734f26] transition-colors">
                    Grandmaster Chess
                  </h3>
                  <span className="font-typewriter text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcc4] text-[#4f3821] border border-[#cbba9e]">8×8</span>
                </div>
                <p className="font-serif text-xs text-[#6e553e] line-clamp-2">
                  Classic 64-tile checkered board with full piece set, gambit cards, and checkmate victory rules.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e2d6c3] flex items-center justify-between font-serif text-xs text-[#523d29]">
                <span className="italic">2 Contenders</span>
                <span className="font-bold text-[#2a1d12] group-hover:text-[#805527] flex items-center gap-1">
                  Enter Atelier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Snakes & Ladders */}
            <div 
              onClick={() => onExploreTemplates('snakes_ladders')}
              className="bg-[#faf6ee] hover:bg-[#fffdf9] rounded p-4 border border-[#cfbe9e] hover:border-[#a88c67] vintage-card-hover cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-[#ede1cb] rounded border border-[#bda682] mb-3 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-3xl mb-1 select-none">🪜🐍</span>
                  <span className="font-typewriter text-[10px] font-bold text-[#5c442c]">100 Serpentine Tiles</span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-[#24170d] group-hover:text-[#734f26] transition-colors">
                    Moral Perils & Ascents
                  </h3>
                  <span className="font-typewriter text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcc4] text-[#4f3821] border border-[#cbba9e]">10×10</span>
                </div>
                <p className="font-serif text-xs text-[#6e553e] line-clamp-2">
                  Serpentine track with animated ladders of virtue, serpent slides of peril, and calibrated D6 dice.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e2d6c3] flex items-center justify-between font-serif text-xs text-[#523d29]">
                <span className="italic">2-4 Pilgrims</span>
                <span className="font-bold text-[#2a1d12] group-hover:text-[#805527] flex items-center gap-1">
                  Enter Atelier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Ludo */}
            <div 
              onClick={() => onExploreTemplates('ludo')}
              className="bg-[#faf6ee] hover:bg-[#fffdf9] rounded p-4 border border-[#cfbe9e] hover:border-[#a88c67] vintage-card-hover cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-[#ede1cb] rounded border border-[#bda682] mb-3 flex items-center justify-center shadow-inner">
                  <div className="grid grid-cols-2 gap-1.5 w-16 h-16">
                    <div className="bg-[#8b2626] rounded-xs flex items-center justify-center text-[10px] text-[#f7e6d0] font-bold font-serif shadow-xs">R</div>
                    <div className="bg-[#245233] rounded-xs flex items-center justify-center text-[10px] text-[#f7e6d0] font-bold font-serif shadow-xs">G</div>
                    <div className="bg-[#1f3f63] rounded-xs flex items-center justify-center text-[10px] text-[#f7e6d0] font-bold font-serif shadow-xs">B</div>
                    <div className="bg-[#a67c1e] rounded-xs flex items-center justify-center text-[10px] text-[#1c1208] font-bold font-serif shadow-xs">Y</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-[#24170d] group-hover:text-[#734f26] transition-colors">
                    Royal Pachisi & Ludo
                  </h3>
                  <span className="font-typewriter text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcc4] text-[#4f3821] border border-[#cbba9e]">15×15</span>
                </div>
                <p className="font-serif text-xs text-[#6e553e] line-clamp-2">
                  Four courtyard sanctuaries, consecrated safety stars, home columns, and capture mechanisms.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e2d6c3] flex items-center justify-between font-serif text-xs text-[#523d29]">
                <span className="italic">2-4 Contenders</span>
                <span className="font-bold text-[#2a1d12] group-hover:text-[#805527] flex items-center gap-1">
                  Enter Atelier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Monopoly Circuit */}
            <div 
              onClick={() => onExploreTemplates('monopoly')}
              className="bg-[#faf6ee] hover:bg-[#fffdf9] rounded p-4 border border-[#cfbe9e] hover:border-[#a88c67] vintage-card-hover cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-32 bg-[#ede1cb] rounded border border-[#bda682] mb-3 flex items-center justify-center shadow-inner">
                  <div className="w-20 h-20 border-2 border-[#3d2b1c] rounded-xs flex flex-col items-center justify-center bg-[#faf4e8]">
                    <span className="font-ornate text-[9px] font-black text-[#3d2b1c]">CIRCUIT</span>
                    <span className="text-xs">🚂</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-[#24170d] group-hover:text-[#734f26] transition-colors">
                    The Grand Circuit
                  </h3>
                  <span className="font-typewriter text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcc4] text-[#4f3821] border border-[#cbba9e]">40 Tiles</span>
                </div>
                <p className="font-serif text-xs text-[#6e553e] line-clamp-2">
                  Perimeter trading circuit with municipal deeds, railroad stations, treasury chests, and tariff taxes.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e2d6c3] flex items-center justify-between font-serif text-xs text-[#523d29]">
                <span className="italic">2-6 Tycoons</span>
                <span className="font-bold text-[#2a1d12] group-hover:text-[#805527] flex items-center gap-1">
                  Enter Atelier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Ludological Craft Pillar Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-typewriter text-xs uppercase tracking-widest text-[#8c6d37] font-bold">ATELIER CAPABILITIES</span>
          <h2 className="font-ornate text-2xl sm:text-3xl font-black text-[#261c14] tracking-wide mt-1">
            Six Tenets of Victorian Gamecraft
          </h2>
          <p className="font-serif italic text-sm text-[#66503c] mt-1">
            Precision instruments designed for tabletop ludologists, game inventors, and traditional printmakers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div className="p-5 rounded bg-[#fdfbf6] border border-[#cfbe9e] shadow-xs space-y-2 font-serif">
            <div className="w-9 h-9 rounded-full bg-[#f0e3cc] border border-[#bfa886] flex items-center justify-center text-[#593e22] text-sm">
              📐
            </div>
            <h3 className="font-bold text-base text-[#2c1e13]">I. Board Topology</h3>
            <p className="text-xs text-[#68523c] leading-relaxed">
              Design Cartesian grids, serpentine expedition tracks, hexagonal honeycombs, and circular racetracks with complete tile sizing and coordinate labeling.
            </p>
          </div>

          <div className="p-5 rounded bg-[#fdfbf6] border border-[#cfbe9e] shadow-xs space-y-2 font-serif">
            <div className="w-9 h-9 rounded-full bg-[#f0e3cc] border border-[#bfa886] flex items-center justify-center text-[#593e22] text-sm">
              📜
            </div>
            <h3 className="font-bold text-base text-[#2c1e13]">II. The Rule Codex</h3>
            <p className="text-xs text-[#68523c] leading-relaxed">
              Formulate definitive win conditions (Elimination, First-to-Goal, Score Threshold, Survival), turn sequences, and custom narrative lore chapters.
            </p>
          </div>

          <div className="p-5 rounded bg-[#fdfbf6] border border-[#cfbe9e] shadow-xs space-y-2 font-serif">
            <div className="w-9 h-9 rounded-full bg-[#f0e3cc] border border-[#bfa886] flex items-center justify-center text-[#593e22] text-sm">
              🎲
            </div>
            <h3 className="font-bold text-base text-[#2c1e13]">III. Consecrated Polyhedrals</h3>
            <p className="text-xs text-[#68523c] leading-relaxed">
              Equip your game with tactile D4, D6, 2xD6, D8, D10, D12, or D20 dice with tactile pip physics, explosive re-rolls, and statistical distribution graphs.
            </p>
          </div>

          <div className="p-5 rounded bg-[#fdfbf6] border border-[#cfbe9e] shadow-xs space-y-2 font-serif">
            <div className="w-9 h-9 rounded-full bg-[#f0e3cc] border border-[#bfa886] flex items-center justify-center text-[#593e22] text-sm">
              🃏
            </div>
            <h3 className="font-bold text-base text-[#2c1e13]">IV. Antique Deck Crafter</h3>
            <p className="text-xs text-[#68523c] leading-relaxed">
              Engrave custom artifact, spell, encounter, and fortune cards with antique card borders, rarity seals, flavor prose, and gameplay triggers.
            </p>
          </div>

          <div className="p-5 rounded bg-[#fdfbf6] border border-[#cfbe9e] shadow-xs space-y-2 font-serif">
            <div className="w-9 h-9 rounded-full bg-[#f0e3cc] border border-[#bfa886] flex items-center justify-center text-[#593e22] text-sm">
              ⚔️
            </div>
            <h3 className="font-bold text-base text-[#2c1e13]">V. Real-Time 2P Parlor Matches</h3>
            <p className="text-xs text-[#68523c] leading-relaxed">
              Generate a telegraph duel link with a single click. Invite an opposing player to duel turn-by-turn with live piece synchronization and match ledgers.
            </p>
          </div>

          <div className="p-5 rounded bg-[#fdfbf6] border border-[#cfbe9e] shadow-xs space-y-2 font-serif">
            <div className="w-9 h-9 rounded-full bg-[#f0e3cc] border border-[#bfa886] flex items-center justify-center text-[#593e22] text-sm">
              🖨️
            </div>
            <h3 className="font-bold text-base text-[#2c1e13]">VI. Print & Plate Export</h3>
            <p className="text-xs text-[#68523c] leading-relaxed">
              Export high-resolution printable PDF sheets with crop marks, piece cut-out tokens, folding dice nets, and parchment rulebook pamphlets.
            </p>
          </div>

        </div>
      </section>

      {/* Antique Footer */}
      <footer className="py-8 bg-[#f5ecdd] border-t border-[#ddcfba] text-center font-serif text-xs text-[#705841]">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-ornate font-bold text-sm tracking-widest text-[#3d2a1a]">BOARDCRAFT</span>
          <span>•</span>
          <span className="italic">Ludological Atelier & Antique Tabletop Foundry</span>
        </div>
        <p className="font-typewriter text-[10px] text-[#8a6e50]">Preserving the golden age of Victorian tabletop play since 1888.</p>
      </footer>

    </div>
  );
};

