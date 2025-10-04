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

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser, existingUser: User | null = null): Promise<User> => {
    const { data: userProfileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, plan')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError) {
      console.error('AuthContext: Erro ao buscar perfil do usuário:', profileError.message);
    }

    // Retorna o usuário combinado, priorizando os dados do perfil, mas mantendo os dados existentes como fallback
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: userProfileData?.full_name || existingUser?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
      plan: userProfileData?.plan || existingUser?.plan || 'Gratuito',
    };
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      // 1. Obter a sessão. Esta é a chamada mais crítica.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
      }

      if (session?.user) {
        // 2. Se houver uma sessão, crie um usuário preliminar IMEDIATAMENTE.
        const preliminaryUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email?.split('@')[0] || 'Usuário', // Nome temporário
          plan: 'Gratuito', // Plano padrão temporário
        };
        setUser(preliminaryUser);

        // 3. Em segundo plano, busque o perfil completo e atualize o estado.
        fetchUserProfile(session.user, preliminaryUser).then(fullProfile => {
          setUser(fullProfile);
        });
      } else {
        setUser(null);
      }

      // 4. Pare o carregamento. A UI pode agora ser renderizada.
      setLoading(false);
    };

    initializeSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const fullProfile = await fetchUserProfile(session.user);
            setUser(fullProfile);
        } else if (event === 'SIGNED_OUT') {
            setUser(null);
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