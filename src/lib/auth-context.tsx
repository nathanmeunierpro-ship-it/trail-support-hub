import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "benevole" | "organisateur" | null;

interface AuthCtx {
  session: Session | null;
  user: User | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const resolveRole = async (u: User | undefined | null): Promise<Role> => {
    if (!u) return null;
    const { data: b } = await supabase.from("benevoles").select("id").eq("id", u.id).maybeSingle();
    if (b) return "benevole";
    const { data: o } = await supabase.from("organisateurs").select("id").eq("id", u.id).maybeSingle();
    if (o) return "organisateur";
    // Fallback to user_metadata.role (set at signUp) if profile row not yet readable
    const meta = (u.user_metadata as { role?: string } | null)?.role;
    if (meta === "benevole" || meta === "organisateur") return meta;
    return null;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => { resolveRole(s.user).then((r) => { console.log("[auth] resolved role =", r); setRole(r); }); }, 0);
      } else {
        setRole(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        resolveRole(data.session.user).then((r) => { console.log("[auth] initial role =", r); setRole(r); setLoading(false); });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };
  const refreshRole = async () => {
    if (session?.user) setRole(await resolveRole(session.user.id));
  };

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, role, loading, signOut, refreshRole }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
