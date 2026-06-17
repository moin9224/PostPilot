import Link from "next/link";
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
      className={cn("inline-flex items-center font-bold", className)}
    >
      <span
        className={cn(
          "text-2xl tracking-tight",
          light ? "text-white" : "text-ink",
        )}
      >
        Post<span className="text-brand">Pilot</span>
      </span>
    </Link>
  );
}
