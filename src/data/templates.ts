import { GameProject, PalettePreset, SnakeOrLadder, Tile, Piece, ArtifactCard } from '../types';

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'minimal_slate',
    name: 'Minimal Slate & Porcelain',
    description: 'Clean modern aesthetic with crisp white, soft slate, and subtle dark border lines.',
    lightTile: '#ffffff',
    darkTile: '#e2e8f0',
    accent: '#2563eb',
    boardBg: '#f8fafc',
    gridBorder: '#cbd5e1',
    textColor: '#0f172a',
  },
  {
    id: 'classic_birch',
    name: 'Classic Birch & Walnut',
    description: 'Understated natural wooden tones with soft cream and warm chestnut.',
    lightTile: '#f8f5ee',
    darkTile: '#bfa07e',
    accent: '#b45309',
    boardBg: '#ede8dd',
    gridBorder: '#a88a68',
    textColor: '#291e12',
  },
  {
    id: 'nordic_monochrome',
    name: 'Nordic Monochrome',
    description: 'High contrast clean black and white minimalist grid layout.',
    lightTile: '#ffffff',
    darkTile: '#27272a',
    accent: '#71717a',
    boardBg: '#f4f4f5',
    gridBorder: '#71717a',
    textColor: '#18181b',
  },
  {
    id: 'sage_emerald',
    name: 'Clean Sage & Emerald',
    description: 'Subtle sage green accents with soft off-white tiles.',
    lightTile: '#f2f7f4',
    darkTile: '#a3c4bc',
    accent: '#059669',
    boardBg: '#e6edea',
    gridBorder: '#83a89e',
    textColor: '#132e27',
  },
  {
    id: 'vintage_parchment',
    name: 'Warm Parchment & Sepia',
    description: 'Warm cream paper tones with soft sepia accents.',
    lightTile: '#fbf7ee',
    darkTile: '#dfcca6',
    accent: '#b48a3c',
    boardBg: '#f3ebd7',
    gridBorder: '#caa873',
    textColor: '#2b1f13',
  },
  {
    id: 'royal_velvet',
    name: 'Royal Velvet & Crimson',
    description: 'Deep crimson with crisp ivory contrast.',
    lightTile: '#fdfbf7',
    darkTile: '#991b1b',
    accent: '#d97706',
    boardBg: '#fee2e2',
    gridBorder: '#b91c1c',
    textColor: '#450a0a',
  }
];

export const PIECE_ICONS = [
  { id: 'pawn', name: 'Pawn', icon: '♟' },
  { id: 'knight', name: 'Knight / Steed', icon: '♞' },
  { id: 'bishop', name: 'Bishop', icon: '♝' },
  { id: 'rook', name: 'Castle / Rook', icon: '♜' },
  { id: 'queen', name: 'Queen', icon: '♛' },
  { id: 'king', name: 'King / Crown', icon: '♚' },
  { id: 'dragon', name: 'Dragon', icon: '🐉' },
  { id: 'galleon', name: 'Galleon Ship', icon: '⛵' },
  { id: 'sword', name: 'Champion Blade', icon: '⚔️' },
  { id: 'shield', name: 'Guardian Shield', icon: '🛡️' },
  { id: 'wizard', name: 'Sorcerer', icon: '🧙' },
  { id: 'ring', name: 'Artifact Ring', icon: '💍' },
  { id: 'skull', name: 'Grim Raider', icon: '💀' },
  { id: 'gem', name: 'Arcane Jewel', icon: '💎' },
  { id: 'boot', name: 'Adventurer Boot', icon: '🥾' },
  { id: 'goblet', name: 'Holy Chalice', icon: '🏆' },
];

export const TILE_ICONS = [
  { id: 'start', label: 'Start Gate', icon: '🚩' },
  { id: 'crown', label: 'Royal Crown', icon: '👑' },
  { id: 'skull', label: 'Peril / Trap', icon: '💀' },
  { id: 'chest', label: 'Treasure Chest', icon: '📦' },
  { id: 'sword', label: 'Battle / Duel', icon: '⚔️' },
  { id: 'portal', label: 'Magic Portal', icon: '🌀' },
  { id: 'dice', label: 'Roll Again', icon: '🎲' },
  { id: 'card', label: 'Draw Card', icon: '📜' },
  { id: 'gold', label: 'Gold Bounty', icon: '💰' },
  { id: 'shield', label: 'Safe Sanctuary', icon: '🛡️' },
  { id: 'jail', label: 'Dungeon / Jail', icon: '⛓️' },
  { id: 'tavern', label: 'Wayside Tavern', icon: '🍺' },
  { id: 'fire', label: 'Campfire Rest', icon: '🔥' },
  { id: 'star', label: 'Star Blessing', icon: '⭐' },
  { id: 'potion', label: 'Alchemist Flask', icon: '🧪' },
  { id: 'dragon', label: 'Dragon Lair', icon: '🐉' },
];

// Helper to generate Chess Board
export function createChessTemplate(): GameProject {
  const rows = 8;
  const cols = 8;
  const tiles: Tile[] = [];
  const palette = PALETTE_PRESETS[0];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      const isLight = (r + c) % 2 === 0;
      const file = String.fromCharCode(65 + c);
      const rank = 8 - r;
      tiles.push({
        id: `tile-${index}`,
        index,
        row: r,
        col: c,
        label: `${file}${rank}`,
        color: isLight ? palette.lightTile : palette.darkTile,
        textColor: isLight ? palette.darkTile : palette.lightTile,
      });
    }
  }

  const pieces: Piece[] = [
    // Black pieces (Player 2)
    { id: 'b_r1', name: 'Black Rook', icon: '♜', playerNumber: 2, color: '#1e1b18', currentTileIndex: 0, startTileIndex: 0 },
    { id: 'b_n1', name: 'Black Knight', icon: '♞', playerNumber: 2, color: '#1e1b18', currentTileIndex: 1, startTileIndex: 1 },
    { id: 'b_b1', name: 'Black Bishop', icon: '♝', playerNumber: 2, color: '#1e1b18', currentTileIndex: 2, startTileIndex: 2 },
    { id: 'b_q', name: 'Black Queen', icon: '♛', playerNumber: 2, color: '#1e1b18', currentTileIndex: 3, startTileIndex: 3 },
    { id: 'b_k', name: 'Black King', icon: '♚', playerNumber: 2, color: '#1e1b18', currentTileIndex: 4, startTileIndex: 4 },
    { id: 'b_b2', name: 'Black Bishop', icon: '♝', playerNumber: 2, color: '#1e1b18', currentTileIndex: 5, startTileIndex: 5 },
    { id: 'b_n2', name: 'Black Knight', icon: '♞', playerNumber: 2, color: '#1e1b18', currentTileIndex: 6, startTileIndex: 6 },
    { id: 'b_r2', name: 'Black Rook', icon: '♜', playerNumber: 2, color: '#1e1b18', currentTileIndex: 7, startTileIndex: 7 },
    ...Array.from({ length: 8 }).map((_, i) => ({
      id: `b_p${i + 1}`,
      name: `Black Pawn ${i + 1}`,
      icon: '♟',
      playerNumber: 2,
      color: '#1e1b18',
      currentTileIndex: 8 + i,
      startTileIndex: 8 + i,
    })),
    // White pieces (Player 1)
    ...Array.from({ length: 8 }).map((_, i) => ({
      id: `w_p${i + 1}`,
      name: `White Pawn ${i + 1}`,
      icon: '♙',
      playerNumber: 1,
      color: '#f8fafc',
      currentTileIndex: 48 + i,
      startTileIndex: 48 + i,
    })),
    { id: 'w_r1', name: 'White Rook', icon: '♖', playerNumber: 1, color: '#f8fafc', currentTileIndex: 56, startTileIndex: 56 },
    { id: 'w_n1', name: 'White Knight', icon: '♘', playerNumber: 1, color: '#f8fafc', currentTileIndex: 57, startTileIndex: 57 },
    { id: 'w_b1', name: 'White Bishop', icon: '♗', playerNumber: 1, color: '#f8fafc', currentTileIndex: 58, startTileIndex: 58 },
    { id: 'w_q', name: 'White Queen', icon: '♕', playerNumber: 1, color: '#f8fafc', currentTileIndex: 59, startTileIndex: 59 },
    { id: 'w_k', name: 'White King', icon: '♔', playerNumber: 1, color: '#f8fafc', currentTileIndex: 60, startTileIndex: 60 },
    { id: 'w_b2', name: 'White Bishop', icon: '♗', playerNumber: 1, color: '#f8fafc', currentTileIndex: 61, startTileIndex: 61 },
    { id: 'w_n2', name: 'White Knight', icon: '♘', playerNumber: 1, color: '#f8fafc', currentTileIndex: 62, startTileIndex: 62 },
    { id: 'w_r2', name: 'White Rook', icon: '♖', playerNumber: 1, color: '#f8fafc', currentTileIndex: 63, startTileIndex: 63 },
  ];

  const cards: ArtifactCard[] = [
    {
      id: 'c_tactic_1',
      deckName: 'Tactical Gambits',
      title: 'Queen’s Gambit',
      type: 'Spell',
      icon: '♛',
      rarity: 'rare',
      effectText: 'Sacrifice a pawn to gain an immediate double movement with any minor piece.',
      flavorText: 'A bold opening crafted in the courts of 15th-century masters.',
    },
    {
      id: 'c_tactic_2',
      deckName: 'Tactical Gambits',
      title: 'Fortified Castling',
      type: 'Boon',
      icon: '♜',
      rarity: 'common',
      effectText: 'Swap King and Rook into safety and grant immunity for 1 opponent turn.',
      flavorText: 'Behind stone bulwarks, monarchs command with impunity.',
    },
    {
      id: 'c_tactic_3',
      deckName: 'Tactical Gambits',
      title: 'Knight’s Fork',
      type: 'Treasure',
      icon: '♞',
      rarity: 'legendary',
      effectText: 'Threaten two major enemy pieces simultaneously; opponent must surrender one.',
      flavorText: 'An elegant leap across ranks that leaves the enemy commander in ruins.',
    }
  ];

  return {
    id: 'proj_chess_classic',
    name: 'Grandmaster Chess Royale',
    description: 'An authentic 8x8 royal checkered board crafted with antique ivory and ebony finishes, complete with tactical maneuver codex and tactical cards.',
    designType: 'square',
    templateId: 'chess',
    rows: 8,
    cols: 8,
    paletteId: 'vintage_parchment',
    tiles,
    pieces,
    diceConfig: {
      type: 'd6',
      label: 'Strategy Roll',
      sidesCount: 6,
      allowReRollOnMax: false,
      modifier: 0,
    },
    ruleEngine: {
      title: 'Grandmaster Chess Royale',
      tagline: 'The ancient battle of kings, queens, and intellect.',
      minPlayers: 2,
      maxPlayers: 2,
      estimatedMinutes: 30,
      ageRecommendation: '8+',
      difficulty: 'Grand Strategy',
      winCondition: 'elimination',
      winConditionDetails: 'Checkmate the opposing King so that no legal escape or defense exists.',
      turnOrder: 'Clockwise',
      sections: [
        { id: 's1', title: 'I. Objective', content: 'Capture or trap the opposing King in Checkmate while guarding your own monarch.' },
        { id: 's2', title: 'II. Piece Movement', content: 'Pawns march forward 1 space (2 on initial move); Knights jump in L-shape; Bishops sweep diagonals; Rooks traverse ranks/files; Queens command all vectors.' },
        { id: 's3', title: 'III. Tactical Gambit Cards', content: 'Once per match, a player may invoke one tactical card from their drawn hand during their movement phase.' }
      ]
    },
    cards,
    themeTexture: 'parchment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Grand Artisan',
    isFavorite: true,
  };
}

// Helper to generate Snakes and Ladders
export function createSnakesAndLaddersTemplate(): GameProject {
  const rows = 10;
  const cols = 10;
  const total = rows * cols; // 100
  const tiles: Tile[] = [];
  const palette = PALETTE_PRESETS[2]; // forest moss / golden

  // Serpentine numbering from 1 (bottom left) to 100 (top left)
  for (let r = 0; r < rows; r++) {
    const isRowEvenFromBottom = (rows - 1 - r) % 2 === 0;
    for (let c = 0; c < cols; c++) {
      const colIndex = isRowEvenFromBottom ? c : (cols - 1 - c);
      const number = (rows - 1 - r) * cols + colIndex + 1;
      const isAlt = number % 2 === 0;
      
      let icon: string | undefined;
      let actionType: Tile['actionType'] = 'none';
      let subLabel: string | undefined;

      if (number === 1) {
        icon = '🚩';
        subLabel = 'START';
      } else if (number === 100) {
        icon = '👑';
        subLabel = 'THRONE';
      }

      tiles.push({
        id: `tile-${number}`,
        index: number,
        row: r,
        col: c,
        label: `${number}`,
        subLabel,
        color: isAlt ? '#faf7eb' : '#dfcca6',
        textColor: '#382513',
        icon,
        actionType,
      });
    }
  }

  // Sort tiles by tile number 1..100 for easy lookup
  tiles.sort((a, b) => a.index - b.index);

  const snakesAndLadders: SnakeOrLadder[] = [
    // Ladders (Climb UP)
    { id: 'l1', fromIndex: 4, toIndex: 14, type: 'ladder', color: '#16a34a', label: 'Vine Ladder' },
    { id: 'l2', fromIndex: 9, toIndex: 31, type: 'ladder', color: '#16a34a', label: 'Golden Stair' },
    { id: 'l3', fromIndex: 20, toIndex: 38, type: 'ladder', color: '#16a34a', label: 'Rope Bridge' },
    { id: 'l4', fromIndex: 28, toIndex: 84, type: 'ladder', color: '#16a34a', label: 'Great Escalation' },
    { id: 'l5', fromIndex: 40, toIndex: 59, type: 'ladder', color: '#16a34a', label: 'Ancient Ramp' },
    { id: 'l6', fromIndex: 51, toIndex: 67, type: 'ladder', color: '#16a34a', label: 'Spire Ladder' },
    { id: 'l7', fromIndex: 63, toIndex: 81, type: 'ladder', color: '#16a34a', label: 'Belfry Lift' },
    { id: 'l8', fromIndex: 71, toIndex: 91, type: 'ladder', color: '#16a34a', label: 'Sky Portal' },

    // Snakes (Slide DOWN)
    { id: 's1', fromIndex: 17, toIndex: 7, type: 'snake', color: '#dc2626', label: 'Viper Pit' },
    { id: 's2', fromIndex: 54, toIndex: 34, type: 'snake', color: '#dc2626', label: 'Sand Worm' },
    { id: 's3', fromIndex: 62, toIndex: 19, type: 'snake', color: '#dc2626', label: 'Great Serpent' },
    { id: 's4', fromIndex: 64, toIndex: 60, type: 'snake', color: '#dc2626', label: 'Cobra Chute' },
    { id: 's5', fromIndex: 87, toIndex: 24, type: 'snake', color: '#dc2626', label: 'Dragon Drop' },
    { id: 's6', fromIndex: 93, toIndex: 73, type: 'snake', color: '#dc2626', label: 'Python Trap' },
    { id: 's7', fromIndex: 95, toIndex: 75, type: 'snake', color: '#dc2626', label: 'Venom Abyss' },
    { id: 's8', fromIndex: 99, toIndex: 78, type: 'snake', color: '#dc2626', label: 'Basilisk Maw' },
  ];

  // Mark tiles with icons
  snakesAndLadders.forEach(item => {
    const tile = tiles.find(t => t.index === item.fromIndex);
    if (tile) {
      tile.icon = item.type === 'ladder' ? '🪜' : '🐍';
      tile.subLabel = item.type === 'ladder' ? `+to ${item.toIndex}` : `-to ${item.toIndex}`;
      tile.actionType = 'teleport';
      tile.actionValue = item.toIndex;
    }
  });

  const pieces: Piece[] = [
    { id: 'p1_knight', name: 'Emerald Champion', icon: '♟', playerNumber: 1, color: '#16a34a', currentTileIndex: 1, startTileIndex: 1 },
    { id: 'p2_ruby', name: 'Crimson Raider', icon: '♞', playerNumber: 2, color: '#dc2626', currentTileIndex: 1, startTileIndex: 1 },
    { id: 'p3_sapphire', name: 'Azure Mage', icon: '🧙', playerNumber: 3, color: '#2563eb', currentTileIndex: 1, startTileIndex: 1 },
    { id: 'p4_gold', name: 'Gilded Pilgrim', icon: '🥾', playerNumber: 4, color: '#d97706', currentTileIndex: 1, startTileIndex: 1 },
  ];

  const cards: ArtifactCard[] = [
    {
      id: 'sn_c1',
      deckName: 'Fate of the Serpent',
      title: 'Snake Charmer’s Flute',
      type: 'Equipment',
      icon: '🪈',
      rarity: 'rare',
      effectText: 'Ignore the next Snake slide and remain firmly on your tile.',
      flavorText: 'A hypnotic melody that lulls even the Great Basilisk to sleep.',
    },
    {
      id: 'sn_c2',
      deckName: 'Fate of the Serpent',
      title: 'Pegasus Feathers',
      type: 'Boon',
      icon: '🪶',
      rarity: 'uncommon',
      effectText: 'Add +3 to your next dice roll and bypass all perils.',
      flavorText: 'Light as the mountain wind over the canopy.',
    },
    {
      id: 'sn_c3',
      deckName: 'Fate of the Serpent',
      title: 'Cursed Mists',
      type: 'Curse',
      icon: '🌫️',
      rarity: 'perilous',
      effectText: 'Target opponent must roll backwards on their next turn.',
      flavorText: 'Disorientation grips the traveler in the serpent groves.',
    }
  ];

  return {
    id: 'proj_snakes_ladders',
    name: 'Mythic Serpents & Golden Ladders',
    description: 'A 100-tile serpentine board with illustrated climbing ladders, cunning serpents, mystical event cards, and roll-to-win dynamics.',
    designType: 'snakes_ladders',
    templateId: 'snakes_ladders',
    rows: 10,
    cols: 10,
    paletteId: 'forest_moss',
    tiles,
    snakesAndLadders,
    pieces,
    diceConfig: {
      type: 'd6',
      label: 'Fate Die',
      sidesCount: 6,
      allowReRollOnMax: true,
      doublesRule: false,
      modifier: 0,
    },
    ruleEngine: {
      title: 'Mythic Serpents & Golden Ladders',
      tagline: 'Ascend the 100 steps of destiny, climbing ladders while evading treacherous serpents.',
      minPlayers: 2,
      maxPlayers: 4,
      estimatedMinutes: 20,
      ageRecommendation: '6+',
      difficulty: 'Easy / Family',
      winCondition: 'first_to_finish',
      winConditionDetails: 'Exact roll required to land on Tile 100 and claim the Imperial Throne.',
      turnOrder: 'Clockwise',
      sections: [
        { id: 's1', title: 'I. Objective', content: 'Be the first player to navigate through 100 perilous tiles and arrive at the Throne of the Sylvan King.' },
        { id: 's2', title: 'II. Movement & Climbing', content: 'Roll the D6 die on your turn. Move forward according to your roll. If you land on a Ladder foot, immediately climb to the summit tile! If you land on a Serpent head, slide down to its tail.' },
        { id: 's3', title: 'III. Exact Roll Rule', content: 'To win, you must land on Tile 100 with an exact roll. If you roll higher, you rebound backwards from the crown!' }
      ]
    },
    cards,
    themeTexture: 'parchment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Grand Artisan',
    isFavorite: true,
  };
}

// Helper to generate Royal Ludo Template
export function createLudoTemplate(): GameProject {
  const size = 15;
  const tiles: Tile[] = [];

  // 15x15 Ludo layout with 4 colored home bases and cross tracks
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const index = r * size + c;
      let color = '#f5edd6';
      let textColor = '#2a1a0f';
      let label: string | undefined;
      let subLabel: string | undefined;
      let icon: string | undefined;
      let actionType: Tile['actionType'] = 'none';

      // Red quadrant (Top-Left 0..5, 0..5)
      if (r <= 5 && c <= 5) {
        color = '#fee2e2';
        if ((r === 1 || r === 4) && (c === 1 || c === 4)) {
          color = '#dc2626';
          textColor = '#ffffff';
          icon = '♟';
          label = 'RED';
        }
      }
      // Green quadrant (Top-Right 0..5, 9..14)
      else if (r <= 5 && c >= 9) {
        color = '#dcfce7';
        if ((r === 1 || r === 4) && (c === 10 || c === 13)) {
          color = '#16a34a';
          textColor = '#ffffff';
          icon = '♟';
          label = 'GRN';
        }
      }
      // Yellow quadrant (Bottom-Right 9..14, 9..14)
      else if (r >= 9 && c >= 9) {
        color = '#fef9c3';
        if ((r === 10 || r === 13) && (c === 10 || c === 13)) {
          color = '#ca8a04';
          textColor = '#ffffff';
          icon = '♟';
          label = 'YEL';
        }
      }
      // Blue quadrant (Bottom-Left 9..14, 0..5)
      else if (r >= 9 && c <= 5) {
        color = '#dbeafe';
        if ((r === 10 || r === 13) && (c === 1 || c === 4)) {
          color = '#2563eb';
          textColor = '#ffffff';
          icon = '♟';
          label = 'BLU';
        }
      }
      // Center Home Triangle / Throne
      else if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
        color = '#c29b38';
        textColor = '#ffffff';
        icon = '👑';
        label = 'HOME';
      }
      // Red Home Column
      else if (r === 7 && c >= 1 && c <= 5) {
        color = '#f87171';
        textColor = '#ffffff';
        label = `R${c}`;
      }
      // Green Home Column
      else if (c === 7 && r >= 1 && r <= 5) {
        color = '#4ade80';
        textColor = '#ffffff';
        label = `G${r}`;
      }
      // Yellow Home Column
      else if (r === 7 && c >= 9 && c <= 13) {
        color = '#facc15';
        textColor = '#1e1b18';
        label = `Y${15 - c}`;
      }
      // Blue Home Column
      else if (c === 7 && r >= 9 && r <= 13) {
        color = '#60a5fa';
        textColor = '#ffffff';
        label = `B${15 - r}`;
      }
      // Safe star squares
      else if ((r === 6 && c === 1) || (r === 1 && c === 8) || (r === 8 && c === 13) || (r === 13 && c === 6)) {
        color = '#fef08a';
        icon = '⭐';
        subLabel = 'SAFE';
        actionType = 'safe_zone';
      }

      tiles.push({
        id: `ludo-${index}`,
        index,
        row: r,
        col: c,
        label: label || `${r},${c}`,
        subLabel,
        color,
        textColor,
        icon,
        actionType,
      });
    }
  }

  const pieces: Piece[] = [
    // Red Team
    { id: 'l_r1', name: 'Red Knight 1', icon: '♟', playerNumber: 1, color: '#dc2626', currentTileIndex: 16, startTileIndex: 16 },
    { id: 'l_r2', name: 'Red Knight 2', icon: '♟', playerNumber: 1, color: '#dc2626', currentTileIndex: 19, startTileIndex: 19 },
    { id: 'l_r3', name: 'Red Knight 3', icon: '♟', playerNumber: 1, color: '#dc2626', currentTileIndex: 61, startTileIndex: 61 },
    { id: 'l_r4', name: 'Red Knight 4', icon: '♟', playerNumber: 1, color: '#dc2626', currentTileIndex: 64, startTileIndex: 64 },

    // Green Team
    { id: 'l_g1', name: 'Green Scout 1', icon: '♟', playerNumber: 2, color: '#16a34a', currentTileIndex: 25, startTileIndex: 25 },
    { id: 'l_g2', name: 'Green Scout 2', icon: '♟', playerNumber: 2, color: '#16a34a', currentTileIndex: 28, startTileIndex: 28 },
    { id: 'l_g3', name: 'Green Scout 3', icon: '♟', playerNumber: 2, color: '#16a34a', currentTileIndex: 70, startTileIndex: 70 },
    { id: 'l_g4', name: 'Green Scout 4', icon: '♟', playerNumber: 2, color: '#16a34a', currentTileIndex: 73, startTileIndex: 73 },

    // Yellow Team
    { id: 'l_y1', name: 'Yellow Guard 1', icon: '♟', playerNumber: 3, color: '#ca8a04', currentTileIndex: 160, startTileIndex: 160 },
    { id: 'l_y2', name: 'Yellow Guard 2', icon: '♟', playerNumber: 3, color: '#ca8a04', currentTileIndex: 163, startTileIndex: 163 },
    { id: 'l_y3', name: 'Yellow Guard 3', icon: '♟', playerNumber: 3, color: '#ca8a04', currentTileIndex: 205, startTileIndex: 205 },
    { id: 'l_y4', name: 'Yellow Guard 4', icon: '♟', playerNumber: 3, color: '#ca8a04', currentTileIndex: 208, startTileIndex: 208 },

    // Blue Team
    { id: 'l_b1', name: 'Blue Archer 1', icon: '♟', playerNumber: 4, color: '#2563eb', currentTileIndex: 151, startTileIndex: 151 },
    { id: 'l_b2', name: 'Blue Archer 2', icon: '♟', playerNumber: 4, color: '#2563eb', currentTileIndex: 154, startTileIndex: 154 },
    { id: 'l_b3', name: 'Blue Archer 3', icon: '♟', playerNumber: 4, color: '#2563eb', currentTileIndex: 196, startTileIndex: 196 },
    { id: 'l_b4', name: 'Blue Archer 4', icon: '♟', playerNumber: 4, color: '#2563eb', currentTileIndex: 199, startTileIndex: 199 },
  ];

  const cards: ArtifactCard[] = [
    {
      id: 'lud_c1',
      deckName: 'Pachisi Fortunes',
      title: 'Divine Six',
      type: 'Boon',
      icon: '🎲',
      rarity: 'rare',
      effectText: 'Instantly spawn any piece from your courtyard into the active path without rolling a 6.',
      flavorText: 'The palace bells ring for the hero entrance.',
    },
    {
      id: 'lud_c2',
      deckName: 'Pachisi Fortunes',
      title: 'Sanctuary Ward',
      type: 'Spell',
      icon: '🛡️',
      rarity: 'common',
      effectText: 'Your piece on a Star tile is completely immune to capture and grants +1 turn.',
      flavorText: 'Sacred stone wardens repel all pursuing hostile tokens.',
    }
  ];

  return {
    id: 'proj_ludo_royal',
    name: 'Imperial Pachisi & Ludo',
    description: 'Four royal quadrants with dedicated courtyards, cross paths, sanctuary stars, and high-stakes token capture mechanics.',
    designType: 'ludo',
    templateId: 'ludo',
    rows: 15,
    cols: 15,
    paletteId: 'royal_velvet',
    tiles,
    pieces,
    diceConfig: {
      type: 'd6',
      label: 'Royal D6',
      sidesCount: 6,
      allowReRollOnMax: true,
      doublesRule: true,
      modifier: 0,
    },
    ruleEngine: {
      title: 'Imperial Pachisi & Ludo',
      tagline: 'Race your four champion tokens through cross battlements to the sacred center throne.',
      minPlayers: 2,
      maxPlayers: 4,
      estimatedMinutes: 25,
      ageRecommendation: '6+',
      difficulty: 'Easy / Family',
      winCondition: 'first_to_finish',
      winConditionDetails: 'First player to escort all 4 tokens into the central golden home square wins.',
      turnOrder: 'Clockwise',
      sections: [
        { id: 's1', title: 'I. Spawning Tokens', content: 'Roll a 6 on the die to release a token from your starting corner barracks onto your entry tile.' },
        { id: 's2', title: 'II. Token Capture', content: 'Landing directly on an opponent piece sends their token back to their corner yard unless they rest on a Star Safe Zone.' },
        { id: 's3', title: 'III. Extra Turns', content: 'Rolling a 6 or capturing an opponent token grants an immediate bonus turn.' }
      ]
    },
    cards,
    themeTexture: 'parchment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Grand Artisan',
  };
}

// Helper to generate Monopoly Style Perimeter Track
export function createMonopolyTemplate(): GameProject {
  const trackLength = 40; // 10 tiles per side
  const tiles: Tile[] = [];

  const districts = [
    { name: 'Old Town Brown', color: '#854d0e', tiles: [1, 3], names: ['Tanner St', 'Potter Lane'], prices: [60, 60] },
    { name: 'Harbor Azure', color: '#0284c7', tiles: [6, 8, 9], names: ['Galleon Pier', 'Sailor Wharf', 'Lighthouse Way'], prices: [100, 100, 120] },
    { name: 'Artisan Magenta', color: '#c026d3', tiles: [11, 13, 14], names: ['Weaver Court', 'Smithy Row', 'Glassworks Ave'], prices: [140, 140, 160] },
    { name: 'Merchant Orange', color: '#ea580c', tiles: [16, 18, 19], names: ['Spice Market', 'Silk Bazaar', 'Caravan Square'], prices: [180, 180, 200] },
    { name: 'Ruby District', color: '#dc2626', tiles: [21, 23, 24], names: ['Garrison Post', 'Armory Blvd', 'High Fortress'], prices: [220, 220, 240] },
    { name: 'Golden Promenade', color: '#ca8a04', tiles: [26, 27, 29], names: ['Guildhall', 'Chamber of Coins', 'Imperial Treasury'], prices: [260, 260, 280] },
    { name: 'Emerald Estates', color: '#16a34a', tiles: [31, 32, 34], names: ['Royal Park', 'Baron Gardens', 'Grand Chateau'], prices: [300, 300, 320] },
    { name: 'Imperial Dark Blue', color: '#1e3a8a', tiles: [37, 39], names: ['Citadel Spire', 'Crown Palace'], prices: [350, 400] },
  ];

  for (let i = 0; i < trackLength; i++) {
    let label = `Tile ${i}`;
    let subLabel: string | undefined;
    let color = '#f7f1e1';
    let textColor = '#2a1a0f';
    let icon: string | undefined;
    let actionType: Tile['actionType'] = 'none';
    let districtName: string | undefined;
    let price: number | undefined;
    let isCorner = false;

    // Corners
    if (i === 0) {
      label = 'COLLECT GOLD';
      subLabel = '+200 GP';
      color = '#e2e8f0';
      icon = '🚩';
      actionType = 'gain_gold';
      isCorner = true;
    } else if (i === 10) {
      label = 'DUNGEON VISIT';
      subLabel = 'JUST VISITING';
      color = '#e2e8f0';
      icon = '⛓️';
      actionType = 'jail';
      isCorner = true;
    } else if (i === 20) {
      label = 'FREE OASIS';
      subLabel = 'REST SPOT';
      color = '#e2e8f0';
      icon = '🔥';
      actionType = 'safe_zone';
      isCorner = true;
    } else if (i === 30) {
      label = 'GO TO JAIL';
      subLabel = 'LOCKED UP';
      color = '#fecaca';
      icon = '💀';
      actionType = 'teleport';
      isCorner = true;
    } else if (i === 2 || i === 17 || i === 33) {
      label = 'CHEST OF FATE';
      subLabel = 'DRAW CARD';
      color = '#fef08a';
      icon = '📦';
      actionType = 'draw_card';
    } else if (i === 7 || i === 22 || i === 36) {
      label = 'ORACLE CHANCE';
      subLabel = 'DRAW CARD';
      color = '#fed7aa';
      icon = '📜';
      actionType = 'draw_card';
    } else if (i === 4 || i === 38) {
      label = 'TRIBUTE TAX';
      subLabel = '-100 GP';
      color = '#fee2e2';
      icon = '💰';
      actionType = 'lose_gold';
    } else if (i === 5 || i === 15 || i === 25 || i === 35) {
      label = 'COACH STATION';
      subLabel = '200 GP';
      color = '#f1f5f9';
      icon = '⛵';
      price = 200;
    } else {
      // Find property
      const dist = districts.find(d => d.tiles.includes(i));
      if (dist) {
        const propIndex = dist.tiles.indexOf(i);
        label = dist.names[propIndex];
        price = dist.prices[propIndex];
        subLabel = `${price} GP`;
        districtName = dist.name;
        color = dist.color;
        textColor = '#ffffff';
        icon = '🏰';
      }
    }

    tiles.push({
      id: `track-${i}`,
      index: i,
      row: 0,
      col: 0,
      label,
      subLabel,
      color,
      textColor,
      icon,
      actionType,
      district: districtName,
      price,
      isCorner,
    });
  }

  const pieces: Piece[] = [
    { id: 'mp_1', name: 'Grand Galleon', icon: '⛵', playerNumber: 1, color: '#dc2626', currentTileIndex: 0, startTileIndex: 0 },
    { id: 'mp_2', name: 'Iron Horse', icon: '♞', playerNumber: 2, color: '#2563eb', currentTileIndex: 0, startTileIndex: 0 },
    { id: 'mp_3', name: 'Alchemist Flask', icon: '🧪', playerNumber: 3, color: '#16a34a', currentTileIndex: 0, startTileIndex: 0 },
    { id: 'mp_4', name: 'Golden Chalice', icon: '🏆', playerNumber: 4, color: '#ca8a04', currentTileIndex: 0, startTileIndex: 0 },
  ];

  const cards: ArtifactCard[] = [
    {
      id: 'm_c1',
      deckName: 'Oracle of Fortune',
      title: 'Grand Caravan Arrival',
      type: 'Treasure',
      icon: '🐫',
      rarity: 'rare',
      effectText: 'Collect 150 Gold from the treasury for exotic spices trade.',
      flavorText: 'Camels laden with rare saffron and silk arrive at the eastern port.',
      goldValue: 150,
    },
    {
      id: 'm_c2',
      deckName: 'Oracle of Fortune',
      title: 'Royal Dungeon Pardon',
      type: 'Boon',
      icon: '🗝️',
      rarity: 'legendary',
      effectText: 'Keep this card until needed to escape the Dungeon freely without paying gold.',
      flavorText: 'Stamped with the personal wax sigil of the High Magistrate.',
    },
    {
      id: 'm_c3',
      deckName: 'Oracle of Fortune',
      title: 'Bridge Repair Levy',
      type: 'Curse',
      icon: '🌉',
      rarity: 'common',
      effectText: 'Pay 25 Gold for every property tile you own to renovate aqueducts.',
      flavorText: 'The town elders mandate contributions following the spring flood.',
      cost: 50,
    }
  ];

  return {
    id: 'proj_grand_bazaar',
    name: 'Grand Bazaar & Imperial Estate',
    description: 'A 40-tile perimeter trading track featuring 8 colorful merchant districts, auction deeds, fate chests, and wealth accumulation rules.',
    designType: 'track',
    templateId: 'monopoly',
    rows: 11,
    cols: 11,
    trackLength: 40,
    paletteId: 'nautical_brass',
    tiles,
    pieces,
    diceConfig: {
      type: '2d6',
      label: 'Twin Brass Dice',
      sidesCount: 6,
      allowReRollOnMax: false,
      doublesRule: true,
      modifier: 0,
    },
    ruleEngine: {
      title: 'Grand Bazaar & Imperial Estate',
      tagline: 'Acquire districts, build merchant stalls, and bankrupt rival barons.',
      minPlayers: 2,
      maxPlayers: 6,
      estimatedMinutes: 45,
      ageRecommendation: '8+',
      difficulty: 'Tactical',
      winCondition: 'bankruptcy',
      winConditionDetails: 'Bankrupt all other players through property rent or reach 2000 Gold first.',
      turnOrder: 'Clockwise',
      sections: [
        { id: 's1', title: 'I. Buying Property', content: 'When landing on an unowned district tile, purchase the title deed for the listed gold price. Collect rent when rivals land on your property!' },
        { id: 's2', title: 'II. Passing Start', content: 'Each complete perimeter lap collecting 200 Gold from the City Vault.' },
        { id: 's3', title: 'III. Dungeon Rules', content: 'Rolling three doubles or landing on Go to Jail sends your token directly to the Dungeon. Roll doubles or pay 50 Gold to leave.' }
      ]
    },
    cards,
    themeTexture: 'parchment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Grand Artisan',
    isFavorite: true,
  };
}

// Helper to generate Custom Grid Template
export function createCustomGridTemplate(rows = 6, cols = 6, isSquare = true): GameProject {
  const tiles: Tile[] = [];
  const palette = PALETTE_PRESETS[0];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      const isAlt = (r + c) % 2 === 0;
      let label = `${r + 1},${c + 1}`;
      let subLabel: string | undefined;
      let icon: string | undefined;
      let actionType: Tile['actionType'] = 'none';

      if (r === 0 && c === 0) {
        label = 'START';
        icon = '🚩';
        actionType = 'safe_zone';
      } else if (r === rows - 1 && c === cols - 1) {
        label = 'GOAL';
        icon = '👑';
        actionType = 'safe_zone';
      } else if ((r + c) % 5 === 0) {
        icon = '📜';
        subLabel = 'CARD';
        actionType = 'draw_card';
      } else if ((r * c) % 7 === 0) {
        icon = '📦';
        subLabel = 'TREASURE';
        actionType = 'gain_gold';
      }

      tiles.push({
        id: `custom-${index}`,
        index,
        row: r,
        col: c,
        label,
        subLabel,
        color: isAlt ? palette.lightTile : palette.darkTile,
        textColor: isAlt ? palette.textColor : '#ffffff',
        icon,
        actionType,
      });
    }
  }

  const pieces: Piece[] = [
    { id: 'c_p1', name: 'Valiant Warrior', icon: '⚔️', playerNumber: 1, color: '#dc2626', currentTileIndex: 0, startTileIndex: 0 },
    { id: 'c_p2', name: 'Mystic Druid', icon: '🧙', playerNumber: 2, color: '#16a34a', currentTileIndex: 0, startTileIndex: 0 },
  ];

  const cards: ArtifactCard[] = [
    {
      id: 'cg_c1',
      deckName: 'Dungeon Encounters',
      title: 'Ancient Relic Found',
      type: 'Treasure',
      icon: '💎',
      rarity: 'rare',
      effectText: 'Gain 50 Gold and advance 2 tiles immediately.',
      flavorText: 'Gleaming runes ignite in the dusty crypt.',
    },
    {
      id: 'cg_c2',
      deckName: 'Dungeon Encounters',
      title: 'Hidden Spike Pit',
      type: 'Curse',
      icon: '💀',
      rarity: 'common',
      effectText: 'Retreat 2 tiles and lose your next action phase.',
      flavorText: 'A false step triggers old iron counterweights.',
    }
  ];

  return {
    id: `proj_custom_${Date.now()}`,
    name: isSquare ? 'Vintage Custom Grid' : 'Custom Rectangular Quest',
    description: `A versatile ${rows}x${cols} board grid with custom hazard tiles, piece tokens, and customizable rule engine.`,
    designType: isSquare ? 'square' : 'rectangular',
    rows,
    cols,
    paletteId: 'vintage_parchment',
    tiles,
    pieces,
    diceConfig: {
      type: 'd6',
      label: 'Adventure Die',
      sidesCount: 6,
      allowReRollOnMax: false,
      modifier: 0,
    },
    ruleEngine: {
      title: 'Custom Realm Adventure',
      tagline: 'Traverse the realm from the Start Gate to the Royal Citadel.',
      minPlayers: 2,
      maxPlayers: 4,
      estimatedMinutes: 20,
      ageRecommendation: '8+',
      difficulty: 'Tactical',
      winCondition: 'first_to_finish',
      winConditionDetails: 'First adventurer to reach the Royal Citadel tile wins the game.',
      turnOrder: 'Clockwise',
      sections: [
        { id: 's1', title: 'I. Journey Objective', content: 'Navigate your champion across the grid from the starting banner to the victory gate.' },
        { id: 's2', title: 'II. Tile Triggers', content: 'Draw encounter cards upon landing on scroll tiles; collect gold bonuses from treasure chests.' }
      ]
    },
    cards,
    themeTexture: 'parchment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Workshop Artisan',
  };
}

export const INITIAL_SAMPLE_PROJECTS: GameProject[] = [
  createChessTemplate(),
  createSnakesAndLaddersTemplate(),
  createLudoTemplate(),
  createMonopolyTemplate(),
];
