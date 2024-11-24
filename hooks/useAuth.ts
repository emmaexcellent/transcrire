import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/auth-js";

type AuthState = {
  user: SupabaseUser | null;
  isLoggedIn: boolean;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthState({
        user,
        isLoggedIn: !!user,
      });
    };

    fetchUser();

    // Listen for authentication state changes
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      // Properly unsubscribe from the event listener
      data.subscription.unsubscribe();
    };
  }, []);

  return authState;
};
