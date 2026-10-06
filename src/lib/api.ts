import { GameProject, UserProfile, GameRoom } from '../types';

export const api = {
  async fetchBoards(): Promise<GameProject[]> {
    try {
      const res = await fetch('/api/boards');
      if (!res.ok) throw new Error('Failed to fetch boards');
      return await res.json();
    } catch (e) {
      console.warn('Backend boards fetch fallback:', e);
      return [];
    }
  },

  async saveBoard(board: GameProject): Promise<GameProject> {
    try {
      const res = await fetch(`/api/boards/${board.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(board),
      });
      if (res.status === 404) {
        // Create instead
        const createRes = await fetch('/api/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(board),
        });
        if (!createRes.ok) throw new Error('Failed to create board on server');
        return await createRes.json();
      }
      if (!res.ok) throw new Error('Failed to update board');
      return await res.json();
    } catch (e) {
      console.warn('Save board backend fallback:', e);
      return board;
    }
  },

  async deleteBoard(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/boards/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('Delete board error:', e);
      return true;
    }
  },

  async login(username: string, email?: string): Promise<UserProfile> {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },

  async generateGameAI(prompt: string): Promise<GameProject> {
    const res = await fetch('/api/ai/generate-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate game via AI.');
    }
    return await res.json();
  },

  async createRoom(boardId: string, hostName: string, hostId?: string): Promise<{ roomId: string; room: GameRoom }> {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId, hostName, hostId }),
    });
    if (!res.ok) throw new Error('Failed to create room');
    return await res.json();
  },

  async getRoom(roomId: string): Promise<GameRoom> {
    const res = await fetch(`/api/rooms/${roomId}`);
    if (!res.ok) throw new Error('Room not found');
    return await res.json();
  },

  async joinRoom(roomId: string, playerName: string, playerId?: string): Promise<{ room: GameRoom; player: any }> {
    const res = await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, playerId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to join game room.');
    }
    return await res.json();
  },

  async sendRoomAction(roomId: string, action: 'roll' | 'reset' | 'chat', playerId: string, text?: string): Promise<{ room: GameRoom; error?: string }> {
    const res = await fetch(`/api/rooms/${roomId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, playerId, text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to execute game action.');
    }
    return await res.json();
  },

  createRoomWebSocket(
    roomId: string,
    playerId: string,
    onRoomUpdate: (room: GameRoom) => void,
    onError?: (msg: string) => void
  ): { ws: WebSocket; send: (msg: any) => void; close: () => void } {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join_room', roomId, playerId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'room_state_updated' && data.room) {
          onRoomUpdate(data.room);
          if (data.error && onError) {
            onError(data.error);
          }
        }
      } catch (err) {
        console.error('Error handling WS event:', err);
      }
    };

    ws.onerror = (err) => {
      console.warn('WebSocket warning/error:', err);
      if (onError) onError('Connection warning. Retrying...');
    };

    return {
      ws,
      send: (msg: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ ...msg, roomId, playerId }));
        }
      },
      close: () => {
        try {
          ws.close();
        } catch (_) {}
      },
    };
  },
};
