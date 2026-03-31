import { useState } from 'react';
import { Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../data/supabaseClient';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [modo, setModo] = useState('login'); // 'login' | 'registro'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    if (modo === 'login') {
      const { error } = await signIn(email, password);
      setCargando(false);
      if (error) setError(error.message);
      return;
    }

    // Registro: crear cuenta y luego actualizar el nombre en profiles
    const { data, error } = await signUp(email, password);
    setCargando(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Si el trigger creó el perfil, actualizamos el nombre
    if (data?.user?.id && nombre.trim()) {
      await supabase
        .from('profiles')
        .update({ name: nombre.trim() })
        .eq('id', data.user.id);
    }

    setMensajeConfirmacion('Revisa tu email para confirmar la cuenta.');
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
          <p className="text-xs text-text-muted">
            {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </p>
        </div>

        {/* Formulario */}
        {mensajeConfirmacion ? (
          <div className="text-center text-sm text-accent-purple-light py-4">
            {mensajeConfirmacion}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {modo === 'registro' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  className="rounded-lg px-3 py-2 text-sm text-text-primary outline-none transition-colors"
                  style={inputStyle}
                  placeholder="Tu nombre de aventurero"
                />
              </div>
            )}

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
              {cargando
                ? 'Cargando...'
                : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        )}

        {/* Toggle login/registro */}
        {!mensajeConfirmacion && (
          <p className="text-center text-xs text-text-muted">
            {modo === 'login' ? '¿Sin cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError(''); setNombre(''); }}
              className="text-accent-purple-light hover:underline"
            >
              {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
