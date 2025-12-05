"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full space-y-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData)
            .then(() => {
              toast.success(flow === "signIn" ? "Signed in successfully" : "Account created");
            })
            .catch((error) => {
              let toastTitle = "";
              if (error.message.includes("Invalid password")) {
                toastTitle = "Invalid password. Please try again.";
              } else {
                toastTitle =
                  flow === "signIn"
                    ? "Could not sign in, did you mean to sign up?"
                    : "Could not sign up, did you mean to sign in?";
              }
              toast.error(toastTitle);
              setSubmitting(false);
            });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-mono">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            className="bg-secondary border-border text-xs font-mono"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-mono">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="bg-secondary border-border text-xs font-mono"
            required
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full text-xs font-mono">
          {submitting ? "..." : flow === "signIn" ? "Sign In" : "Sign Up"}
        </Button>
        <div className="text-center text-xs text-muted-foreground font-mono">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-foreground hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </form>
      <div className="flex items-center my-4">
        <hr className="flex-1 border-border" />
        <span className="mx-4 text-xs text-muted-foreground font-mono">or</span>
        <hr className="flex-1 border-border" />
      </div>
      <Button
        variant="outline"
        className="w-full text-xs font-mono"
        onClick={() => void signIn("anonymous")}
      >
        Sign in anonymously
      </Button>
    </div>
  );
}
