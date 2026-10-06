import { GameRoom, RoomPlayer, GameProject, GameLogEntry, ArtifactCard } from '../src/types';
import { storage } from './storage';

// In-memory active game rooms
const rooms = new Map<string, GameRoom>();

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RLM-${code}`;
}

export const roomManager = {
  createRoom(boardId: string, hostName: string, hostId?: string): GameRoom {
    const board = storage.getBoardById(boardId) || storage.getAllBoards()[0];
    const roomId = generateRoomId();

    const hostPlayer: RoomPlayer = {
      id: hostId || `p1_${Date.now()}`,
      name: hostName || 'Player 1 (Host)',
      playerNumber: 1,
      color: board.pieces[0]?.color || '#b45309',
      icon: board.pieces[0]?.icon || '♟️',
      currentTileIndex: board.pieces[0]?.startTileIndex || 0,
      gold: 100,
      inventoryCards: [],
      isHost: true,
      isConnected: true,
    };

    const room: GameRoom = {
      id: roomId,
      board,
      hostId: hostPlayer.id,
      createdAt: new Date().toISOString(),
      status: 'waiting',
      players: [hostPlayer],
      currentTurnPlayerNumber: 1,
      lastRoll: null,
      lastActionSummary: 'Room initialized. Waiting for Player 2 to enter through the parlor door.',
      winner: null,
      history: [
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Room created by ${hostPlayer.name}. Game ready for 2-player match.`,
          type: 'system',
        },
      ],
    };

    rooms.set(roomId, room);
    return room;
  },

  getRoom(roomId: string): GameRoom | undefined {
    return rooms.get(roomId);
  },

  joinRoom(roomId: string, playerName: string, playerId?: string): { room: GameRoom; player: RoomPlayer } | { error: string } {
    const room = rooms.get(roomId);
    if (!room) {
      return { error: 'Game room not found.' };
    }

    // Check if player is rejoining
    const existingPlayer = room.players.find((p) => p.id === playerId || (p.name.toLowerCase() === playerName.toLowerCase() && p.playerNumber === 2));
    if (existingPlayer) {
      existingPlayer.isConnected = true;
      return { room, player: existingPlayer };
    }

    // Check if room is full
    if (room.players.length >= 2) {
      return { error: 'Room is already full with 2 players.' };
    }

    const p2Piece = room.board.pieces[1] || {
      color: '#1e3a8a',
      icon: '♞',
      startTileIndex: 0,
    };

    const guestPlayer: RoomPlayer = {
      id: playerId || `p2_${Date.now()}`,
      name: playerName || 'Player 2 (Guest)',
      playerNumber: 2,
      color: p2Piece.color || '#1e3a8a',
      icon: p2Piece.icon || '♞',
      currentTileIndex: p2Piece.startTileIndex || 0,
      gold: 100,
      inventoryCards: [],
      isHost: false,
      isConnected: true,
    };

    room.players.push(guestPlayer);
    room.status = 'in_progress';
    room.history.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `${guestPlayer.name} has joined the game! The duel begins. It is ${room.players[0].name}'s turn.`,
      type: 'event',
    });

    return { room, player: guestPlayer };
  },

  setPlayerConnection(roomId: string, playerId: string, isConnected: boolean): GameRoom | null {
    const room = rooms.get(roomId);
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.isConnected = isConnected;
    }
    return room;
  },

  rollAndMove(roomId: string, playerId: string): { room: GameRoom; error?: string } {
    const room = rooms.get(roomId);
    if (!room) return { room: {} as any, error: 'Room not found' };

    if (room.status === 'completed') {
      return { room, error: 'Game has already concluded.' };
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      return { room, error: 'Player not recognized in this room.' };
    }

    if (player.playerNumber !== room.currentTurnPlayerNumber) {
      return { room, error: `It is not your turn. Waiting for Player ${room.currentTurnPlayerNumber}.` };
    }

    // Roll dice based on board dice configuration
    const dice = room.board.diceConfig;
    let roll = 1;
    if (dice.type === '2d6') {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      roll = d1 + d2 + (dice.modifier || 0);
    } else if (dice.type === 'coin') {
      roll = Math.random() > 0.5 ? 2 : 1;
    } else {
      const sides = dice.sidesCount || 6;
      roll = Math.floor(Math.random() * sides) + 1 + (dice.modifier || 0);
    }

    room.lastRoll = roll;

    // Movement calculation
    const totalTiles = room.board.tiles.length;
    const maxIndex = totalTiles > 0 ? totalTiles - 1 : 63;
    let targetIndex = player.currentTileIndex + roll;

    let logNarrative = `${player.name} rolled a ${roll}`;

    if (targetIndex > maxIndex) {
      if (room.board.designType === 'track') {
        targetIndex = targetIndex % totalTiles;
        player.gold += 200;
        logNarrative += ` and completed a circuit around the track (+200 Gold)!`;
      } else {
        targetIndex = maxIndex - (targetIndex - maxIndex);
        logNarrative += ` (overshot goal, rebounded to Tile #${targetIndex + 1})`;
      }
    } else {
      logNarrative += ` and advanced to Tile #${targetIndex + 1}`;
    }

    // Check Snakes or Ladders
    const sl = (room.board.snakesAndLadders || []).find((s) => s.fromIndex === targetIndex);
    if (sl) {
      if (sl.type === 'ladder') {
        logNarrative += ` 🪜 Took ladder to Tile #${sl.toIndex + 1}!`;
      } else {
        logNarrative += ` 🐍 Slid down serpent to Tile #${sl.toIndex + 1}!`;
      }
      targetIndex = sl.toIndex;
    }

    // Update position
    player.currentTileIndex = targetIndex;

    // Check Tile Action Triggers
    const landedTile = room.board.tiles.find((t) => t.index === targetIndex);
    let keepTurn = false;

    if (landedTile) {
      if (landedTile.actionType === 'gain_gold') {
        const amt = Number(landedTile.actionValue) || 50;
        player.gold += amt;
        logNarrative += ` 💰 Landed on Merchant: +${amt} Gold!`;
      } else if (landedTile.actionType === 'lose_gold') {
        const amt = Number(landedTile.actionValue) || 30;
        player.gold = Math.max(0, player.gold - amt);
        logNarrative += ` 💸 Landed on Tax: -${amt} Gold!`;
      } else if (landedTile.actionType === 'draw_card' && room.board.cards.length > 0) {
        const card = room.board.cards[Math.floor(Math.random() * room.board.cards.length)];
        player.inventoryCards.push(card);
        if (card.goldValue) player.gold += card.goldValue;
        logNarrative += ` 📜 Drew Artifact: "${card.title}" (${card.effectText})!`;
      } else if (landedTile.actionType === 'roll_again') {
        keepTurn = true;
        logNarrative += ` 🎲 Lucky roll! Roll again granted.`;
      }
    }

    room.lastActionSummary = logNarrative;
    room.history.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: logNarrative,
      playerNumber: player.playerNumber,
      type: 'move',
    });

    // Check Win Conditions
    const rule = room.board.ruleEngine;
    let hasWon = false;
    let winReason = '';

    if (rule.winCondition === 'wealth_target' && player.gold >= 500) {
      hasWon = true;
      winReason = `Amassed ${player.gold} Gold, exceeding the treasury target!`;
    } else if (targetIndex >= maxIndex) {
      hasWon = true;
      winReason = `Reached the Final Destination (Tile #${maxIndex + 1}) first!`;
    }

    if (hasWon) {
      room.status = 'completed';
      room.winner = {
        playerNumber: player.playerNumber,
        name: player.name,
        reason: winReason,
      };
      room.history.unshift({
        id: `log_win_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `🏆 VICTORY! ${player.name} triumphs! ${winReason}`,
        type: 'victory',
      });
    } else if (!keepTurn) {
      // Switch turn to opposing player
      room.currentTurnPlayerNumber = player.playerNumber === 1 ? 2 : 1;
    }

    return { room };
  },

  addChatMessage(roomId: string, playerId: string, text: string): GameRoom | null {
    const room = rooms.get(roomId);
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return null;

    room.history.unshift({
      id: `msg_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `${player.name}: "${text}"`,
      playerNumber: player.playerNumber,
      type: 'chat',
    });
    return room;
  },

  resetGame(roomId: string): GameRoom | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    room.players.forEach((p) => {
      p.currentTileIndex = 0;
      p.gold = 100;
      p.inventoryCards = [];
    });

    room.status = room.players.length === 2 ? 'in_progress' : 'waiting';
    room.currentTurnPlayerNumber = 1;
    room.lastRoll = null;
    room.lastActionSummary = 'Rematch initialized. Pawns placed at the Port of Origin.';
    room.winner = null;
    room.history.unshift({
      id: `log_reset_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Game has been reset for a fresh match!',
      type: 'system',
    });

    return room;
  },
};
