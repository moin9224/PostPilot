import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Sign in
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-ink">
          Welcome back.
        </h1>
        <p className="mt-1.5 text-sm text-neutral-600">
          Sign in to continue where you left off.
        </p>
      </div>
      <AuthForm mode="login" />
    </>
  );
}
