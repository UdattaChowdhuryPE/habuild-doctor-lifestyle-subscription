import { createFileRoute } from "@tanstack/react-router";
import { PrescriptionForm } from "@/components/PrescriptionForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lifestyle Prescription | Habuild" },
      { name: "description", content: "Send personalized lifestyle prescriptions to your patients on WhatsApp in under 15 seconds. No app installation required." },
      { property: "og:title", content: "Lifestyle Prescription | Habuild" },
      { property: "og:description", content: "Send personalized lifestyle prescriptions to your patients on WhatsApp in under 15 seconds." },
    ],
  }),
  component: Index,
});

function Index() {
  return <PrescriptionForm />;
}
