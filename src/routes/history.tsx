import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import { isAuthenticated } from "@/lib/auth";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/history")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: HistoryRoute,
});

function HistoryRoute() {
  return (
    <AppLayout>
      <HistoryContent />
    </AppLayout>
  );
}

function HistoryContent() {
  const [search, setSearch] = useState("");

  const filteredPrescriptions = useMemo(() => {
    return MOCK_PRESCRIPTIONS.filter(
      (p) =>
        p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.patientMobile.includes(search),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prescription History</h1>
        <p className="text-muted-foreground mt-2">View all prescriptions you've sent</p>
      </div>

      <Input
        placeholder="Search by patient name or mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Habits Prescribed</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="font-medium">{rx.patientName}</TableCell>
                <TableCell>{rx.patientMobile}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rx.habits.map((habit) => (
                      <Badge key={habit} variant="outline" className="text-xs">
                        {habit}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{rx.createdAt}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-600">
                    {rx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default HistoryRoute;
