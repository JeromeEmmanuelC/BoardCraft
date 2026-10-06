import React, { useState, useEffect, useRef } from 'react';
import { GameProject, GameRoom, RoomPlayer, ArtifactCard } from '../../types';
import { api } from '../../lib/api';
import { BoardCanvas } from '../Studio/BoardCanvas';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Dices, 
  RotateCcw, 
  UserCheck, 
  Users, 
  Trophy, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Crown, 
  Coins, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TwoPlayerGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: GameProject;
  initialRoomId?: string;
  currentPlayerName: string;
  currentPlayerId: string;
}

export const TwoPlayerGameModal: React.FC<TwoPlayerGameModalProps> = ({
  isOpen,
  onClose,
  project,
  initialRoomId,
  currentPlayerName,
  currentPlayerId,
}) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [activeCardView, setActiveCardView] = useState<ArtifactCard | null>(null);

  const wsRef = useRef<{ ws: WebSocket; send: (msg: any) => void; close: () => void } | null>(null);

  // Initialize or join room
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function setupRoom() {
      try {
        let currentRoom: GameRoom;

        if (initialRoomId) {
          // Join existing room
          try {
            const joinResult = await api.joinRoom(initialRoomId, currentPlayerName, currentPlayerId);
            currentRoom = joinResult.room;
          } catch (e: any) {
            // If already inside or error, try to fetch room
            currentRoom = await api.getRoom(initialRoomId);
          }
        } else if (project) {
          // Create new room for current board
          const createResult = await api.createRoom(project.id, currentPlayerName, currentPlayerId);
          currentRoom = createResult.room;
        } else {
          throw new Error('No board or room ID specified.');
        }

        if (!isMounted) return;
        setRoom(currentRoom);
        setLoading(false);

        // Connect WebSocket for live sync
        const socket = api.createRoomWebSocket(
          currentRoom.id,
          currentPlayerId,
          (updatedRoom) => {
            if (isMounted) {
              setRoom(updatedRoom);
              if (updatedRoom.status === 'completed' && updatedRoom.winner) {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#b45309', '#1e3a8a', '#d97706', '#fef08a'],
                });
              }
            }
          },
          (errText) => {
            console.warn('Socket notice:', errText);
          }
        );

        wsRef.current = socket;
      } catch (err: any) {
        console.error('Room setup error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to initialize 2-player parlor room.');
          setLoading(false);
        }
      }
    }

    setupRoom();

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, initialRoomId, project?.id]);

  if (!isOpen) return null;

  const currentBoard = room?.board || project;
  const p1 = room?.players.find((p) => p.playerNumber === 1);
  const p2 = room?.players.find((p) => p.playerNumber === 2);
  const me = room?.players.find((p) => p.id === currentPlayerId) || (room?.players[0]?.id === currentPlayerId ? room?.players[0] : room?.players[1]);
  const isMyTurn = me && room?.status === 'in_progress' && room?.currentTurnPlayerNumber === me.playerNumber;

  const shareUrl = room ? `${window.location.origin}?game=${room.id}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Play ${currentBoard?.name} with me on BoardCraft!`,
          text: `Join my 2-player board game duel!`,
          url: shareUrl,
        });
      } catch (e) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRollDice = async () => {
    if (!room || !me || !isMyTurn || isRolling || room.status === 'completed') return;
    setIsRolling(true);

    // Send action via WebSocket or REST fallback
    if (wsRef.current) {
      wsRef.current.send({ type: 'roll_dice', roomId: room.id, playerId: me.id });
    } else {
      try {
        const res = await api.sendRoomAction(room.id, 'roll', me.id);
        if (res.room) setRoom(res.room);
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => setIsRolling(false), 700);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !room || !me) return;

    if (wsRef.current) {
      wsRef.current.send({ type: 'send_chat', roomId: room.id, playerId: me.id, text: chatInput.trim() });
    } else {
      api.sendRoomAction(room.id, 'chat', me.id, chatInput.trim()).then((res) => {
        if (res.room) setRoom(res.room);
      });
    }
    setChatInput('');
  };

  const handleResetGame = () => {
    if (!room) return;
    if (wsRef.current) {
      wsRef.current.send({ type: 'reset_game', roomId: room.id, playerId: me?.id });
    } else {
      api.sendRoomAction(room.id, 'reset', me?.id || '').then((res) => {
        if (res.room) setRoom(res.room);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div 
        id="two_player_game_modal"
        className="relative w-full max-w-6xl max-h-[95vh] flex flex-col bg-[#fbf9f5] border border-stone-300 rounded-xl shadow-2xl overflow-hidden text-stone-900"
      >
        {/* Vintage Letterpress Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-300 bg-[#f4eee3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center font-display text-lg shadow-xs">
              <Dices className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold tracking-tight text-stone-900">
                  {currentBoard?.name || 'Grand Tabletop Duel'}
                </h2>
                {room && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-200/80 text-stone-700 font-semibold border border-stone-300">
                    Room {room.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Authoritative 2-Player Game Server & Rule Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Invite Button */}
            {room && (
              <button
                id="btn_share_game_link"
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 text-xs font-semibold tracking-wide shadow-xs transition-colors"
                title="Share Game Invitation Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Invite Player'}</span>
              </button>
            )}

            <button
              id="btn_close_two_player_game"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-300/60 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin" />
            <p className="font-serif text-stone-700 text-sm">Setting up tabletop parlor room...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-red-50 text-red-700 rounded-full border border-red-200">
              <X className="w-6 h-6" />
            </div>
            <p className="font-serif text-red-800 font-semibold">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold"
            >
              Return to Workshop
            </button>
          </div>
        )}

        {/* Main 2-Player Game Interface */}
        {!loading && !error && room && currentBoard && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left/Center: Interactive Board View */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center bg-[#faf7f2]">
              
              {/* Share Banner when waiting for Player 2 */}
              {room.status === 'waiting' && (
                <div className="w-full max-w-2xl mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-amber-950">
                        Waiting for Player 2 to join...
                      </h4>
                      <p className="text-xs text-amber-800">
                        Send this private match link to your friend or open it in another window.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="text-xs font-mono bg-white border border-amber-300 rounded px-2.5 py-1.5 w-full sm:w-56 text-stone-700 select-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 bg-amber-800 text-amber-50 hover:bg-amber-900 rounded text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Turn Banner */}
              <div className="w-full max-w-2xl mb-3 flex items-center justify-between px-4 py-2.5 rounded-lg border border-stone-200 bg-white shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    {room.status === 'completed' ? 'Game Concluded' : 'Turn Status'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-serif text-sm font-bold">
                  {room.status === 'completed' ? (
                    <span className="text-amber-700 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      {room.winner?.name} Victorious!
                    </span>
                  ) : isMyTurn ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      Your Turn! Cast the Die
                    </span>
                  ) : (
                    <span className="text-stone-600 font-medium">
                      Waiting for {room.players.find(p => p.playerNumber === room.currentTurnPlayerNumber)?.name || 'opponent'} to roll...
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-stone-500">
                  {currentBoard.diceConfig.label} ({currentBoard.diceConfig.type.toUpperCase()})
                </div>
              </div>

              {/* Board Canvas with authoritative piece coordinates */}
              <div className="w-full max-w-2xl aspect-square flex items-center justify-center rounded-xl bg-white border border-stone-300 shadow-sm p-2 sm:p-4 overflow-hidden">
                <BoardCanvas
                  project={{
                    ...currentBoard,
                    pieces: [
                      {
                        id: 'p1_live',
                        name: p1?.name || 'Player 1',
                        icon: p1?.icon || '♟️',
                        playerNumber: 1,
                        color: p1?.color || '#b45309',
                        currentTileIndex: p1?.currentTileIndex || 0,
                        startTileIndex: 0,
                      },
                      ...(p2
                        ? [
                            {
                              id: 'p2_live',
                              name: p2.name,
                              icon: p2.icon || '♞',
                              playerNumber: 2,
                              color: p2.color || '#1e3a8a',
                              currentTileIndex: p2.currentTileIndex,
                              startTileIndex: 0,
                            },
                          ]
                        : []),
                    ],
                  }}
                  previewPiecePositions={{
                    ...(p1 ? { p1_live: p1.currentTileIndex } : {}),
                    ...(p2 ? { p2_live: p2.currentTileIndex } : {}),
                  }}
                  selectedTileIndex={null}
                  onTileClick={() => {}}
                />
              </div>

              {/* Bottom Roll & Action Controls */}
              <div className="w-full max-w-2xl mt-4 flex items-center justify-between gap-4 p-3 rounded-xl bg-white border border-stone-300 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-900 text-stone-50 border border-stone-700 flex items-center justify-center font-display text-2xl font-bold shadow-xs">
                    {room.lastRoll !== null ? room.lastRoll : '-'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">
                      {room.lastRoll !== null ? `Rolled a ${room.lastRoll}` : 'Die at rest'}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 max-w-xs">
                      {room.lastActionSummary || 'Ready to roll.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {room.status === 'completed' ? (
                    <button
                      id="btn_rematch_game"
                      onClick={handleResetGame}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-bold shadow-sm transition-transform active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-300" />
                      <span>Start Rematch</span>
                    </button>
                  ) : (
                    <button
                      id="btn_roll_dice_multiplayer"
                      onClick={handleRollDice}
                      disabled={!isMyTurn || isRolling || room.status === 'waiting'}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all ${
                        isMyTurn && !isRolling && room.status !== 'waiting'
                          ? 'bg-stone-900 hover:bg-stone-800 text-amber-200 cursor-pointer active:scale-95 shadow-md'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                      }`}
                    >
                      <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                      <span>{isRolling ? 'Rolling Die...' : isMyTurn ? 'Roll Consecrated Die' : 'Opponent Turn'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right: Players Duel Bar, Ledger & Rules */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-stone-300 bg-white flex flex-col h-auto lg:h-[calc(95vh-65px)]">
              
              {/* Players Status Duel Box */}
              <div className="p-4 border-b border-stone-200 bg-[#faf8f5]">
                <h4 className="font-serif text-xs uppercase tracking-wider font-bold text-stone-600 mb-3">
                  Match Competitors
                </h4>

                <div className="space-y-2.5">
                  {/* Player 1 Card */}
                  <div className={`p-3 rounded-lg border transition-all ${
                    room.currentTurnPlayerNumber === 1 && room.status === 'in_progress'
                      ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p1?.icon || '♟️'}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif text-xs font-bold text-stone-900">
                              {p1?.name || 'Player 1'}
                            </span>
                            {p1?.isHost && (
                              <Crown className="w-3 h-3 text-amber-600" title="Host" />
                            )}
                            {p1?.id === me?.id && (
                              <span className="text-[10px] bg-stone-200 px-1 py-0.2 rounded text-stone-700 font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 font-mono">
                            Tile #{((p1?.currentTileIndex || 0) + 1)} • {p1?.gold || 0} Gold
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${p1?.isConnected ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        <span className="text-[10px] text-stone-500">
                          {p1?.isConnected ? 'Ready' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Card */}
                  <div className={`p-3 rounded-lg border transition-all ${
                    room.currentTurnPlayerNumber === 2 && room.status === 'in_progress'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-stone-200 bg-white'
                  }`}>
                    {p2 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p2.icon || '♞'}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif text-xs font-bold text-stone-900">
                                {p2.name}
                              </span>
                              {p2.id === me?.id && (
                                <span className="text-[10px] bg-stone-200 px-1 py-0.2 rounded text-stone-700 font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 font-mono">
                              Tile #{(p2.currentTileIndex + 1)} • {p2.gold} Gold
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${p2.isConnected ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                          <span className="text-[10px] text-stone-500">
                            {p2.isConnected ? 'Ready' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1 text-center">
                        <p className="text-xs text-stone-500 italic mb-2">
                          Seat vacant. Waiting for Player 2...
                        </p>
                        <button
                          onClick={handleCopyLink}
                          className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-3 h-3 text-stone-600" />
                          <span>Copy Game Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Ledger / Game Chronicle */}
              <div className="flex-1 flex flex-col min-h-48 overflow-hidden">
                <div className="px-4 py-2 border-b border-stone-200 bg-[#fbf9f5] flex items-center justify-between">
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-stone-700">
                    Match Chronicle
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Live Server Feed
                  </span>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs font-sans">
                  {room.history.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded border text-xs ${
                        item.type === 'victory'
                          ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                          : item.type === 'chat'
                          ? 'bg-stone-100 border-stone-200 text-stone-800'
                          : item.type === 'event'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mb-0.5">
                        <span>{item.playerNumber ? `Player ${item.playerNumber}` : 'Chronicle'}</span>
                        <span className="font-mono">{item.timestamp}</span>
                      </div>
                      <p className="leading-snug">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Chat Input */}
                <form onSubmit={handleSendChat} className="p-2 border-t border-stone-200 bg-stone-50 flex gap-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Whisper a remark..."
                    className="flex-1 text-xs bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-1.5 bg-stone-900 text-stone-100 disabled:opacity-40 rounded hover:bg-stone-800"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Rulebook Glance */}
              <div className="p-3 border-t border-stone-200 bg-[#f4eee3] text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 font-serif font-bold text-stone-900 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Rule Engine Codex</span>
                </div>
                <p className="line-clamp-2 italic">
                  "{currentBoard.ruleEngine.winConditionDetails}"
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
