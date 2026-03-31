import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';

export function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = cargando

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => {
    localStorage.removeItem('quest-life-data');
    return supabase.auth.signOut();
  };

  return { session, signIn, signOut };
}
