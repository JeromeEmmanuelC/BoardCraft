import React from 'react';
import { LayoutGrid, FolderOpen, Video, Plus, LogOut, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'studio';
  onNavigate: (view: 'landing' | 'dashboard' | 'studio') => void;
  onOpenDemo: () => void;
  onOpenAuth: () => void;
  onNewGame: () => void;
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
  user,
  onLogout,
  activeProjectName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => onNavigate('landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <LayoutGrid className="w-4 h-4 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-zinc-900 tracking-tight">
                BoardCraft
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                Creator
              </span>
            </div>
          </div>
        </div>

        {/* Studio Active Project Indicator */}
        {currentView === 'studio' && activeProjectName && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-xs">
            <span className="text-zinc-500 font-medium">Project:</span>
            <span className="font-semibold text-zinc-800 truncate max-w-[200px]">{activeProjectName}</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Walkthrough Button */}
          <button
            id="nav-demo-btn"
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all"
            title="Watch 1-min interactive demo"
          >
            <Video className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Demo Video</span>
          </button>

          {/* Navigation links */}
          <button
            id="nav-landing-btn"
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'landing'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            Overview
          </button>

          <button
            id="nav-dashboard-btn"
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                onNavigate('dashboard');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span>My Boards</span>
          </button>

          {/* New Board Action */}
          <button
            id="nav-new-board-btn"
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Board</span>
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="flex items-center gap-2 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                <span className="text-sm select-none">{user.avatarIcon || '👤'}</span>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-zinc-800 leading-tight">{user.username}</p>
                </div>
              </div>
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-zinc-600" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};


