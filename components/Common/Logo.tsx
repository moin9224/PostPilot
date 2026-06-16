import Link from "next/link";
import Image from "next/image";
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
      <Image
        src="/Final_logo.png"
        alt="PostPilot"
        width={36}
        height={36}
        className="h-9 w-9 object-contain"
        priority
      />
      <span className={cn("text-lg tracking-tight", light ? "text-white" : "text-ink")}>
        Post<span className="text-brand">Pilot</span>
      </span>
    </Link>
  );
}
