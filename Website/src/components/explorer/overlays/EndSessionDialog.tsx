'use client';

import { LogOut } from 'lucide-react';

interface EndSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EndSessionDialog({ open, onClose, onConfirm }: EndSessionDialogProps) {
  if (!open) return null;

  return (
    <div className={`exp-dialog-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="exp-dialog" onClick={e => e.stopPropagation()}>
        <div className="exp-dialog-icon red">
          <LogOut />
        </div>
        <div className="exp-dialog-title">End Session?</div>
        <div className="exp-dialog-message">
          This will end the current session and show the thank you screen.
        </div>
        <div className="exp-dialog-actions">
          <button className="exp-dialog-btn exp-dialog-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="exp-dialog-btn exp-dialog-btn-confirm" onClick={onConfirm}>
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}
