import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getAuthUser, setAuthUser, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/profile-setup")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileSetupPage,
});

function ProfileSetupPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [fullName, setFullName] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    setIsLoading(true);

    try {
      // Mock save - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update auth user with full name and referral link
      setAuthUser({
        phone: authUser?.phone ?? "",
        ...authUser,
        fullName: fullName.trim(),
        referralLink: referralLink.trim() || undefined,
      });

      // Force a small delay to ensure localStorage is updated
      await new Promise((resolve) => setTimeout(resolve, 100));
      toast.success("Profile saved successfully!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Set up your doctor profile to start sending prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Dr. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="referralLink" className="text-sm font-medium">
                Habuild Yoga Program Referral Link (Optional)
              </label>
              <Input
                id="referralLink"
                type="url"
                placeholder="https://habuild.in/your-referral-link"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                This link will be included in prescriptions you send to patients.
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading || !fullName.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileSetupRoute() {
  return <ProfileSetupPage />;
}
