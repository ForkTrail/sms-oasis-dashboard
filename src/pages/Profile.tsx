import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setEmail(data.user.email);
        const { data: profile } = await supabase
          .from("users")
          .select("name")
          .eq("id", data.user.id)
          .single();
        setName(profile?.name || "");
      }
    });
  }, []);

  async function handleSave() {
    setMessage("");
    // Update name in users table
    await supabase.from("users").update({ name }).eq("email", email);
    // Update email in auth
    if (email) await supabase.auth.updateUser({ email });
    setMessage("Profile updated!");
  }

  async function handlePasswordChange() {
    setMessage("");
    if (password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setMessage(error.message);
      else setMessage("Password updated!");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button className="btn btn-primary mb-4" onClick={handleSave}>
        Save Changes
      </button>
      <input
        className="w-full mb-2 p-2 border rounded"
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="btn btn-outline" onClick={handlePasswordChange}>
        Change Password
      </button>
      {message && <div className="mt-2 text-info">{message}</div>}
    </div>
  );
}
