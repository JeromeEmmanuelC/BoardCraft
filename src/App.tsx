import React, { useState, useEffect } from 'react';
import { GameProject, UserProfile } from './types';
import { 
  INITIAL_SAMPLE_PROJECTS, 
  createChessTemplate, 
  createSnakesAndLaddersTemplate, 
  createLudoTemplate, 
  createMonopolyTemplate, 
  createCustomGridTemplate 
} from './data/templates';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { BoardCreatorStudio } from './components/Studio/BoardCreatorStudio';
import { DemoVideoModal } from './components/DemoVideoModal';
import { AuthModal } from './components/AuthModal';
import { CreateBoardModal } from './components/Dashboard/CreateBoardModal';
import { PlaytestModal } from './components/Playtest/PlaytestModal';
import { ExportModal } from './components/Studio/ExportModal';
import { TwoPlayerGameModal } from './components/Multiplayer/TwoPlayerGameModal';
import { AIGameCrafterModal } from './components/Studio/AIGameCrafterModal';
import { api } from './lib/api';

const STORAGE_KEY_PROJECTS = 'boardcraft_artisan_projects_v1';
const STORAGE_KEY_USER = 'boardcraft_artisan_user_v1';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'studio'>('landing');
  
  // Projects State
  const [projects, setProjects] = useState<GameProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load saved projects from localStorage:', e);
    }
    return INITIAL_SAMPLE_PROJECTS;
  });

  // Active Project for Studio
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_SAMPLE_PROJECTS[0].id);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load user from localStorage:', e);
    }
    const guestId = `artisan_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: guestId,
      username: 'Alden the Gamecrafter',
      email: 'alden@boardcraft.guild',
      guildRank: 'Master Artisan',
      avatarIcon: '👑',
      title: 'Keeper of the Ancient Boards',
    };
  });

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState<boolean>(false);
  const [playtestProjectId, setPlaytestProjectId] = useState<string | null>(null);
  const [exportProjectId, setExportProjectId] = useState<string | null>(null);

  // 2-Player Multiplayer Match State
  const [isTwoPlayerModalOpen, setIsTwoPlayerModalOpen] = useState<boolean>(false);
  const [twoPlayerProject, setTwoPlayerProject] = useState<GameProject | null>(null);
  const [twoPlayerRoomId, setTwoPlayerRoomId] = useState<string | null>(null);

  // AI Game Crafter Modal State
  const [isAICrafterOpen, setIsAICrafterOpen] = useState<boolean>(false);

  // Backend Initialization: Sync with server and check URL invitation parameters
  useEffect(() => {
    // 1. Check if URL contains game invite: ?game=ROOM_ID
    const searchParams = new URLSearchParams(window.location.search);
    const gameParam = searchParams.get('game');
    if (gameParam) {
      setTwoPlayerRoomId(gameParam);
      setIsTwoPlayerModalOpen(true);
    }

    // 2. Fetch authoritative boards from backend
    api.fetchBoards().then((serverBoards) => {
      if (serverBoards && serverBoards.length > 0) {
        setProjects(serverBoards);
      } else {
        // Seed default boards on backend
        INITIAL_SAMPLE_PROJECTS.forEach((p) => api.saveBoard(p));
      }
    }).catch((e) => console.warn('Could not sync with backend boards:', e));
  }, []);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not persist projects:', e);
    }
  }, [projects]);

  // Sync user to localStorage & server
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('Could not persist user:', e);
    }
  }, [user]);

  // Current active project object
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_SAMPLE_PROJECTS[0];
  const playtestProject = projects.find((p) => p.id === playtestProjectId);
  const exportProject = projects.find((p) => p.id === exportProjectId);

  // Action Handlers
  const handleOpenProjectInStudio = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentView('studio');
  };

  const handleSaveProject = (updatedProject: GameProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    api.saveBoard(updatedProject);
  };

  const handleCreateSquareBoard = (size: number) => {
    const fresh = createCustomGridTemplate(size, size, true);
    const newProject: GameProject = {
      ...fresh,
      id: `proj_${Date.now()}`,
      name: `Square Realm (${size}×${size})`,
      description: `A custom symmetrical ${size}×${size} square grid board crafted in BoardCraft studio.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    api.saveBoard(newProject);
    setActiveProjectId(newProject.id);
    setCurrentView('studio');
  };

  const handleCreateRectangularBoard = (rows: number, cols: number) => {
    const fresh = createCustomGridTemplate(rows, cols, false);
    const newProject: GameProject = {
      ...fresh,
      id: `proj_${Date.now()}`,
      name: `Custom Journey Map (${rows}×${cols})`,
      description: `A custom rectangular ${rows}×${cols} journey grid created in BoardCraft workshop.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    api.saveBoard(newProject);
    setActiveProjectId(newProject.id);
    setCurrentView('studio');
  };

  const handleSelectBuiltinTemplate = (templateId: 'chess' | 'snakes_ladders' | 'ludo' | 'monopoly') => {
    let templateData: GameProject;
    if (templateId === 'chess') templateData = createChessTemplate();
    else if (templateId === 'snakes_ladders') templateData = createSnakesAndLaddersTemplate();
    else if (templateId === 'ludo') templateData = createLudoTemplate();
    else templateData = createMonopolyTemplate();

    const newProject: GameProject = {
      ...templateData,
      id: `proj_${Date.now()}`,
      name: `${templateData.name} (Custom Edition)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    api.saveBoard(newProject);
    setActiveProjectId(newProject.id);
    setCurrentView('studio');
  };

  const handleDuplicateProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    const duplicated: GameProject = {
      ...target,
      id: `proj_${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
    api.saveBoard(duplicated);
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      alert('You must retain at least one blueprint project in your workshop archive.');
      return;
    }
    if (confirm('Are you sure you wish to dissolve this board project from your workshop archive?')) {
      const remaining = projects.filter((p) => p.id !== projectId);
      setProjects(remaining);
      api.deleteBoard(projectId);
      if (activeProjectId === projectId) {
        setActiveProjectId(remaining[0].id);
      }
    }
  };

  const handleLaunch2Player = (target: GameProject | string) => {
    const proj = typeof target === 'string' ? projects.find((p) => p.id === target) : target;
    if (proj) {
      setTwoPlayerProject(proj);
      setTwoPlayerRoomId(null);
      setIsTwoPlayerModalOpen(true);
    }
  };

  const handleAIGameCreated = (createdProject: GameProject) => {
    setProjects((prev) => [createdProject, ...prev]);
    setActiveProjectId(createdProject.id);
    setCurrentView('studio');
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
    setCurrentView('dashboard');
    api.login(authenticatedUser.username, authenticatedUser.email).catch((e) => console.warn(e));
  };

  const handleLogout = () => {
    const guestId = `artisan_${Math.random().toString(36).substring(2, 7)}`;
    setUser({
      id: guestId,
      username: 'Guest Traveler',
      guildRank: 'Apprentice',
      avatarIcon: '🎲',
      title: 'Visiting Player',
    });
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col selection:bg-stone-900 selection:text-amber-100">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNewGame={() => setIsCreateBoardModalOpen(true)}
        onOpenAICrafter={() => setIsAICrafterOpen(true)}
        user={user}
        onLogout={handleLogout}
        activeProjectName={activeProject?.name}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onOpenDemo={() => setIsDemoModalOpen(true)}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onExploreTemplates={(templateId) => handleSelectBuiltinTemplate(templateId as any)}
            onStartCreating={() => setIsCreateBoardModalOpen(true)}
            sampleProjects={projects}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            projects={projects}
            user={user}
            onOpenProject={handleOpenProjectInStudio}
            onPlaytestProject={(id) => setPlaytestProjectId(id)}
            onPlay2Player={handleLaunch2Player}
            onOpenAICrafter={() => setIsAICrafterOpen(true)}
            onNewBoardClick={() => setIsCreateBoardModalOpen(true)}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onExportProject={(id) => setExportProjectId(id)}
            onSelectTemplate={handleSelectBuiltinTemplate}
          />
        )}

        {currentView === 'studio' && (
          <BoardCreatorStudio
            key={activeProject.id}
            initialProject={activeProject}
            onSaveProject={handleSaveProject}
            onPlay2Player={handleLaunch2Player}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </div>

      {/* 2-Player Multiplayer Live Parlor Modal */}
      {isTwoPlayerModalOpen && (
        <TwoPlayerGameModal
          isOpen={isTwoPlayerModalOpen}
          onClose={() => {
            setIsTwoPlayerModalOpen(false);
            setTwoPlayerRoomId(null);
            // Clean URL search query without reload
            if (window.location.search.includes('game=')) {
              window.history.replaceState({}, '', window.location.pathname);
            }
          }}
          project={twoPlayerProject || activeProject}
          initialRoomId={twoPlayerRoomId || undefined}
          currentPlayerName={user.username}
          currentPlayerId={user.id}
        />
      )}

      {/* AI Ludology & Rule Crafter Modal */}
      <AIGameCrafterModal
        isOpen={isAICrafterOpen}
        onClose={() => setIsAICrafterOpen(false)}
        onGameCreated={handleAIGameCreated}
      />

      {/* Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onEnterWorkshop={() => {
          setIsDemoModalOpen(false);
          if (!user) setIsAuthModalOpen(true);
          else setCurrentView('dashboard');
        }}
      />

      {/* Auth / Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
      />

      {/* Create New Board Modal (Square vs Rectangular + Built-in Templates) */}
      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onCreateSquare={handleCreateSquareBoard}
        onCreateRectangular={handleCreateRectangularBoard}
        onSelectBuiltinTemplate={handleSelectBuiltinTemplate}
      />

      {/* Quick Solo Playtest Modal from Dashboard */}
      {playtestProject && (
        <PlaytestModal
          isOpen={!!playtestProjectId}
          onClose={() => setPlaytestProjectId(null)}
          project={playtestProject}
        />
      )}

      {/* Export / Print Modal from Dashboard */}
      {exportProject && (
        <ExportModal
          isOpen={!!exportProjectId}
          onClose={() => setExportProjectId(null)}
          project={exportProject}
        />
      )}

    </div>
  );
}

