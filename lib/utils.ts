import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Signature card shape: 50px radius on the top-right and bottom-left corners.
// Used by feature cards, the FAQ photo and hero cards so the look stays consistent site-wide.
export const brandShape = "rounded-2xl rounded-tr-[50px] rounded-bl-[50px]";
