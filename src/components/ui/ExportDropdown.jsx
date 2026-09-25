import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSound } from '../../context/SoundContext';
import { Download, ChevronDown, FileText, FileCode, FileJson, Loader2 } from 'lucide-react';

export const ExportDropdown = ({
  label = 'Export',
  options = [
    { label: 'PDF Dossier', format: 'pdf', ext: '.pdf', icon: FileText },
    { label: 'Plain Text', format: 'txt', ext: '.txt', icon: FileCode }
  ],
  onExport,
  variant = 'tactical',
  size = 'sm',
  align = 'right',
  className = ''
}) => {
  const { playSfx } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null);
  const dropdownRef = useRef(null);

  // Measure viewport space to flip dropdown upwards if near bottom of viewport
  const updatePosition = useCallback(() => {
    if (!dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const dropdownHeight = 160; // Estimated height of dropdown menu with padding
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
      setOpenUp(true);
    } else {
      setOpenUp(false);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Re-calculate positioning on scroll or resize when open
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    playSfx('energy');
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = async (format, e) => {
    e.stopPropagation();
    if (exportingFormat) return;
    setExportingFormat(format);
    playSfx('energy');

    try {
      if (onExport) {
        await onExport(format);
      }
    } catch (err) {
      console.error('[ExportDropdown Error]:', err);
    } finally {
      setExportingFormat(null);
      setIsOpen(false);
    }
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl'
  };

  const variantStyles = {
    tactical:
      'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 shadow-md hover:text-amber-300',
    primary:
      'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg border border-amber-300/30',
    secondary:
      'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg border border-cyan-300/30',
    outline:
      'bg-transparent hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 border border-amber-500/40'
  };

  return (
    <div className={`relative inline-block text-left overflow-visible ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={!!exportingFormat}
        className={`inline-flex items-center font-orbitron font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]}`}
      >
        {exportingFormat ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
        ) : (
          <Download className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>{exportingFormat ? `Exporting ${exportingFormat.toUpperCase()}...` : label}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? (openUp ? 'rotate-0 text-amber-400' : 'rotate-180 text-amber-400') : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[9999] w-48 rounded-xl bg-slate-950/98 border border-slate-700 shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-xl py-1.5 animate-fade-in ${
            openUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${align === 'left' ? 'left-0' : 'right-0'}`}
        >
          <div className="px-3 py-1 text-[10px] font-rajdhani font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
            Choose Export Format
          </div>

          {options.map((opt) => {
            const Icon = opt.icon || (opt.format === 'json' ? FileJson : opt.format === 'txt' ? FileCode : FileText);
            const isCurrentlyExporting = exportingFormat === opt.format;

            return (
              <button
                key={opt.format}
                type="button"
                onClick={(e) => handleSelect(opt.format, e)}
                disabled={!!exportingFormat}
                className="w-full text-left px-3 py-2 text-xs font-outfit text-slate-200 hover:text-amber-300 hover:bg-slate-900/90 flex items-center justify-between gap-2 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  {isCurrentlyExporting ? (
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-medium">{opt.label}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold group-hover:text-amber-400/80">
                  {opt.ext || `.${opt.format}`}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
