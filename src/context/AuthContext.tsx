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

// Função de timeout para envolver promessas
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${ms} ms`));
    }, ms);

    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    console.log("AuthContext: Fetching user profile for", supabaseUser.id);
    try {
      const profilePromise = supabase
        .from('profiles')
        .select('full_name, plan')
        .eq('id', supabaseUser.id)
        .single();

      // Adicionando timeout de 8 segundos
      const { data: userProfileData, error: profileError } = await withTimeout(profilePromise, 8000);

      if (profileError) {
        console.error('AuthContext: Erro ao buscar perfil do usuário:', profileError.message);
        // Se o perfil não for encontrado, não é um erro fatal. Usamos dados padrão.
      }
      
      console.log("AuthContext: User profile data fetched:", userProfileData);

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: userProfileData?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
        plan: userProfileData?.plan || 'Gratuito',
      };

    } catch (e: any) {
      console.error("AuthContext: Uncaught error during fetchUserProfile (possibly timeout):", e);
      setError(e.message);
      return null; // Retorna nulo em caso de erro grave como timeout
    }
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
        console.log("AuthContext: initializeSession started.");
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("AuthContext: Error getting session:", sessionError);
                setError(sessionError.message);
            }
            
            if (session?.user) {
                console.log("AuthContext: Session user found, fetching profile.");
                const profile = await fetchUserProfile(session.user);
                setUser(profile);
            } else {
                console.log("AuthContext: No session user found.");
                setUser(null);
            }
        } catch (e: any) {
            console.error("AuthContext: Error during initializeSession:", e);
            setError(e.message || "Erro desconhecido ao inicializar a sessão.");
            setUser(null);
        } finally {
            console.log("AuthContext: initializeSession finished, setting loading to false.");
            setLoading(false);
        }
    };

    initializeSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthContext: onAuthStateChange event:", event);
        if (event === 'SIGNED_IN' && session?.user) {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
            setLoading(false);
        } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setLoading(false);
        }
    });

    return () => {
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