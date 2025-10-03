import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    console.log("AuthContext: Fetching user profile for", supabaseUser.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, plan')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.warn('AuthContext: Não foi possível buscar o perfil completo do usuário, usando valores padrão:', error.message);
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email?.split('@')[0] || 'Usuário',
        plan: 'Gratuito',
      };
    }
    console.log("AuthContext: User profile fetched:", data);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: data.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
      plan: data.plan || 'Gratuito',
    };
  }, []);

  useEffect(() => {
    console.log("AuthContext: useEffect triggered.");
    const initializeSession = async () => {
        console.log("AuthContext: initializeSession started.");
        try {
            console.log("AuthContext: Calling supabase.auth.getSession()...");
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("AuthContext: Error getting session:", sessionError);
                setError(sessionError.message);
            }
            console.log("AuthContext: supabase.auth.getSession() returned:", session);
            if (session?.user) {
                console.log("AuthContext: Session user found, fetching profile.");
                const profile = await fetchUserProfile(session.user);
                setUser(profile);
            } else {
                console.log("AuthContext: No session user found.");
                setUser(null);
            }
        } catch (e: any) { // Catch any potential network errors or other issues
            console.error("AuthContext: Error during initializeSession:", e);
            setError(e.message || "Erro desconhecido ao inicializar a sessão.");
            setUser(null);
        } finally {
            console.log("AuthContext: initializeSession finished, setting loading to false.");
            setLoading(false);
        }
    };

    initializeSession();
    
    console.log("AuthContext: Setting up onAuthStateChange listener.");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthContext: onAuthStateChange event:", event, "session:", session);
        if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
        } else {
            setUser(null);
        }
    });

    return () => {
      console.log("AuthContext: Cleaning up onAuthStateChange subscription.");
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .update({ plan: updatedFields.plan })
      .eq('id', user.id)
      .select('plan')
      .single();

    if (error) {
      setError(error.message);
      throw error;
    }

    if (data) {
        setUser(prevUser => ({ ...prevUser!, plan: data.plan }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};