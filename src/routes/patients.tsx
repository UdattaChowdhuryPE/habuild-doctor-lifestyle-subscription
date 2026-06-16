import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MOCK_PATIENTS, MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import { isAuthenticated } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus } from "lucide-react";

export const Route = createFileRoute("/patients")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: PatientsRoute,
});

function PatientsRoute() {
  return (
    <AppLayout>
      <PatientsContent />
    </AppLayout>
  );
}

function PatientsContent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const selectedPatient = MOCK_PATIENTS.find((p) => p.id === selectedPatientId);
  const patientPrescriptions = MOCK_PRESCRIPTIONS.filter(
    (p) => p.patientName === selectedPatient?.name,
  );

  const filteredPatients = useMemo(() => {
    return MOCK_PATIENTS.filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.mobile.includes(search),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patients</h1>
        <p className="text-muted-foreground mt-2">View and manage your patient list</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Prescriptions</TableHead>
              <TableHead>Last Prescription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.mobile}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{patient.prescriptionCount}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {patient.lastPrescriptionDate}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPatientId(patient.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => navigate({ to: "/send" })}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Patient Detail Sheet */}
      <Sheet open={!!selectedPatientId} onOpenChange={() => setSelectedPatientId(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedPatient && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle>{selectedPatient.name}</SheetTitle>
              </SheetHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                  <p className="text-foreground mt-1">{selectedPatient.mobile}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <Textarea
                    value={notes || selectedPatient.notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                    placeholder="Add notes about this patient..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Recent Prescriptions
                  </label>
                  <div className="mt-3 space-y-3">
                    {patientPrescriptions.slice(0, 3).map((rx) => (
                      <div key={rx.id} className="border border-border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">{rx.createdAt}</p>
                        <div className="flex flex-wrap gap-1">
                          {rx.habits.map((habit) => (
                            <Badge key={habit} variant="outline" className="text-xs">
                              {habit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default PatientsRoute;
