import { createFileRoute } from "@tanstack/react-router";
import { PrescriptionForm } from "@/components/PrescriptionForm";

export const Route = createFileRoute("/send")({
  component: PrescriptionForm,
});
