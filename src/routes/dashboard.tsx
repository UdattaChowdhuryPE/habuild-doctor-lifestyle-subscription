import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { MOCK_DOCTOR } from "@/lib/mockData";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Users, FileText, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: "/send" });
  },
  component: DashboardRoute,
});

function DashboardContent() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Send Prescription Card */}
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => navigate({ to: "/send" })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-green-600" />
              Send Prescription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create and send a new prescription to a patient
            </p>
          </CardContent>
        </Card>

        {/* Patients Card */}
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => navigate({ to: "/patients" })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View and manage your patient list</p>
          </CardContent>
        </Card>

        {/* History Card */}
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => navigate({ to: "/history" })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-purple-600" />
              History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View all prescriptions you've sent</p>
          </CardContent>
        </Card>

        {/* Analytics Card */}
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => navigate({ to: "/analytics" })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View insights and statistics</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Getting Started</h2>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Habuild Lifestyle Prescription</CardTitle>
            <CardDescription>
              You're all set! Start by sending your first prescription to a patient.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: "/send" })} className="w-full sm:w-auto">
              Send Your First Prescription
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function DashboardRoute() {
  return <DashboardContent />;
}
