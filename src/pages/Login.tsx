  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { supabase } from "@/lib/supabase";

  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login successful");

  navigate("/input");
};

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        >
          <h1 className="mb-6 text-center text-3xl font-bold">
            Login
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-green-600"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    );
  };

  export default Login;