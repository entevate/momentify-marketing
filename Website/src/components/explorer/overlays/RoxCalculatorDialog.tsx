'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tent, UserPlus, Briefcase, Building2, CalendarDays } from 'lucide-react';

interface RoxCalculatorDialogProps {
  open: boolean;
  onClose: () => void;
}

type SolutionId = 'trade-shows' | 'recruiting' | 'field-sales' | 'facilities' | 'venues-events';

interface SolutionDef {
  id: SolutionId;
  label: string;
  icon: typeof Tent;
  accent: string;
  totalLabel: string;
  totalHelp: string;
  capturedLabel: string;
  meaningfulLabel: string;
  meaningfulHelp: string;
  followUpLabel: string;
  followUpHelp: string;
  convertedLabel: string;
  convertedHelp: string;
}

const SOLUTIONS: SolutionDef[] = [
  {
    id: 'trade-shows',
    label: 'Trade Shows & Exhibits',
    icon: Tent,
    accent: '#6B21D4',
    totalLabel: 'Total Booth Visitors',
    totalHelp: 'Estimated number of people who stopped at your booth',
    capturedLabel: 'Total Leads Captured',
    meaningfulLabel: 'Leads with Meaningful Interaction',
    meaningfulHelp: 'Demos, recorded conversations, or content engagement',
    followUpLabel: 'Avg Days to First Follow-Up',
    followUpHelp: 'Days before you sent the first follow-up',
    convertedLabel: 'Post-Event Conversions',
    convertedHelp: 'Meetings, opportunities, or closed deals',
  },
  {
    id: 'recruiting',
    label: 'Technical Recruiting',
    icon: UserPlus,
    accent: '#5FD9C2',
    totalLabel: 'Total Event Attendees',
    totalHelp: 'Expected or registered attendees',
    capturedLabel: 'Candidates Captured',
    meaningfulLabel: 'Candidates with Meaningful Interaction',
    meaningfulHelp: 'Tech talk, coding challenge, or role-specific conversation',
    followUpLabel: 'Avg Days to First Contact',
    followUpHelp: 'Days until recruiter outreach post-event',
    convertedLabel: 'Hires or Advances',
    convertedHelp: 'Reached phone screen, on-site, or offer',
  },
  {
    id: 'field-sales',
    label: 'Field Sales Enablement',
    icon: Briefcase,
    accent: '#F2B33D',
    totalLabel: 'Total Field Visits',
    totalHelp: 'Estimated total visits this quarter',
    capturedLabel: 'Visits with Documented Interactions',
    meaningfulLabel: 'Prospects Who Engaged with Content',
    meaningfulHelp: 'Viewed, downloaded, or interacted with shared content',
    followUpLabel: 'Avg Days from Visit to CRM Entry',
    followUpHelp: 'Days before notes are entered into CRM',
    convertedLabel: 'Visits That Advanced a Stage',
    convertedHelp: 'Documented visits resulting in stage progression',
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: Building2,
    accent: '#5B4499',
    totalLabel: 'Total Facility Tours',
    totalHelp: 'Tours hosted this quarter',
    capturedLabel: 'Tours with Documented Interactions',
    meaningfulLabel: 'Visitors Who Engaged Deeply',
    meaningfulHelp: 'Demos, briefings, or extended conversations',
    followUpLabel: 'Avg Days from Tour to CRM Entry',
    followUpHelp: 'Days before tour notes are entered',
    convertedLabel: 'Tours That Advanced a Stage',
    convertedHelp: 'Tours resulting in pipeline stage progression',
  },
  {
    id: 'venues-events',
    label: 'Venues & Events',
    icon: CalendarDays,
    accent: '#F25E3D',
    totalLabel: 'Total Event Attendees',
    totalHelp: 'Registered or checked-in attendees',
    capturedLabel: 'Total Attendees Captured',
    meaningfulLabel: 'Guests with a Meaningful Interaction',
    meaningfulHelp: 'Session check-ins, sponsor activations, or deep engagement',
    followUpLabel: 'Avg Days to First Follow-Up',
    followUpHelp: 'Days before organizer/sponsor follow-up',
    convertedLabel: 'Post-Event Conversions',
    convertedHelp: 'Sponsor meetings, registrations, or qualified outcomes',
  },
];

interface Inputs {
  total: string;
  captured: string;
  meaningful: string;
  followUpDays: string;
  converted: string;
}

const EMPTY: Inputs = { total: '', captured: '', meaningful: '', followUpDays: '', converted: '' };

function followUpScore(days: number): number {
  if (days <= 1) return 100;
  if (days <= 2) return 85;
  if (days <= 3) return 70;
  if (days <= 5) return 50;
  if (days <= 7) return 35;
  if (days <= 14) return 20;
  return 10;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function computeScores(inputs: Inputs) {
  const total = inputs.total ? Number(inputs.total) : null;
  const captured = inputs.captured ? Number(inputs.captured) : null;
  const meaningful = inputs.meaningful ? Number(inputs.meaningful) : null;
  const days = inputs.followUpDays ? Number(inputs.followUpDays) : null;
  const converted = inputs.converted ? Number(inputs.converted) : null;

  const capture =
    total !== null && total > 0 && captured !== null
      ? clamp((captured / total) * 100)
      : null;
  const engagement =
    captured !== null && captured > 0 && meaningful !== null
      ? clamp((meaningful / captured) * 100)
      : null;
  const followUp = days !== null && days >= 0 ? followUpScore(days) : null;
  // Conversion: B2B-realistic — 20% converted maxes out the score.
  const conversion =
    captured !== null && captured > 0 && converted !== null
      ? clamp((converted / captured) * 500)
      : null;

  const scores = [capture, engagement, followUp, conversion];
  const valid = scores.filter((s): s is number => s !== null);
  const total100 = valid.length > 0
    ? Math.round(valid.reduce((s, v) => s + v, 0) / valid.length)
    : null;

  return { total: total100, capture, engagement, followUp, conversion };
}

function tierOf(score: number): { label: string; color: string; range: string } {
  if (score >= 85) return { label: 'Elite ROX', color: '#0CF4DF', range: '85–100' };
  if (score >= 70) return { label: 'High ROX', color: '#5FD9C2', range: '70–84' };
  if (score >= 40) return { label: 'Needs Optimization', color: '#F2B33D', range: '40–69' };
  return { label: 'Critical Gap', color: '#E5484D', range: '0–39' };
}

const TIERS = [
  { label: 'Critical', color: '#E5484D', max: 39 },
  { label: 'Optimize', color: '#F2B33D', max: 69 },
  { label: 'High', color: '#5FD9C2', max: 84 },
  { label: 'Elite', color: '#0CF4DF', max: 100 },
];

export default function RoxCalculatorDialog({ open, onClose }: RoxCalculatorDialogProps) {
  const [solutionId, setSolutionId] = useState<SolutionId>('trade-shows');
  const [inputs, setInputs] = useState<Inputs>(EMPTY);

  useEffect(() => {
    if (!open) {
      setSolutionId('trade-shows');
      setInputs(EMPTY);
    }
  }, [open]);

  const solution = useMemo(() => SOLUTIONS.find(s => s.id === solutionId)!, [solutionId]);
  const scores = useMemo(() => computeScores(inputs), [inputs]);
  const tier = scores.total !== null ? tierOf(scores.total) : null;

  if (!open) return null;

  const setField = (key: keyof Inputs, value: string) => {
    // Allow only positive integers (or empty)
    if (value === '' || /^\d+$/.test(value)) {
      setInputs(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleReset = () => setInputs(EMPTY);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 13px',
    background: 'var(--exp-input-bg)',
    border: '1px solid var(--exp-border)',
    borderRadius: 10,
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 400,
    color: 'var(--exp-input-text)',
    outline: 'none',
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--exp-text-2)',
    marginBottom: 4,
    display: 'block',
  };

  const fieldHelpStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 300,
    color: 'var(--exp-text-3)',
    marginTop: 4,
  };

  const categoryCardStyle: React.CSSProperties = {
    padding: 14,
    borderRadius: 12,
    border: '1px solid var(--exp-border)',
    background: 'var(--exp-surface)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  const categoryTitleStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: 'var(--exp-cyan)',
  };

  return (
    <div
      className={`exp-dialog-overlay ${open ? 'open' : ''}`}
      onClick={onClose}
      style={{ background: 'var(--exp-dialog-overlay-bg)' }}
    >
      <div
        className="exp-dialog exp-notes-inner"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--exp-dialog-bg)',
          backdropFilter: 'blur(32px)',
          border: '1px solid var(--exp-dialog-border)',
          boxShadow: 'var(--exp-dialog-shadow)',
          maxHeight: '94%',
          overflowY: 'auto',
          width: 'min(840px, 92vw)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div className="exp-dialog-title" style={{ fontSize: 28, marginBottom: 6 }}>
            ROX Calculator
          </div>
          <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--exp-text-2)' }}>
            Return on Experience — score your last event in under a minute.
          </div>
        </div>

        {/* Solution selector */}
        <div className="exp-notes-field-group" style={{ marginBottom: 16 }}>
          <div className="exp-notes-field-label" style={{ fontSize: 12 }}>
            Which solution are you measuring?
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8,
            }}
          >
            {SOLUTIONS.map(s => {
              const Icon = s.icon;
              const selected = s.id === solutionId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSolutionId(s.id)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 12,
                    border: `1px solid ${selected ? s.accent : 'var(--exp-border)'}`,
                    background: selected ? `${s.accent}26` : 'transparent',
                    color: selected ? 'var(--exp-text-1)' : 'var(--exp-text-2)',
                    fontFamily: 'inherit',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'var(--exp-transition)',
                    lineHeight: 1.2,
                    textAlign: 'center',
                  }}
                >
                  <Icon
                    style={{
                      width: 20,
                      height: 20,
                      strokeWidth: 1.5,
                      color: selected ? s.accent : 'var(--exp-text-2)',
                    }}
                  />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories — 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {/* Lead Capture */}
          <div style={categoryCardStyle}>
            <div style={categoryTitleStyle}>Lead Capture Efficiency</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={fieldLabelStyle}>{solution.totalLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.total}
                  onChange={e => setField('total', e.target.value)}
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
              <div>
                <label style={fieldLabelStyle}>{solution.capturedLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.captured}
                  onChange={e => setField('captured', e.target.value)}
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
            </div>
            <div style={fieldHelpStyle}>{solution.totalHelp}</div>
          </div>

          {/* Engagement */}
          <div style={categoryCardStyle}>
            <div style={categoryTitleStyle}>Engagement Quality</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={fieldLabelStyle}>{solution.meaningfulLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.meaningful}
                  onChange={e => setField('meaningful', e.target.value)}
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
              <div>
                <label style={fieldLabelStyle}>{solution.capturedLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.captured}
                  onChange={e => setField('captured', e.target.value)}
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
            </div>
            <div style={fieldHelpStyle}>{solution.meaningfulHelp}</div>
          </div>

          {/* Follow-Up Speed */}
          <div style={categoryCardStyle}>
            <div style={categoryTitleStyle}>Follow-Up Speed</div>
            <div>
              <label style={fieldLabelStyle}>{solution.followUpLabel}</label>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.followUpDays}
                onChange={e => setField('followUpDays', e.target.value)}
                style={inputStyle}
                placeholder="0"
              />
            </div>
            <div style={fieldHelpStyle}>{solution.followUpHelp}</div>
          </div>

          {/* Conversion */}
          <div style={categoryCardStyle}>
            <div style={categoryTitleStyle}>Conversion Effectiveness</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={fieldLabelStyle}>{solution.convertedLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.converted}
                  onChange={e => setField('converted', e.target.value)}
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
              <div>
                <label style={fieldLabelStyle}>{solution.capturedLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.captured}
                  onChange={e => setField('captured', e.target.value)}
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
            </div>
            <div style={fieldHelpStyle}>{solution.convertedHelp}</div>
          </div>
        </div>

        {/* Live ROX score */}
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            border: `1px solid ${tier ? tier.color : 'var(--exp-border)'}`,
            background: tier ? `${tier.color}12` : 'var(--exp-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  color: 'var(--exp-text-3)',
                  marginBottom: 4,
                }}
              >
                Your ROX Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 500,
                    lineHeight: 1,
                    color: tier ? tier.color : 'var(--exp-text-3)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {scores.total !== null ? scores.total : '—'}
                </div>
                {tier && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: tier.color, lineHeight: 1.1 }}>
                      {tier.label}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--exp-text-3)' }}>
                      Tier range {tier.range}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tier scale bar */}
          <div style={{ display: 'flex', gap: 3, height: 8, borderRadius: 4, overflow: 'hidden' }}>
            {TIERS.map(t => {
              const active = scores.total !== null && tier?.color === t.color;
              return (
                <div
                  key={t.label}
                  style={{
                    flex: 1,
                    background: active ? t.color : `${t.color}33`,
                    transition: 'var(--exp-transition)',
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 3, fontSize: 10, fontWeight: 500, color: 'var(--exp-text-3)' }}>
            {TIERS.map(t => (
              <div key={t.label} style={{ flex: 1, textAlign: 'center' }}>{t.label}</div>
            ))}
          </div>

          {/* Per-category breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 4 }}>
            {[
              { label: 'Capture', value: scores.capture },
              { label: 'Engagement', value: scores.engagement },
              { label: 'Follow-Up', value: scores.followUp },
              { label: 'Conversion', value: scores.conversion },
            ].map(c => (
              <div
                key={c.label}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'var(--exp-card-bg)',
                  border: '1px solid var(--exp-card-border)',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--exp-text-3)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--exp-text-1)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                  {c.value !== null ? Math.round(c.value) : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="exp-dialog-actions" style={{ marginTop: 16 }}>
          <button
            className="exp-dialog-btn exp-dialog-btn-cancel"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="exp-dialog-btn exp-dialog-btn-send"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
