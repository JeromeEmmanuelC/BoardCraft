import { GoogleGenAI, Type } from '@google/genai';
import { GameProject, Tile, Piece, ArtifactCard, SnakeOrLadder } from '../src/types';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateGameWithAI(prompt: string): Promise<GameProject> {
  const ai = getGenAI();

  // If no Gemini API key configured, generate a high quality procedural vintage game
  if (!ai) {
    return generateFallbackThematicGame(prompt);
  }

  try {
    const systemPrompt = `You are a master board game architect and vintage ludologist from 1890.
Generate a complete, fully-formed, playable board game specification in JSON matching the exact required schema.
The game must be balanced, imaginative, and evocative with a nostalgic vintage board game aesthetic.
The prompt from the designer is: "${prompt}".

Return a valid JSON object matching the schema. Do not include markdown codeblocks or outer text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a custom board game inspired by: ${prompt}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Evocative game title (e.g. "The Whispering Galleon of 1888")' },
            description: { type: Type.STRING, description: 'Narrative lore and premise of the game' },
            designType: { type: Type.STRING, enum: ['track', 'snakes_ladders', 'square', 'rectangular'] },
            rows: { type: Type.INTEGER, description: 'Number of rows (6 to 10)' },
            cols: { type: Type.INTEGER, description: 'Number of columns (6 to 10)' },
            paletteId: { type: Type.STRING, description: 'e.g. vintage_parchment or classic_birch' },
            ruleEngine: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                tagline: { type: Type.STRING },
                minPlayers: { type: Type.INTEGER },
                maxPlayers: { type: Type.INTEGER },
                estimatedMinutes: { type: Type.INTEGER },
                ageRecommendation: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ['Easy / Family', 'Tactical', 'Grand Strategy', 'Party'] },
                winCondition: { type: Type.STRING, enum: ['first_to_finish', 'elimination', 'wealth_target', 'bankruptcy', 'territory_control', 'custom'] },
                winConditionDetails: { type: Type.STRING },
                turnOrder: { type: Type.STRING, enum: ['Clockwise', 'Initiative Roll', 'Simultaneous'] },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                    },
                    required: ['id', 'title', 'content'],
                  },
                },
              },
              required: ['title', 'tagline', 'winCondition', 'winConditionDetails', 'sections'],
            },
            diceConfig: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['d6', '2d6', 'd8', 'd10', 'd12', 'd20', 'coin'] },
                label: { type: Type.STRING },
                sidesCount: { type: Type.INTEGER },
                modifier: { type: Type.INTEGER },
                allowReRollOnMax: { type: Type.BOOLEAN },
              },
              required: ['type', 'label', 'sidesCount'],
            },
            specialTiles: {
              type: Type.ARRAY,
              description: 'Array of special tiles with indices from 1 to rows*cols - 1',
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER },
                  label: { type: Type.STRING },
                  subLabel: { type: Type.STRING },
                  color: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  actionType: { type: Type.STRING, enum: ['advance', 'retreat', 'draw_card', 'gain_gold', 'lose_gold', 'roll_again', 'lose_turn', 'teleport', 'safe_zone'] },
                  actionValue: { type: Type.STRING },
                },
                required: ['index', 'label', 'actionType'],
              },
            },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  deckName: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['Event', 'Treasure', 'Boon', 'Curse', 'Spell', 'Property Deed', 'Equipment'] },
                  icon: { type: Type.STRING },
                  rarity: { type: Type.STRING, enum: ['common', 'uncommon', 'rare', 'legendary', 'perilous'] },
                  effectText: { type: Type.STRING },
                  flavorText: { type: Type.STRING },
                  goldValue: { type: Type.INTEGER },
                },
                required: ['title', 'deckName', 'type', 'icon', 'rarity', 'effectText'],
              },
            },
          },
          required: ['name', 'description', 'designType', 'rows', 'cols', 'ruleEngine', 'cards'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return assembleCompleteProject(parsed, prompt);
  } catch (err) {
    console.error('Gemini generation error, falling back to procedural generator:', err);
    return generateFallbackThematicGame(prompt);
  }
}

function assembleCompleteProject(data: any, originalPrompt: string): GameProject {
  const rows = Math.min(10, Math.max(5, Number(data.rows) || 8));
  const cols = Math.min(10, Math.max(5, Number(data.cols) || 8));
  const totalTiles = rows * cols;
  const isTrack = data.designType === 'track';

  const tiles: Tile[] = [];
  const specialMap = new Map<number, any>();
  if (Array.isArray(data.specialTiles)) {
    data.specialTiles.forEach((st: any) => {
      if (typeof st.index === 'number') specialMap.set(st.index, st);
    });
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Boustrophedon snake indexing
      const actualCol = r % 2 === 1 ? cols - 1 - c : c;
      const index = r * cols + actualCol;
      const isStart = index === 0;
      const isEnd = index === totalTiles - 1;
      const isLight = (r + c) % 2 === 0;

      const special = specialMap.get(index);

      let label = isStart ? 'START' : isEnd ? 'FINISH' : special?.label || `${index + 1}`;
      let subLabel = special?.subLabel || (isStart ? 'Port of Origin' : isEnd ? 'Final Citadel' : undefined);
      let color = isStart ? '#fef3c7' : isEnd ? '#fef08a' : isLight ? '#faf8f5' : '#e8e2d5';
      let icon = isStart ? '🏁' : isEnd ? '🏆' : special?.icon;
      let actionType = isStart || isEnd ? 'none' : special?.actionType || 'none';
      let actionValue = special?.actionValue;

      if (!special && !isStart && !isEnd) {
        // Random interesting tiles if none specified
        if (index % 7 === 0) {
          actionType = 'gain_gold';
          actionValue = 50;
          icon = '💰';
          label = 'Merchant';
          color = '#fef9c3';
        } else if (index % 11 === 0) {
          actionType = 'draw_card';
          icon = '📜';
          label = 'Codex';
          color = '#f1f5f9';
        } else if (index % 13 === 0) {
          actionType = 'lose_gold';
          actionValue = 30;
          icon = '⚠️';
          label = 'Hazard';
          color = '#fee2e2';
        }
      }

      tiles.push({
        id: `tile_${index}`,
        index,
        row: r,
        col: actualCol,
        label,
        subLabel,
        color,
        textColor: '#1c1917',
        borderColor: '#d6cebe',
        icon,
        actionType,
        actionValue,
      });
    }
  }

  const snakesAndLadders: SnakeOrLadder[] = [];
  if (data.designType === 'snakes_ladders' || totalTiles >= 36) {
    snakesAndLadders.push(
      { id: 'sl_1', fromIndex: 4, toIndex: Math.min(totalTiles - 2, 14), type: 'ladder', color: '#16a34a', label: 'Secret Pass' },
      { id: 'sl_2', fromIndex: 9, toIndex: Math.min(totalTiles - 2, 22), type: 'ladder', color: '#16a34a', label: 'Wind Tunnel' },
      { id: 'sl_3', fromIndex: Math.min(totalTiles - 3, 27), toIndex: 7, type: 'snake', color: '#dc2626', label: 'Quicksand' },
      { id: 'sl_4', fromIndex: Math.min(totalTiles - 2, totalTiles - 6), toIndex: Math.max(1, totalTiles - 18), type: 'snake', color: '#dc2626', label: 'Ambush' }
    );
  }

  const pieces: Piece[] = [
    {
      id: 'piece_1',
      name: 'The Pioneer (P1)',
      icon: '♟️',
      playerNumber: 1,
      color: '#b45309', // Vintage Amber / Brass
      currentTileIndex: 0,
      startTileIndex: 0,
      role: 'Player 1',
    },
    {
      id: 'piece_2',
      name: 'The Navigator (P2)',
      icon: '♞',
      playerNumber: 2,
      color: '#1e3a8a', // Deep Prussian Navy
      currentTileIndex: 0,
      startTileIndex: 0,
      role: 'Player 2',
    },
  ];

  const cards: ArtifactCard[] = Array.isArray(data.cards) && data.cards.length > 0
    ? data.cards.map((c: any, i: number) => ({
        id: `card_${Date.now()}_${i}`,
        deckName: c.deckName || 'Chronicle Deck',
        title: c.title || `Ancient Relic #${i + 1}`,
        type: c.type || 'Event',
        icon: c.icon || '📜',
        rarity: c.rarity || 'uncommon',
        effectText: c.effectText || 'Advance 2 tiles or gain 50 Gold.',
        flavorText: c.flavorText || 'Preserved from bygone expeditions.',
        goldValue: typeof c.goldValue === 'number' ? c.goldValue : 50,
      }))
    : [
        {
          id: 'card_1',
          deckName: 'Vintage Chronicle',
          title: 'Favor of the Guildmaster',
          type: 'Boon',
          icon: '👑',
          rarity: 'rare',
          effectText: 'Roll the dice again and collect 50 gold from the treasury.',
          flavorText: 'A sealed royal letter granting free passage.',
          goldValue: 50,
        },
        {
          id: 'card_2',
          deckName: 'Vintage Chronicle',
          title: 'Fog on the Mooring',
          type: 'Curse',
          icon: '🌫️',
          rarity: 'common',
          effectText: 'Lose 1 turn while navigating through dense marsh mist.',
          flavorText: 'The lanterns cannot pierce the heavy harbor fog.',
        },
        {
          id: 'card_3',
          deckName: 'Vintage Chronicle',
          title: 'Sextant of Antiquity',
          type: 'Treasure',
          icon: '🧭',
          rarity: 'legendary',
          effectText: 'Advance 3 spaces immediately without triggering hazards.',
          flavorText: 'Crafted in brass with etched celestial coordinates.',
          goldValue: 100,
        },
      ];

  const projectId = `proj_ai_${Date.now()}`;
  return {
    id: projectId,
    name: data.name || `The Grand Parlor Expedition: ${originalPrompt}`,
    description: data.description || `A bespoke tabletop game engineered around "${originalPrompt}". Designed with nostalgic tactile elegance and balanced 2-player mechanics.`,
    designType: data.designType || 'square',
    rows,
    cols,
    paletteId: data.paletteId || 'vintage_parchment',
    tiles,
    snakesAndLadders,
    pieces,
    diceConfig: {
      type: data.diceConfig?.type || 'd6',
      label: data.diceConfig?.label || 'Classic Ivory D6',
      sidesCount: data.diceConfig?.sidesCount || 6,
      modifier: data.diceConfig?.modifier || 0,
      allowReRollOnMax: data.diceConfig?.allowReRollOnMax ?? true,
    },
    ruleEngine: {
      title: data.ruleEngine?.title || data.name || 'Rules of the Realm',
      tagline: data.ruleEngine?.tagline || 'A contest of wit, fortune, and perseverance',
      minPlayers: 2,
      maxPlayers: 2,
      estimatedMinutes: data.ruleEngine?.estimatedMinutes || 20,
      ageRecommendation: '8+',
      difficulty: data.ruleEngine?.difficulty || 'Tactical',
      winCondition: data.ruleEngine?.winCondition || 'first_to_finish',
      winConditionDetails: data.ruleEngine?.winConditionDetails || 'First player to reach the final tile or accumulate the target wealth wins the championship.',
      turnOrder: 'Clockwise',
      sections: data.ruleEngine?.sections || [
        {
          id: 'sec_1',
          title: 'Rule I: Turn Sequence',
          content: 'Players alternate turns. On your turn, roll the consecrated die, advance your pawn, and resolve any tile actions, boons, or hazards.',
        },
        {
          id: 'sec_2',
          title: 'Rule II: Special Tiles & Passages',
          content: 'Secret passages and ladders launch pawns forward. Hazards and ambushes send pawns backward.',
        },
        {
          id: 'sec_3',
          title: 'Rule III: Victory & Triumph',
          content: 'The first player to land upon the Citadel space triumphs and is crowned the Sovereign Champion.',
        },
      ],
    },
    cards,
    themeTexture: 'parchment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'AI Ludology Engine',
  };
}

function generateFallbackThematicGame(prompt: string): GameProject {
  const p = prompt.toLowerCase();
  let title = 'The Victorian Gentleman’s Expedition';
  let desc = 'A nostalgic 1890s transatlantic race from the cobblestones of London to the grand exhibits of Paris.';
  let type: 'square' | 'snakes_ladders' | 'track' = 'snakes_ladders';

  if (p.includes('space') || p.includes('star') || p.includes('sci-fi')) {
    title = 'Voyage of the Brass Starship (1899)';
    desc = 'Retro-futuristic celestial race through asteroid belts and clockwork orbital stations.';
  } else if (p.includes('pirate') || p.includes('sea') || p.includes('ship') || p.includes('ocean')) {
    title = 'Isle of Lost Doubloons';
    desc = 'A perilous seafaring navigational contest past kraken trenches and hidden coral bays.';
  } else if (p.includes('detective') || p.includes('mystery') || p.includes('noir') || p.includes('crime')) {
    title = 'Baker Street Gaslight Clues';
    desc = 'A cerebral race across foggy Victorian alleys gathering evidence and unmasking the criminal mastermind.';
    type = 'square';
  } else if (p.includes('monopoly') || p.includes('trade') || p.includes('wealth') || p.includes('money')) {
    title = 'Merchant Guilds of Venice';
    desc = 'A strategic race of commerce, toll plazas, and cargo contracts along the grand canal.';
    type = 'track';
  }

  return assembleCompleteProject(
    {
      name: title,
      description: desc,
      designType: type,
      rows: 8,
      cols: 8,
      ruleEngine: {
        title: `${title} - Codex`,
        tagline: 'A nostalgic two-player tabletop duel',
        winCondition: 'first_to_finish',
        winConditionDetails: 'First adventurer to reach the final sanctuary or claim the central treasure wins.',
        sections: [
          { id: 's1', title: 'Chapter 1: The Initiative', content: 'Player 1 rolls first. On every turn, players roll the die and advance.' },
          { id: 's2', title: 'Chapter 2: Treasures & Hazards', content: 'Treasure tiles yield gold; hazard tiles force a tax or push the adventurer back.' },
        ],
      },
    },
    prompt
  );
}
