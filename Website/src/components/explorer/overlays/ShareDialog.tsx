'use client';

import { useState } from 'react';
import { Mail, MessageSquare, QrCode, X, Send } from 'lucide-react';
import { useExplorer } from '../ExplorerContext';

type ShareType = 'email' | 'text' | 'qr';

interface ShareDialogProps {
  open: boolean;
  type: ShareType;
  onClose: () => void;
}

export default function ShareDialog({ open, type, onClose }: ShareDialogProps) {
  const { showToast, session } = useExplorer();
  const [inputValue, setInputValue] = useState('');

  if (!open) return null;

  const handleSend = () => {
    showToast(type === 'email' ? 'Email sent!' : 'Text sent!');
    setInputValue('');
    onClose();
  };

  return (
    <div className={`exp-dialog-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="exp-dialog" onClick={e => e.stopPropagation()}>
        {type === 'qr' ? (
          <>
            <div className="exp-dialog-icon teal">
              <QrCode />
            </div>
            <div className="exp-dialog-title">Scan QR Code</div>
            <div className="exp-dialog-message">
              Scan this code with your phone to receive your personalized content.
            </div>
            <div className="exp-qr-container">
              <canvas
                ref={canvas => {
                  if (canvas) drawPseudoQR(canvas);
                }}
                width={208}
                height={208}
              />
            </div>
            <div className="exp-dialog-actions">
              <button className="exp-dialog-btn exp-dialog-btn-cancel" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="exp-dialog-icon teal">
              {type === 'email' ? <Mail /> : <MessageSquare />}
            </div>
            <div className="exp-dialog-title">
              {type === 'email' ? 'Send via Email' : 'Send via Text'}
            </div>
            <div className="exp-dialog-message">
              {type === 'email'
                ? 'Enter your email to receive your personalized content.'
                : 'Enter your phone number to receive a link.'}
            </div>
            <input
              className="exp-dialog-input"
              type={type === 'email' ? 'email' : 'tel'}
              placeholder={type === 'email' ? (session.registeredEmail || 'name@company.com') : (session.registeredPhone || '(555) 555-5555')}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <div className="exp-dialog-actions">
              <button className="exp-dialog-btn exp-dialog-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="exp-dialog-btn exp-dialog-btn-send" onClick={handleSend}>
                <Send style={{ width: 16, height: 16, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Draw a pseudo-random QR pattern on canvas */
function drawPseudoQR(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = 208;
  const moduleSize = 8;
  const modules = Math.floor(size / moduleSize);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000';

  // Draw finder patterns (3 corners)
  const drawFinder = (x: number, y: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isInner) {
          ctx.fillRect((x + c) * moduleSize, (y + r) * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  // Fill random data modules
  const seed = 42;
  let hash = seed;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder pattern areas
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) continue;
      hash = ((hash * 1103515245 + 12345) >>> 0) % 2147483647;
      if (hash % 3 === 0) {
        ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}
