import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PrescriptionForm } from "@/components/PrescriptionForm";

function IndexRoute() {
  return (
    <AppLayout>
      <PrescriptionForm />
    </AppLayout>
  );
}

export const Route = createFileRoute("/")({
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
  component: IndexRoute,
});
