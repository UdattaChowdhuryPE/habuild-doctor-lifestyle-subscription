import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PrescriptionForm } from "@/components/PrescriptionForm";
import { isAuthenticated } from "@/lib/auth";

function SendRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <AppLayout>
      <PrescriptionForm />
    </AppLayout>
  );
}

export const Route = createFileRoute("/send")({
  component: SendRoute,
});
