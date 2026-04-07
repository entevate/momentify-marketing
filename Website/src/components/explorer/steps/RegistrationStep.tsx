'use client';

import { useState } from 'react';
import { QrCode, Search, Globe, Check } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';

const SAMPLE_RESULTS = [
  { initials: 'JD', name: 'John Doe', meta: 'Acme Corp - VP Engineering' },
  { initials: 'SM', name: 'Sarah Mitchell', meta: 'TechStart Inc - Director of Ops' },
  { initials: 'RK', name: 'Raj Kumar', meta: 'GlobalTech - Senior Manager' },
];

export default function RegistrationStep() {
  const { config, session, nextStep, setVisitorName, setRegisteredEmail } = useExplorer();
  const reg = config.registration;
  const mode = session.mode;

  // Form state
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  // Search state
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find name and email field IDs for direct context updates
  const firstNameField = reg.fields.find(f => f.placeholder?.toLowerCase().includes('first'));
  const emailField = reg.fields.find(f => f.type === 'email');

  const handleFormChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    // Update context directly so BottomBar next/skip captures data
    if (firstNameField && fieldId === firstNameField.id) {
      setVisitorName(value.trim());
    }
    if (emailField && fieldId === emailField.id) {
      setRegisteredEmail(value.trim());
    }
  };

  const handleSearchSelect = (result: typeof SAMPLE_RESULTS[0]) => {
    setSelectedResult(result.initials);
    setSearchQuery(result.name);
    const firstName = result.name.split(' ')[0];
    setVisitorName(firstName);
    setRegisteredEmail(`${result.name.toLowerCase().replace(/\s/g, '.')}@example.com`);
  };

  // ─── Scan View ────────────────────────────────
  if (mode === 'scan') {
    return (
      <div className="exp-scan-view">
        <div className="exp-scan-status">
          <span className="exp-scan-dot" />
          Ready
        </div>
        <div className="exp-scan-ring" onClick={() => { setVisitorName('Jordan'); setRegisteredEmail('jordan@example.com'); nextStep(); }} style={{ cursor: 'pointer' }}>
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

    // Check if required fields are filled for enabling next
    const requiredFields = reg.fields.filter(f => f.required);
    const allRequiredFilled = requiredFields.every(f => formValues[f.id]?.trim());

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
                      value={formValues[field.id] || ''}
                      onChange={e => handleFormChange(field.id, e.target.value)}
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
                value={formValues[field.id] || ''}
                onChange={e => handleFormChange(field.id, e.target.value)}
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
        </div>
      </div>
    );
  }

  // ─── Search View ──────────────────────────────
  // Show results only after 2+ characters typed (matches Cat Defense)
  const showResults = searchQuery.length >= 2 && !selectedResult;

  return (
    <div className="exp-search-view">
      <div className="exp-search-box">
        <Search />
        <input
          type="text"
          placeholder={reg.searchPlaceholder}
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            if (selectedResult) {
              setSelectedResult(null);
              setVisitorName('');
              setRegisteredEmail('');
            }
          }}
        />
      </div>

      {/* Results — shown after 2+ chars typed */}
      {showResults && (
        <div className="exp-search-results">
          {SAMPLE_RESULTS.map((result) => (
            <div
              className="exp-search-result"
              key={result.initials}
              onClick={() => handleSearchSelect(result)}
              style={{ cursor: 'pointer' }}
            >
              <div className="exp-search-initials">{result.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="exp-search-name">{result.name}</div>
                <div className="exp-search-meta">{result.meta}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected result — shown after selection */}
      {selectedResult && (
        <div className="exp-search-results">
          {SAMPLE_RESULTS.filter(r => r.initials === selectedResult).map((result) => (
            <div
              className="exp-search-result selected"
              key={result.initials}
            >
              <div className="exp-search-initials">{result.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="exp-search-name">{result.name}</div>
                <div className="exp-search-meta">{result.meta}</div>
              </div>
              <div className="exp-search-check">
                <Check />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip — shown when no query or query too short */}
      {!showResults && !selectedResult && (
        <div className="exp-search-empty">
          Type a last name to search
        </div>
      )}
    </div>
  );
}
