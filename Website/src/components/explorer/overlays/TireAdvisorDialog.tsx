'use client';

import { useState, useEffect } from 'react';
import { Sun, Snowflake, MapPin, Compass, Mountain, Car } from 'lucide-react';

interface TireAdvisorDialogProps {
  open: boolean;
  onClose: () => void;
}

const WIDTHS = [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315];
const RATIOS = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
const DIAMETERS = [14, 15, 16, 17, 18, 19, 20, 21, 22, 24];

const NEEDS = [
  { value: 'daily-commute', label: 'Daily Commute', icon: Car },
  { value: 'long-trips', label: 'Long Trips', icon: MapPin },
  { value: 'sun-rain', label: 'Sun & Rain', icon: Sun },
  { value: 'cold-wintry', label: 'Cold & Wintry', icon: Snowflake },
  { value: 'light-off-road', label: 'Light Off-Road', icon: Compass },
  { value: 'heavy-off-road', label: 'Heavy Off-Road', icon: Mountain },
] as const;

interface Product {
  id: string;
  name: string;
  line: string;
  rationale: string;
  badge: string;
}

const PRODUCTS: Record<string, Product> = {
  climaflex4s: {
    id: 'climaflex4s',
    name: 'ClimaFlex 4S',
    line: 'Premium All-Season',
    rationale: 'Engineered for cold, wet, and wintry conditions year round.',
    badge: 'All Weather',
  },
  perfectus: {
    id: 'perfectus',
    name: 'Perfectus',
    line: 'Touring Comfort',
    rationale: 'Quiet, comfortable ride for daily driving and city commutes.',
    badge: 'Touring',
  },
  viento: {
    id: 'viento',
    name: 'Viento',
    line: 'High-Performance Touring',
    rationale: 'Long-mileage performance with grip on highway long hauls.',
    badge: 'Performance',
  },
  tormentaAt2: {
    id: 'tormentaAt2',
    name: 'Tormenta A/T2',
    line: 'All-Terrain',
    rationale: 'Balanced on-road comfort with confident off-road traction.',
    badge: 'All-Terrain',
  },
  tormentaMt: {
    id: 'tormentaMt',
    name: 'Tormenta M/T',
    line: 'Mud-Terrain',
    rationale: 'Aggressive bite for mud, rocks, and demanding off-road work.',
    badge: 'Mud-Terrain',
  },
  tormentaHt: {
    id: 'tormentaHt',
    name: 'Tormenta H/T',
    line: 'Highway Light Truck',
    rationale: 'Smooth highway manners for full-size trucks and SUVs.',
    badge: 'Highway',
  },
};

function recommend(
  width: number | null,
  ratio: number | null,
  diameter: number | null,
  needs: Set<string>,
): Product[] {
  const recs: Product[] = [];
  const push = (p: Product) => {
    if (!recs.find(r => r.id === p.id)) recs.push(p);
  };

  if (needs.has('cold-wintry')) push(PRODUCTS.climaflex4s);
  if (needs.has('heavy-off-road')) push(PRODUCTS.tormentaMt);
  if (needs.has('light-off-road')) push(PRODUCTS.tormentaAt2);

  if (needs.has('long-trips')) {
    if (diameter !== null && diameter >= 18) push(PRODUCTS.viento);
    else push(PRODUCTS.viento);
  }

  if (needs.has('daily-commute') || needs.has('sun-rain')) {
    if (width !== null && width >= 255 && needs.has('daily-commute')) {
      push(PRODUCTS.tormentaHt);
    } else {
      push(PRODUCTS.perfectus);
    }
  }

  // If only size selected with no needs, fall back to all-season touring
  if (recs.length === 0 && (width || ratio || diameter)) {
    push(PRODUCTS.perfectus);
    push(PRODUCTS.climaflex4s);
  }

  return recs.slice(0, 3);
}

export default function TireAdvisorDialog({ open, onClose }: TireAdvisorDialogProps) {
  const [width, setWidth] = useState<string>('');
  const [ratio, setRatio] = useState<string>('');
  const [diameter, setDiameter] = useState<string>('');
  const [needs, setNeeds] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setWidth('');
      setRatio('');
      setDiameter('');
      setNeeds(new Set());
      setShowResults(false);
    }
  }, [open]);

  if (!open) return null;

  const toggleNeed = (value: string) => {
    setNeeds(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setShowResults(false);
  };

  const handleFind = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setWidth('');
    setRatio('');
    setDiameter('');
    setNeeds(new Set());
    setShowResults(false);
  };

  const canFind = width !== '' || ratio !== '' || diameter !== '' || needs.size > 0;

  const recommendations = showResults
    ? recommend(
        width ? Number(width) : null,
        ratio ? Number(ratio) : null,
        diameter ? Number(diameter) : null,
        needs,
      )
    : [];

  const selectStyle: React.CSSProperties = {
    flex: 1,
    padding: '14px 16px',
    background: 'var(--exp-surface)',
    border: '1px solid var(--exp-border)',
    borderRadius: 12,
    fontFamily: 'inherit',
    fontSize: 16,
    fontWeight: 400,
    color: 'var(--exp-text-1)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
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
          maxHeight: '92%',
          overflowY: 'auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="exp-dialog-title" style={{ fontSize: 31, marginBottom: 8 }}>
            Tire Advisor
          </div>
          <div style={{ fontSize: 16, fontWeight: 300, color: 'var(--exp-text-2)' }}>
            Find your perfect Fortune Tire.
          </div>
        </div>

        {/* Section 1: Tire Size */}
        <div className="exp-notes-field-group">
          <div className="exp-notes-field-label">Tire Size</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <select
              style={selectStyle}
              value={width}
              onChange={e => { setWidth(e.target.value); setShowResults(false); }}
            >
              <option value="">Width</option>
              {WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select
              style={selectStyle}
              value={ratio}
              onChange={e => { setRatio(e.target.value); setShowResults(false); }}
            >
              <option value="">Ratio</option>
              {RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              style={selectStyle}
              value={diameter}
              onChange={e => { setDiameter(e.target.value); setShowResults(false); }}
            >
              <option value="">Diameter</option>
              {DIAMETERS.map(d => <option key={d} value={d}>R{d}</option>)}
            </select>
          </div>
        </div>

        {/* Section 2: Driving Needs */}
        <div className="exp-notes-field-group">
          <div className="exp-notes-field-label">Driving Needs</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
            }}
          >
            {NEEDS.map(({ value, label, icon: Icon }) => {
              const selected = needs.has(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleNeed(value)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: `1px solid ${selected ? 'var(--exp-cyan)' : 'var(--exp-border)'}`,
                    background: selected ? 'var(--exp-cyan-15)' : 'transparent',
                    color: selected ? 'var(--exp-cyan)' : 'var(--exp-text-2)',
                    fontFamily: 'inherit',
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'var(--exp-transition)',
                  }}
                >
                  <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="exp-notes-field-group">
            <div className="exp-notes-field-label">Recommended Tires</div>
            {recommendations.length === 0 ? (
              <div
                style={{
                  padding: 20,
                  borderRadius: 14,
                  border: '1px dashed var(--exp-border)',
                  color: 'var(--exp-text-3)',
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 300,
                }}
              >
                Select at least one driving need to see recommendations.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${recommendations.length}, 1fr)`,
                  gap: 12,
                }}
              >
                {recommendations.map(p => (
                  <div
                    key={p.id}
                    style={{
                      padding: 18,
                      borderRadius: 14,
                      border: '1px solid var(--exp-cyan)',
                      background: 'var(--exp-cyan-15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        color: 'var(--exp-cyan)',
                      }}
                    >
                      {p.badge}
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 500, color: 'var(--exp-text-1)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--exp-text-2)' }}>
                      {p.line}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 300,
                        color: 'var(--exp-text-2)',
                        lineHeight: 1.5,
                        marginTop: 4,
                      }}
                    >
                      {p.rationale}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="exp-dialog-actions" style={{ marginTop: 8 }}>
          <button
            className="exp-dialog-btn exp-dialog-btn-cancel"
            onClick={showResults ? handleReset : onClose}
          >
            {showResults ? 'Reset' : 'Close'}
          </button>
          <button
            className="exp-dialog-btn exp-dialog-btn-send"
            onClick={handleFind}
            disabled={!canFind}
            style={{ opacity: canFind ? 1 : 0.4, cursor: canFind ? 'pointer' : 'not-allowed' }}
          >
            Find Tires
          </button>
        </div>
      </div>
    </div>
  );
}
