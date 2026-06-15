import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { setAuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const normalizePhone = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      return "91" + digits.slice(1);
    }
    if (digits.startsWith("91")) {
      return digits;
    }
    if (digits.length === 10) {
      return "91" + digits;
    }
    return digits;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      const normalizedPhone = normalizePhone(phone);
      if (normalizedPhone.length !== 12) {
        toast.error("Please enter a valid 10-digit phone number");
      } else {
        setStep("otp");
        toast.success("Demo OTP sent to your phone");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate OTP verification and save to localStorage
    setTimeout(() => {
      const normalizedPhone = normalizePhone(phone);
      setAuthUser({ phone: normalizedPhone });
      toast.success("Logged in successfully");
      navigate({ to: "/profile-setup" });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
              Demo Mode
            </span>
          </div>
          <CardTitle className="text-2xl">Lifestyle Prescription</CardTitle>
          <CardDescription>Sign in to send prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="rounded-lg bg-blue-50 p-3 flex gap-2 text-xs text-blue-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>This is a demo. Enter any 10-digit number to proceed.</p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !phone}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP
                </label>
                <p className="text-xs text-muted-foreground">Enter any 6 digits to verify</p>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={isLoading}
                  maxLength={6}
                  autoFocus
                />
              </div>
              <div className="rounded-lg bg-blue-50 p-3 flex gap-2 text-xs text-blue-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>This is a demo. Any 6 digits will work.</p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
              >
                Back
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginRoute() {
  return <LoginPage />;
}
