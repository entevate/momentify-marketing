'use client';

import { QrCode, Search, Globe } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';

const SAMPLE_RESULTS = [
  { initials: 'JD', name: 'John Doe', meta: 'Acme Corp - VP Engineering' },
  { initials: 'SM', name: 'Sarah Mitchell', meta: 'TechStart Inc - Director of Ops' },
  { initials: 'RK', name: 'Raj Kumar', meta: 'GlobalTech - Senior Manager' },
];

export default function RegistrationStep() {
  const { config, session, nextStep } = useExplorer();
  const reg = config.registration;
  const mode = session.mode;

  // ─── Scan View ────────────────────────────────
  if (mode === 'scan') {
    return (
      <div className="exp-scan-view">
        <div className="exp-scan-status">
          <span className="exp-scan-dot" />
          Ready
        </div>
        <div className="exp-scan-ring" onClick={nextStep} style={{ cursor: 'pointer' }}>
          <div className="exp-scan-corner-tr" />
          <div className="exp-scan-corner-bl" />
          <QrCode />
        </div>
        <div className="exp-scan-label">{reg.scanLabel}</div>
        <div className="exp-scan-hint">{reg.scanHint}</div>
      </div>
    );
  }

  // ─── Form View ────────────────────────────────
  if (mode === 'form') {
    // Group fields into rows: halfWidth fields pair up, full-width fields get their own row
    const rows: typeof reg.fields[] = [];
    let halfBuffer: typeof reg.fields = [];

    for (const field of reg.fields) {
      if (field.halfWidth) {
        halfBuffer.push(field);
        if (halfBuffer.length === 2) {
          rows.push(halfBuffer);
          halfBuffer = [];
        }
      } else {
        if (halfBuffer.length > 0) {
          rows.push(halfBuffer);
          halfBuffer = [];
        }
        rows.push([field]);
      }
    }
    if (halfBuffer.length > 0) rows.push(halfBuffer);

    return (
      <div className="exp-form-view">
        <div className="exp-form-header">
          <div className="exp-form-title">{reg.formTitle}</div>
          <div className="exp-form-subtitle">{reg.formSubtitle}</div>
        </div>

        {rows.map((row, ri) => {
          if (row.length === 2) {
            return (
              <div className="exp-form-row" key={ri}>
                {row.map((field) => (
                  <div className="exp-form-field" key={field.id}>
                    <label>
                      {field.label}
                      {field.required && <span className="exp-required"> *</span>}
                    </label>
                    <input
                      type={field.type === 'select' ? 'text' : field.type}
                      placeholder={field.placeholder}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            );
          }
          const field = row[0];
          return (
            <div className="exp-form-field" key={field.id}>
              <label>
                {field.label}
                {field.required && <span className="exp-required"> *</span>}
              </label>
              <input
                type={field.type === 'select' ? 'text' : field.type}
                placeholder={field.placeholder}
                readOnly
              />
            </div>
          );
        })}

        <div className="exp-form-footer">
          {reg.optInText && <div className="exp-form-opt-in">{reg.optInText}</div>}
          {reg.showLocaleButton && (
            <button className="exp-btn-locale" type="button">
              <Globe style={{ width: 12, height: 12, marginRight: 4, verticalAlign: -2 }} />
              English (US)
            </button>
          )}
          <button className="exp-btn-next" type="button" onClick={nextStep}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ─── Search View ──────────────────────────────
  return (
    <div className="exp-search-view">
      <div className="exp-search-box">
        <Search />
        <input
          type="text"
          placeholder={reg.searchPlaceholder}
          readOnly
        />
      </div>
      <div className="exp-search-results">
        {SAMPLE_RESULTS.map((result) => (
          <div
            className="exp-search-result"
            key={result.initials}
            onClick={nextStep}
            style={{ cursor: 'pointer' }}
          >
            <div className="exp-search-initials">{result.initials}</div>
            <div>
              <div className="exp-search-name">{result.name}</div>
              <div className="exp-search-meta">{result.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
