import React, { useState } from 'react';
import { X, User, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  { icon: '👑', label: 'Monarch' },
  { icon: '🧙', label: 'Mage' },
  { icon: '🐉', label: 'Dragon' },
  { icon: '⚔️', label: 'Champion' },
  { icon: '📜', label: 'Scribe' },
  { icon: '⛵', label: 'Voyager' },
  { icon: '🪙', label: 'Merchant' },
  { icon: '💎', label: 'Artisan' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('Game Creator');
  const [selectedAvatar, setSelectedAvatar] = useState('👑');
  const [email, setEmail] = useState('creator@boardcraft.app');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      username: username.trim() || 'Game Creator',
      title: 'Board Designer',
      avatarIcon: selectedAvatar,
      guildRank: 'Creator',
      joinedDate: new Date().toLocaleDateString(),
    };
    localStorage.setItem('boardcraft_user', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      id: 'guest_user',
      username: 'Game Creator',
      title: 'Board Designer',
      avatarIcon: '👑',
      guildRank: 'Creator',
      joinedDate: new Date().toLocaleDateString(),
    };
    localStorage.setItem('boardcraft_user', JSON.stringify(guestUser));
    onLoginSuccess(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white text-zinc-900 rounded-xl border border-zinc-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Sign In to BoardCraft
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Access your saved board games and projects.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Master Alden"
              className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Email / Pass */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Email / Handle
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@example.com"
              className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((seal) => (
                <button
                  type="button"
                  key={seal.label}
                  onClick={() => setSelectedAvatar(seal.icon)}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    selectedAvatar === seal.icon
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-lg">{seal.icon}</span>
                  <span className="text-[10px] truncate max-w-full">{seal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-medium transition-colors"
            >
              Continue as Guest
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};


