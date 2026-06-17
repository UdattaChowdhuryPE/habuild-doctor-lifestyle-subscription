import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { MOCK_DOCTOR } from "@/lib/mockData";
import { getAuthUser, clearAuthUser } from "@/lib/auth";
import { Leaf, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AppNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authUser = getAuthUser();

  const handleLogout = () => {
    clearAuthUser();
    toast.success("Logged out successfully");
    navigate({ to: "/login" });
  };

  const isActive = (path: string) => routerState.location.pathname === path;

  const navItems = [
    { label: "Send", href: "/send" },
    { label: "History", href: "/history" },
  ];

  return (
    <header className="border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/send" className="flex items-center gap-2">
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right text-sm">
              <p className="font-medium text-foreground">
                {authUser?.fullName || MOCK_DOCTOR.full_name}
              </p>
              <p className="text-xs text-muted-foreground">Doctor</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-card">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-colors border-b border-border/50 last:border-b-0 ${
                  isActive(item.href)
                    ? "bg-green-100 text-green-700"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
