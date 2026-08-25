import React, { useState } from 'react';
import { GameProject, ArtifactCard, CardRarity } from '../../../types';
import { Scroll, Plus, Trash2 } from 'lucide-react';

interface ArtifactsStepProps {
  project: GameProject;
  onChangeProject: (updated: GameProject) => void;
}

const CARD_ICONS = [
  { icon: '👑', label: 'Crown' },
  { icon: '⚔️', label: 'Sword' },
  { icon: '🗝️', label: 'Key' },
  { icon: '🐉', label: 'Dragon' },
  { icon: '💰', label: 'Gold Chest' },
  { icon: '💀', label: 'Skull' },
  { icon: '🏆', label: 'Trophy' },
  { icon: '📜', label: 'Scroll' },
  { icon: '💍', label: 'Ring' },
  { icon: '💎', label: 'Gem' },
  { icon: '🛡️', label: 'Shield' },
  { icon: '⭐', label: 'Star' },
  { icon: '🌀', label: 'Portal' },
  { icon: '⚡', label: 'Lightning' },
];

const RARITIES: { id: CardRarity; label: string; color: string; border: string }[] = [
  { id: 'common', label: 'Common', color: '#64748b', border: '#94a3b8' },
  { id: 'uncommon', label: 'Uncommon', color: '#16a34a', border: '#4ade80' },
  { id: 'rare', label: 'Rare Relic', color: '#2563eb', border: '#60a5fa' },
  { id: 'legendary', label: 'Legendary Masterwork', color: '#d97706', border: '#fbbf24' },
  { id: 'perilous', label: 'Perilous Curse', color: '#dc2626', border: '#f87171' },
];

export const ArtifactsStep: React.FC<ArtifactsStepProps> = ({
  project,
  onChangeProject,
}) => {
  const { cards } = project;
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleUpdateCard = (updates: Partial<ArtifactCard>) => {
    if (!selectedCard) return;
    const updated = cards.map((c) =>
      c.id === selectedCard.id ? { ...c, ...updates } : c
    );
    onChangeProject({ ...project, cards: updated });
  };

  const handleAddCard = () => {
    const newCard: ArtifactCard = {
      id: `card_${Date.now()}`,
      deckName: 'Encounter Deck',
      title: 'Fate’s Whisper',
      type: 'Boon',
      icon: '📜',
      rarity: 'rare',
      effectText: 'Advance 2 tiles and draw another artifact from the deck.',
      flavorText: 'The ancient runes glow with renewed vigor.',
      goldValue: 50,
    };
    onChangeProject({ ...project, cards: [...cards, newCard] });
    setSelectedCardId(newCard.id);
  };

  const handleDeleteCard = (id: string) => {
    const updated = cards.filter((c) => c.id !== id);
    onChangeProject({ ...project, cards: updated });
    if (selectedCardId === id) {
      setSelectedCardId(updated[0]?.id || '');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Scroll className="w-4 h-4 text-zinc-700" />
          <span>Step 6: Artifacts, Cards & Decks</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Create collectible cards, opportunity cards, action boons, and hazards given to players.
        </p>
      </div>

      {/* Cards Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-700">
            Card Decks ({cards.length})
          </span>
          <button
            onClick={handleAddCard}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Card</span>
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="p-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 text-center space-y-2">
            <span className="text-2xl">🃏</span>
            <p className="text-xs font-medium text-zinc-700">No cards in this deck yet</p>
            <button
              onClick={handleAddCard}
              className="px-3 py-1.5 rounded-md bg-zinc-900 text-white text-xs font-semibold"
            >
              Add First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {cards.map((card) => {
              const isSelected = selectedCard?.id === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                    className={`absolute top-1.5 right-1.5 p-1 transition-colors ${
                      isSelected ? 'text-zinc-400 hover:text-red-400' : 'text-zinc-400 hover:text-red-600'
                    }`}
                    title="Delete card"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="text-center my-1">
                    <span className="text-xl">{card.icon}</span>
                    <h4 className="text-xs font-bold truncate mt-1">
                      {card.title}
                    </h4>
                    <span className={`text-[10px] uppercase font-medium ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {card.type} • {card.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Card Designer & Preview */}
      {selectedCard && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Visual Card Render (Left Preview) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[240px] aspect-[2/3] bg-white text-zinc-900 rounded-2xl p-4 border border-zinc-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
              
              {/* Card Header */}
              <div className="text-center space-y-0.5 border-b border-zinc-100 pb-2">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide block">
                  {selectedCard.deckName}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 leading-tight">
                  {selectedCard.title}
                </h4>
                <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 inline-block mt-0.5">
                  {selectedCard.rarity}
                </span>
              </div>

              {/* Artwork Icon Area */}
              <div className="my-auto py-3 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-2xl mb-2">
                  {selectedCard.icon}
                </div>
                <p className="text-xs text-zinc-700 font-medium leading-snug px-1">
                  {selectedCard.effectText}
                </p>
              </div>

              {/* Flavor Text & Value Footer */}
              <div className="border-t border-zinc-100 pt-2 text-center space-y-0.5">
                {selectedCard.flavorText && (
                  <p className="text-[10px] text-zinc-400 italic leading-tight">
                    "{selectedCard.flavorText}"
                  </p>
                )}
                {selectedCard.goldValue ? (
                  <span className="text-[10px] font-semibold text-amber-700 block">
                    🪙 Value: +{selectedCard.goldValue}
                  </span>
                ) : null}
              </div>

            </div>
          </div>

          {/* Card Attribute Controls (Right) */}
          <div className="lg:col-span-7 bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={selectedCard.title}
                  onChange={(e) => handleUpdateCard({ title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Deck Name
                </label>
                <input
                  type="text"
                  value={selectedCard.deckName}
                  onChange={(e) => handleUpdateCard({ deckName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* Type & Rarity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Card Type
                </label>
                <select
                  value={selectedCard.type}
                  onChange={(e) => handleUpdateCard({ type: e.target.value as ArtifactCard['type'] })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="Boon">Boon / Blessing</option>
                  <option value="Curse">Curse / Hazard</option>
                  <option value="Treasure">Treasure Relic</option>
                  <option value="Spell">Spell / Magic</option>
                  <option value="Property Deed">Property Deed</option>
                  <option value="Equipment">Equipment Item</option>
                  <option value="Event">Event Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Rarity Tier
                </label>
                <select
                  value={selectedCard.rarity}
                  onChange={(e) => handleUpdateCard({ rarity: e.target.value as CardRarity })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                >
                  {RARITIES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Artwork Symbol
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {CARD_ICONS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleUpdateCard({ icon: item.icon })}
                    className={`p-1.5 rounded-md border text-lg text-center transition-all ${
                      selectedCard.icon === item.icon
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Effect Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Gameplay Effect Description
              </label>
              <textarea
                rows={2}
                value={selectedCard.effectText}
                onChange={(e) => handleUpdateCard({ effectText: e.target.value })}
                placeholder="e.g. Draw 2 gold coins and move forward 3 spaces"
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            {/* Flavor Text & Gold Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Flavor Quote / Lore
                </label>
                <input
                  type="text"
                  value={selectedCard.flavorText || ''}
                  onChange={(e) => handleUpdateCard({ flavorText: e.target.value })}
                  placeholder="e.g. A relic from the ancient wars"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Gold Value / Cost
                </label>
                <input
                  type="number"
                  value={selectedCard.goldValue || 0}
                  onChange={(e) => handleUpdateCard({ goldValue: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};


