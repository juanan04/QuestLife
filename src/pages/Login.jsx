import { useState } from 'react';
import { Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    const { error } = await signIn(email, password);
    setCargando(false);
    if (error) setError(error.message);
  };

  const inputStyle = {
    backgroundColor: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm rounded-2xl border p-8 flex flex-col gap-6"
        style={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-accent-purple-light" />
            <Zap size={20} className="text-accent-gold" />
          </div>
          <h1
            className="text-xl font-bold text-text-primary"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Quest Life
          </h1>
          <p className="text-xs text-text-muted">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="rounded-lg px-3 py-2 text-sm text-text-primary outline-none transition-colors"
              style={inputStyle}
              placeholder="tu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg px-3 py-2 text-sm text-text-primary outline-none transition-colors"
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#7c3aed' }}
          >
            {cargando ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
