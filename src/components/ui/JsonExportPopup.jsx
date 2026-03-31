import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function JsonExportPopup({ onClose }) {
  const { data } = useGame();
  const [copiado, setCopiado] = useState(false);

  const json = JSON.stringify(data, null, 2);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const copiar = async () => {
    await navigator.clipboard.writeText(json);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border flex flex-col"
        style={{
          backgroundColor: '#12121a',
          borderColor: 'rgba(255,255,255,0.08)',
          maxHeight: '80vh',
        }}
      >
        {/* Cabecera */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-sm font-semibold text-[#e2e8f0]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Exportar estructura JSON
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copiar}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor: copiado ? '#10b981' : '#7c3aed',
                color: 'white',
              }}
            >
              {copiado ? <Check size={13} /> : <Copy size={13} />}
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
            <button
              onClick={onClose}
              className="text-[#64748b] hover:text-[#e2e8f0] transition-colors p-1 rounded"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <pre
          className="overflow-auto p-4 text-xs leading-relaxed text-[#94a3b8] select-all"
          style={{ fontFamily: 'monospace', flex: 1 }}
        >
          {json}
        </pre>
      </div>
    </div>
  );
}
