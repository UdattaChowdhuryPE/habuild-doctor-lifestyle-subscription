import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function IndexRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate({ to: "/login" });
    } else {
      navigate({ to: "/send" });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexRoute,
  head: () => ({
    meta: [
      { title: "Lifestyle Prescription | Habuild" },
      {
        name: "description",
        content:
          "Send personalized lifestyle prescriptions to your patients on WhatsApp in under 15 seconds. No app installation required.",
      },
      { property: "og:title", content: "Lifestyle Prescription | Habuild" },
      {
        property: "og:description",
        content:
          "Send personalized lifestyle prescriptions to your patients on WhatsApp in under 15 seconds.",
      },
    ],
  }),
});
