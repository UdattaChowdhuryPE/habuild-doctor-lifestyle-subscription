import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const saveSchema = z.object({
  patientName: z.string().min(1).max(100),
  patientMobile: z.string().min(10).max(15),
  habits: z.array(z.string()).min(1).max(10),
  doctorName: z.string().min(1).max(100).optional().default("Dr. Udatta Chowdhury"),
  inviteLink: z.string().max(500).optional().default(""),
});

export const savePrescription = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: result, error } = await supabaseAdmin
      .from("prescriptions")
      .insert({
        patient_name: data.patientName,
        patient_mobile: data.patientMobile,
        habits: data.habits,
        doctor_name: data.doctorName,
        status: "sent",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save prescription:", error);
      throw new Error("Failed to save prescription");
    }

    return { success: true, id: result.id };
  });

export const getPrescriptionCount = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error } = await supabaseAdmin
      .from("prescriptions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to get count:", error);
      return { count: 0 };
    }

    return { count: count ?? 0 };
  });

export const getRecentPrescriptions = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    if (data === undefined) return { limit: 10 };
    return z.object({ limit: z.number().min(1).max(100).optional().default(10) }).parse(data);
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("prescriptions")
      .select("id, patient_name, patient_mobile, habits, status, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (error) {
      console.error("Failed to get prescriptions:", error);
      return { prescriptions: [] };
    }

    return {
      prescriptions: rows.map((r) => ({
        id: r.id,
        patientName: r.patient_name,
        patientMobile: r.patient_mobile,
        habits: r.habits,
        status: r.status,
        createdAt: r.created_at,
      })),
    };
  });
