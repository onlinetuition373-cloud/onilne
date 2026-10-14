import type { FieldValues, Path, UseFormClearErrors, UseFormSetError } from "react-hook-form";
import type { ZodTypeAny } from "zod";

// Validates one step of a multi-step form against its own zod schema and
// pushes any issues into react-hook-form so they show under the right field.
export function validateStep<T extends FieldValues>(
  schema: ZodTypeAny,
  values: T,
  setError: UseFormSetError<T>,
  clearErrors: UseFormClearErrors<T>
) {
  clearErrors();
  const result = schema.safeParse(values);
  if (result.success) return true;
  const seen = new Set<string>();
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (seen.has(key)) continue;
    seen.add(key);
    setError(key as Path<T>, { type: "manual", message: issue.message });
  }
  // Move focus to the first invalid field for keyboard and screen reader users.
  const first = document.getElementById(String(result.error.issues[0]?.path[0]));
  first?.focus();
  return false;
}
