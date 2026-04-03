'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Square, X } from 'lucide-react';
import { useExplorer } from '../ExplorerContext';

interface VoiceCaptureDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function VoiceCaptureDialog({ open, onClose }: VoiceCaptureDialogProps) {
  const { showToast } = useExplorer();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(20).fill(8));
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const waveRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      waveRef.current = setInterval(() => {
        setWaveHeights(prev => prev.map(() => 8 + Math.random() * 44));
      }, 150);
    } else {
      clearInterval(timerRef.current);
      clearInterval(waveRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(waveRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    if (!open) {
      setIsRecording(false);
      setElapsed(0);
      setWaveHeights(Array(20).fill(8));
    }
  }, [open]);

  if (!open) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    setIsRecording(false);
    showToast('Voice note saved');
    onClose();
  };

  return (
    <div className={`exp-dialog-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="exp-dialog" style={{ maxWidth: 520, padding: '52px 64px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div className="exp-dialog-icon teal">
          <Mic />
        </div>
        <div className="exp-dialog-title">Voice Note</div>
        <div className="exp-dialog-message">
          {isRecording ? 'Recording in progress...' : 'Tap the microphone to start recording.'}
        </div>

        {/* Waveform */}
        <div className="exp-voice-waveform" style={{ marginBottom: 24 }}>
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className="exp-voice-bar"
              style={{
                height: isRecording ? h : 8,
                opacity: isRecording ? 0.7 : 0.2,
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <div style={{
          fontSize: 32,
          fontWeight: 500,
          color: isRecording ? '#E5484D' : 'var(--exp-text-3)',
          marginBottom: 32,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatTime(elapsed)}
        </div>

        {/* Record/Stop button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <button
            onClick={() => isRecording ? setIsRecording(false) : setIsRecording(true)}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: `2px solid ${isRecording ? '#E5484D' : 'var(--exp-teal)'}`,
              background: isRecording ? 'rgba(229,72,77,0.1)' : 'transparent',
              color: isRecording ? '#E5484D' : 'var(--exp-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--exp-transition)',
            }}
          >
            {isRecording ? <Square style={{ width: 28, height: 28 }} /> : <Mic style={{ width: 32, height: 32 }} />}
          </button>
        </div>

        <div className="exp-dialog-actions">
          <button className="exp-dialog-btn exp-dialog-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          {elapsed > 0 && (
            <button className="exp-dialog-btn exp-dialog-btn-send" onClick={handleSave}>
              Save Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
