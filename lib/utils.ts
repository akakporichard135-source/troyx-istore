type ClassValue = string | number | false | null | undefined | ClassValue[] | Record<string, boolean>;

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap((input): string[] => {
      if (!input) return [];
      if (Array.isArray(input)) return [cn(...input)];
      if (typeof input === "object") {
        return Object.entries(input)
          .filter(([, enabled]) => enabled)
          .map(([key]) => key);
      }
      return [String(input)];
    })
    .filter(Boolean)
    .join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
