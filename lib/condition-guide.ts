import type { ProductCondition } from "@/types";

export const productionConditions = [
  "Brand New",
  "UK Used",
  "Excellent",
  "Very Good",
  "Refurbished"
] as const;

export function normalizeConditionLabel(condition?: string) {
  if (!condition) return "Brand New";
  if (condition === "New") return "Brand New";
  if (condition === "Used") return "UK Used";
  return condition;
}

export function getConditionSummary(condition?: ProductCondition | string) {
  const normalized = normalizeConditionLabel(condition);

  const summaries: Record<string, string> = {
    "Brand New":
      "Factory-fresh or sealed stock with catalogue imagery, warranty guidance, and configuration confirmation before purchase.",
    "UK Used":
      "Imported pre-owned devices checked for function, cosmetic grade, storage, and battery health before recommendation.",
    Excellent:
      "Very clean used condition with minimal visible wear and strong expected battery guidance where relevant.",
    "Very Good":
      "Good everyday used condition with clear notes on visible wear, battery expectations, and final inspection.",
    Refurbished:
      "Professionally checked stock with service history or replacement parts explained before purchase."
  };

  return summaries[normalized] || summaries["Brand New"];
}

export function isUsedCondition(condition?: ProductCondition | string) {
  const normalized = normalizeConditionLabel(condition);
  return ["UK Used", "Excellent", "Very Good", "Refurbished"].includes(
    normalized
  );
}
