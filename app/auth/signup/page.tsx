import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <>
      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Get started
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-ink">
          Create your account.
        </h1>
        <p className="mt-1.5 text-sm text-neutral-600">
          7 days free. No credit card required.
        </p>
      </div>
      <AuthForm mode="signup" />
    </>
  );
}
