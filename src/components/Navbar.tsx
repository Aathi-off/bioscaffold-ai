import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Beaker,
  Home,
  FlaskConical,
  BarChart3,
  Settings2,
  Info,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { path: "/main", label: "Main", icon: Home },
  { path: "/input", label: "Design Scaffold", icon: FlaskConical },
  { path: "/results", label: "Results", icon: Beaker },
  { path: "/optimize", label: "Optimize", icon: Settings2 },
  { path: "/visualize", label: "Visualize", icon: BarChart3 },
  { path: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Beaker className="h-5 w-5 text-primary-foreground" />
          </div>

          <span className="text-lg font-bold text-foreground">
            Bio
            <span className="text-gradient">Scaffold</span>
            AI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">

          {user &&
            navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

          {!user ? (
            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
              >
                Signup
              </Link>

            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 space-y-1">

          {user &&
            navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;

              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

          {!user ? (
            <div className="space-y-2 pt-2">

              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-lg border px-4 py-2 text-sm text-center"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="block rounded-lg bg-green-600 px-4 py-2 text-sm text-center text-white"
              >
                Signup
              </Link>

            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;