'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { ExplorerConfig, OutcomeCard, LearnCard, SolutionCard } from '@/lib/explorer/config-schema';

interface ContentPanelProps {
  config: ExplorerConfig;
  onChange: (config: ExplorerConfig) => void;
}

type ContentTab = 'outcomes' | 'learn' | 'solutions';

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-2">
      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5] transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div className="mb-2">
      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5] transition-colors resize-none"
      />
    </div>
  );
}

function DescriptionFields({ desc, onChange }: { desc: { small: string; medium: string; large: string; overlay: string }; onChange: (d: typeof desc) => void }) {
  return (
    <>
      <TextField label="Description (Small)" value={desc.small} onChange={v => onChange({ ...desc, small: v })} placeholder="1 line" />
      <TextArea label="Description (Medium)" value={desc.medium} onChange={v => onChange({ ...desc, medium: v })} placeholder="2-3 lines" />
      <TextArea label="Description (Large)" value={desc.large} onChange={v => onChange({ ...desc, large: v })} placeholder="3-4 lines" rows={3} />
      <TextArea label="Description (Overlay)" value={desc.overlay} onChange={v => onChange({ ...desc, overlay: v })} placeholder="Full detail for overlay" rows={4} />
    </>
  );
}

function CardItem({ title, subtitle, expanded, onToggle, onDelete, children }: { title: string; subtitle?: string; expanded: boolean; onToggle: () => void; onDelete: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-white/8 rounded-lg mb-2 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-2 p-3 hover:bg-white/3 transition-colors">
        <div className="flex-1 text-left">
          <div className="text-xs font-medium text-white/80 truncate">{title || 'Untitled'}</div>
          {subtitle && <div className="text-[10px] text-white/40">{subtitle}</div>}
        </div>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-white/30" /> : <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
      </button>
      {expanded && (
        <div className="p-3 pt-0 border-t border-white/6">
          {children}
          <button onClick={onDelete} className="mt-2 w-full py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center justify-center gap-1">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ContentPanel({ config, onChange }: ContentPanelProps) {
  const [tab, setTab] = useState<ContentTab>('outcomes');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (i: number) => setExpandedIndex(expandedIndex === i ? null : i);

  // Outcomes
  const updateOutcome = (i: number, o: OutcomeCard) => {
    const outcomes = [...config.content.outcomes];
    outcomes[i] = o;
    onChange({ ...config, content: { ...config.content, outcomes } });
  };
  const deleteOutcome = (i: number) => {
    onChange({ ...config, content: { ...config.content, outcomes: config.content.outcomes.filter((_, idx) => idx !== i) } });
    setExpandedIndex(null);
  };
  const addOutcome = () => {
    const o: OutcomeCard = { key: '', title: 'New Outcome', icon: '', description: { small: '', medium: '', large: '', overlay: '' } };
    onChange({ ...config, content: { ...config.content, outcomes: [...config.content.outcomes, o] } });
    setExpandedIndex(config.content.outcomes.length);
  };

  // Learn
  const updateLearn = (i: number, lc: LearnCard) => {
    const learnCards = [...config.content.learnCards];
    learnCards[i] = lc;
    onChange({ ...config, content: { ...config.content, learnCards } });
  };
  const deleteLearn = (i: number) => {
    onChange({ ...config, content: { ...config.content, learnCards: config.content.learnCards.filter((_, idx) => idx !== i) } });
    setExpandedIndex(null);
  };
  const addLearn = () => {
    const lc: LearnCard = { title: 'New Learn Card', type: 'blog', roles: ['all'], objectives: [], url: '#', description: { small: '', medium: '', large: '', overlay: '' } };
    onChange({ ...config, content: { ...config.content, learnCards: [...config.content.learnCards, lc] } });
    setExpandedIndex(config.content.learnCards.length);
  };

  // Solutions
  const updateSolution = (i: number, s: SolutionCard) => {
    const solutions = [...config.content.solutions];
    solutions[i] = s;
    onChange({ ...config, content: { ...config.content, solutions } });
  };
  const deleteSolution = (i: number) => {
    onChange({ ...config, content: { ...config.content, solutions: config.content.solutions.filter((_, idx) => idx !== i) } });
    setExpandedIndex(null);
  };
  const addSolution = () => {
    const s: SolutionCard = { id: '', title: 'New Solution', icon: '', industries: 'all', description: { small: '', medium: '', large: '', overlay: '' } };
    onChange({ ...config, content: { ...config.content, solutions: [...config.content.solutions, s] } });
    setExpandedIndex(config.content.solutions.length);
  };

  return (
    <div className="text-white">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/4 rounded-lg p-0.5">
        {(['outcomes', 'learn', 'solutions'] as ContentTab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setExpandedIndex(null); }}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${tab === t ? 'bg-[#00BBA5]/15 text-[#00BBA5]' : 'text-white/40 hover:text-white/60'}`}
          >
            {t} ({t === 'outcomes' ? config.content.outcomes.length : t === 'learn' ? config.content.learnCards.length : config.content.solutions.length})
          </button>
        ))}
      </div>

      {/* Outcomes */}
      {tab === 'outcomes' && (
        <>
          {config.content.outcomes.map((o, i) => (
            <CardItem key={i} title={o.title} subtitle={`Key: ${o.key || '(none)'}`} expanded={expandedIndex === i} onToggle={() => toggleExpand(i)} onDelete={() => deleteOutcome(i)}>
              <TextField label="Key (matches trait label)" value={o.key} onChange={v => updateOutcome(i, { ...o, key: v })} placeholder="e.g. Product Demo" />
              <TextField label="Title" value={o.title} onChange={v => updateOutcome(i, { ...o, title: v })} />
              <TextField label="Icon (SVG path)" value={o.icon} onChange={v => updateOutcome(i, { ...o, icon: v })} placeholder="<path d=..." />
              <DescriptionFields desc={o.description} onChange={d => updateOutcome(i, { ...o, description: d })} />
            </CardItem>
          ))}
          <button onClick={addOutcome} className="w-full py-2 rounded-lg text-xs font-medium text-[#00BBA5] border border-[#00BBA5]/20 hover:border-[#00BBA5]/40 hover:bg-[#00BBA5]/5 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Outcome
          </button>
        </>
      )}

      {/* Learn */}
      {tab === 'learn' && (
        <>
          {config.content.learnCards.map((lc, i) => (
            <CardItem key={i} title={lc.title} subtitle={lc.type} expanded={expandedIndex === i} onToggle={() => toggleExpand(i)} onDelete={() => deleteLearn(i)}>
              <TextField label="Title" value={lc.title} onChange={v => updateLearn(i, { ...lc, title: v })} />
              <div className="mb-2">
                <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">Type</label>
                <select
                  value={lc.type}
                  onChange={e => updateLearn(i, { ...lc, type: e.target.value as LearnCard['type'] })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5] appearance-none"
                >
                  {['blog', 'webinar', 'podcast', 'whitepaper', 'video', 'website'].map(t => (
                    <option key={t} value={t} className="bg-[#0F1035]">{t}</option>
                  ))}
                </select>
              </div>
              <TextField label="URL" value={lc.url} onChange={v => updateLearn(i, { ...lc, url: v })} placeholder="https://..." />
              <TextField label="Roles (comma-separated)" value={lc.roles.join(', ')} onChange={v => updateLearn(i, { ...lc, roles: v.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="all" />
              <TextField label="Objectives (comma-separated)" value={lc.objectives.join(', ')} onChange={v => updateLearn(i, { ...lc, objectives: v.split(',').map(s => s.trim()).filter(Boolean) })} />
              <DescriptionFields desc={lc.description} onChange={d => updateLearn(i, { ...lc, description: d })} />
            </CardItem>
          ))}
          <button onClick={addLearn} className="w-full py-2 rounded-lg text-xs font-medium text-[#00BBA5] border border-[#00BBA5]/20 hover:border-[#00BBA5]/40 hover:bg-[#00BBA5]/5 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Learn Card
          </button>
        </>
      )}

      {/* Solutions */}
      {tab === 'solutions' && (
        <>
          {config.content.solutions.map((s, i) => (
            <CardItem key={i} title={s.title} subtitle={`Industries: ${s.industries}`} expanded={expandedIndex === i} onToggle={() => toggleExpand(i)} onDelete={() => deleteSolution(i)}>
              <TextField label="ID" value={s.id} onChange={v => updateSolution(i, { ...s, id: v })} placeholder="e.g. event-intelligence" />
              <TextField label="Title" value={s.title} onChange={v => updateSolution(i, { ...s, title: v })} />
              <TextField label="Icon (SVG path)" value={s.icon} onChange={v => updateSolution(i, { ...s, icon: v })} placeholder="<path d=..." />
              <TextField label="Industries (comma-separated or 'all')" value={s.industries} onChange={v => updateSolution(i, { ...s, industries: v })} placeholder="all" />
              <DescriptionFields desc={s.description} onChange={d => updateSolution(i, { ...s, description: d })} />
            </CardItem>
          ))}
          <button onClick={addSolution} className="w-full py-2 rounded-lg text-xs font-medium text-[#00BBA5] border border-[#00BBA5]/20 hover:border-[#00BBA5]/40 hover:bg-[#00BBA5]/5 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Solution
          </button>
        </>
      )}
    </div>
  );
}
