import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    setError(""); setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage("Check your email for confirmation!");
  }

  async function handleSignIn() {
    setError(""); setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else if (data?.user) {
      // Check email verification
      if (!data.user.email_confirmed_at) {
        setError("Please verify your email before logging in.");
        return;
      }
      const { data: profile } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", data.user.id)
        .single();
      if (profile?.is_admin) navigate("/admin");
      else navigate("/");
    }
  }

  async function handlePasswordReset() {
    setError(""); setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage("Password reset email sent! Check your inbox.");
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-bold mb-4">
        {showReset ? "Reset Password" : "Sign In / Register"}
      </h2>

      <input
        className="w-full mb-2 p-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      {!showReset && (
        <input
          className="w-full mb-2 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      )}

      {!showReset ? (
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleSignIn}>Sign In</button>
          <button className="btn btn-outline" onClick={handleSignUp}>Register</button>
        </div>
      ) : (
        <button className="btn btn-primary w-full" onClick={handlePasswordReset}>
          Send Reset Link
        </button>
      )}

      <div className="mt-3 text-sm text-center">
        {!showReset ? (
          <button className="text-blue-600 hover:underline" onClick={() => setShowReset(true)}>
            Forgot password?
          </button>
        ) : (
          <button className="text-blue-600 hover:underline" onClick={() => setShowReset(false)}>
            Back to login
          </button>
        )}
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}
      {message && <div className="text-green-600 mt-2">{message}</div>}
    </div>
  );
}
