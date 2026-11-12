import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("wordmark inline-flex items-start leading-none", className)}>
      VANTA<span className="ml-[-0.2em] text-[0.45em] tracking-normal">®</span>
    </span>
  );
}
