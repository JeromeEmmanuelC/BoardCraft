import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { storage } from './server/storage';
import { roomManager } from './server/rooms';
import { generateGameWithAI } from './server/gemini';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // WebSocket Server for Real-Time 2-Player Multiplayer
  const wss = new WebSocketServer({ server });

  // Map tracking socket connections: socket -> { roomId, playerId }
  const socketMeta = new Map<WebSocket, { roomId: string; playerId: string }>();

  function broadcastToRoom(roomId: string, message: any) {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const meta = socketMeta.get(client);
        if (meta && meta.roomId === roomId) {
          client.send(data);
        }
      }
    });
  }

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        const { type, roomId, playerId, playerName, text } = msg;

        if (type === 'join_room') {
          socketMeta.set(ws, { roomId, playerId });
          roomManager.setPlayerConnection(roomId, playerId, true);
          const room = roomManager.getRoom(roomId);
          if (room) {
            broadcastToRoom(roomId, { type: 'room_state_updated', room });
          }
        } else if (type === 'roll_dice') {
          const result = roomManager.rollAndMove(roomId, playerId);
          broadcastToRoom(roomId, {
            type: 'room_state_updated',
            room: result.room,
            error: result.error,
          });
        } else if (type === 'send_chat') {
          const room = roomManager.addChatMessage(roomId, playerId, text);
          if (room) {
            broadcastToRoom(roomId, { type: 'room_state_updated', room });
          }
        } else if (type === 'reset_game') {
          const room = roomManager.resetGame(roomId);
          if (room) {
            broadcastToRoom(roomId, { type: 'room_state_updated', room });
          }
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      const meta = socketMeta.get(ws);
      if (meta) {
        roomManager.setPlayerConnection(meta.roomId, meta.playerId, false);
        const room = roomManager.getRoom(meta.roomId);
        if (room) {
          broadcastToRoom(meta.roomId, { type: 'room_state_updated', room });
        }
        socketMeta.delete(ws);
      }
    });
  });

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Boards API
  app.get('/api/boards', (req, res) => {
    const boards = storage.getAllBoards();
    res.json(boards);
  });

  app.get('/api/boards/:id', (req, res) => {
    const board = storage.getBoardById(req.params.id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.json(board);
  });

  app.post('/api/boards', (req, res) => {
    const newBoard = storage.createBoard(req.body);
    res.status(201).json(newBoard);
  });

  app.put('/api/boards/:id', (req, res) => {
    const updated = storage.updateBoard(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.json(updated);
  });

  app.delete('/api/boards/:id', (req, res) => {
    const deleted = storage.deleteBoard(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.json({ success: true });
  });

  // Users API
  app.get('/api/users', (req, res) => {
    res.json(storage.getAllUsers());
  });

  app.post('/api/users/login', (req, res) => {
    const { username, email } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const user = storage.findOrCreateUser(username, email);
    res.json(user);
  });

  // AI Game Creator API
  app.post('/api/ai/generate-game', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required for AI game generation.' });
    }

    try {
      const generatedProject = await generateGameWithAI(prompt);
      // Auto-save to persistent storage so it's instantly available
      storage.createBoard(generatedProject);
      res.json(generatedProject);
    } catch (err: any) {
      console.error('AI Generation error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate board game.' });
    }
  });

  // 2-Player Game Rooms API
  app.post('/api/rooms/create', (req, res) => {
    const { boardId, hostName, hostId } = req.body;
    const room = roomManager.createRoom(boardId, hostName, hostId);
    res.json({ roomId: room.id, room });
  });

  app.get('/api/rooms/:id', (req, res) => {
    const room = roomManager.getRoom(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  });

  app.post('/api/rooms/:id/join', (req, res) => {
    const { playerName, playerId } = req.body;
    const result = roomManager.joinRoom(req.params.id, playerName, playerId);
    if ('error' in result) {
      return res.status(400).json({ error: result.error });
    }
    broadcastToRoom(req.params.id, { type: 'room_state_updated', room: result.room });
    res.json(result);
  });

  app.post('/api/rooms/:id/action', (req, res) => {
    const { action, playerId, text } = req.body;
    const roomId = req.params.id;

    if (action === 'roll') {
      const result = roomManager.rollAndMove(roomId, playerId);
      broadcastToRoom(roomId, { type: 'room_state_updated', room: result.room, error: result.error });
      return res.json(result);
    } else if (action === 'chat') {
      const room = roomManager.addChatMessage(roomId, playerId, text);
      if (!room) return res.status(404).json({ error: 'Room or player not found' });
      broadcastToRoom(roomId, { type: 'room_state_updated', room });
      return res.json({ room });
    } else if (action === 'reset') {
      const room = roomManager.resetGame(roomId);
      if (!room) return res.status(404).json({ error: 'Room not found' });
      broadcastToRoom(roomId, { type: 'room_state_updated', room });
      return res.json({ room });
    }

    res.status(400).json({ error: 'Unknown action' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`BoardCraft Parlor Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
