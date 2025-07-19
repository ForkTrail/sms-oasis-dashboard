// components/LogoutButton.tsx
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  return (
    <button className="btn w-full mt-4 btn-outline" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
