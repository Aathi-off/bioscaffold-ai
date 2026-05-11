import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful! Check your email.");

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Signup
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 p-3 text-white"
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-green-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;