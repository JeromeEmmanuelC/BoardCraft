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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              My Board Games
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage your game blueprints, jump into the studio, or launch a playtest.
            </p>
          </div>

          <button
            id="dashboard-new-board-btn"
            onClick={onNewBoardClick}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Board</span>
          </button>
        </div>

        {/* Quick Template Strip */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Quick Start from Template
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onSelectTemplate('chess')}
              className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl">♟️</span>
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">Chess Grid</span>
                <span className="text-[11px] text-zinc-500">8×8 Classic</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTemplate('snakes_ladders')}
              className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl">🪜</span>
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">Snakes & Ladders</span>
                <span className="text-[11px] text-zinc-500">100 Serpentine</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTemplate('ludo')}
              className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl">⭐</span>
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">Pachisi / Ludo</span>
                <span className="text-[11px] text-zinc-500">15×15 Cross</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTemplate('monopoly')}
              className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl">🏰</span>
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">Circuit Track</span>
                <span className="text-[11px] text-zinc-500">40 Perimeter</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search your boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-800 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'chess', label: 'Chess' },
              { id: 'snakes_ladders', label: 'Snakes' },
              { id: 'ludo', label: 'Ludo' },
              { id: 'monopoly', label: 'Track' },
              { id: 'custom', label: 'Custom' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-zinc-300 space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-500">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">No board games found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No matching boards found. Create a new custom board or pick a starter template.
            </p>
            <button
              onClick={onNewBoardClick}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium text-xs shadow-sm hover:bg-zinc-800"
            >
              Create New Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between hover:border-zinc-300 hover:shadow-sm transition-all group"
              >
                <div>
                  
                  {/* Visual Board Thumbnail Card */}
                  <div className="relative h-40 bg-zinc-50 rounded-lg p-2 border border-zinc-200 mb-3 overflow-hidden flex items-center justify-center">
                    
                    {/* Render mini visual pattern of tiles */}
                    <div className="grid grid-cols-6 gap-0.5 w-full max-w-[140px] aspect-square bg-zinc-200 p-1 rounded">
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
                            <span className="opacity-30">{tile.label ? tile.label.slice(0, 1) : i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Badge on top */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 border border-zinc-200 text-[10px] font-medium text-zinc-700 shadow-xs">
                      {project.designType === 'square' && 'Square Grid'}
                      {project.designType === 'rectangular' && 'Rectangular'}
                      {project.designType === 'snakes_ladders' && 'Serpentine'}
                      {project.designType === 'ludo' && 'Ludo Cross'}
                      {project.designType === 'track' && 'Perimeter Track'}
                    </div>

                    {/* Pieces indicator */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 border border-zinc-200 text-[10px] text-zinc-600">
                      {project.pieces.length} Pieces
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-3 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100">
                      <Grid className="w-3 h-3 text-zinc-400" />
                      {project.tiles.length} Tiles
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100">
                      <Users className="w-3 h-3 text-zinc-400" />
                      {project.ruleEngine.minPlayers}-{project.ruleEngine.maxPlayers}P
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100">
                      <Dices className="w-3 h-3 text-zinc-400" />
                      {project.diceConfig.type.toUpperCase()}
                    </span>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  
                  {/* Primary Studio Action */}
                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open Studio</span>
                  </button>

                  {/* Playtest Simulator */}
                  <button
                    onClick={() => onPlaytestProject(project.id)}
                    className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-all"
                    title="Playtest Simulation"
                  >
                    <Play className="w-3.5 h-3.5 text-zinc-600 fill-zinc-600" />
                    <span>Playtest</span>
                  </button>

                  {/* Quick Dropdown Actions */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onExportProject(project.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                      title="Export or Print"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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


