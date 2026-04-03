'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';
import type { ExplorerConfig, SelectionStep, TraitOption } from '@/lib/explorer/config-schema';

interface StepsPanelProps {
  config: ExplorerConfig;
  onChange: (config: ExplorerConfig) => void;
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-3">
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

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-white/60">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-8 h-[18px] rounded-full transition-colors relative ${value ? 'bg-[#00BBA5]' : 'bg-white/12'}`}
      >
        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-transform ${value ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  );
}

function OptionEditor({ option, onChange, onDelete }: { option: TraitOption; onChange: (o: TraitOption) => void; onDelete: () => void }) {
  return (
    <div className="flex gap-2 items-start mb-2 p-2 rounded-lg bg-white/3 border border-white/6">
      <div className="flex-1 space-y-1.5">
        <input
          type="text"
          value={option.label}
          onChange={e => onChange({ ...option, label: e.target.value })}
          placeholder="Label"
          className="w-full px-2 py-1 rounded-md bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5]"
        />
        <input
          type="text"
          value={option.value}
          onChange={e => onChange({ ...option, value: e.target.value })}
          placeholder="Value (slug)"
          className="w-full px-2 py-1 rounded-md bg-white/6 border border-white/8 text-[10px] text-white/50 outline-none focus:border-[#00BBA5] font-mono"
        />
      </div>
      <button onClick={onDelete} className="p-1 text-white/20 hover:text-red-400 transition-colors mt-1">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function StepEditor({ step, onChange, onDelete }: { step: SelectionStep; onChange: (s: SelectionStep) => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const updateOption = (index: number, option: TraitOption) => {
    const options = [...step.options];
    options[index] = option;
    onChange({ ...step, options });
  };

  const deleteOption = (index: number) => {
    const options = step.options.filter((_, i) => i !== index);
    onChange({ ...step, options });
  };

  const addOption = () => {
    const options = [...step.options, { value: `option-${step.options.length + 1}`, label: 'New Option', icon: '' }];
    onChange({ ...step, options });
  };

  return (
    <div className="border border-white/8 rounded-lg mb-2 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 hover:bg-white/3 transition-colors"
      >
        <GripVertical className="w-3.5 h-3.5 text-white/20" />
        <div className="flex-1 text-left">
          <div className="text-xs font-medium text-white/80">{step.title || 'Untitled Step'}</div>
          <div className="text-[10px] text-white/40">{step.selectionMode} select, {step.options.length} options</div>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${step.selectionMode === 'single' ? 'bg-blue-500/15 text-blue-400' : 'bg-teal-500/15 text-teal-400'}`}>
          {step.selectionMode}
        </span>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-white/30" /> : <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
      </button>

      {expanded && (
        <div className="p-3 pt-0 border-t border-white/6">
          <TextField label="Step ID" value={step.id} onChange={v => onChange({ ...step, id: v })} />
          <TextField label="Title" value={step.title} onChange={v => onChange({ ...step, title: v })} />
          <TextField label="Subtitle" value={step.subtitle} onChange={v => onChange({ ...step, subtitle: v })} />

          <div className="flex gap-1 mb-3 bg-white/4 rounded-lg p-0.5">
            <button
              onClick={() => onChange({ ...step, selectionMode: 'single' })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${step.selectionMode === 'single' ? 'bg-white/8 text-white/80' : 'text-white/30'}`}
            >
              Single Select
            </button>
            <button
              onClick={() => onChange({ ...step, selectionMode: 'multi' })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${step.selectionMode === 'multi' ? 'bg-white/8 text-white/80' : 'text-white/30'}`}
            >
              Multi Select
            </button>
          </div>

          <Toggle label="Show Greeting" value={step.showGreeting} onChange={v => onChange({ ...step, showGreeting: v })} />
          <Toggle label="Show Select All" value={step.showSelectAll} onChange={v => onChange({ ...step, showSelectAll: v })} />

          <div className="mt-3">
            <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">Options</div>
            {step.options.map((opt, i) => (
              <OptionEditor key={i} option={opt} onChange={o => updateOption(i, o)} onDelete={() => deleteOption(i)} />
            ))}
            <button
              onClick={addOption}
              className="w-full py-1.5 rounded-lg border border-dashed border-white/12 text-xs text-white/40 hover:text-white/60 hover:border-white/20 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Option
            </button>
          </div>

          <button
            onClick={onDelete}
            className="mt-3 w-full py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors"
          >
            Delete Step
          </button>
        </div>
      )}
    </div>
  );
}

export default function StepsPanel({ config, onChange }: StepsPanelProps) {
  const updateStep = (index: number, step: SelectionStep) => {
    const steps = [...config.steps];
    steps[index] = step;
    onChange({ ...config, steps });
  };

  const deleteStep = (index: number) => {
    const steps = config.steps.filter((_, i) => i !== index);
    onChange({ ...config, steps });
  };

  const addStep = () => {
    const newStep: SelectionStep = {
      id: `step-${config.steps.length + 1}`,
      type: 'trait-selection',
      title: 'New Step',
      subtitle: 'Select an option.',
      selectionMode: 'multi',
      showGreeting: false,
      showSelectAll: true,
      options: [],
    };
    onChange({ ...config, steps: [...config.steps, newStep] });
  };

  return (
    <div className="text-white">
      <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-3">Selection Steps</div>

      {config.steps.length === 0 && (
        <div className="text-xs text-white/30 text-center py-8 border border-dashed border-white/8 rounded-lg mb-3">
          No steps yet. Add your first selection step.
        </div>
      )}

      {config.steps.map((step, i) => (
        <StepEditor
          key={step.id || i}
          step={step}
          onChange={s => updateStep(i, s)}
          onDelete={() => deleteStep(i)}
        />
      ))}

      <button
        onClick={addStep}
        className="w-full py-2 rounded-lg text-xs font-medium text-[#00BBA5] border border-[#00BBA5]/20 hover:border-[#00BBA5]/40 hover:bg-[#00BBA5]/5 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Add Step
      </button>

      <div className="mt-6 border-t border-white/6 pt-4">
        <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-3">Branching</div>
        <TextField
          label="Top Roles (comma-separated)"
          value={config.branching.topRoles.join(', ')}
          onChange={v => onChange({ ...config, branching: { ...config.branching, topRoles: v.split(',').map(s => s.trim()).filter(Boolean) } })}
          placeholder="executive, vp, manager, engineer"
        />
        <TextField
          label="Top Path Steps (comma-separated IDs)"
          value={config.branching.topPathSteps.join(', ')}
          onChange={v => onChange({ ...config, branching: { ...config.branching, topPathSteps: v.split(',').map(s => s.trim()).filter(Boolean) } })}
        />
        <TextField
          label="Bottom Path Steps (comma-separated IDs)"
          value={config.branching.bottomPathSteps.join(', ')}
          onChange={v => onChange({ ...config, branching: { ...config.branching, bottomPathSteps: v.split(',').map(s => s.trim()).filter(Boolean) } })}
        />
      </div>
    </div>
  );
}
