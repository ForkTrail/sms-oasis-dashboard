import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        navigate("/auth");
        return;
      }
      if (adminOnly) {
        const { data: profile } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", data.user.id)
          .single();
        if (!profile?.is_admin) {
          navigate("/");
          return;
        }
      }
      setAllowed(true);
      setLoading(false);
    });
  }, [adminOnly, navigate]);

  if (loading) return <div>Loading...</div>;
  return allowed ? children : null;
}