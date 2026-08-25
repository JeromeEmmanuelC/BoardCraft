export type BoardDesignType = 'square' | 'rectangular' | 'track' | 'ludo' | 'snakes_ladders';

export type TileActionType = 
  | 'none'
  | 'advance'
  | 'retreat'
  | 'draw_card'
  | 'gain_gold'
  | 'lose_gold'
  | 'roll_again'
  | 'lose_turn'
  | 'teleport'
  | 'safe_zone'
  | 'jail';

export interface Tile {
  id: string;
  index: number;
  row: number;
  col: number;
  label?: string;
  subLabel?: string;
  color: string;
  textColor?: string;
  borderColor?: string;
  icon?: string;
  actionType?: TileActionType;
  actionValue?: number | string;
  district?: string; // For monopoly style groups
  price?: number;
  rent?: number;
  isCorner?: boolean;
}

export interface SnakeOrLadder {
  id: string;
  fromIndex: number;
  toIndex: number;
  type: 'snake' | 'ladder';
  color?: string;
  label?: string;
}

export interface Piece {
  id: string;
  name: string;
  icon: string;
  playerNumber: number;
  color: string;
  currentTileIndex: number;
  startTileIndex: number;
  movementType?: 'step' | 'diagonal' | 'straight' | 'any';
  maxRange?: number;
  role?: string;
  isCaptured?: boolean;
}

export type DiceType = 'd6' | '2d6' | 'd4' | 'd8' | 'd10' | 'd12' | 'd20' | 'spinner' | 'coin';

export interface DiceConfig {
  type: DiceType;
  label: string;
  sidesCount: number;
  allowReRollOnMax: boolean;
  doublesRule?: boolean;
  customFaces?: string[];
  modifier: number;
}

export type WinConditionType = 
  | 'first_to_finish' 
  | 'elimination' 
  | 'wealth_target' 
  | 'bankruptcy' 
  | 'territory_control' 
  | 'custom';

export interface RuleSection {
  id: string;
  title: string;
  content: string;
}

export interface RuleEngineConfig {
  title: string;
  tagline: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedMinutes: number;
  ageRecommendation: string;
  difficulty: 'Easy / Family' | 'Tactical' | 'Grand Strategy' | 'Party';
  winCondition: WinConditionType;
  winConditionDetails: string;
  turnOrder: 'Clockwise' | 'Initiative Roll' | 'Simultaneous';
  sections: RuleSection[];
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'perilous';

export interface ArtifactCard {
  id: string;
  deckName: string;
  title: string;
  type: 'Event' | 'Treasure' | 'Boon' | 'Curse' | 'Spell' | 'Property Deed' | 'Equipment';
  icon: string;
  rarity: CardRarity;
  effectText: string;
  flavorText?: string;
  cost?: number;
  goldValue?: number;
  borderTheme?: string;
}

export interface PalettePreset {
  id: string;
  name: string;
  description: string;
  lightTile: string;
  darkTile: string;
  accent: string;
  boardBg: string;
  gridBorder: string;
  textColor: string;
}

export interface GameProject {
  id: string;
  name: string;
  description: string;
  designType: BoardDesignType;
  templateId?: string;
  rows: number;
  cols: number;
  trackLength?: number;
  paletteId: string;
  customPalette?: {
    lightTile: string;
    darkTile: string;
    accent: string;
    boardBg: string;
    gridBorder: string;
    textColor: string;
  };
  tiles: Tile[];
  snakesAndLadders?: SnakeOrLadder[];
  pieces: Piece[];
  diceConfig: DiceConfig;
  ruleEngine: RuleEngineConfig;
  cards: ArtifactCard[];
  themeTexture: 'parchment' | 'dark_walnut' | 'royal_velvet' | 'stone' | 'leather';
  createdAt: string;
  updatedAt: string;
  author: string;
  isFavorite?: boolean;
}

export type StudioStep = 'layout' | 'aesthetics' | 'color' | 'pieces' | 'dice' | 'rules' | 'artifacts';

export interface UserProfile {
  id: string;
  username: string;
  title: string;
  avatarIcon: string;
  guildRank: string;
  joinedDate: string;
}
