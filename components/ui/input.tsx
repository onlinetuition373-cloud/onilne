import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-muted/70 transition-shadow focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 aria-[invalid=true]:border-danger";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(field, "h-11", className)} {...props} />
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(field, "min-h-[120px] py-3", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(field, "h-11 pr-8", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("mb-1.5 block text-sm font-medium text-ink-soft", className)} {...props} />
);

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-ink-muted">{children}</p>;
}

// Wraps label + control + error so every form field is laid out the same way.
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <Hint>{hint}</Hint>}
      <FieldError message={error} />
    </div>
  );
}

// Multi-select pill group used in both application forms.
export function ChipGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
}) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            type="button"
            key={option}
            aria-pressed={active}
            onClick={() => toggle(option)}
            className={cn(
              "min-h-[36px] rounded-full border px-3.5 text-sm transition-colors",
              active
                ? "border-brand-500 bg-brand-50 font-medium text-brand-700"
                : "border-line bg-white text-ink-soft hover:border-brand-300"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
