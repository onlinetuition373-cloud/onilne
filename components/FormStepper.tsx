import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-8 flex items-center" aria-label="Application progress">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={isActive ? "step" : undefined}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  isDone && "border-brand-600 bg-brand-600 text-white",
                  isActive && "border-brand-600 bg-white text-brand-700",
                  !isDone && !isActive && "border-line bg-white text-ink-muted"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span className={cn("mt-1.5 hidden text-xs font-medium sm:block", isActive ? "text-ink" : "text-ink-muted")}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1 rounded sm:-mt-5", isDone ? "bg-brand-600" : "bg-line")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
