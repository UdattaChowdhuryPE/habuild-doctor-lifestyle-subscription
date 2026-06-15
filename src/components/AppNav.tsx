import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { LogOut, Leaf, Menu } from "lucide-react";
import { useState } from "react";

export function AppNav() {
  const { logout } = useAuth();
  const { profile } = useAuthProfile();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isActive = (path: string) => routerState.location.pathname === path;

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Send", href: "/send" },
    { label: "Patients", href: "/patients" },
    { label: "History", href: "/history" },
  ];

  return (
    <header className="border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">Habuild</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-green-100 text-green-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right text-sm">
              <p className="font-medium text-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">Doctor</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
