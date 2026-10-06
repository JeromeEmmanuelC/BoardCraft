import fs from 'fs';
import path from 'path';
import { GameProject, UserProfile } from '../src/types';
import { INITIAL_SAMPLE_PROJECTS } from '../src/data/templates';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOARDS_FILE = path.join(DATA_DIR, 'boards.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

// In-memory caches initialized from files or defaults
let boardsCache: GameProject[] = [];
let usersCache: UserProfile[] = [];

// Load boards
try {
  if (fs.existsSync(BOARDS_FILE)) {
    const raw = fs.readFileSync(BOARDS_FILE, 'utf-8');
    boardsCache = JSON.parse(raw);
  } else {
    boardsCache = [...INITIAL_SAMPLE_PROJECTS];
    fs.writeFileSync(BOARDS_FILE, JSON.stringify(boardsCache, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Failed to read boards.json, using defaults:', e);
  boardsCache = [...INITIAL_SAMPLE_PROJECTS];
}

// Load users
try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    usersCache = JSON.parse(raw);
  } else {
    usersCache = [
      {
        id: 'artisan_default',
        username: 'Alden the Gamecrafter',
        email: 'alden@boardcraft.guild',
        guildRank: 'Master Artisan',
        avatarIcon: '👑',
        title: 'Keeper of the Ancient Boards',
        joinedDate: new Date().toISOString(),
      },
      {
        id: 'player_two_guest',
        username: 'Rowan the Challenger',
        email: 'rowan@boardcraft.guild',
        guildRank: 'Journeyman Duelist',
        avatarIcon: '⚔️',
        title: 'Wayfarer of the Checkered Plains',
        joinedDate: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Failed to read users.json, using defaults:', e);
}

function persistBoards() {
  try {
    fs.writeFileSync(BOARDS_FILE, JSON.stringify(boardsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist boards to file:', err);
  }
}

function persistUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist users to file:', err);
  }
}

export const storage = {
  // Boards
  getAllBoards(): GameProject[] {
    return boardsCache;
  },

  getBoardById(id: string): GameProject | undefined {
    return boardsCache.find((b) => b.id === id);
  },

  createBoard(board: GameProject): GameProject {
    const existingIndex = boardsCache.findIndex((b) => b.id === board.id);
    if (existingIndex >= 0) {
      boardsCache[existingIndex] = board;
    } else {
      boardsCache.unshift(board);
    }
    persistBoards();
    return board;
  },

  updateBoard(id: string, updates: Partial<GameProject>): GameProject | null {
    const idx = boardsCache.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    boardsCache[idx] = {
      ...boardsCache[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    persistBoards();
    return boardsCache[idx];
  },

  deleteBoard(id: string): boolean {
    const initialLen = boardsCache.length;
    boardsCache = boardsCache.filter((b) => b.id !== id);
    if (boardsCache.length < initialLen) {
      persistBoards();
      return true;
    }
    return false;
  },

  // Users
  getAllUsers(): UserProfile[] {
    return usersCache;
  },

  getUserById(id: string): UserProfile | undefined {
    return usersCache.find((u) => u.id === id);
  },

  findOrCreateUser(username: string, email?: string): UserProfile {
    const trimmed = username.trim();
    let existing = usersCache.find(
      (u) => u.username.toLowerCase() === trimmed.toLowerCase() || (email && u.email?.toLowerCase() === email.toLowerCase())
    );

    if (existing) {
      return existing;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: trimmed || 'Wayfarer Traveler',
      email: email || `${trimmed.toLowerCase().replace(/\s+/g, '')}@parlor.game`,
      guildRank: 'Guild Apprentice',
      avatarIcon: ['🎲', '♟️', '👑', '⚔️', '🛡️', '🪙', '📜', '🧭'][Math.floor(Math.random() * 8)],
      title: 'Artisan Apprentice',
      joinedDate: new Date().toISOString(),
    };

    usersCache.push(newUser);
    persistUsers();
    return newUser;
  },
};
