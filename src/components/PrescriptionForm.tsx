"use client";

import { useState, useCallback, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { savePrescription, getPrescriptionCount } from "@/lib/prescriptions.functions";
import {
  User,
  Phone,
  Send,
  Check,
  Leaf,
  Heart,
  Activity,
  Moon,
  Droplets,
  Apple,
  Smartphone,
  Loader2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const DEFAULT_HABITS = [
  { id: "yoga", label: "10 minutes Yoga", icon: Activity },
  { id: "walking", label: "15 minutes Walking", icon: Heart },
  { id: "breathing", label: "5 minutes Deep Breathing", icon: Leaf },
  { id: "sleep", label: "Sleep before 11 PM", icon: Moon },
  { id: "water", label: "Drink 2 litres water", icon: Droplets },
  { id: "meditation", label: "10 minutes Meditation", icon: Leaf },
  { id: "fruits", label: "Eat fruits daily", icon: Apple },
  { id: "screen", label: "Avoid screen before bed", icon: Smartphone },
];

const PRE_SELECTED: string[] = [];

function generateWhatsAppMessage(
  patientName: string,
  habits: string[],
  doctorName: string,
  inviteLink: string
) {
  const habitList = habits.map((h) => `✅ ${h}`).join("\n");
  const inviteSection = inviteLink.trim()
    ? `\nTo help you get started, I would also like to invite you to a 14-Day Free Yoga Program, where Saurabh Bothra (IITian with 14+ years of experience) will guide you through simple daily sessions:\n${inviteLink.trim()}`
    : "";
  return encodeURIComponent(
    `Namaste ${patientName} Ji 🙏\n\n` +
      `As discussed during your consultation, ${doctorName} recommends the following daily wellness practices:\n\n` +
      `${habitList}\n\n` +
      `Start with one small step today.${inviteSection}\n\n` +
      `Wishing you good health 🌿`
  );
}

function cleanMobileNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.startsWith("+91") && digits.length === 13) return digits.slice(1);
  return digits;
}

export function PrescriptionForm() {
  const [patientName, setPatientName] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(
    new Set(PRE_SELECTED)
  );
  const [inviteLink, setInviteLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const saveFn = useServerFn(savePrescription);
  const countFn = useServerFn(getPrescriptionCount);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const toggleHabit = useCallback((id: string) => {
    setSelectedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedHabitLabels = useMemo(
    () =>
      Array.from(selectedHabits)
        .map((id) => DEFAULT_HABITS.find((h) => h.id === id)?.label)
        .filter(Boolean) as string[],
    [selectedHabits]
  );

  const waUrl = useMemo(() => {
    const cleaned = cleanMobileNumber(patientMobile);
    if (!cleaned || cleaned.length < 10) return null;
    const message = generateWhatsAppMessage(patientName, selectedHabitLabels, "Dr. Udatta Chowdhury", inviteLink);
    return `https://wa.me/${cleaned}?text=${message}`;
  }, [patientName, patientMobile, selectedHabitLabels, inviteLink]);

  const handleSend = useCallback(async () => {
    if (!patientName.trim()) {
      toast.error("Please enter the patient's name");
      return;
    }
    if (!patientMobile.trim()) {
      toast.error("Please enter the patient's mobile number");
      return;
    }
    if (selectedHabits.size === 0) {
      toast.error("Please select at least one habit");
      return;
    }
    const cleaned = cleanMobileNumber(patientMobile);
    if (cleaned.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSending(true);
    try {
      await saveFn({
        data: {
          patientName: patientName.trim(),
          patientMobile: cleaned,
          habits: selectedHabitLabels,
          doctorName: "Dr. Udatta Chowdhury",
          inviteLink: inviteLink.trim(),
        },
      });

      const { count } = await countFn({});
      setSentCount(count);

      if (waUrl) {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      toast.success("Prescription sent and tracked!");

      // Reset form
      setPatientName("");
      setPatientMobile("");
      setSelectedHabits(new Set(PRE_SELECTED));
      setInviteLink("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  }, [patientName, patientMobile, selectedHabits, selectedHabitLabels, waUrl, saveFn, countFn, inviteLink]);

  const previewMessage = useMemo(() => {
    const habitList = selectedHabitLabels.map((h) => `✅ ${h}`).join("\n");
    const inviteSection = inviteLink.trim()
      ? `\nTo help you get started, I would also like to invite you to a 14-Day Free Yoga Program, where Saurabh Bothra (IITian with 14+ years of experience) will guide you through simple daily sessions:\n${inviteLink.trim()}`
      : `\nTo help you get started, I would also like to invite you to a 14-Day Free Yoga Program, where Saurabh Bothra (IITian with 14+ years of experience) will guide you through simple daily sessions:\n<doctors_personal_invite_link>`;
    return (
      `Namaste ${patientName || "Patient"} Ji 🙏\n\n` +
      `As discussed during your consultation, Dr. Udatta Chowdhury recommends the following daily wellness practices:\n\n` +
      `${habitList}\n\n` +
      `Start with one small step today.${inviteSection}\n\n` +
      `Wishing you good health 🌿`
    );
  }, [patientName, selectedHabitLabels, inviteLink]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-sage-light),var(--color-background))]">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-habuild)] shadow-sm">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-foreground font-[family-name:var(--font-display)]">
                Lifestyle Prescription
              </h1>
              <p className="text-xs text-muted-foreground">by Habuild</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="card-elevated p-5 space-y-5">
          {/* Patient Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-habuild" />
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Rishi"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Phone className="h-4 w-4 text-habuild" />
              Mobile Number
            </label>
            <input
              type="tel"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground/60"
            />
            <p className="text-xs text-muted-foreground">
              Enter 10-digit Indian mobile number
            </p>
          </div>

          {/* Invite Link */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <ExternalLink className="h-4 w-4 text-habuild" />
              14-Day Yoga Program Link
            </label>
            <input
              type="url"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="e.g. https://habuild.in/yoga-program"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground/60"
            />
            <p className="text-xs text-muted-foreground">
              Your personal invite link for the free yoga program
            </p>
          </div>

          {/* Habits */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Heart className="h-4 w-4 text-habuild" />
              Recommended Habits
            </label>
            <p className="text-xs text-muted-foreground -mt-1">
              Tap to add or remove habits from the prescription.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {DEFAULT_HABITS.map((habit) => {
                const isSelected = selectedHabits.has(habit.id);
                const Icon = habit.icon;
                return (
                  <button
                    key={habit.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleHabit(habit.id)}
                    className={`habit-row ${isSelected ? "habit-row-active" : ""}`}
                  >
                    <span className={`habit-check ${isSelected ? "habit-check-active" : ""}`}>
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <Icon className="h-4 w-4 text-habuild shrink-0" />
                    <span className="leading-tight">{habit.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSending}
            className="btn-habuild flex w-full items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Prescription
              </>
            )}
          </button>
        </div>

        {/* Preview Toggle */}
        <button
          onClick={() => setShowPreview((p) => !p)}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-habuild" />
            Preview WhatsApp Message
          </span>
          {showPreview ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showPreview && (
          <div className="mt-2 rounded-xl border border-border bg-card p-4">
            <div className="rounded-lg bg-[#dcf8c6] p-3 text-sm text-[#1f2421] whitespace-pre-line">
              {previewMessage}
            </div>
          </div>
        )}

        {/* Tracking Toggle */}
        <button
          onClick={() => {
            setShowTracking((p) => !p);
            if (!showTracking) {
              countFn({}).then(({ count }) => setSentCount(count));
            }
          }}
          className="mt-3 flex w-full items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-habuild" />
            Prescription Tracking
          </span>
          {showTracking ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showTracking && (
          <div className="mt-2 rounded-xl border border-border bg-card p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-sage-light p-3 text-center">
                <div className="text-2xl font-bold text-forest font-[family-name:var(--font-display)]">
                  {sentCount ?? "-"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Sent</div>
              </div>
              <div className="rounded-lg bg-sage-light/60 p-3 text-center opacity-50">
                <div className="text-2xl font-bold text-forest font-[family-name:var(--font-display)]">
                  —
                </div>
                <div className="text-xs text-muted-foreground mt-1">Delivered</div>
              </div>
              <div className="rounded-lg bg-sage-light/60 p-3 text-center opacity-50">
                <div className="text-2xl font-bold text-forest font-[family-name:var(--font-display)]">
                  —
                </div>
                <div className="text-xs text-muted-foreground mt-1">Read</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Delivery and read tracking require WhatsApp Business API integration.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-lg px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Built with 💚 by Team Habuild
          </p>
        </div>
      </footer>
    </div>
  );
}
