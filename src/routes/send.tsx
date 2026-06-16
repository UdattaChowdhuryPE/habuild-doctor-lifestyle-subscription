import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PrescriptionForm } from "@/components/PrescriptionForm";
import { isAuthenticated } from "@/lib/auth";

function SendRoute() {
  return (
    <AppLayout>
      <PrescriptionForm />
    </AppLayout>
  );
}

export const Route = createFileRoute("/send")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: SendRoute,
});
