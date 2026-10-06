import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Play, 
  Edit3, 
  Copy, 
  Trash2, 
  Download, 
  Grid, 
  Users, 
  Dices,
  Layers,
  Sparkles
} from 'lucide-react';
import { GameProject, UserProfile } from '../types';

interface DashboardProps {
  projects: GameProject[];
  user: UserProfile | null;
  onOpenProject: (projectId: string) => void;
  onPlaytestProject: (projectId: string) => void;
  onPlay2Player?: (projectId: string) => void;
  onOpenAICrafter?: () => void;
  onNewBoardClick: () => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onExportProject: (projectId: string) => void;
  onSelectTemplate: (templateId: 'chess' | 'snakes_ladders' | 'ludo' | 'monopoly') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  user,
  onOpenProject,
  onPlaytestProject,
  onPlay2Player,
  onOpenAICrafter,
  onNewBoardClick,
  onDuplicateProject,
  onDeleteProject,
  onExportProject,
  onSelectTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'chess') return matchesSearch && proj.templateId === 'chess';
    if (filterType === 'snakes_ladders') return matchesSearch && proj.templateId === 'snakes_ladders';
    if (filterType === 'ludo') return matchesSearch && proj.templateId === 'ludo';
    if (filterType === 'monopoly') return matchesSearch && proj.templateId === 'monopoly';
    if (filterType === 'custom') return matchesSearch && !proj.templateId;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                My Board Games
              </h1>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 font-semibold">
                Library
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Create, customize, and play board games. Playtest solo or send a shareable game link to play 2-player online.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenAICrafter && (
              <button
                id="dashboard-ai-craft-btn"
                onClick={onOpenAICrafter}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>AI Game Generator</span>
              </button>
            )}

            <button
              id="dashboard-new-board-btn"
              onClick={onNewBoardClick}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Create New Board</span>
            </button>
          </div>
        </div>

        {/* Quick Template Strip */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span>Popular Game Templates</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onSelectTemplate('chess')}
              className="p-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl select-none">♟️</span>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Chess Grid</span>
                <span className="text-[11px] text-stone-500">8×8 Checkered</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTemplate('snakes_ladders')}
              className="p-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl select-none">🪜</span>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Snakes & Ladders</span>
                <span className="text-[11px] text-stone-500">100 Numbered Tiles</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTemplate('ludo')}
              className="p-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl select-none">⭐</span>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Ludo / Pachisi</span>
                <span className="text-[11px] text-stone-500">Cross & 4 Home Yards</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTemplate('monopoly')}
              className="p-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl select-none">🚂</span>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Property Circuit</span>
                <span className="text-[11px] text-stone-500">40 Perimeter Tiles</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search board games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Games' },
              { id: 'chess', label: 'Chess' },
              { id: 'snakes_ladders', label: 'Snakes & Ladders' },
              { id: 'ludo', label: 'Ludo' },
              { id: 'monopoly', label: 'Circuit' },
              { id: 'custom', label: 'Custom' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300 space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-600">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">No board games found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No matching board games found. Create a new custom board or pick one of the templates above.
            </p>
            <button
              onClick={onNewBoardClick}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs"
            >
              Create New Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col justify-between hover:border-stone-400 group shadow-xs transition-all relative"
              >
                <div>
                  
                  {/* Visual Board Thumbnail Card */}
                  <div className="relative h-40 bg-stone-100 rounded-lg p-2 border border-stone-200 mb-3 overflow-hidden flex items-center justify-center">
                    
                    {/* Render mini visual pattern of tiles */}
                    <div className="grid grid-cols-6 gap-0.5 w-full max-w-[140px] aspect-square bg-stone-300 p-1 rounded">
                      {project.tiles.slice(0, 36).map((tile, i) => (
                        <div
                          key={tile.id || i}
                          className="rounded-[1px] flex items-center justify-center text-[8px] font-bold"
                          style={{
                            backgroundColor: tile.color || '#ffffff',
                            color: tile.textColor || '#18181b',
                          }}
                        >
                          {tile.icon ? (
                            <span>{tile.icon}</span>
                          ) : (
                            <span className="opacity-40">{tile.label ? tile.label.slice(0, 1) : i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Badge on top */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/95 border border-stone-200 text-[9px] font-semibold text-stone-700 shadow-xs">
                      {project.designType === 'square' && 'Square Grid'}
                      {project.designType === 'rectangular' && 'Rectangular'}
                      {project.designType === 'snakes_ladders' && 'Snakes & Ladders Track'}
                      {project.designType === 'ludo' && 'Ludo Cross'}
                      {project.designType === 'track' && 'Perimeter Track'}
                    </div>

                    {/* Pieces indicator */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/95 border border-stone-200 text-[10px] font-semibold text-stone-700">
                      {project.pieces.length} Pieces
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-3 text-[11px] text-stone-600">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-medium">
                      <Grid className="w-3 h-3 text-stone-500" />
                      {project.tiles.length} Tiles
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-medium">
                      <Users className="w-3 h-3 text-stone-500" />
                      {project.ruleEngine.minPlayers}-{project.ruleEngine.maxPlayers} Players
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-medium">
                      <Dices className="w-3 h-3 text-stone-500" />
                      {project.diceConfig.type.toUpperCase()}
                    </span>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="pt-3 mt-3 border-t border-stone-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* Primary Studio Action */}
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Edit in Studio</span>
                    </button>

                    {/* 2-Player Match (Send Link) */}
                    {onPlay2Player && (
                      <button
                        onClick={() => onPlay2Player(project.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-xs"
                        title="Start a 2-player match and get a game link to share"
                      >
                        <Users className="w-3.5 h-3.5 text-amber-700" />
                        <span>Play 2-Player</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Playtest Simulator */}
                    <button
                      onClick={() => onPlaytestProject(project.id)}
                      className="flex items-center justify-center gap-1 py-1 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold transition-all"
                      title="Solo Playtest Simulation"
                    >
                      <Play className="w-3 h-3 text-stone-800 fill-stone-800" />
                      <span>Playtest</span>
                    </button>

                    {/* Quick Dropdown Actions */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onExportProject(project.id)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Export or Print"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateProject(project.id)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

