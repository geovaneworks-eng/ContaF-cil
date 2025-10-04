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
    const fetchPromise = supabase
      .from('profiles')
      .select('full_name, plan')
      .eq('id', supabaseUser.id)
      .single();

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: A requisição ao Supabase demorou demasiado.')), 8000)
    );

    try {
      const { data: userProfileData, error: profileError } = await Promise.race([fetchPromise, timeoutPromise as Promise<any>]);

      if (profileError) {
        console.error('AuthContext: Erro ao buscar perfil do usuário:', profileError.message);
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: userProfileData?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
        plan: userProfileData?.plan || 'Gratuito',
      };
    } catch (err) {
      console.error('AuthContext: Timeout ou erro de rede ao buscar perfil.', err);
      // Em caso de timeout, podemos retornar um perfil padrão ou lançar o erro
      // para que o chamador possa lidar com isso. Lançar o erro é mais explícito.
      throw err;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (isMounted) {
          if (session?.user) {
            const fullProfile = await fetchUserProfile(session.user);
            if (isMounted) setUser(fullProfile);
          } else {
            setUser(null);
          }
        }
      } catch (err: any) {
        console.error("Erro ao recuperar sessão inicial:", err.message);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (isMounted) {
            try {
                if (session?.user) {
                    const fullProfile = await fetchUserProfile(session.user);
                    if (isMounted) setUser(fullProfile);
                } else {
                    if (isMounted) setUser(null);
                }
            } catch (err: any) {
                console.error("Erro durante o onAuthStateChange:", err.message);
                if(isMounted) setUser(null);
            }
        }
    });

    return () => {
      isMounted = false;
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