import { createFileRoute } from "@tanstack/react-router";
import { PrescriptionForm } from "@/components/PrescriptionForm";

function SendRoute() {
  return <PrescriptionForm />;
}

export const Route = createFileRoute("/send")({ component: SendRoute });
