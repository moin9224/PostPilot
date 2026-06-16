import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export default function Card({
  children,
  padded = true,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white",
        padded && "p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
