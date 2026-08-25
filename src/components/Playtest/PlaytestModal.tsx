import React, { useState } from 'react';
import { GameProject, Piece, ArtifactCard } from '../../types';
import { BoardCanvas } from '../Studio/BoardCanvas';
import { X, Play, RotateCcw, Shuffle, Sparkles, Trophy, ChevronRight, Scroll, Coins, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlaytestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GameProject;
}

interface PlayerState {
  playerNumber: number;
  name: string;
  piece: Piece;
  currentTileIndex: number;
  gold: number;
  inventoryCards: ArtifactCard[];
  isJailed: boolean;
}

export const PlaytestModal: React.FC<PlaytestModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { tiles, diceConfig, ruleEngine, snakesAndLadders = [], cards } = project;

  // Initialize Players State based on project pieces
  const [players, setPlayers] = useState<PlayerState[]>(() => {
    return project.pieces.map((piece) => ({
      playerNumber: piece.playerNumber,
      name: piece.name,
      piece,
      currentTileIndex: piece.startTileIndex || 0,
      gold: 100,
      inventoryCards: [],
      isJailed: false,
    }));
  });

  const [activePlayerIdx, setActivePlayerIdx] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([
    `⚔️ Playtest initialized for "${project.name}" with ${project.pieces.length} champions.`,
    `🎲 Win Condition: ${project.ruleEngine.winConditionDetails || 'Reach the final tile to triumph.'}`
  ]);
  const [activeDrawnCard, setActiveDrawnCard] = useState<ArtifactCard | null>(null);
  const [winner, setWinner] = useState<PlayerState | null>(null);

  if (!isOpen) return null;

  const activePlayer = players[activePlayerIdx] || players[0];

  const addLog = (msg: string) => {
    setGameLog((prev) => [msg, ...prev.slice(0, 15)]);
  };

  const handleRollDice = () => {
    if (isRolling || winner) return;
    setIsRolling(true);

    let rollVal = 1;
    if (diceConfig.type === '2d6') {
      const r1 = Math.floor(Math.random() * 6) + 1;
      const r2 = Math.floor(Math.random() * 6) + 1;
      rollVal = r1 + r2 + (diceConfig.modifier || 0);
    } else if (diceConfig.type === 'coin') {
      rollVal = Math.random() > 0.5 ? 2 : 1;
    } else {
      rollVal = Math.floor(Math.random() * (diceConfig.sidesCount || 6)) + 1 + (diceConfig.modifier || 0);
    }

    setTimeout(() => {
      setLastRoll(rollVal);
      setIsRolling(false);
      advancePlayer(rollVal);
    }, 600);
  };

  const advancePlayer = (spaces: number) => {
    const maxTileIndex = tiles.length > 0 ? (tiles[tiles.length - 1].index || tiles.length - 1) : 63;
    let targetIndex = activePlayer.currentTileIndex + spaces;

    addLog(`🎲 ${activePlayer.name} rolled ${spaces}!`);

    // Check bounds
    if (targetIndex > maxTileIndex) {
      if (project.designType === 'track') {
        // Wrap around track
        targetIndex = targetIndex % tiles.length;
        addLog(`🚩 ${activePlayer.name} completed a lap and collected 200 Gold!`);
        activePlayer.gold += 200;
      } else {
        // Bounce back for exact win
        targetIndex = maxTileIndex - (targetIndex - maxTileIndex);
        addLog(`⚠️ ${activePlayer.name} overshot the final tile and rebounded to Tile #${targetIndex}`);
      }
    }

    // Check Snakes and Ladders
    const snakeOrLadder = snakesAndLadders.find((sl) => sl.fromIndex === targetIndex);
    if (snakeOrLadder) {
      if (snakeOrLadder.type === 'ladder') {
        addLog(`🪜 ${activePlayer.name} scaled a Ladder from Tile #${targetIndex} to #${snakeOrLadder.toIndex}!`);
      } else {
        addLog(`🐍 ${activePlayer.name} was bitten by a Serpent and slid from Tile #${targetIndex} to #${snakeOrLadder.toIndex}!`);
      }
      targetIndex = snakeOrLadder.toIndex;
    }

    // Check Tile Triggers
    const landedTile = tiles.find((t) => t.index === targetIndex);
    if (landedTile) {
      if (landedTile.actionType === 'gain_gold') {
        const amt = Number(landedTile.actionValue) || 50;
        activePlayer.gold += amt;
        addLog(`💰 ${activePlayer.name} landed on Treasure Tile #${targetIndex} and gained +${amt} Gold!`);
      } else if (landedTile.actionType === 'lose_gold') {
        const amt = Number(landedTile.actionValue) || 30;
        activePlayer.gold = Math.max(0, activePlayer.gold - amt);
        addLog(`💸 ${activePlayer.name} paid a toll of -${amt} Gold on Tile #${targetIndex}!`);
      } else if (landedTile.actionType === 'draw_card' && cards.length > 0) {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        setActiveDrawnCard(randomCard);
        activePlayer.inventoryCards.push(randomCard);
        if (randomCard.goldValue) activePlayer.gold += randomCard.goldValue;
        addLog(`📜 ${activePlayer.name} drew Artifact: "${randomCard.title}"!`);
      }
    }

    // Update active player position
    const updatedPlayers = players.map((p, idx) =>
      idx === activePlayerIdx ? { ...p, currentTileIndex: targetIndex, piece: { ...p.piece, currentTileIndex: targetIndex } } : p
    );
    setPlayers(updatedPlayers);

    // Check Win Condition
    if (targetIndex >= maxTileIndex && (ruleEngine.winCondition === 'first_to_finish' || project.designType === 'snakes_ladders')) {
      handleVictory(activePlayer);
      return;
    }

    // Advance turn
    setActivePlayerIdx((prev) => (prev + 1) % players.length);
  };

  const handleVictory = (victor: PlayerState) => {
    setWinner(victor);
    addLog(`👑 VICTORY! ${victor.name} has claimed the Throne and won the game!`);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleResetGame = () => {
    setPlayers(
      project.pieces.map((piece) => ({
        playerNumber: piece.playerNumber,
        name: piece.name,
        piece,
        currentTileIndex: piece.startTileIndex || 0,
        gold: 100,
        inventoryCards: [],
        isJailed: false,
      }))
    );
    setActivePlayerIdx(0);
    setWinner(null);
    setLastRoll(null);
    setActiveDrawnCard(null);
    setGameLog([`🔄 Game simulation reset to initial starting squares.`]);
  };

  // Sync project with playtest piece positions for live BoardCanvas
  const liveProject: GameProject = {
    ...project,
    pieces: players.map((p) => ({
      ...p.piece,
      currentTileIndex: p.currentTileIndex,
    })),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Playtest Arena Window */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#1a1008] text-[#f4ebd0] rounded-2xl vintage-border shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2a1a0f] px-6 py-3 border-b border-[#5c3e21] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#16a34a]/20 border border-[#16a34a] flex items-center justify-center text-sm font-bold text-[#86efac]">
              ▶
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-[#f5edd6] tracking-wider">
                Live Playtest Sandbox: {project.name}
              </h2>
              <span className="text-[11px] font-crimson text-[#d8b894] italic">
                Active Turn: {activePlayer.name} (Player {activePlayer.playerNumber})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetGame}
              className="p-1.5 rounded bg-[#3b2413] hover:bg-[#4f2f17] text-[#ffd700] border border-[#7a522a] text-xs font-cinzel flex items-center gap-1"
              title="Reset Sandbox"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Game</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#bfa07e] hover:text-white hover:bg-[#3d2410]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Canvas, Right Turn Control */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-y-auto">
          
          {/* Live Board Canvas (Col 8) */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <BoardCanvas
              project={liveProject}
              selectedTileIndex={activePlayer.currentTileIndex}
              onSelectTile={() => {}}
              highlightedTiles={[activePlayer.currentTileIndex]}
              previewMode={true}
            />
          </div>

          {/* Turn Engine & Player Status Controls (Col 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* Active Player Card */}
            <div
              className="p-4 rounded-xl border-2 shadow-xl space-y-3"
              style={{
                backgroundColor: '#24170e',
                borderColor: activePlayer.piece.color || '#ffd700',
              }}
            >
              <div className="flex justify-between items-center border-b border-[#5c3e21] pb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xl text-white font-bold border-2 border-white shadow"
                    style={{ backgroundColor: activePlayer.piece.color }}
                  >
                    {activePlayer.piece.icon}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-sm font-bold text-[#f5edd6]">
                      {activePlayer.name}
                    </h3>
                    <span className="text-[10px] text-[#ffd700] font-cinzel">
                      Player {activePlayer.playerNumber} • Tile #{activePlayer.currentTileIndex}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-cinzel text-[#ffd700] flex items-center gap-1 justify-end font-bold">
                    🪙 {activePlayer.gold} GP
                  </span>
                  <span className="text-[10px] text-[#8c6b4a] font-crimson">
                    {activePlayer.inventoryCards.length} Artifacts
                  </span>
                </div>
              </div>

              {/* Roll Dice Action Button */}
              <div className="pt-2 text-center space-y-2">
                <button
                  onClick={handleRollDice}
                  disabled={isRolling || !!winner}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#94681e] via-[#c29b38] to-[#8a5d16] text-[#1a1008] border-2 border-[#ffe082] font-cinzel font-black text-sm tracking-wider shadow-2xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Shuffle className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>
                    {isRolling ? 'Rolling Dice...' : `Roll ${diceConfig.label || 'Die'} for Turn`}
                  </span>
                </button>

                {lastRoll !== null && (
                  <div className="p-2 rounded bg-[#170e08] border border-[#5c3e21] flex justify-around items-center text-xs font-cinzel text-[#ffd700]">
                    <span>Last Roll: <strong>{lastRoll}</strong></span>
                    <span>Piece advanced on board</span>
                  </div>
                )}
              </div>
            </div>

            {/* Players Turn Order Strip */}
            <div className="bg-[#24170e] p-3 rounded-xl border border-[#5c3e21] space-y-2">
              <span className="font-cinzel text-[11px] font-bold text-[#e5c158] uppercase tracking-wider block">
                All Player Positions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {players.map((p, idx) => (
                  <div
                    key={p.playerNumber}
                    className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-cinzel transition-all ${
                      idx === activePlayerIdx
                        ? 'bg-[#3b2311] border-[#ffd700] text-[#ffd700]'
                        : 'bg-[#170e08] border-[#4a2e16] text-[#a8825c]'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                      style={{ backgroundColor: p.piece.color }}
                    >
                      {p.piece.icon}
                    </span>
                    <div className="truncate">
                      <span className="font-bold truncate block">{p.name}</span>
                      <span className="text-[10px] text-[#8c6b4a]">Tile #{p.currentTileIndex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Logs & Event Feed */}
            <div className="flex-1 bg-[#170e08] p-3 rounded-xl border border-[#5c3e21] flex flex-col justify-between max-h-48 overflow-y-auto">
              <span className="font-cinzel text-[11px] font-bold text-[#8c6b4a] uppercase tracking-wider mb-1 block">
                ✦ Playtest Chronicle Logs ✦
              </span>
              <div className="space-y-1 text-xs font-crimson">
                {gameLog.map((log, i) => (
                  <p key={i} className="text-[#d8c3a5] leading-snug border-b border-[#3b2413]/30 pb-0.5">
                    {log}
                  </p>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Drawn Card Popup Modal during gameplay */}
      {activeDrawnCard && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 animate-fadeIn">
          <div className="w-full max-w-sm bg-parchment text-[#2a1a0f] rounded-2xl p-5 border-4 border-[#8c5a24] shadow-2xl space-y-4 text-center">
            <div className="space-y-1 border-b border-[#8c5a24]/30 pb-2">
              <span className="text-[10px] font-cinzel font-bold text-[#b91c1c] uppercase tracking-widest block">
                ✦ ARTIFACT DRAWN! ✦
              </span>
              <h3 className="font-cinzel text-lg font-black text-[#3d2410]">
                {activeDrawnCard.title}
              </h3>
              <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded bg-[#3d2410] text-[#ffd700] inline-block">
                {activeDrawnCard.type} • {activeDrawnCard.rarity}
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#dfcca6] border-2 border-[#b89355] flex items-center justify-center text-3xl mx-auto shadow-inner">
              {activeDrawnCard.icon}
            </div>

            <p className="font-crimson text-sm font-semibold text-[#1c1208] leading-relaxed">
              {activeDrawnCard.effectText}
            </p>

            {activeDrawnCard.flavorText && (
              <p className="font-crimson text-xs text-[#78512b] italic">
                "{activeDrawnCard.flavorText}"
              </p>
            )}

            <button
              onClick={() => setActiveDrawnCard(null)}
              className="w-full py-2.5 rounded-lg bg-[#3d2410] text-[#ffd700] font-cinzel font-bold text-xs tracking-wider shadow hover:bg-[#523116]"
            >
              Collect Artifact & Continue Turn
            </button>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      {winner && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 animate-fadeIn">
          <div className="w-full max-w-md bg-[#2a1a0f] text-[#f5edd6] rounded-2xl p-6 vintage-border shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full wax-seal border-2 border-[#ffd700] flex items-center justify-center text-3xl mx-auto shadow-2xl">
              👑
            </div>
            <h2 className="font-cinzel-dec text-2xl font-black gold-gradient-text">
              Imperial Victory!
            </h2>
            <p className="font-crimson text-base text-[#d8c3a5]">
              <strong>{winner.name}</strong> (Player {winner.playerNumber}) has accomplished the victory condition and conquered the realm!
            </p>
            <div className="p-3 bg-[#170e08] rounded-lg border border-[#5c3e21] text-xs font-cinzel text-[#ffd700]">
              Final Gold Bounty: {winner.gold} GP • Artifacts: {winner.inventoryCards.length}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleResetGame}
                className="flex-1 py-2.5 rounded-lg bg-[#3d2410] text-[#ffd700] border border-[#a87f3b] font-cinzel font-bold text-xs"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-[#c29b38] text-[#1a1008] font-cinzel font-bold text-xs shadow"
              >
                Exit to Studio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

