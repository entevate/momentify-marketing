'use client';

import { useState } from 'react';
import { StickyNote, Flame, Thermometer, Snowflake, CloudSnow, Mic, Camera, X } from 'lucide-react';
import { useExplorer } from '../ExplorerContext';

interface NotesDialogProps {
  open: boolean;
  onClose: () => void;
}

const LEAD_TEMPS = [
  { value: 'hot' as const, label: 'Hot', icon: Flame },
  { value: 'warm' as const, label: 'Warm', icon: Thermometer },
  { value: 'cool' as const, label: 'Cool', icon: Snowflake },
  { value: 'cold' as const, label: 'Cold', icon: CloudSnow },
];

const ASSIGNEES = [
  'Sarah Johnson',
  'Mike Thompson',
  'Rachel Kim',
  'David Chen',
  'Emily Rodriguez',
];

export default function NotesDialog({ open, onClose }: NotesDialogProps) {
  const { config, session, setLeadTemp, setNotes, setAssignee, showToast, goToStep } = useExplorer();
  const [isRecording, setIsRecording] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    onClose();
    showToast('Notes saved');
    // Navigate to splash after saving
    const splashStep = config.steps.find(s => s.type === 'splash');
    if (splashStep) {
      setTimeout(() => goToStep(splashStep.id), 1500);
    }
  };

  return (
    <div className={`exp-dialog-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div
        className="exp-dialog exp-notes-inner"
        onClick={e => e.stopPropagation()}
      >
        <div className="exp-dialog-title" style={{ textAlign: 'center', marginBottom: 38, fontSize: 31 }}>
          Session Notes
        </div>

        {/* Lead Temperature */}
        <div className="exp-notes-field-group">
          <div className="exp-notes-field-label">Lead Temperature</div>
          <div className="exp-lead-temp-chips">
            {LEAD_TEMPS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                className={`exp-lead-temp-chip ${session.leadTemp === value ? 'selected' : ''}`}
                data-temp={value}
                onClick={() => setLeadTemp(value)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="exp-notes-field-group">
          <div className="exp-notes-field-label">Notes</div>
          <div style={{ position: 'relative', width: '100%' }}>
            <textarea
              className="exp-notes-textarea"
              placeholder="Add session notes..."
              value={session.notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: 8,
            }}>
              <button
                className={`exp-btn-persistent ${isRecording ? 'exp-recording' : ''}`}
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: '50%',
                  borderColor: isRecording ? '#E5484D' : 'rgba(0,187,165,0.4)',
                  color: isRecording ? '#E5484D' : 'var(--exp-teal)',
                }}
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic style={{ width: 22, height: 22 }} />
              </button>
              <button
                className="exp-btn-persistent"
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: '50%',
                  borderColor: 'rgba(0,187,165,0.4)',
                  color: 'var(--exp-teal)',
                }}
              >
                <Camera style={{ width: 22, height: 22 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Assignee */}
        <div className="exp-notes-field-group" style={{ overflow: 'visible' }}>
          <div className="exp-notes-field-label">Assign To</div>
          <div style={{ position: 'relative' }}>
            <button
              className="exp-dialog-input"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
            >
              <span style={{ color: session.assignee ? 'var(--exp-text-1)' : 'var(--exp-text-3)' }}>
                {session.assignee || 'Select team member...'}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showAssigneeDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 6,
                background: 'var(--exp-bg)',
                border: '1px solid var(--exp-border)',
                borderRadius: 12,
                padding: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                zIndex: 100,
              }}>
                {ASSIGNEES.map(name => (
                  <button
                    key={name}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--exp-text-2)',
                      fontFamily: 'inherit',
                      fontSize: 15,
                      textAlign: 'left',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setAssignee(name);
                      setShowAssigneeDropdown(false);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="exp-dialog-actions" style={{ marginTop: 8 }}>
          <button className="exp-dialog-btn exp-dialog-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="exp-dialog-btn exp-dialog-btn-send" onClick={handleSave}>
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
