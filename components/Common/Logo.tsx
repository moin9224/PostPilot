import Link from "next/link";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({
  href = "/",
  light = false,
  className,
}: {
  href?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 font-bold", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
        <Rocket className="h-4 w-4" />
      </span>
      <span className={cn("text-lg", light ? "text-white" : "text-ink")}>
        Post<span className="text-brand">Pilot</span>
      </span>
    </Link>
  );
}
