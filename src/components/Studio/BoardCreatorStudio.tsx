import React, { useState } from 'react';
import { GameProject, StudioStep } from '../../types';
import { BoardCanvas } from './BoardCanvas';
import { LayoutStep } from './Steps/LayoutStep';
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
  Palette, 
  Crown, 
  Dice5, 
  BookOpen, 
  Scroll,
  Edit2
} from 'lucide-react';

interface BoardCreatorStudioProps {
  initialProject: GameProject;
  onSaveProject: (project: GameProject) => void;
  onBackToDashboard: () => void;
}

const STUDIO_STEPS: { id: StudioStep; label: string; icon: React.ComponentType<{ className?: string }>; num: number }[] = [
  { id: 'layout', label: 'Layout & Grid', icon: Grid, num: 1 },
  { id: 'aesthetics', label: 'Board Colours', icon: Palette, num: 2 },
  { id: 'pieces', label: 'Choosing Pieces', icon: Crown, num: 3 },
  { id: 'dice', label: 'Dice & Movement', icon: Dice5, num: 4 },
  { id: 'rules', label: 'Rule Engine', icon: BookOpen, num: 5 },
  { id: 'artifacts', label: 'Artifacts & Cards', icon: Scroll, num: 6 },
];

export const BoardCreatorStudio: React.FC<BoardCreatorStudioProps> = ({
  initialProject,
  onSaveProject,
  onBackToDashboard,
}) => {
  const [project, setProject] = useState<GameProject>(initialProject);
  const [currentStep, setCurrentStep] = useState<StudioStep>('layout');
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(0);
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      
      {/* Studio Top Control Header */}
      <header className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Back & Project Title */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onBackToDashboard}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors"
              title="Return to Dashboard"
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
                  className="px-2.5 py-1 rounded-md bg-white border border-zinc-300 text-sm font-semibold text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                />
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <h1 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {project.name}
                  </h1>
                  <Edit2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700" />
                </div>
              )}
              <span className="text-[11px] font-medium text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 hidden sm:inline uppercase">
                {project.designType}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            
            {/* Playtest Simulator */}
            <button
              id="studio-playtest-btn"
              onClick={() => setIsPlaytestOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-600" />
              <span>Playtest</span>
            </button>

            {/* Export & Print */}
            <button
              id="studio-export-btn"
              onClick={() => setIsExportOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export / Print</span>
            </button>

            {/* Primary Save Button */}
            <button
              id="studio-save-btn"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs active:scale-98 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

          </div>

        </div>

        {/* 6-Step Workflow Wizard Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-zinc-100 overflow-x-auto">
          <div className="flex items-center justify-between gap-1.5 min-w-[660px]">
            {STUDIO_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : isPast
                      ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    isActive ? 'bg-white text-zinc-900' : isPast ? 'bg-zinc-300 text-zinc-800' : 'bg-zinc-200 text-zinc-600'
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
          />
        </div>

        {/* Right Column: Step Controls Inspector */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-6">
          
          {/* Step 1: Layout */}
          {currentStep === 'layout' && (
            <LayoutStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step 2: Aesthetics & Colors */}
          {currentStep === 'aesthetics' && (
            <AestheticsStep
              project={project}
              onChangeProject={(u) => setProject(u)}
              selectedTileIndex={selectedTileIndex}
              onSelectTile={(idx) => setSelectedTileIndex(idx)}
            />
          )}

          {/* Step 3: Pieces & Tokens */}
          {currentStep === 'pieces' && (
            <PiecesStep
              project={project}
              onChangeProject={(u) => setProject(u)}
              onSelectTile={(idx) => setSelectedTileIndex(idx)}
            />
          )}

          {/* Step 4: Dice & Movement Engine */}
          {currentStep === 'dice' && (
            <DiceStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step 5: Rule Engine */}
          {currentStep === 'rules' && (
            <RulesStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step 6: Artifacts & Cards */}
          {currentStep === 'artifacts' && (
            <ArtifactsStep
              project={project}
              onChangeProject={(u) => setProject(u)}
            />
          )}

          {/* Step Footer Navigation Bar */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-zinc-500 font-medium">
              Step {currentStepIndex + 1} of {STUDIO_STEPS.length}
            </span>

            {currentStepIndex < STUDIO_STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
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

