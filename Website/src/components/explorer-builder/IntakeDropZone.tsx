'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Upload, FileText, FileSpreadsheet, Image, X } from 'lucide-react';

interface IntakeDropZoneProps {
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  label: string;
  hint?: string;
  preview?: boolean;
  compact?: boolean;
  light?: boolean;
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return <FileText className="w-5 h-5" />;
  if (['xlsx', 'xls', 'csv'].includes(ext)) return <FileSpreadsheet className="w-5 h-5" />;
  if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) return <Image className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IntakeDropZone({
  accept,
  multiple = false,
  files,
  onChange,
  label,
  hint,
  preview = false,
  compact = false,
  light = false,
}: IntakeDropZoneProps) {
  // Color tokens based on theme
  const c = light
    ? { border: 'rgba(6,19,65,0.10)', borderActive: '#00BBA5', bg: 'rgba(6,19,65,0.02)', bgHover: 'rgba(0,187,165,0.04)', text: 'rgba(6,19,65,0.38)', textFile: 'rgba(6,19,65,0.55)', textSize: 'rgba(6,19,65,0.30)', icon: 'rgba(6,19,65,0.25)', fileBg: 'rgba(6,19,65,0.03)', fileBorder: 'rgba(6,19,65,0.06)', xBg: '#F5F6FA', xColor: 'rgba(6,19,65,0.4)' }
    : { border: 'rgba(255,255,255,0.08)', borderActive: '#00BBA5', bg: 'rgba(255,255,255,0.02)', bgHover: 'rgba(0,187,165,0.04)', text: 'rgba(255,255,255,0.4)', textFile: 'rgba(255,255,255,0.7)', textSize: 'rgba(255,255,255,0.3)', icon: 'rgba(255,255,255,0.3)', fileBg: 'rgba(255,255,255,0.04)', fileBorder: 'rgba(255,255,255,0.06)', xBg: '#07081F', xColor: 'rgba(255,255,255,0.6)' };
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview URL for single image files
  useEffect(() => {
    if (preview && files.length === 1 && files[0].type.startsWith('image/')) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [files, preview]);

  const handleFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      if (multiple) {
        onChange([...files, ...arr]);
      } else {
        onChange(arr.slice(0, 1));
      }
    },
    [files, multiple, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const hasFile = files.length > 0;

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? c.borderActive : hasFile ? c.borderActive + '40' : c.border}`,
          borderRadius: 12,
          padding: compact ? '16px 12px' : '24px 20px',
          background: dragging ? c.bgHover : c.bg,
          cursor: 'pointer',
          transition: 'all 0.2s',
          textAlign: 'center',
          minHeight: compact ? 100 : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {preview && previewUrl ? (
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxHeight: compact ? 48 : 64,
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 6,
              }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); onChange([]); }}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `1px solid ${c.border}`,
                background: c.xBg,
                color: c.xColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <X style={{ width: 12, height: 12 }} />
            </button>
          </div>
        ) : !hasFile ? (
          <>
            <Upload style={{ width: compact ? 18 : 22, height: compact ? 18 : 22, color: c.icon }} />
            <div style={{ fontSize: compact ? 12 : 13, color: c.text, fontWeight: 400 }}>
              {label}
            </div>
            {hint && !compact && (
              <div style={{ fontSize: 11, color: c.icon }}>{hint}</div>
            )}
          </>
        ) : !preview ? (
          <div style={{ fontSize: 12, color: c.text }}>
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
              e.target.value = '';
            }
          }}
          style={{ display: 'none' }}
        />
      </div>

      {/* File list (for multi-file non-preview zones) */}
      {multiple && files.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                background: c.fileBg,
                border: `1px solid ${c.fileBorder}`,
              }}
            >
              <span style={{ color: c.icon }}>{fileIcon(file.name)}</span>
              <span style={{ flex: 1, fontSize: 13, color: c.textFile, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
              <span style={{ fontSize: 11, color: c.textSize }}>{formatSize(file.size)}</span>
              <button
                onClick={() => removeFile(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: c.icon,
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
