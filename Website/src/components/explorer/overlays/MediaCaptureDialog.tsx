'use client';

import { Camera, Video, FileText, X } from 'lucide-react';
import { useExplorer } from '../ExplorerContext';

interface MediaCaptureDialogProps {
  open: boolean;
  onClose: () => void;
}

const MEDIA_TYPES = [
  { id: 'photo', label: 'Take Photo', icon: Camera },
  { id: 'video', label: 'Record Video', icon: Video },
  { id: 'document', label: 'Scan Document', icon: FileText },
];

export default function MediaCaptureDialog({ open, onClose }: MediaCaptureDialogProps) {
  const { showToast } = useExplorer();

  if (!open) return null;

  const handleCapture = (type: string) => {
    showToast(`${type} captured`);
    onClose();
  };

  return (
    <div className={`exp-dialog-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="exp-dialog" onClick={e => e.stopPropagation()}>
        <div className="exp-dialog-icon teal">
          <Camera />
        </div>
        <div className="exp-dialog-title">Capture Media</div>
        <div className="exp-dialog-message">
          Choose a capture method.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {MEDIA_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleCapture(label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                borderRadius: 14,
                border: '1px solid var(--exp-border)',
                background: 'transparent',
                color: 'var(--exp-text-2)',
                fontFamily: 'inherit',
                fontSize: 17,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--exp-transition)',
              }}
            >
              <Icon style={{ width: 24, height: 24, color: 'var(--exp-teal)' }} />
              {label}
            </button>
          ))}
        </div>

        <div className="exp-dialog-actions">
          <button className="exp-dialog-btn exp-dialog-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
