"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Linkedin } from "lucide-react";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import { isValidEmail, passwordStrength } from "@/lib/utils";

type Mode = "login" | "signup";

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-error",
  "bg-error",
  "bg-warning",
  "bg-action",
  "bg-success",
];

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);

  function validate() {
    const next: Record<string, string> = {};
    if (isSignup && !name.trim()) next.name = "Name is required.";
    if (!email) next.email = "Email is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (isSignup && password.length < 8)
      next.password = "Use at least 8 characters.";
    if (isSignup && confirm !== password)
      next.confirm = "Passwords do not match.";
    if (isSignup && !agree) next.agree = "You must accept the terms.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate auth request.
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() => router.push("/auth/callback")}
      >
        <Linkedin className="h-4 w-4 text-brand" />
        Continue with LinkedIn
      </Button>

      <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        or with email
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      {isSignup && (
        <Input
          label="Full name"
          name="name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div>
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {isSignup && password.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < strength ? STRENGTH_COLORS[strength] : "bg-edge"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {STRENGTH_LABELS[strength]}
            </p>
          </div>
        )}
      </div>

      {isSignup && (
        <Input
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
      )}

      {isSignup ? (
        <div>
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-edge text-brand focus:ring-action"
            />
            <span>
              I agree to the{" "}
              <a href="/terms" className="text-action hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-action hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agree && (
            <p className="mt-1 text-xs text-error">{errors.agree}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-edge text-brand focus:ring-action"
            />
            Remember me
          </label>
          <Link href="/auth/login" className="text-action hover:underline">
            Forgot password?
          </Link>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-ink hover:bg-neutral-800"
        loading={loading}
      >
        {isSignup ? "Create account" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-action hover:underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-action hover:underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
