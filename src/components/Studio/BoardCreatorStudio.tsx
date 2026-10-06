import React, { useState } from 'react';
import { GameProject, StudioStep } from '../../types';
import { BoardCanvas } from './BoardCanvas';
import { LayoutStep } from './Steps/LayoutStep';
import { PathStep } from './Steps/PathStep';
import { AestheticsStep } from './Steps/AestheticsStep';
import { PiecesStep } from './Steps/PiecesStep';
import { DiceStep } from './Steps/DiceStep';
import { RulesStep } from './Steps/RulesStep';
import { ArtifactsStep } from './Steps/ArtifactsStep';
import { PlaytestModal } from '../Playtest/PlaytestModal';
import { ExportModal } from './ExportModal';
import { 
  Save, 
  Play, 
  Printer, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Grid, 
  GitCommit,
  Palette, 
  Crown, 
  Dice5, 
  BookOpen, 
  Scroll,
  Edit2,
  Users
} from 'lucide-react';

interface BoardCreatorStudioProps {
  initialProject: GameProject;
  onSaveProject: (project: GameProject) => void;
  onBackToDashboard: () => void;
  onPlay2Player?: (project: GameProject) => void;
}

const STUDIO_STEPS: { id: StudioStep; label: string; icon: React.ComponentType<{ className?: string }>; num: number }[] = [
  { id: 'layout', label: 'Layout & Grid', icon: Grid, num: 1 },
  { id: 'path', label: 'Move Path & Connectors', icon: GitCommit, num: 2 },
  { id: 'aesthetics', label: 'Colors & Design', icon: Palette, num: 3 },
  { id: 'pieces', label: 'Game Pieces', icon: Crown, num: 4 },
  { id: 'dice', label: 'Dice', icon: Dice5, num: 5 },
  { id: 'rules', label: 'Game Rules', icon: BookOpen, num: 6 },
  { id: 'artifacts', label: 'Cards & Decks', icon: Scroll, num: 7 },
];

export const BoardCreatorStudio: React.FC<BoardCreatorStudioProps> = ({
  initialProject,
  onSaveProject,
  onBackToDashboard,
  onPlay2Player,
}) => {
  const [project, setProject] = useState<GameProject>(initialProject);
  const [currentStep, setCurrentStep] = useState<StudioStep>('layout');
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(1);
  const [showMoveOrder, setShowMoveOrder] = useState<boolean>(true);
  const [isPlaytestOpen, setIsPlaytestOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const currentStepIndex = STUDIO_STEPS.findIndex((s) => s.id === currentStep);

  const handleSave = () => {
    const updated = {
      ...project,
      updatedAt: new Date().toISOString(),
    };
    setProject(updated);
    onSaveProject(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleNextStep = () => {
    if (currentStepIndex < STUDIO_STEPS.length - 1) {
      setCurrentStep(STUDIO_STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STUDIO_STEPS[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 flex flex-col font-sans">
      
      {/* Studio Top Control Header */}
      <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Back & Project Title */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onBackToDashboard}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
              title="Back to My Games"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Editable Project Name */}
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-400 text-sm font-bold text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                />
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {project.name}
                  </h1>
                  <Edit2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
                </div>
              )}
              <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded bg-stone-100 border border-stone-300 hidden sm:inline uppercase">
                {project.designType}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            
            {/* 2-Player Match (Send Link) */}
            {onPlay2Player && (
              <button
                id="studio-2player-duel-btn"
                onClick={() => {
                  onSaveProject(project);
                  onPlay2Player(project);
                }}
                className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Play 2-player with a friend using a shareable game link"
              >
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>Play 2-Player</span>
              </button>
            )}

            {/* Playtest Simulator */}
            <button
              id="studio-playtest-btn"
              onClick={() => setIsPlaytestOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-stone-800 text-stone-800" />
              <span>Playtest</span>
            </button>

            {/* Export & Print */}
            <button
              id="studio-export-btn"
              onClick={() => setIsExportOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export & Print</span>
            </button>

            {/* Primary Save Button */}
            <button
              id="studio-save-btn"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Save Board</span>
            </button>

          </div>

        </div>

        {/* 7-Step Workflow Wizard Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-stone-200 overflow-x-auto">
          <div className="flex items-center justify-between gap-1.5 min-w-[720px]">
            {STUDIO_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : isPast
                      ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-amber-400 text-stone-900' : isPast ? 'bg-stone-300 text-stone-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Studio Viewport (2-Column Grid) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Interactive Board Canvas */}
        <div className="lg:col-span-6 xl:col-span-7 sticky top-28 space-y-3">
          <BoardCanvas
            project={project}
            selectedTileIndex={selectedTileIndex}
            onSelectTile={(idx) => setSelectedTileIndex(idx)}
            highlightedTiles={selectedTileIndex !== null ? [selectedTileIndex] : []}
            showMoveOrder={showMoveOrder}
          />
        </div>

        {/* Right Column: Step Controls Inspector */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          
          {/* Step 1: Layout */}
          {currentStep === 'layout' && (
            <LayoutStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step 2: Move Path & Connectors */}
          {currentStep === 'path' && (
            <PathStep
              project={project}
              onChangeProject={(u) => setProject(u)}
              selectedTileIndex={selectedTileIndex}
              onSelectTile={(idx) => setSelectedTileIndex(idx)}
              showMoveOrder={showMoveOrder}
              onToggleMoveOrder={(show) => setShowMoveOrder(show)}
            />
          )}

          {/* Step 3: Colors & Design */}
          {currentStep === 'aesthetics' && (
            <AestheticsStep
              project={project}
              onChangeProject={(u) => setProject(u)}
              selectedTileIndex={selectedTileIndex}
              onSelectTile={(idx) => setSelectedTileIndex(idx)}
            />
          )}

          {/* Step 4: Pieces */}
          {currentStep === 'pieces' && (
            <PiecesStep
              project={project}
              onChangeProject={(u) => setProject(u)}
              onSelectTile={(idx) => setSelectedTileIndex(idx)}
            />
          )}

          {/* Step 5: Dice */}
          {currentStep === 'dice' && (
            <DiceStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step 6: Rules */}
          {currentStep === 'rules' && (
            <RulesStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step 7: Artifacts & Cards */}
          {currentStep === 'artifacts' && (
            <ArtifactsStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step Footer Navigation Bar */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="text-xs text-stone-500 font-semibold">
              Step {currentStepIndex + 1} of {STUDIO_STEPS.length}
            </span>

            {currentStepIndex < STUDIO_STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4 text-emerald-200" />
                <span>Save Board</span>
              </button>
            )}
          </div>

        </div>

      </main>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-zinc-900 text-white shadow-xl flex items-center gap-3 animate-fade-in border border-zinc-800">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Board Saved</h4>
            <p className="text-[11px] text-zinc-400">All changes have been successfully saved.</p>
          </div>
        </div>
      )}

      {/* Playtest Modal */}
      <PlaytestModal
        isOpen={isPlaytestOpen}
        onClose={() => setIsPlaytestOpen(false)}
        project={project}
      />

      {/* Export / Print Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

    </div>
  );
};

