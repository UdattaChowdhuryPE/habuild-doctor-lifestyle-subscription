import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { MOCK_DOCTOR } from "@/lib/mockData";
import { getAuthUser, clearAuthUser } from "@/lib/auth";
import { Leaf, Menu, LogOut, Send, FileText } from "lucide-react";
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

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden border-t border-border bg-white flex items-center justify-around fixed bottom-0 left-0 right-0 h-16 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const Icon = item.label === "Send" ? Send : FileText;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive(item.href)
                    ? "text-green-600 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
