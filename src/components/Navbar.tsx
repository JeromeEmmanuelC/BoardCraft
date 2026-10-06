import React from 'react';
import { FolderOpen, Video, Plus, LogOut, User, Sparkles, Dices, Compass } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'studio';
  onNavigate: (view: 'landing' | 'dashboard' | 'studio') => void;
  onOpenDemo: () => void;
  onOpenAuth: () => void;
  onNewGame: () => void;
  onOpenAICrafter?: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  activeProjectName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenDemo,
  onOpenAuth,
  onNewGame,
  onOpenAICrafter,
  user,
  onLogout,
  activeProjectName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbf8f2]/95 backdrop-blur-md border-b border-[#ddcfba] px-4 sm:px-6 lg:px-8 py-2.5 shadow-[0_2px_8px_rgba(45,30,18,0.04)] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Vintage Monogram Emblem Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => onNavigate('landing')}
        >
          {/* Engraved Parlor Seal Icon */}
          <div className="relative w-10 h-10 rounded-full bg-[#271d16] text-[#e8d5b5] flex items-center justify-center border-2 border-[#b5986e] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.25)] group-hover:border-[#d4af37] transition-all">
            <span className="text-base select-none">♟️</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8c6d37] border border-[#fbf8f2] flex items-center justify-center text-[8px] font-bold text-amber-100">
              ✦
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-ornate text-xl sm:text-2xl font-black text-[#261c14] tracking-wide group-hover:text-[#5e3f1c] transition-colors leading-none">
                BOARDCRAFT
              </span>
              <span className="font-typewriter text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#ebdcc4] text-[#4a341e] border border-[#cbba9e] font-bold">
                ESTD. 1888
              </span>
            </div>
            <p className="font-serif italic text-[11px] text-[#70563b] tracking-wider -mt-0.5">
              Atelier of Vintage Ludology & Parlor Games
            </p>
          </div>
        </div>

        {/* Studio Active Project Indicator */}
        {currentView === 'studio' && activeProjectName && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded border border-[#cfbe9e] bg-[#f5ecdb] text-xs font-serif shadow-inner">
            <span className="text-[#7c6347] uppercase tracking-wider text-[10px] font-bold">On The Table:</span>
            <span className="font-bold text-[#2a1d12] truncate max-w-[200px] italic">«{activeProjectName}»</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Walkthrough Button */}
          <button
            id="nav-demo-btn"
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-serif text-[#5c442c] hover:text-[#2a1d12] hover:bg-[#ebdcc4]/60 border border-transparent hover:border-[#cbba9e] transition-all"
            title="Watch 1-min interactive demo"
          >
            <Video className="w-3.5 h-3.5 text-[#886948]" />
            <span className="hidden sm:inline">Exhibition Reel</span>
          </button>

          {/* Overview / Landing */}
          <button
            id="nav-landing-btn"
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded text-xs font-serif tracking-wide transition-all ${
              currentView === 'landing'
                ? 'bg-[#eedfc7] text-[#24170d] font-bold border border-[#c5b08e] shadow-xs'
                : 'text-[#5c442c] hover:text-[#24170d] hover:bg-[#ebdcc4]/50'
            }`}
          >
            Overview
          </button>

          {/* My Boards Archives */}
          <button
            id="nav-dashboard-btn"
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                onNavigate('dashboard');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-serif tracking-wide transition-all ${
              currentView === 'dashboard'
                ? 'bg-[#eedfc7] text-[#24170d] font-bold border border-[#c5b08e] shadow-xs'
                : 'text-[#5c442c] hover:text-[#24170d] hover:bg-[#ebdcc4]/50'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#886948]" />
            <span>Ludotheque</span>
          </button>

          {/* AI Game Crafter Action */}
          {onOpenAICrafter && (
            <button
              id="nav-ai-crafter-btn"
              onClick={onOpenAICrafter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-serif font-bold bg-[#fbf1dc] hover:bg-[#f6e6c4] text-[#4d3215] border border-[#cbb184] shadow-xs transition-all"
              title="Generate a custom board game and rule engine with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9a6a24]" />
              <span className="hidden md:inline">AI Ludomancer</span>
            </button>
          )}

          {/* New Board Action */}
          <button
            id="nav-new-board-btn"
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-serif font-bold vintage-btn-primary transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#ecd39e]" />
            <span>Engrave New Board</span>
          </button>

          {/* User Profile / Guild Status */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#dcd0bc]">
              <div className="flex items-center gap-1.5 bg-[#f5edde] px-2.5 py-1 rounded border border-[#d3c2a3]">
                <span className="text-sm select-none">{user.avatarIcon || '🎲'}</span>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-serif font-bold text-[#2a1d12] leading-tight">{user.username}</p>
                  <p className="text-[9px] font-typewriter text-[#886b49] leading-tight">{user.guildRank || 'Master Artisan'}</p>
                </div>
              </div>
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                title="Depart Atelier"
                className="p-1.5 text-[#8c7456] hover:text-red-800 rounded hover:bg-[#ebdcc4] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-serif font-bold text-[#3d2c1c] bg-[#ede0cb] hover:bg-[#e4d4bb] border border-[#c4b192] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#6d5236]" />
              <span>Patron Login</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

