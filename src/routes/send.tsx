import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PrescriptionForm } from "@/components/PrescriptionForm";

function SendRoute() {
  return (
    <AppLayout>
      <PrescriptionForm />
    </AppLayout>
  );
}

export const Route = createFileRoute("/send")({
  component: SendRoute,
});
